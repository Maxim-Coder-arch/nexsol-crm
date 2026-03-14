import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Пропускаем API и статические файлы
  if (pathname.startsWith('/api') || 
      pathname.includes('_next') || 
      pathname.includes('favicon')) {
    return NextResponse.next();
  }
  
  // Страница логина всегда доступна
  if (pathname === '/login') {
    return NextResponse.next();
  }
  
  // Проверяем авторизацию
  const authCookie = request.cookies.get('nexsol_auth');
  const userCookie = request.cookies.get('nexsol_user');
  
  console.log('🔍 Path:', pathname, 'Auth:', !!authCookie, 'User:', userCookie?.value);
  
  // Если нет куки - редирект на логин
  if (!authCookie || !userCookie) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  // Все ок - пропускаем
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};