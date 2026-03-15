import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Link {
  _id?: ObjectId;
  title: string;
  description: string;
  url: string;
  importance: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

export class LinkModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Link>('director_links');
  }

  static async create(data: Omit<Link, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const link = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(link);
    return { ...link, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ importance: -1, createdAt: -1 }).toArray();
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, data: Partial<Link>) {
    const collection = await this.getCollection();
    
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...data,
          updatedAt: new Date() 
        } 
      }
    );
  }
}