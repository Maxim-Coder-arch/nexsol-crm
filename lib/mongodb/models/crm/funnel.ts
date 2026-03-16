import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  order: number;
  type: 'tofu' | 'mofu' | 'bofu'; // TOFU, MOFU, BOFU
  width?: number; // будет вычисляться на фронте
}

export interface Funnel {
  _id?: ObjectId;
  name: string;
  description: string;
  type: 'sales' | 'attraction' | 'b2b'; // тип воронки
  stages: FunnelStage[];
  createdAt: Date;
  updatedAt: Date;
}

export class FunnelModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Funnel>('funnels');
  }

  static async create(data: Omit<Funnel, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const funnel = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(funnel);
    return { ...funnel, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ createdAt: -1 }).toArray();
  }

  static async getById(id: string) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, data: Partial<Funnel>) {
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

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }
}