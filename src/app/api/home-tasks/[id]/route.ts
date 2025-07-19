import { prisma } from '@/prisma';
import { auth } from '@/lib/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export const PATCH = async (req: NextRequest, { params }: RouteParams) => {
  const { id } = await params;

  const [data, session] = await Promise.all([prisma.hometask.findFirst({ where: { id } }), auth()]);

  if (!data || data.userId !== session?.user.id) return new NextResponse('', { status: 404 });

  const body = await req.json();

  const updated = await prisma.hometask.update({
    where: { id },
    data: { text: body.text, date: body.date },
  });

  return new NextResponse(JSON.stringify(updated));
};

export const DELETE = async (req: NextRequest, { params }: RouteParams) => {
  const { id } = await params;

  const [data, session] = await Promise.all([prisma.hometask.findFirst({ where: { id } }), auth()]);

  if (!data || data.userId !== session?.user.id) return new NextResponse('', { status: 404 });

  await prisma.hometask.delete({ where: { id } });

  return new NextResponse();
};
