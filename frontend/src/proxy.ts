import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const token = (await cookies()).get('token')?.value;
  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isAuthenticatedRoute = ['/profile', '/my-purchases', '/checkout', '/dashboard'].some((route) =>
    pathname.startsWith(route)
  );

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!token && isAuthenticatedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
