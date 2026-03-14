import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Project {
  clientId: ObjectId;
  name: string;
  type: 'site' | 'ads' | 'strategy' | 'support';
  budget: number;
  paid: number;
  status: 'new' | 'inProgress' | 'done' | 'paused';
  startDate: Date;
  deadline?: Date;
  tasks: Task[];
}

export interface Task {
  title: string;
  assignee: string;
  status: 'todo' | 'inProgress' | 'done';
  deadline?: Date;
}

export class ProjectModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Project>('crm_projects');
  }

  static async create(data: Omit<Project, 'tasks'>) {
    const collection = await this.getCollection();
    return collection.insertOne({
      ...data,
      tasks: []
    });
  }

  static async findByClient(clientId: string) {
    const collection = await this.getCollection();
    return collection.find({ 
      clientId: new ObjectId(clientId) 
    }).toArray();
  }
}