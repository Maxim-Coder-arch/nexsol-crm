import { NextResponse } from 'next/server';
import { ToolModel } from '@/lib/mongodb/models/crm/tools';

export async function GET() {
  try {
    const tools = await ToolModel.getAll();
    return NextResponse.json(tools);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}