import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/checkout', '/dashboard', '/my-purchases', '/profile'];
const guestRoutes = ['/login', '/register'];
const JWT_SECRET_KEY = new TextEncoder().encode('rahasia');
// This function can be marked `async` if using `await` inside
export default async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (guestRoutes.some((route) => pathname.startsWith(route) || pathname === '/') && token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET_KEY);

      if (payload.role === 'user') {
        return NextResponse.redirect(new URL('/explore', request.url));
      }
      if (payload.role === 'admin' || payload.role === 'creator') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
