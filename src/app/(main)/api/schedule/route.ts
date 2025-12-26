import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';

export async function POST(req: Request) {
  const { month, year } = await req.json();
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const schedule = await prisma.workSchedule.findMany({
      where: {
        employeeId: user.employee_id,
        // workDate: {
        //   gte: new Date(year + '-' + month + '-' + 1),
        //   lte: new Date(year + '-' + month + '-' + 31),
        // },
      },
      include: {
        shift: true,
      },
    });
    if (schedule) {
      return NextResponse.json({
        schedule: schedule,
      });
    }
    return NextResponse.json({
      message: 'Không tìm thấy lịch làm',
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
