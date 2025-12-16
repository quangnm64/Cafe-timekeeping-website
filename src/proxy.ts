import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'
 const legacyPrefixes = ['/forgot-password','/reset-password','/log-out','/sign-up','/dashboard']
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const token = (await cookies()).get("access_token")?.value
    const { pathname } = request.nextUrl
    if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))&&token) {
        return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/log-in', request.url))
}
 
export const config = {
  matcher: ['/forgot-password','/reset-password','/log-out','/sign-up','/dashboard']
}