import { NextResponse } from 'next/server';
import { FinanceModel } from '@/lib/mongodb/models/crm/finances';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const expenses = await FinanceModel.getPlannedExpenses();
    return NextResponse.json(expenses);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch planned expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { author, description, amount, plannedDate } = await request.json();
    
    if (!author || !description || !amount || !plannedDate) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const expense = await FinanceModel.addPlannedExpense({
      author,
      description,
      amount: Number(amount),
      plannedDate
    });
    
    return NextResponse.json({ success: true, expense });
  } catch {
    return NextResponse.json(
      { error: 'Failed to add planned expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    const result = await FinanceModel.deletePlannedExpense(id);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Planned expense not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete planned expense' },
      { status: 500 }
    );
  }
}