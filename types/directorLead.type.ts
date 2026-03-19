export interface Lead {
  _id: string;
  name: string;
  email: string;
  contact: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
  createdAt: string;
}