import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('nexsol');
    
    const now = new Date();
    
    // За последние 7 дней
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // За последние 4 недели
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    // За последние 6 месяцев
    const yearAgo = new Date(now);
    yearAgo.setMonth(yearAgo.getMonth() - 6);
    
    const weeklyVisitors = await db.collection('visitors').aggregate([
      { $match: { timestamp: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const weeklyData = weeklyVisitors.map((item, index) => ({
      day: daysOfWeek[index] || '?',
      visitors: item.count
    }));

    const monthlyVisitors = await db.collection('visitors').aggregate([
      { $match: { timestamp: { $gte: monthAgo } } },
      {
        $group: {
          _id: { $week: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const monthlyData = monthlyVisitors.map((item, index) => ({
      day: `${index + 1} нед`,
      visitors: item.count
    }));

    const yearlyVisitors = await db.collection('visitors').aggregate([
      { $match: { timestamp: { $gte: yearAgo } } },
      {
        $group: {
          _id: { $month: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
    const yearlyData = yearlyVisitors.map((item, index) => ({
      day: months[index] || '?',
      visitors: item.count
    }));

    return NextResponse.json({
      weekly: weeklyData,
      monthly: monthlyData,
      yearly: yearlyData
    });
  } catch (error) {
    console.error('Charts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}