import clientPromise from '../..';
import { ObjectId } from 'mongodb';

export interface Note {
  _id?: ObjectId;
  author: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NoteModel {
  static async create(author: string, text: string) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    const note: Note = {
      author,
      text,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection<Note>('notes').insertOne(note);
    return { ...note, _id: result.insertedId };
  }

  static async getAll() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return await db
      .collection<Note>('notes')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async getById(id: string) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return await db.collection<Note>('notes').findOne({ 
      _id: new ObjectId(id) 
    });
  }

  static async update(id: string, text: string) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return await db.collection<Note>('notes').updateOne(
      { _id: new ObjectId(id) },
      { $set: { text, updatedAt: new Date() } }
    );
  }

  static async delete(id: string) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return await db.collection<Note>('notes').deleteOne({ 
      _id: new ObjectId(id) 
    });
  }
}