import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, password } = body;
    const usersString = process.env.ADMIN_USERS || '';
    const adminPassword = process.env.ADMIN_PASSWORD;
    const validUsers = usersString.split(',').map(u => u.trim().toLowerCase());
    const userNameLower = name?.toLowerCase().trim();
    const isUserValid = validUsers.includes(userNameLower);
    
    if (!isUserValid) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    const response = NextResponse.json({ 
      success: true,
      user: name,
      message: 'Login successful' 
    });
    response.cookies.set({
      name: 'nexsol_user',
      value: name,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
    });
    
    response.cookies.set({
      name: 'nexsol_auth',
      value: 'true',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
    });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}