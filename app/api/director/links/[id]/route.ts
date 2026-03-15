import { NextResponse } from 'next/server';
import { LinkModel } from '@/lib/mongodb/models/crm/link';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const result = await LinkModel.delete(id);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const { title, description, url, importance } = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const result = await LinkModel.update(id, { title, description, url, importance });
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}