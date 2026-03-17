import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Tool {
  _id?: ObjectId;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ToolModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Tool>('tools');
  }

  static async create(data: Omit<Tool, '_id' | 'createdAt' | 'updatedAt'>) {
    console.log('📝 ToolModel.create called with:', data);
    
    try {
      const collection = await this.getCollection();
      const now = new Date();
      
      const tool = {
        ...data,
        createdAt: now,
        updatedAt: now
      };
      
      console.log('💾 Inserting tool:', tool);
      
      const result = await collection.insertOne(tool);
      console.log('✅ Insert result:', result);
      
      return { ...tool, _id: result.insertedId };
    } catch (error) {
      console.error('💥 Error in ToolModel.create:', error);
      throw error;
    }
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ category: 1, name: 1 }).toArray();
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }
}