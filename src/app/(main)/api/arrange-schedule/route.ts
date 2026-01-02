import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
interface ShiftAssignment {
  id?: string;
  employeeId: string;
  dateKey: string;
  shiftId: string;
}
async function getdata(monday: string, sunday: string, storeId: number) {
  try {
    const result = await prisma.employee.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        schedules: {
          where: {
            workDate: {
              gte: new Date(monday),
              lte: new Date(sunday),
            },
          },
        },
      },
    });
    if (result && result[0].schedules.length) {
      return NextResponse.json({
        result: result,
        status: true,
      });
    }
    return NextResponse.json({
      result: result,
      status: false,
    });
  } catch (error) {
    console.error('Error fetching schedules by date range:', error);
    return NextResponse.json({ result: [] });
  }
}

async function submit(schedule: ShiftAssignment[]) {
  const re = NextResponse.json({
    status: true,
  });
  const data = schedule.map((item) => ({
    employeeId: Number(item.employeeId),
    shiftId: Number(item.shiftId),
    workDate: new Date(item.dateKey),
  }));
  const result = await Promise.all(
    data.map((item) =>
      prisma.workSchedule.upsert({
        where: {
          employeeId_workDate: {
            employeeId: item.employeeId,
            workDate: item.workDate,
          },
        },
        update: {
          shiftId: item.shiftId,
        },
        create: {
          employeeId: item.employeeId,
          shiftId: item.shiftId,
          workDate: item.workDate,
        },
      })
    )
  );
  if (result) return re;
  return NextResponse.json({
    status: false,
  });
}
export async function POST(req: Request) {
  const request = await req.json();
  if (request.content === 'getdata') {
    return getdata(request.monday, request.sunday, request.storeId);
  } else if (request.content === 'submit') {
    return submit(request.schedule);
  }
  return NextResponse.json({
    message: 'true',
  });
}
