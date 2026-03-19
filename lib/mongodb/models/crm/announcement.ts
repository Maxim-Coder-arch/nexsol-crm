import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Announcement {
  _id?: ObjectId;
  author: string;
  title: string;
  content: string;
  importance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class AnnouncementModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Announcement>('announcements');
  }

  static async create(data: Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const announcement = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(announcement);
    return { ...announcement, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ importance: -1, createdAt: -1 }).toArray();
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, data: Partial<Announcement>) {
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