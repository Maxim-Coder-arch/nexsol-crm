export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'director' | 'manager';
  specialties: string[];
  responsibilities: string[];
  createdAt: string;
}