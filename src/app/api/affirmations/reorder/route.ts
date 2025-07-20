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

  if (id1 === id2) {
    const data = await prisma.affirmation.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
    });
    return new NextResponse(JSON.stringify(data));
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

      const idx1 = affirmations.findIndex((item) => item.id === id1);
      const idx2 = affirmations.findIndex((item) => item.id === id2);

      if (idx1 < 0 || idx2 < 0) return null;

      const item1 = affirmations[idx1];
      const item2 = affirmations[idx2];

      let shifting = false;
      if (idx1 < idx2) {
        for (let i = 0; i < affirmations.length; i += 1) {
          if (item1.id === affirmations[i].id) {
            affirmations[i] = affirmations[i + 1];
            shifting = true;
            continue;
          }

          if (item2.id === affirmations[i].id) {
            shifting = false;
            affirmations[i] = item1;
            break;
          }

          if (shifting) {
            affirmations[i] = affirmations[i + 1];
          }
        }
      } else {
        for (let i = affirmations.length - 1; i >= 0; i -= 1) {
          if (item1.id === affirmations[i].id) {
            affirmations[i] = affirmations[i - 1];
            shifting = true;
            continue;
          }

          if (item2.id === affirmations[i].id) {
            shifting = false;
            affirmations[i] = item1;
            break;
          }

          if (shifting) {
            affirmations[i] = affirmations[i - 1];
          }
        }
      }

      affirmations.forEach((item, idx) => {
        item.order = idx + 1;
      });

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
