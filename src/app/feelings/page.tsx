import { notFound } from 'next/navigation';
import { prisma } from '@/prisma';
import { Feelings } from '@/components/Feelings/Feelings';
import { auth } from '@/lib/utils/auth';

const Page = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return notFound();

  const data = await prisma.feeling.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  return <Feelings feelings={data} />;
};

export default Page;
