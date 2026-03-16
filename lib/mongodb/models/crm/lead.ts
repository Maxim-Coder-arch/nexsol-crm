import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Lead {
  _id?: ObjectId;
  name: string;
  email: string;
  contact: string; // ссылка на соцсеть
  message?: string; // дополнительное сообщение
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string; // откуда пришел (например, 'website')
  createdAt: Date;
  updatedAt: Date;
}

export class LeadModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Lead>('leads');
  }

  // Создать новую заявку (публичный метод)
  static async create(data: Omit<Lead, '_id' | 'createdAt' | 'updatedAt' | 'status'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const lead = {
      ...data,
      status: 'new',
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(lead);
    return { ...lead, _id: result.insertedId };
  }

  // Получить все заявки (для админки)
  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ createdAt: -1 }).toArray();
  }

  // Обновить статус заявки
  static async updateStatus(id: string, status: Lead['status']) {
    const collection = await this.getCollection();
    
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date() 
        } 
      }
    );
  }

  // Удалить заявку
  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  // Получить статистику по заявкам
  static async getStats() {
    const collection = await this.getCollection();
    
    const [total, new_, contacted, converted, lost] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ status: 'new' }),
      collection.countDocuments({ status: 'contacted' }),
      collection.countDocuments({ status: 'converted' }),
      collection.countDocuments({ status: 'lost' })
    ]);
    
    return {
      total,
      new: new_,
      contacted,
      converted,
      lost,
      conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0
    };
  }
}