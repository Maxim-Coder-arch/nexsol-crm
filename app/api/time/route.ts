import { NextResponse } from 'next/server';
import { TimeModel } from '@/lib/mongodb/models/crm/time';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const entries = await TimeModel.getAll();
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { author, task, description, difficulty, startTime, endTime } = await request.json();
    
    if (!author || !task || !difficulty || !startTime) {
      return NextResponse.json(
        { error: 'Author, task, difficulty and startTime are required' },
        { status: 400 }
      );
    }
    
    if (difficulty < 1 || difficulty > 10) {
      return NextResponse.json(
        { error: 'Difficulty must be between 1 and 10' },
        { status: 400 }
      );
    }
    
    const entry = await TimeModel.create({
      author,
      task,
      description,
      difficulty,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined
    });
    
    return NextResponse.json({ success: true, entry });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create time entry' },
      { status: 500 }
    );
  }
}