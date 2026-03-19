import { NextResponse } from 'next/server';
import { ToolModel } from '@/lib/mongodb/models/crm/tools';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  
  try {
    const tools = await ToolModel.getAll();
    return NextResponse.json(tools);
  } catch (error) {
    console.error('❌ Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  
  try {
    const body = await request.json();
    const { name, description, url, category, icon } = body;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('nexsol_user');
    const createdBy = userCookie?.value || 'Директор';
    
    if (!name || !description || !url || !category) {
      return NextResponse.json(
        { error: 'Name, description, url and category are required' },
        { status: 400 }
      );
    }
    
    const tool = await ToolModel.create({
      name,
      description,
      url,
      category,
      icon: icon || '🔧',
      createdBy
    });
    
    return NextResponse.json({ success: true, tool });
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    );
  }
}