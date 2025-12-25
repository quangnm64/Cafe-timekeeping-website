import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { format } from 'date-fns';

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
    const records = await prisma.attendanceExplanation.findMany({
      where: {
        employeeId: parseInt(user.employee_id),
        createdAt: {
          gte: new Date(format(from, 'yyyy-MM-dd') + 'T00:00:00.000Z'),
          lte: new Date(format(to, 'yyyy-MM-dd') + 'T23:59:59.999Z'),
        },
      },
    });
    return NextResponse.json({
      status: true,
      result: records,
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
