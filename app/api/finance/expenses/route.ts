import { NextResponse } from 'next/server';
import { FinanceModel } from '@/lib/mongodb/models/crm/finances';

export async function GET() {
  try {
    const expenses = await FinanceModel.getExpenses();
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { author, description, amount, date, rationality } = await request.json();
    
    if (!author || !description || !amount || !date || !rationality) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const expense = await FinanceModel.addExpense({
      author,
      description,
      amount: Number(amount),
      date,
      rationality: Number(rationality)
    });
    
    return NextResponse.json({ success: true, expense });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}