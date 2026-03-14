import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export interface Transaction {
  projectId: ObjectId;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
}

export class FinanceModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Transaction>('crm_finances');
  }

  static async addIncome(data: Omit<Transaction, 'type'>) {
    const collection = await this.getCollection();
    return collection.insertOne({
      ...data,
      type: 'income'
    });
  }

  static async addExpense(data: Omit<Transaction, 'type'>) {
    const collection = await this.getCollection();
    return collection.insertOne({
      ...data,
      type: 'expense'
    });
  }

  static async getSummary() {
    const collection = await this.getCollection();
    
    const pipeline = [
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ];
    
    const result = await collection.aggregate(pipeline).toArray();
    
    const income = result.find(r => r._id === 'income')?.total || 0;
    const expense = result.find(r => r._id === 'expense')?.total || 0;
    
    return {
      income,
      expense,
      profit: income - expense
    };
  }
}