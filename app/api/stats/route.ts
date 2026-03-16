import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('nexsol');
    const collection = db.collection('visitors');
    
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const uniqueToday = await collection.distinct('visitorId', {
      timestamp: { $gte: startOfDay }
    });
    
    const uniqueWeek = await collection.distinct('visitorId', {
      timestamp: { $gte: startOfWeek }
    });
    
    const uniqueMonth = await collection.distinct('visitorId', {
      timestamp: { $gte: startOfMonth }
    });
    
    const totalToday = await collection.countDocuments({
      timestamp: { $gte: startOfDay }
    });
    
    const totalWeek = await collection.countDocuments({
      timestamp: { $gte: startOfWeek }
    });
    
    const totalMonth = await collection.countDocuments({
      timestamp: { $gte: startOfMonth }
    });
    
    return NextResponse.json({
      unique: {
        today: uniqueToday.length,
        week: uniqueWeek.length,
        month: uniqueMonth.length
      },
      total: {
        today: totalToday,
        week: totalWeek,
        month: totalMonth
      }
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}