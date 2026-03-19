export interface Client {
  _id: string;
  name: string;
  request: string;
  service: string;
  comment?: string;
  payment: number;
  contacts: {
    telegram?: string;
    instagram?: string;
    whatsapp?: string;
    email?: string;
    phone?: string;
    other?: string;
  };
  timeSpent: number;
  createdAt: string;
}