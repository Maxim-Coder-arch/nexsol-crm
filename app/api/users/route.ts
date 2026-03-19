import { NextResponse } from 'next/server';
import { UserModel } from '@/lib/mongodb/models/crm/users';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await UserModel.getAll();
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}