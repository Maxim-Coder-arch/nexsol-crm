import { NextResponse } from 'next/server';
import { LinkModel } from '@/lib/mongodb/models/crm/link';

export async function GET() {
  try {
    const links = await LinkModel.getAll();
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, url, importance } = await request.json();
    
    if (!title || !description || !url || importance === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    if (importance < 1 || importance > 5) {
      return NextResponse.json(
        { error: 'Importance must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    const link = await LinkModel.create({
      title,
      description,
      url,
      importance
    });
    
    return NextResponse.json({ success: true, link });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}