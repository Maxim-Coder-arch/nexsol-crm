import { NextResponse } from 'next/server';
import { ClientModel } from '@/lib/mongodb/models/crm/clientCrm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const clients = await ClientModel.getAll();
    return NextResponse.json(clients);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, request: clientRequest, service, comment, payment, contacts, timeSpent } = await request.json();
    
    if (!name || !clientRequest || !service || payment === undefined || !contacts || timeSpent === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const client = await ClientModel.create({
      name,
      request: clientRequest,
      service,
      comment,
      payment: Number(payment),
      contacts,
      timeSpent: timeSpent
    });
    
    return NextResponse.json({ success: true, client });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}