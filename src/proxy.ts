import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Protege rutas privadas y APIs del frontend.
  const token = request.cookies.get('task_app_token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/tasks')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/tasks')) {
    if (!token) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tasks/:path*', '/api/tasks/:path*']
};
