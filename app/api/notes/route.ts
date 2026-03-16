import { NextResponse } from 'next/server';
import { NoteModel } from '@/lib/mongodb/models/crm/note';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const notes = await NoteModel.getAll();
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { author, text } = await request.json();
    
    if (!author || !text) {
      return NextResponse.json(
        { error: 'Author and text are required' },
        { status: 400 }
      );
    }
    
    const note = await NoteModel.create(author, text);
    return NextResponse.json({ success: true, note });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}