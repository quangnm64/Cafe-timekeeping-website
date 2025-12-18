import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { mapEmployeeToUser } from '@/mappers/user/user.mapper';

export async function POST() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const user_infor = await prisma.employee.findUnique({
      where: { employee_id: user.employee_id },
    });

    if (!user_infor) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: mapEmployeeToUser(user_infor),
    });
  } catch (error) {
    console.error('getToken error:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
