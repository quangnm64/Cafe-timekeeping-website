import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';

async function CheckIn() {
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
        resut: result,
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
async function CheckOut() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const att = await prisma.attendance.findFirst({
      where: {
        employee_id: BigInt(user.employee_id),
        work_date: {
          gte: today,
        },
      },
    });
    if (att?.attendance_id) {
      const result = await prisma.attendance.update({
        where: {
          attendance_id: BigInt(att?.attendance_id),
          employee_id: BigInt(user.employee_id),
          work_date: {
            gte: today,
          },
        },
        data: {
          check_out: new Date(),
        },
      });
      if (result) {
        return NextResponse.json({
          status: true,
          resut: {
            ...result,
            attendance_id: result.attendance_id.toString(),
            employee_id: result.employee_id.toString(),
          },
        });
      }
    }
    return NextResponse.json({
      status: false,
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const today = new Date('2025-12-19T00:00:00.993Z');
    const result = await prisma.attendance.findFirst({
      where: {
        employee_id: BigInt(user.employee_id),
        work_date: {
          gte: today,
        },
      },
    });
    if (result) {
      if (result.check_in) {
        if (result.check_out) {
          return NextResponse.json({
            checkIn: true,
            checkOut: true,
            status: true,
            result: {
              ...result,
              attendance_id: result.attendance_id.toString(),
              employee_id: result.employee_id.toString(),
            },
          });
        }
        return NextResponse.json({
          checkIn: true,
          checkOut: false,
          status: true,
          result: {
            ...result,
            attendance_id: result.attendance_id.toString(),
            employee_id: result.employee_id.toString(),
          },
        });
      }
    }

    return NextResponse.json({
      checkIn: true,
      checkOut: false,
      status: false,
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
export async function POST(req: Request) {
  const task = await req.json();
  if (task.value === 'checkin') {
    return CheckIn();
  }
  if (task.value === 'checkout') {
    return CheckOut();
  }
  return NextResponse.json({
    message: 'Error when call',
  });
}
