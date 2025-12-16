import jwt  from 'jsonwebtoken';
import { cookies } from "next/headers"
import { NextResponse } from "next/server";
export async function POST() {
  const token = (await cookies()).get("access_token")?.value
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;

  const user = jwt.verify(token, JWT_SECRET)as jwt.JwtPayload
  
  return NextResponse.json({...user})
}