import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout success' },
    { status: 200 }
  );

  response.cookies.set({
    name: 'access_token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
