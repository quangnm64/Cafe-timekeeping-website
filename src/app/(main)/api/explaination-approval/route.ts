import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { endOfDay, format } from 'date-fns';
import jwt from 'jsonwebtoken';

export async function getData(from: Date, to: Date) {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const user_infor = await prisma.employee.findUnique({
      where: { id: parseInt(user.employee_id) },
    });
    const result = await prisma.attendanceExplanation.findMany({
      where: {
        employee: {
          storeId: user_infor?.storeId,
        },
        createdAt: {
          gte: new Date(format(from, 'yyyy-MM-dd')),
          lte: endOfDay(new Date(format(to, 'yyyy-MM-dd'))),
        },
      },
      include: {
        attendance: true,
        employee: true,
        workSchedule: {
          include: {
            shift: true,
          },
        },
      },
    });
    if (result) {
      return NextResponse.json({
        result: result,
      });
    }
    return NextResponse.json({
      result: [],
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
export async function aprroval(id: number, decision: string) {
  console.log(decision);
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    // Bước 1: Tìm bản ghi
    const existing = await prisma.attendanceApproval.findFirst({
      where: { explanationId: Number(id) },
    });

    if (existing) {
      // Bước 2a: Nếu có rồi thì update bằng ID khóa chính
      await prisma.attendanceApproval.update({
        where: { id: existing.id },
        data: { decision: decision },
      });
    } else {
      // Bước 2b: Nếu chưa có thì create
      await prisma.attendanceApproval.create({
        data: {
          explanationId: Number(id),
          decision: decision,
          approverId: user.employee_id,
        },
      });
    }
    if (decision === 'rejected') {
      const result = await prisma.attendanceExplanation.update({
        where: {
          id: Number(id),
        },
        data: {
          approvalStatus: 'rejected',
          submissionStatus: 'NO',
          explanationStatus: 'NO',
          updatedAt: new Date(),
        },
      });
      if (result) {
        return NextResponse.json({
          message: 'Phê duyệt thành công',
        });
      }
    } else {
      const result = await prisma.attendanceExplanation.update({
        where: {
          id: Number(id),
        },
        data: {
          approvalStatus: 'approved',
          updatedAt: new Date(),
        },
      });
      if (result) {
        return NextResponse.json({
          message: 'Phê duyệt thành công',
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
  return NextResponse.json({
    message: 'Phê duyệt không thành công',
  });
}
export async function POST(req: Request) {
  const request = await req.json();
  if (request.content === 'getdata') {
    const from = request.fromDate;
    const to = request.toDate;
    return getData(from, to);
  }
  if (request.content === 'approval') {
    return aprroval(request.id, request.decision);
  }
  return NextResponse.json({
    status: true,
  });
}
