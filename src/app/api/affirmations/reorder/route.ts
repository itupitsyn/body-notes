import { auth } from '@/lib';
import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse('', { status: 401 });
  }

  const { id1, id2 }: { id1: string; id2: string } = await req.json();

  if (!id1 || !id2) {
    return new NextResponse('', { status: 422 });
  }

  const updated = await prisma.$transaction(
    async (tx) => {
      const affirmations = await tx.affirmation.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          order: 'asc',
        },
      });

      affirmations.forEach((item, idx) => {
        item.order = idx + 1;
      });

      const item1 = affirmations.find((item) => item.id === id1);
      const item2 = affirmations.find((item) => item.id === id2);

      if (!item1 || !item2) return null;

      [item1.order, item2.order] = [item2.order, item1.order];

      await Promise.all(
        affirmations.map((item) =>
          tx.affirmation.update({
            data: {
              order: item.order,
            },
            where: {
              id: item.id,
            },
          }),
        ),
      );

      return prisma.affirmation.findMany({
        where: { userId: session.user.id },
        orderBy: { order: 'asc' },
      });
    },
    {
      isolationLevel: 'RepeatableRead',
    },
  );

  if (!updated) {
    return new NextResponse('', { status: 404 });
  }

  return new NextResponse(JSON.stringify(updated));
};
