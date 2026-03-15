// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Пропускаем API и статические файлы
//   if (pathname.startsWith('/api') || 
//       pathname.includes('_next') || 
//       pathname.includes('favicon')) {
//     return NextResponse.next();
//   }
  
//   // Страница логина всегда доступна
//   if (pathname === '/login') {
//     return NextResponse.next();
//   }
  
//   // Проверяем авторизацию
//   const authCookie = request.cookies.get('nexsol_auth');
//   const userCookie = request.cookies.get('nexsol_user');
  
//   console.log('🔍 Path:', pathname, 'Auth:', !!authCookie, 'User:', userCookie?.value);
  
//   // Если нет куки - редирект на логин
//   if (!authCookie || !userCookie) {
//     const url = new URL('/login', request.url);
//     url.searchParams.set('from', pathname);
//     return NextResponse.redirect(url);
//   }
  
//   // Все ок - пропускаем
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };



import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Пропускаем API и статику
  if (pathname.startsWith('/api') || 
      pathname.includes('_next') || 
      pathname.includes('favicon')) {
    return NextResponse.next();
  }
  
  // Страницы логина доступны всегда
  if (pathname === '/login' || pathname === '/director-login') {
    return NextResponse.next();
  }
  
  // Проверка для обычных пользователей
  if (!pathname.startsWith('/director')) {
    const authCookie = request.cookies.get('nexsol_auth');
    const userCookie = request.cookies.get('nexsol_user');
    
    if (!authCookie || !userCookie) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  
  // Проверка для директора
  if (pathname.startsWith('/director')) {
    const directorAuth = request.cookies.get('director_auth');
    
    if (!directorAuth) {
      const url = new URL('/director-login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};