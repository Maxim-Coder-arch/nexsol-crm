import { NextResponse } from 'next/server';
import { IdeaModel } from '@/lib/mongodb/models/crm/idea';

export async function GET() {
  try {
    const ideas = await IdeaModel.getAll();
    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, author, priority } = await request.json();
    
    if (!title || !description || !author || priority === undefined) {
      return NextResponse.json(
        { error: 'Title, description, author and priority are required' },
        { status: 400 }
      );
    }
    
    if (priority < 1 || priority > 5) {
      return NextResponse.json(
        { error: 'Priority must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    const idea = await IdeaModel.create(title, description, author, priority);
    return NextResponse.json({ success: true, idea });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}