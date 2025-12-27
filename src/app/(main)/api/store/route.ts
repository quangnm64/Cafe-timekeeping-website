import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prismaClient';

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
      include: {
        store: true,
      },
    });
    console.log(result);
    if (result?.store) {
      return NextResponse.json({
        store: result.store,
        status: true,
      });
    }
    return NextResponse.json({
      status: true,
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    throw error;
  }
}
