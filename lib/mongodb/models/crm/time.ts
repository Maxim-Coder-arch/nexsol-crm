import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface TimeEntry {
  _id?: ObjectId;
  author: string;
  task: string;
  description?: string;
  difficulty: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TimeModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<TimeEntry>('time_tracking');
  }

  static async create(data: Omit<TimeEntry, '_id' | 'createdAt' | 'updatedAt' | 'duration'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    let duration;
    if (data.endTime) {
      duration = Math.round((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60));
    }

    const entry = {
      ...data,
      duration,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(entry);
    return { ...entry, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ startTime: -1 }).toArray();
  }

  static async getActive() {
    const collection = await this.getCollection();
    return collection.findOne({ endTime: { $exists: false } });
  }

  static async stopActive(endTime: Date) {
    const collection = await this.getCollection();
    
    const active = await this.getActive();
    if (!active) return null;
    
    const duration = Math.round((endTime.getTime() - active.startTime.getTime()) / (1000 * 60));
    
    await collection.updateOne(
      { _id: active._id },
      { 
        $set: { 
          endTime, 
          duration,
          updatedAt: new Date() 
        } 
      }
    );
    
    return { ...active, endTime, duration };
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async getStats() {
    const collection = await this.getCollection();
    
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [dayStats, weekStats, monthStats, totalStats] = await Promise.all([
      collection.aggregate([
        { $match: { startTime: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ]).toArray(),
      collection.aggregate([
        { $match: { startTime: { $gte: startOfWeek } } },
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ]).toArray(),
      collection.aggregate([
        { $match: { startTime: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ]).toArray(),
      collection.aggregate([
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ]).toArray()
    ]);
    
    return {
      day: dayStats[0]?.total || 0,
      week: weekStats[0]?.total || 0,
      month: monthStats[0]?.total || 0,
      total: totalStats[0]?.total || 0
    };
  }
}