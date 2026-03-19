import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Client {
  _id?: ObjectId;
  name: string;
  request: string;
  service: string;
  comment?: string;
  payment: number;
  contacts: {
    telegram?: string;
    instagram?: string;
    whatsapp?: string;
    email?: string;
    phone?: string;
    other?: string;
  };
  timeSpent: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ClientModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Client>('clients');
  }

  static async create(data: Omit<Client, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const client = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(client);
    return { ...client, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ createdAt: -1 }).toArray();
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async update(id: string, data: Partial<Client>) {
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

  static async getStats() {
    const collection = await this.getCollection();
    
    const [total, totalRevenue, averagePayment] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate([
        { $group: { _id: null, total: { $sum: '$payment' } } }
      ]).toArray(),
      collection.aggregate([
        { $group: { _id: null, avg: { $avg: '$payment' } } }
      ]).toArray()
    ]);
    
    return {
      total,
      totalRevenue: totalRevenue[0]?.total || 0,
      averagePayment: Math.round(averagePayment[0]?.avg || 0)
    };
  }
}