import { getCurrentUser } from '@/lib/auth/get-current-user';
import { NextResponse } from 'next/server';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json(user);
}
