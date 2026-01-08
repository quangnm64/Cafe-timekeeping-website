import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';

export async function GET() {
  const result = await prisma.attendanceApproval.findMany({
    include: {
      explanation: {
        include: {
          employee: true,
          attendance: true,
          workSchedule: true,
        },
      },
    },
  });
  return NextResponse.json({
    result: result,
  });
}

export async function POST(req: Request) {
  const request = await req.json();
  try {
    const result = await prisma.attendanceApproval.update({
      where: {
        id: Number(request.approvalId),
      },
      data: {
        decision: request.decision,
      },
    });
    if (result) {
      if (request.decision === 'rejected') {
        const change = await prisma.attendanceExplanation.update({
          where: {
            id: Number(request.explanationId),
          },
          data: {
            approvalStatus: request.decision,
            submissionStatus: 'NO',
            explanationStatus: 'NO',
            updatedAt: new Date(),
          },
        });

        if (change) {
          return NextResponse.json({
            message: 'Thay đổi lựa chọn thành công',
          });
        }
      }
      if (request.decision === 'approved') {
        const change = await prisma.attendanceExplanation.update({
          where: {
            id: Number(request.explanationId),
          },
          data: {
            approvalStatus: 'approved',
            submissionStatus: 'YES',
            explanationStatus: 'YES',

            updatedAt: new Date(),
          },
        });
        if (change) {
          return NextResponse.json({
            message: 'Thay đổi lựa chọn thành công',
          });
        }
      }
    }
  } catch (err) {
    return NextResponse.json({
      message: 'Đã xảy ra lỗi',
    });
  }

  return NextResponse.json({
    message: 'Thay đổi lựa chọn không thành công',
  });
}
