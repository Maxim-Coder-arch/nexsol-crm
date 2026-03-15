import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Template {
  _id?: ObjectId;
  author: string;
  title: string;
  content: string;
  category: 'attraction' | 'answers' | 'ads' | 'essential';
  createdAt: Date;
  updatedAt: Date;
}

export class TemplateModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Template>('templates');
  }

  static async create(data: Omit<Template, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const template = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(template);
    return { ...template, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ createdAt: -1 }).toArray();
  }

  static async getByCategory(category: string) {
    const collection = await this.getCollection();
    return collection.find({ category }).sort({ createdAt: -1 }).toArray();
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, data: Partial<Template>) {
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