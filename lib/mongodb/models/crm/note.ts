import clientPromise from '../../index';

export interface Note {
  id: number;           // Простой числовой ID
  author: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NoteModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Note>('notes');
  }

  // Получить следующий ID
  static async getNextId(): Promise<number> {
    const collection = await this.getCollection();
    
    // Находим максимальный ID
    const maxIdNote = await collection
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    return maxIdNote.length > 0 ? maxIdNote[0].id + 1 : 1;
  }

  // Создать заметку
  static async create(author: string, text: string) {
    const collection = await this.getCollection();
    const now = new Date();
    const nextId = await this.getNextId();
    
    const note = {
      id: nextId,
      author,
      text,
      createdAt: now,
      updatedAt: now
    };
    
    await collection.insertOne(note);
    return note;
  }

  // Получить все заметки
  static async findAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ createdAt: -1 }).toArray();
  }

  // Получить заметку по ID
  static async findById(id: number) {
    const collection = await this.getCollection();
    return collection.findOne({ id });
  }

  // Обновить заметку
  static async update(id: number, text: string) {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          text, 
          updatedAt: new Date() 
        } 
      }
    );
    
    return result;
  }

  // Удалить заметку
  static async delete(id: number) {
    const collection = await this.getCollection();
    return collection.deleteOne({ id });
  }
}