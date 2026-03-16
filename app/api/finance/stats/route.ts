import { NextResponse } from 'next/server';
import { FinanceModel } from '@/lib/mongodb/models/crm/finances';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // week, month, year
    
    const endDate = new Date();
    let startDate = new Date();
    
    switch(period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }
    
    const { expenses, incomes } = await FinanceModel.getStatsForPeriod(startDate, endDate);
    
    // Группировка по дням для графика
    const chartData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dayExpenses = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
        
      const dayIncomes = incomes
        .filter(i => i.date === dateStr)
        .reduce((sum, i) => sum + i.amount, 0);
      
      chartData.push({
        date: dateStr,
        expenses: dayExpenses,
        incomes: dayIncomes,
        profit: dayIncomes - dayExpenses
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return NextResponse.json({
      chartData,
      totals: {
        expenses: expenses.reduce((sum, e) => sum + e.amount, 0),
        incomes: incomes.reduce((sum, i) => sum + i.amount, 0),
        profit: incomes.reduce((sum, i) => sum + i.amount, 0) - expenses.reduce((sum, e) => sum + e.amount, 0)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}