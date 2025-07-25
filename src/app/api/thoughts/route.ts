import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/utils/auth';
import { prisma } from '@/prisma';

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user.id) return new NextResponse('', { status: 404 });

  const body = await req.json();

  const data = await prisma.thought.create({
    data: {
      text: body.text,
      userId: session.user.id,
      date: body.date,
    },
  });

  return new NextResponse(JSON.stringify(data));
};
