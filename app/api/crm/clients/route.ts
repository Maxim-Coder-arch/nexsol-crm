import { NextResponse } from 'next/server';
import { ClientModel } from '@/lib/mongodb/models/crm/client';

export async function GET() {
  try {
    const clients = await ClientModel.findAll();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await ClientModel.create(data);
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}