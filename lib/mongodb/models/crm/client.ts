import clientPromise from '../../index';

export interface Client {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  telegram?: string;
  status: 'lead' | 'negotiation' | 'active' | 'archive';
  source: string;
  budget?: number;
  ourPrice?: number;
  createdAt: Date;
  lastContact: Date;
  notes?: string;
}

export class ClientModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<Client>('crm_clients');
  }

  static async create(data: Omit<Client, 'createdAt' | 'lastContact'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    return collection.insertOne({
      ...data,
      createdAt: now,
      lastContact: now
    });
  }

  static async findAll() {
    const collection = await this.getCollection();
    return collection.find().sort({ lastContact: -1 }).toArray();
  }

  static async updateStatus(id: string, status: Client['status']) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, lastContact: new Date() } }
    );
  }
}