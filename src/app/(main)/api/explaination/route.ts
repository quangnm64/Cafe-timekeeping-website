import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { format } from 'date-fns';

async function getdata(from: Date, to: Date) {
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
          gte: new Date(format(from, 'yyyy-MM-dd') + 'T00:00:00Z'),

          lte: new Date(format(to, 'yyyy-MM-dd') + 'T23:59:59Z'),
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

async function submit(
  id: number,
  shiftCode: string,
  reason: string,
  notes: string,
  explanationStatus: string,
  startTime: string,
  endTime: string
) {
  const records = await prisma.attendanceExplanation.update({
    where: {
      id: id,
    },
    data: {
      reason: reason,
      note: notes,
      explanationStatus: 'YES',
      proposedShiftId: parseInt(shiftCode),
      // proposedCheckInTime: new Date(startTime),
      // proposedCheckOutTime: new Date(endTime),
    },
  });
  if (records) {
    return NextResponse.json({
      status: 'Chỉnh sửa thành công',
    });
  }
  return NextResponse.json({
    status: 'Chỉnh sửa không thành công',
  });
}

export async function POST(req: Request) {
  const request = await req.json();
  if (request.content === 'getData') {
    return getdata(request.fromDate, request.toDate);
  }
  if (request.content === 'submit') {
    return submit(
      request.id,
      request.shiftCode,
      request.reason,
      request.notes,
      request.explanationStatus,
      request.startTime,
      request.endTime
    );
  }
  return NextResponse.json({
    status: true,
  });
}
