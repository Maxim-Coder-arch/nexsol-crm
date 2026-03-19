export interface Visitor {
  _id: string;
  visitorId: string;
  page: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
}

export interface StatsData {
  unique: { today: number; week: number; month: number };
  total: { today: number; week: number; month: number };
}

export interface ChartData {
  day: string;
  visitors: number;
}

export interface Expense {
  amount: number;
  description: string;
}

export interface Income {
  amount: number;
  description: string;
}

export interface FinanceTotals {
  expenses: number;
  incomes: number;
  profit: number;
}