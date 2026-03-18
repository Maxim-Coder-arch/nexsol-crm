import { NextResponse } from 'next/server';
import { UserModel } from '@/lib/mongodb/models/crm/users';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await UserModel.getAll(); // уже без паролей
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}