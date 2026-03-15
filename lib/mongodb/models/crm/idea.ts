import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Idea {
  _id?: ObjectId;
  title: string;
  description: string;
  author: string;
  priority: number; // от 1 до 5
  createdAt: Date;
  updatedAt: Date;
}

export class IdeaModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Idea>('ideas');
  }

  static async create(title: string, description: string, author: string, priority: number) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const idea = {
      title,
      description,
      author,
      priority,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(idea);
    return { ...idea, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ priority: -1, createdAt: -1 }).toArray();
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, title: string, description: string, priority: number) {
    const collection = await this.getCollection();
    
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title, 
          description, 
          priority,
          updatedAt: new Date() 
        } 
      }
    );
  }
}