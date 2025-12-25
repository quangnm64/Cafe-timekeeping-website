import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../../../../../../prisma/prismaClient';
import argon2 from 'argon2';

dotenv.config();

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await prisma.account.findUnique({
    where: { employeeCode: parseInt(username) },
  });
  if (!user) {
    const res = NextResponse.json({
      status: false,
      message: 'Không tìm thấy tài khoản',
    });
    return res;
  }

  const isValid = await argon2.verify(user.password, password);
  if (!isValid) {
    const res = NextResponse.json({
      status: false,
      message: 'Sai mật khẩu',
    });
    return res;
  }

  await prisma.account.update({
    where: {
      accountId: user.accountId,
    },
    data: {
      lastLogin: new Date(new Date().toISOString()),
    },
  });
  const token = signToken({
    account_id: user?.accountId,
    employee_id: user?.employeeId,
    role_id: user?.roleId,
    username: user?.employeeId,
    last_login: user?.lastLogin,
  });

  const res = NextResponse.json({
    status: true,
    message: 'Đăng nhập thành công',
  });

  res.cookies.set({
    name: 'access_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return res;
}

export function signToken(payload: object) {
  const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}
