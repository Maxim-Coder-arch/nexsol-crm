import { NextResponse } from 'next/server';
import { FinanceModel } from '@/lib/mongodb/models/crm/finances';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const incomes = await FinanceModel.getIncomes();
    return NextResponse.json(incomes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch incomes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { author, description, amount, date } = await request.json();
    
    if (!author || !description || !amount || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const income = await FinanceModel.addIncome({
      author,
      description,
      amount: Number(amount),
      date
    });
    
    return NextResponse.json({ success: true, income });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add income' },
      { status: 500 }
    );
  }
}