import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  const user = cookieStore.get('nexsol_user')?.value;
  const role = cookieStore.get('nexsol_role')?.value;
  const email = cookieStore.get('nexsol_email')?.value;
  const auth = cookieStore.get('nexsol_auth')?.value;
  
  if (!auth || !user) {
    return NextResponse.json({ authenticated: false });
  }
  
  return NextResponse.json({
    authenticated: true,
    user,
    email,
    role
  });
}