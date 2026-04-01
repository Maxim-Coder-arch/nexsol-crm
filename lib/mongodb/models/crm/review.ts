import clientPromise from '../../index';
import { ObjectId } from 'mongodb';

export type ReviewStatus = 'new' | 'approved' | 'rejected';

export interface Review {
  _id?: ObjectId;
  name: string;
  role: string;
  text: string;
  rating: number;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Review>('reviews');
  }

  static async create(data: Omit<Review, '_id' | 'createdAt' | 'updatedAt' | 'status'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    const review = {
      ...data,
      status: 'new' as ReviewStatus,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(review);
    return { ...review, _id: result.insertedId };
  }

  static async getAll(onlyApproved: boolean = true) {
    const collection = await this.getCollection();
    const filter = onlyApproved ? { status: 'approved' } : {};
    return collection.find(filter).sort({ createdAt: -1 }).toArray();
  }

  static async getByStatus(status: ReviewStatus) {
    const collection = await this.getCollection();
    return collection.find({ status }).sort({ createdAt: -1 }).toArray();
  }

  static async getById(id: string) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async approve(id: string) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'approved' as ReviewStatus,
          updatedAt: new Date() 
        } 
      }
    );
  }

  static async reject(id: string) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'rejected' as ReviewStatus,
          updatedAt: new Date() 
        } 
      }
    );
  }

  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }

  static async getStats() {
    const collection = await this.getCollection();
    
    const [total, new_, approved, rejected] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ status: 'new' }),
      collection.countDocuments({ status: 'approved' }),
      collection.countDocuments({ status: 'rejected' })
    ]);
    
    return {
      total,
      new: new_,
      approved,
      rejected,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  }
}