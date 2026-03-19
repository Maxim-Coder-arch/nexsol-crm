import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Achievement {
  _id?: ObjectId;
  title: string;
  description: string;
  rating: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class AchievementModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Achievement>('achievements');
  }

  static async create(title: string, description: string, rating: number) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const achievement = {
      title,
      description,
      rating,
      date: now,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(achievement);
    return { ...achievement, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ date: -1 }).toArray();
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, title: string, description: string, rating: number) {
    const collection = await this.getCollection();
    
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title, 
          description, 
          rating,
          updatedAt: new Date() 
        } 
      }
    );
  }
}