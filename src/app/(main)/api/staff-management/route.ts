import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';
import { cookies } from 'next/headers';
import argon2 from 'argon2';
import { User } from '@/shared/contexts/user-context';
import { parse } from 'date-fns';
export async function GET() {
  const result = await prisma.employee.findMany();
  return NextResponse.json({
    result: result,
  });
}
async function resetPassoword(id: number) {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const password_hash = await argon2.hash('123456789');
    const result = await prisma.account.update({
      where: {
        employeeId: id,
      },
      data: {
        password: String(password_hash),
      },
    });
    if (result) {
      return NextResponse.json({
        message: 'Đổi mật khẩu thành công',
      });
    }
    return NextResponse.json({
      message: 'Đổi mật khẩu không thành công',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
const safeParseDate = (
  dateVal: string | Date | undefined | unknown
): Date | undefined => {
  if (!dateVal) return undefined; // Trả về undefined để Prisma bỏ qua nếu không có dữ liệu
  if (dateVal instanceof Date) return dateVal;

  if (typeof dateVal === 'string') {
    // Xử lý định dạng dd/MM/yyyy
    if (dateVal.includes('/')) {
      const parsed = parse(dateVal, 'dd/MM/yyyy', new Date());
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    // Xử lý định dạng ISO hoặc yyyy-mm-dd
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};
async function editStaff(data: User) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const {
      id,
      createdAt,
      updatedAt,
      fromDate,
      dateOfBirth,
      citizenIdIssueDate,
      hireDate,
      storeId,
      positionId,
      ...rest
    } = data;

    const result = await prisma.employee.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(rest as Record<string, string>),

        fromDate: safeParseDate(fromDate),
        dateOfBirth: safeParseDate(dateOfBirth),
        citizenIdIssueDate: safeParseDate(citizenIdIssueDate),
        hireDate: safeParseDate(hireDate),

        storeId: storeId ? Number(storeId) : undefined,
        positionId: positionId ? Number(positionId) : undefined,

        updatedAt: new Date(),
      },
    });
    if (result) {
      return NextResponse.json({
        status: true,
        result,
        message: 'Cập nhật thông tin thành công',
      });
    }
    return NextResponse.json({
      status: false,
      message: 'Cập nhật thông tin không thành công',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('LỖI PRISMA:', errorMessage);

    return NextResponse.json(
      { message: 'Internal server error', detail: errorMessage },
      { status: 500 }
    );
  }
}
// async function deleteStaff(id:number) {
//   const cookieStore = await cookies();
//     const token = cookieStore.get('access_token')?.value;

//     if (!token) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }
//     const delete_account=await prisma.account.delete({
//       where:{
//         employeeId:id
//       }
//     })

//     const result=await prisma.employee.delete({
//       where:{
//         id:id
//       }
//     })
// }
export async function POST(req: Request) {
  const request = await req.json();
  if (request.content === 'reset-password') {
    return resetPassoword(request.id);
  }
  if (request.content === 'edit-staff') {
    return editStaff(request.data);
  }
  // if (request.content === 'delete-staff') {
  //   return deleteStaff(request.id);
  // }
  return NextResponse.json({
    message: 'Không tương thích với điều kiện nào',
  });
}
