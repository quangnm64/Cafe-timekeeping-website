import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import prisma from "../../../../../prisma/prismaClient";

dotenv.config()
export async function POST(req: Request) {
  const { username, password } = await req.json()
  const user = await prisma.account.findUnique({
    where: { username,password_hash:password },
  });
  console.log(user?.employee_id)
  if(!user){
    const res= NextResponse.json({
      status:false,
      message: "Sai tên đăng nhập hoặc mật khẩu"
    });
    return res;
  }


  const token = signToken({
    account_id: user?.account_id.toString(),
    employee_id: user?.employee_id.toString(),
    role_id: user?.role_id.toString(),
    username:user?.username,
    last_login:user?.last_login,
  })

  
  const res= NextResponse.json({
    status:true,
    message: "Đăng nhập thành công",
  });

  res.cookies.set({
    name: "access_token",
    value: token,
    httpOnly: true,          
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, 
  })

  return res;

} 

export function signToken(payload: object) {
  const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  })
}