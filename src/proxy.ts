import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

const authPages = ['/log-in', '/reset-password', '/sign-up'];

const protectedPages = ['/dashboard', '/profile', '/time-keeping', '/log-out'];
const BLOCKED_PAGES = ['/arrange-schedule', '/explaination-approval'];
export async function proxy(request: NextRequest) {
  const token = (await cookies()).get('access_token')?.value;
  const { pathname } = request.nextUrl;
  if (protectedPages.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  if (authPages.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/log-in-announce', request.url));
  }
  if (token) {
    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (
      user.role_id === 1 &&
      BLOCKED_PAGES.some((p) => pathname.startsWith(p))
    ) {
      return NextResponse.redirect(new URL('/time-keeping', request.url));
    }
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
    '/arrange-schedule/:path*',
    '/explaination-approval/:path*',
  ],
};
