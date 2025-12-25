import jwt from 'jsonwebtoken';
import prisma from '../../../../../../prisma/prismaClient';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import argon2 from 'argon2';

export async function POST(req: Request) {
  const { oldPassword, newPassword, confirmPassword } = await req.json();
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const password_hash = await argon2.hash(newPassword);
    await prisma.account.update({
      where: {
        accountId: user.account_id,
      },
      data: {
        password: String(password_hash),
      },
    });

    return NextResponse.json({
      status: true,
    });
  } catch (error) {
    console.error('getToken error:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
