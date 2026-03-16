import { NextResponse } from 'next/server';
import { AnnouncementModel } from '@/lib/mongodb/models/crm/announcement';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const announcements = await AnnouncementModel.getAll();
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { author, title, content, importance } = await request.json();
    
    if (!author || !title || !content || importance === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    if (importance < 1 || importance > 10) {
      return NextResponse.json(
        { error: 'Importance must be between 1 and 10' },
        { status: 400 }
      );
    }
    
    const announcement = await AnnouncementModel.create({
      author,
      title,
      content,
      importance
    });
    
    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}