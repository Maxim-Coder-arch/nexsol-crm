import { NextResponse } from 'next/server';
import { UserModel } from '@/lib/mongodb/models/crm/users';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const isValid = await UserModel.comparePassword(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const response = NextResponse.json({ 
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
    response.cookies.set({
      name: 'nexsol_auth',
      value: 'true',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    
    response.cookies.set({
      name: 'nexsol_user',
      value: user.name,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
    });
    
    response.cookies.set({
      name: 'nexsol_role',
      value: user.role,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
    });
    
    response.cookies.set({
      name: 'nexsol_email',
      value: user.email,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}