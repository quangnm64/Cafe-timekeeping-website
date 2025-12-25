import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { format } from 'date-fns';
import { error } from 'console';

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
    const result = await prisma.attendanceLog.create({
      data: {
        userId: user.employee_id,
        workDate: new Date(format(workDate, 'yyyy-MM-dd')),
        logType: 'IN',
        logTime: new Date(),
        status: 'present',
        createdAt: new Date(),
        shiftId: 2,
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
    const workDate = new Date();
    const schedule = await prisma.workSchedule.findFirst({
      where: {
        employeeId: parseInt(user.employee_id),
        workDate: new Date(format(new Date(), 'yyyy-MM-dd')),
      },
    });
    if (!schedule) {
      return NextResponse.json({
        status: true,
        message: 'Không tìm thấy lịch làm việc',
      });
    }
    const shift = await prisma.shift.findUnique({
      where: {
        // id: schedule?.shiftId,
        id: 2,
      },
    });

    const current = new Date(workDate.getTime() + 7 * 60 * 60 * 1000);
    const currentMinutes = current.getUTCHours() * 60 + current.getUTCMinutes();
    const endMinutes = shift?.endTime
      ? shift.endTime.getUTCHours() * 60 + shift.endTime.getUTCMinutes()
      : 0;

    const isInLastHour =
      currentMinutes >= endMinutes + 60 || currentMinutes < endMinutes;

    const result = await prisma.attendanceLog.create({
      data: {
        userId: user.employee_id,
        workDate: new Date(format(workDate, 'yyyy-MM-dd')),
        logType: 'OUT',
        logTime: new Date(),
        status: isInLastHour ? 'Deviation' : 'present',
        createdAt: new Date(),
        shiftId: schedule?.shiftId,
      },
    });
    if (isInLastHour) {
      await prisma.attendanceExplanation
        .create({
          data: {
            employeeId: user.employee_id,
            attendanceId: result.id,
            workScheduleId: schedule?.scheduleId ?? 2,
            approvalStatus: 'NO',
            explanationStatus: 'NO',
            submissionStatus: 'NO',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        .catch((error) => console.log(error));
    }
    if (result) {
      return NextResponse.json({
        status: true,
        resut: {
          ...result,
          attendance_id: result.id.toString(),
          employee_id: result.userId.toString(),
        },
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
