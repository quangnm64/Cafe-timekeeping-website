import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

const authPages = ['/log-in', '/reset-password', '/sign-up'];

const protectedPages = ['/dashboard', '/profile', '/time-keeping', '/log-out'];

export async function proxy(request: NextRequest) {
  const token = (await cookies()).get('access_token')?.value;
  const { pathname } = request.nextUrl;

  if (authPages.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/log-in-announce', request.url));
  }

  if (protectedPages.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/log-in',
    '/forgot-password',
    '/reset-password',
    '/sign-up',
    '/dashboard/:path*',
    '/profile/:path*',
    '/time-keeping/:path*',
    '/log-out',
  ],
};
