import { NextResponse } from 'next/server';

export async function POST() {
  
  const response = NextResponse.json({ success: true });
  
  response.cookies.set({
    name: 'nexsol_auth',
    value: '',
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  response.cookies.set({
    name: 'nexsol_user',
    value: '',
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  return response;
}