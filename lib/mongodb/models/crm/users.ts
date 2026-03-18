import clientPromise from '../../index';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'director' | 'admin' | 'manager';
  specialties: string[];        // специальности
  responsibilities: string[];    // обязанности
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('nexsol');
    return db.collection<User>('users');
  }

  // Создать пользователя (с хэшированием пароля)
  static async create(data: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await this.getCollection();
    const now = new Date();
    
    // Хэшируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const user = {
      ...data,
      password: hashedPassword,
      specialties: data.specialties || [],
      responsibilities: data.responsibilities || [],
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  // Найти пользователя по email
  static async findByEmail(email: string) {
    const collection = await this.getCollection();
    return collection.findOne({ email });
  }

  // Проверить пароль
  static async comparePassword(candidatePassword: string, hashedPassword: string) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Получить всех пользователей (без паролей)
  static async getAll() {
    const collection = await this.getCollection();
    return collection.find().project({ password: 0 }).toArray();
  }

  // Получить пользователя по ID
  static async getById(id: string) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
  }

  // Обновить пользователя
  static async update(id: string, data: Partial<User>) {
    const collection = await this.getCollection();
    
    // Если обновляем пароль — хэшируем
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    
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

  // Удалить пользователя
  static async delete(id: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }
}