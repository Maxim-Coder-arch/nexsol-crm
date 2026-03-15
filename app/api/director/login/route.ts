import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const validUsername = process.env.DIRECTOR_USERNAME;
    const validPassword = process.env.DIRECTOR_PASSWORD;
    
    if (!validUsername || !validPassword) {
      console.error('Director credentials not set in env');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    if (username === validUsername && password === validPassword) {
      const response = NextResponse.json({ success: true });
      
      response.cookies.set({
        name: 'director_auth',
        value: 'true',
        path: '/',
        maxAge: 60 * 60 * 24,
        httpOnly: true,
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}