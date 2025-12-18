import jwt from 'jsonwebtoken';
import { useUser } from '@/shared/contexts/user-context';
import prisma from '../../../../../../prisma/prismaClient';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { oldPassword, newPassword, confirmPassword } = await req.json();
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    await prisma.account.update({
      where: {
        account_id: BigInt(user.account_id),
      },
      data: {
        password_hash: String(newPassword),
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
