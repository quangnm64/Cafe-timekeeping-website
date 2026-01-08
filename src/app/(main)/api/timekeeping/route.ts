import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { format } from 'date-fns';
import { AttendanceLog } from '@prisma/client';

const ONE_HOUR = 60 * 60 * 1000;

function combineDateAndTime(workDate: string, time: Date): Date {
  const d = new Date(workDate);
  d.setHours(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), 0);
  return d;
}

function isDeviation(
  logTime: Date,
  shiftTime: Date,
  type: 'IN' | 'OUT'
): boolean {
  if (type === 'IN')
    return (
      logTime.getTime() > shiftTime.getTime() ||
      Math.abs(logTime.getTime() - shiftTime.getTime()) > ONE_HOUR
    );
  return (
    logTime.getTime() < shiftTime.getTime() ||
    Math.abs(logTime.getTime() - shiftTime.getTime()) > ONE_HOUR
  );
}

async function CheckIn() {
  try {
    const token = (await cookies()).get('access_token')?.value;
    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const workDateStr = format(new Date(), 'yyyy-MM-dd');

    const workSchedule = await prisma.workSchedule.findFirst({
      where: { employeeId: user.employee_id, workDate: new Date(workDateStr) },
      include: { shift: true },
    });
    if (!workSchedule)
      return NextResponse.json({ message: 'Bạn chưa được xếp lịch' });

    const now = new Date();
    const shiftStart = combineDateAndTime(
      workDateStr,
      workSchedule.shift.startTime
    );

    const logs: AttendanceLog[] = await prisma.attendanceLog.findMany({
      where: {
        userId: user.employee_id,
        workDate: new Date(workDateStr),
        logType: 'IN',
      },
      orderBy: { logTime: 'asc' },
    });

    const attendance = await prisma.attendanceLog.create({
      data: {
        userId: user.employee_id,
        workDate: new Date(workDateStr),
        logType: 'IN',
        logTime: now,
        status: 'present',
        shiftId: workSchedule.shiftId,
        createdAt: new Date(),
      },
    });

    logs.push(attendance);

    const closestLog = logs.reduce((prev, curr) =>
      Math.abs(curr.logTime.getTime() - shiftStart.getTime()) <
      Math.abs(prev.logTime.getTime() - shiftStart.getTime())
        ? curr
        : prev
    );

    const deviation = isDeviation(closestLog.logTime, shiftStart, 'IN');

    if (deviation) {
      const existExp = await prisma.attendanceExplanation.findFirst({
        where: {
          employeeId: user.employee_id,
          workScheduleId: workSchedule.scheduleId,
        },
      });
      if (!existExp) {
        await prisma.attendanceExplanation.create({
          data: {
            employeeId: user.employee_id,
            workScheduleId: workSchedule.scheduleId,
            attendanceId: closestLog.id,
            approvalStatus: 'NO',
            explanationStatus: 'NO',
            submissionStatus: 'NO',
          },
        });
      }
      await prisma.attendanceLog.update({
        where: { id: closestLog.id },
        data: { status: 'Deviation' },
      });
    } else {
      await prisma.attendanceLog.updateMany({
        where: {
          userId: user.employee_id,
          workDate: new Date(workDateStr),
          logType: 'IN',
        },
        data: { status: 'present' },
      });
      await prisma.attendanceExplanation.deleteMany({
        where: {
          employeeId: user.employee_id,
          workScheduleId: workSchedule.scheduleId,
        },
      });
    }

    return NextResponse.json({ status: true, result: closestLog });
  } catch (error) {
    console.error('CheckIn error:', error);
    throw error;
  }
}

async function CheckOut() {
  try {
    const token = (await cookies()).get('access_token')?.value;
    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const workDateStr = format(new Date(), 'yyyy-MM-dd');

    const workSchedule = await prisma.workSchedule.findFirst({
      where: { employeeId: user.employee_id, workDate: new Date(workDateStr) },
      include: { shift: true },
    });
    if (!workSchedule)
      return NextResponse.json({ message: 'Bạn chưa được xếp lịch' });

    const now = new Date();
    const shiftEnd = combineDateAndTime(
      workDateStr,
      workSchedule.shift.endTime
    );

    const logs: AttendanceLog[] = await prisma.attendanceLog.findMany({
      where: {
        userId: user.employee_id,
        workDate: new Date(workDateStr),
        logType: 'OUT',
      },
      orderBy: { logTime: 'asc' },
    });

    const attendance = await prisma.attendanceLog.create({
      data: {
        userId: user.employee_id,
        workDate: new Date(workDateStr),
        logType: 'OUT',
        logTime: now,
        status: 'present',
        shiftId: workSchedule.shiftId,
        createdAt: new Date(),
      },
    });

    logs.push(attendance);

    const closestLog = logs.reduce((prev, curr) =>
      Math.abs(curr.logTime.getTime() - shiftEnd.getTime()) <
      Math.abs(prev.logTime.getTime() - shiftEnd.getTime())
        ? curr
        : prev
    );

    const deviation = isDeviation(closestLog.logTime, shiftEnd, 'OUT');

    if (deviation) {
      const existExp = await prisma.attendanceExplanation.findFirst({
        where: {
          employeeId: user.employee_id,
          workScheduleId: workSchedule.scheduleId,
        },
      });
      if (!existExp) {
        await prisma.attendanceExplanation.create({
          data: {
            employeeId: user.employee_id,
            workScheduleId: workSchedule.scheduleId,
            attendanceId: closestLog.id,
            approvalStatus: 'NO',
            explanationStatus: 'NO',
            submissionStatus: 'NO',
          },
        });
      }
      await prisma.attendanceLog.update({
        where: { id: closestLog.id },
        data: { status: 'Deviation' },
      });
    } else {
      await prisma.attendanceLog.updateMany({
        where: {
          userId: user.employee_id,
          workDate: new Date(workDateStr),
          logType: 'OUT',
        },
        data: { status: 'present' },
      });
      await prisma.attendanceExplanation.deleteMany({
        where: {
          employeeId: user.employee_id,
          workScheduleId: workSchedule.scheduleId,
        },
      });
    }

    return NextResponse.json({ status: true, result: closestLog });
  } catch (error) {
    console.error('CheckOut error:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;
    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const employee = await prisma.employee.findUnique({
      where: { id: user.employee_id },
    });
    const store = await prisma.store.findUnique({
      where: { storeId: employee?.storeId },
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  const task = await req.json();
  if (task.value === 'checkin') return CheckIn();
  if (task.value === 'checkout') return CheckOut();
  return NextResponse.json({ message: 'Error when call' });
}
