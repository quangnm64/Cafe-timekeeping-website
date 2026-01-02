import { format, toDate } from 'date-fns';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';

export async function POST(req: Request) {
  const json = await req.json();
  const from = json.fromDate;
  const to = json.toDate;
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const result = await prisma.attendanceLog.findMany({
      where: {
        userId: user.employee_id,
        workDate: {
          gte: new Date(format(from, 'yyyy-MM-dd')),
          lte: new Date(format(to, 'yyyy-MM-dd')),
        },
      },
      orderBy: [{ workDate: 'desc' }, { logTime: 'desc' }],
    });
    return NextResponse.json({
      checkIn: false,
      checkOut: false,
      status: false,
      result: result,
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
