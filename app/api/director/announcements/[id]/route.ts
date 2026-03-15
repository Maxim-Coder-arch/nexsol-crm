import { NextResponse } from 'next/server';
import { AnnouncementModel } from '@/lib/mongodb/models/crm/announcement';
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
    
    const result = await AnnouncementModel.delete(id);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}