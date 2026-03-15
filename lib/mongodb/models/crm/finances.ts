import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

// Расходы
export interface Expense {
  _id?: ObjectId;
  author: string;
  description: string;
  amount: number;
  date: string; // Дата в формате YYYY-MM-DD (ручной ввод)
  rationality: number; // от 1 до 10
  createdAt: Date;
}

// Доходы
export interface Income {
  _id?: ObjectId;
  author: string;
  description: string;
  amount: number;
  date: string;
  createdAt: Date;
}

// Планируемые расходы
export interface PlannedExpense {
  _id?: ObjectId;
  author: string;
  description: string;
  amount: number;
  plannedDate: string; // Дата когда планируется трата
  createdAt: Date;
}

export class FinanceModel {
  // ----- РАСХОДЫ -----
  static async addExpense(expense: Omit<Expense, '_id' | 'createdAt'>) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    const newExpense = {
      ...expense,
      createdAt: new Date()
    };
    
    const result = await db.collection('expenses').insertOne(newExpense);
    return { ...newExpense, _id: result.insertedId };
  }

  static async getExpenses() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return db.collection('expenses')
      .find({})
      .sort({ date: -1 })
      .toArray();
  }

  // ----- ДОХОДЫ -----
  static async addIncome(income: Omit<Income, '_id' | 'createdAt'>) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    const newIncome = {
      ...income,
      createdAt: new Date()
    };
    
    const result = await db.collection('incomes').insertOne(newIncome);
    return { ...newIncome, _id: result.insertedId };
  }

  static async getIncomes() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return db.collection('incomes')
      .find({})
      .sort({ date: -1 })
      .toArray();
  }

  // ----- ПЛАНИРУЕМЫЕ РАСХОДЫ -----
  static async addPlannedExpense(expense: Omit<PlannedExpense, '_id' | 'createdAt'>) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    const newExpense = {
      ...expense,
      createdAt: new Date()
    };
    
    const result = await db.collection('planned_expenses').insertOne(newExpense);
    return { ...newExpense, _id: result.insertedId };
  }

  static async getPlannedExpenses() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return db.collection('planned_expenses')
      .find({})
      .sort({ plannedDate: 1 })
      .toArray();
  }

  static async deletePlannedExpense(id: string) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    return db.collection('planned_expenses').deleteOne({ 
      _id: new ObjectId(id) 
    });
  }

  // ----- СТАТИСТИКА ДЛЯ ГРАФИКОВ -----
  static async getStatsForPeriod(startDate: Date, endDate: Date) {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    const [expenses, incomes] = await Promise.all([
      db.collection('expenses').find({
        date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
      }).toArray(),
      db.collection('incomes').find({
        date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
      }).toArray()
    ]);
    
    return { expenses, incomes };
  }
}