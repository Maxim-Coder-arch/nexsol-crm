import { NextResponse } from 'next/server';
import { UserModel } from '@/lib/mongodb/models/crm/users';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const users = await UserModel.getAll();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role, specialties, responsibilities } = await request.json();
    
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password and role are required' },
        { status: 400 }
      );
    }

    // Проверяем, нет ли уже такого email
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    const user = await UserModel.create({
      name,
      email,
      password,
      role,
      specialties: specialties || [],
      responsibilities: responsibilities || []
    });
    
    return NextResponse.json({ success: true, user });
    
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}