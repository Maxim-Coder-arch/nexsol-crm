import { NextResponse } from 'next/server';
import { FunnelModel } from '@/lib/mongodb/models/crm/funnel';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const funnels = await FunnelModel.getAll();
    return NextResponse.json(funnels);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch funnels' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, type, stages } = await request.json();
    
    if (!name || !description || !type || !stages || !Array.isArray(stages)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const funnel = await FunnelModel.create({
      name,
      description,
      type,
      stages
    });
    
    return NextResponse.json({ success: true, funnel });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create funnel' },
      { status: 500 }
    );
  }
}