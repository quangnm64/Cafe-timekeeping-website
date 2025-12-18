import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '../../../prisma/prismaClient';
import { mapEmployeeToUser } from '@/mappers/user/user.mapper';
export async function getCurrentUser() {
  const cookie = await cookies();
  if (!cookie) {
    console.log('cookie null');
    return null;
  }
  console.log(cookie);
  const token = cookie.get('access_token')?.value;
  if (!token) {
    console.log('token null');
    return null;
  }

  console.log('token: ', token);
  const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;

  const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  const user_infor = await prisma.employee.findUnique({
    where: { employee_id: user.employee_id },
  });

  console.log(user_infor);

  if (!user_infor) return null;

  return mapEmployeeToUser(user_infor);
}
