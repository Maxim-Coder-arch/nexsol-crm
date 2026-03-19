export interface Template {
  _id: string;
  author: string;
  title: string;
  content: string;
  category: 'attraction' | 'answers' | 'ads' | 'essential';
  createdAt: string;
}

export type CategoryType = 'all' | 'attraction' | 'answers' | 'ads' | 'essential';