import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Responsibility {
  _id?: ObjectId;
  assignee: string;
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class ResponsibilityModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Responsibility>('responsibilities');
  }

  static async create(assignee: string, tasks: string[]) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const responsibility = {
      assignee,
      tasks,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(responsibility);
    return { ...responsibility, _id: result.insertedId };
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ assignee: 1 }).toArray();
  }

  static async getByAssignee(assignee: string) {
    const collection = await this.getCollection();
    return collection.find({ assignee }).toArray();
  }

  static async update(id: string, tasks: string[]) {
    const collection = await this.getCollection();
    
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          tasks,
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