import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const client = await clientPromise;
    const db = client.db('nexsol');
    
    const visitors = await db
      .collection('visitors')
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(visitors);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch visitors' },
      { status: 500 }
    );
  }
}