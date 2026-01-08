import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

const AUTH_PAGES = ['/log-in', '/reset-password', '/sign-up'];
const PROTECTED_PAGES = ['/dashboard', '/profile', '/time-keeping', '/log-out'];

// role_id = 1 → SUPER ADMIN
const SUPER_ADMIN_PAGES = [
  '/staff-management',
  '/explaination-approval-management',
];

// role_id = 2 → ADMIN
const ADMIN_PAGES = ['/arrange-schedule', '/explaination-approval'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = (await cookies()).get('access_token')?.value;

  // ❌ Chưa login mà vào trang protected
  if (PROTECTED_PAGES.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  // ✅ Đã login mà vào auth page
  if (AUTH_PAGES.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/log-in-announce', request.url));
  }

  if (token) {
    try {
      const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
      const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      const roleId = Number(user.role_id); // 🔥 FIX STRING ROLE

      const isSuperAdminPage = SUPER_ADMIN_PAGES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      );

      const isAdminPage = ADMIN_PAGES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      );

      // ❌ Không phải SUPER ADMIN
      if (isSuperAdminPage && roleId !== 1) {
        return NextResponse.redirect(new URL('/attendance', request.url));
      }

      // ❌ Không phải ADMIN (tránh đụng super admin page)
      if (isAdminPage && !isSuperAdminPage && roleId !== 2) {
        return NextResponse.redirect(new URL('/attendance', request.url));
      }
    } catch {
      // Token lỗi / hết hạn
      return NextResponse.redirect(new URL('/log-in', request.url));
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
    '/explaination/:path*',
    '/attendance/:path*',
    '/schedule/:path*',
    '/staff-management/:path*',
    '/explaination-approval-management/:path*',
  ],
};
