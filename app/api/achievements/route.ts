import { NextResponse } from 'next/server';
import { AchievementModel } from '@/lib/mongodb/models/crm/achievement';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const achievements = await AchievementModel.getAll();
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, rating } = await request.json();
    
    if (!title || !description || rating === undefined) {
      return NextResponse.json(
        { error: 'Title, description and rating are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 10' },
        { status: 400 }
      );
    }
    
    const achievement = await AchievementModel.create(title, description, rating);
    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}