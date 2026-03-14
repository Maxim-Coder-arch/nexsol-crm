import { NextResponse } from 'next/server';

export async function POST() {
  console.log('🚪 Logout API called');
  
  const response = NextResponse.json({ success: true });
  
  // Удаляем куки (ставим пустые значения и истекшее время)
  response.cookies.set({
    name: 'nexsol_auth',
    value: '',
    path: '/',
    expires: new Date(0),
    httpOnly: true,
  });
  
  response.cookies.set({
    name: 'nexsol_user',
    value: '',
    path: '/',
    expires: new Date(0),
    httpOnly: true,
  });
  
  console.log('🍪 Cookies deleted');
  return response;
}