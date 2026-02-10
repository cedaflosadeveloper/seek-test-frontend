import { NextRequest, NextResponse } from 'next/server';
import { isJwtExpired } from '@/shared/utils/jwt';

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set('task_app_token', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax'
  });
  response.cookies.set('task_app_user', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax'
  });
  return response;
};

export function proxy(request: NextRequest) {
  // Protege rutas privadas y APIs del frontend.
  const token = request.cookies.get('task_app_token')?.value;
  const { pathname } = request.nextUrl;
  const isExpired = token ? isJwtExpired(token) : false;

  if (pathname.startsWith('/tasks')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (isExpired) {
      const loginUrl = new URL('/login', request.url);
      return clearAuthCookies(NextResponse.redirect(loginUrl));
    }
  }

  if (pathname.startsWith('/api/tasks')) {
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
    if (isExpired) {
      return clearAuthCookies(NextResponse.json({ message: 'Sesión expirada' }, { status: 401 }));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tasks/:path*', '/api/tasks/:path*']
};
