import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';

export async function POST(req: Request) {
  const time = req.json();
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const result = await prisma.attendance.create({
      data: {
        employee_id: BigInt(user.employee_id),
        work_date: new Date(),
        check_in: new Date(),
      },
    });
    if (result) {
      return NextResponse.json({
        status: true,
      });
    }
    return NextResponse.json({
      status: false,
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
