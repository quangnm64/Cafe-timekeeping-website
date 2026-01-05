import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { format } from 'date-fns';
function combineDateAndTime(workDate: Date, time: Date) {
  const d = new Date(workDate);
  d.setHours(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), 0);
  return d;
}

async function CheckIn() {
  try {
    const token = (await cookies()).get('access_token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const workDate = new Date();
    workDate.setHours(0, 0, 0, 0);

    const workSchedule = await prisma.workSchedule.findFirst({
      where: {
        employeeId: user.employee_id,
        workDate: new Date(format(workDate, 'yyyy-MM-dd')),
      },
      include: {
        shift: true,
      },
    });

    if (!workSchedule) {
      return NextResponse.json({ message: 'Bạn chưa được xếp lịch' });
    }

    const now = new Date();

    const shiftStart = combineDateAndTime(
      workSchedule.workDate,
      workSchedule.shift.startTime
    );

    const lateLimit = new Date(shiftStart.getTime() + 60 * 60 * 1000);

    const status = now > lateLimit ? 'Deviation' : 'present';

    const result = await prisma.attendanceLog.create({
      data: {
        userId: user.employee_id,
        workDate: new Date(format(workDate, 'yyyy-MM-dd')),
        logType: 'IN',
        logTime: now,
        status,
        shiftId: workSchedule.shiftId,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      status: true,
      result,
    });
  } catch (error) {
    console.error('CheckIn error:', error);
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

    const workDate = new Date();
    workDate.setHours(0, 0, 0, 0);

    const workSchedule = await prisma.workSchedule.findFirst({
      where: {
        employeeId: user.employee_id,
        workDate: new Date(format(workDate, 'yyyy-MM-dd')),
      },
      include: {
        shift: true,
      },
    });

    if (!workSchedule) {
      return NextResponse.json({ message: 'Bạn chưa được xếp lịch' });
    }

    const now = new Date();

    const shiftEnd = combineDateAndTime(
      workSchedule.workDate,
      workSchedule.shift.endTime
    );

    const status = now < shiftEnd ? 'Deviation' : 'present';

    const result = await prisma.attendanceLog.create({
      data: {
        userId: user.employee_id,
        workDate: new Date(format(workDate, 'yyyy-MM-dd')),
        logType: 'OUT',
        logTime: now,
        status,
        shiftId: workSchedule.shiftId,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      status: true,
      result,
    });
  } catch (error) {
    console.error('CheckOut error:', error);
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
    const result = await prisma.employee.findUnique({
      where: {
        id: user.employee_id,
      },
    });
    const address = await prisma.store.findUnique({
      where: {
        storeId: result?.storeId,
      },
    });

    return NextResponse.json({
      store: address,
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
