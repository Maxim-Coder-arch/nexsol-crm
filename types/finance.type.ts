export interface Expense {
  _id: string;
  author: string;
  description: string;
  amount: number;
  date: string;
  rationality: number;
}

export interface Income {
  _id: string;
  author: string;
  description: string;
  amount: number;
  date: string;
}

export interface PlannedExpense {
  _id: string;
  author: string;
  description: string;
  amount: number;
  plannedDate: string;
}

export interface ChartData {
  date: string;
  expenses: number;
  incomes: number;
  profit: number;
}