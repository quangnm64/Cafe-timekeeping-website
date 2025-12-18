import jwt  from 'jsonwebtoken';
import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import dotenv from 'dotenv';

dotenv.config()
export async function GET() {
  const token = (await cookies()).get("access_token")?.value
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;

  const user = jwt.verify(token, JWT_SECRET)as jwt.JwtPayload
  
  return NextResponse.json({ email:user.id,mail:user.title })
}



export async function POST() {

  const response = NextResponse.json(
    { message: 'Logout success' },
    { status: 200 }
  )

  response.cookies.set({
    name: 'access_token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0, // xóa cookie
  })

  return response
}
