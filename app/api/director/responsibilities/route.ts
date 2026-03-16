import { NextResponse } from 'next/server';
import { ResponsibilityModel } from '@/lib/mongodb/models/crm/responsibility';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const responsibilities = await ResponsibilityModel.getAll();
    return NextResponse.json(responsibilities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch responsibilities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { assignee, tasks } = await request.json();
    
    if (!assignee || !tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Assignee and tasks array are required' },
        { status: 400 }
      );
    }
    
    const responsibility = await ResponsibilityModel.create(assignee, tasks);
    
    return NextResponse.json({ success: true, responsibility });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create responsibility' },
      { status: 500 }
    );
  }
}