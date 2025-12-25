import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '../../../prisma/prismaClient';
export async function getCurrentUser() {
  const cookie = await cookies();
  if (!cookie) {
    return null;
  }
  const token = cookie.get('access_token')?.value;
  if (!token) {
    return null;
  }

  console.log('token: ', token);
  const JWT_SECRET = process.env.JWT_TOKEN_SECRET!;

  const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  const user_infor = await prisma.employee.findUnique({
    where: { id: user.employee_id },
  });

  console.log(user_infor);

  if (!user_infor) return null;

  return user_infor;
}
