import { NextResponse } from 'next/server';
import { TimeModel } from '@/lib/mongodb/models/crm/time';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const active = await TimeModel.getActive();
    return NextResponse.json(active || { active: false });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch active timer' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { endTime } = await request.json();
    
    const stopped = await TimeModel.stopActive(new Date(endTime));
    
    if (!stopped) {
      return NextResponse.json(
        { error: 'No active timer found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, entry: stopped });
  } catch {
    return NextResponse.json(
      { error: 'Failed to stop timer' },
      { status: 500 }
    );
  }
}