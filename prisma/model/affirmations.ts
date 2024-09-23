import { auth } from "@/app/api/auth/[...nextauth]/route";
import { ERROR_UNAUTHORIZED } from "@/constants/common";
import { prisma } from "@/prisma";
import { PrismaTypes } from "@/types/prisma";

export const getAffirmations = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) throw new Error(ERROR_UNAUTHORIZED);

  const result = await prisma.affirmation.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });

  return result;
};

export const addAffirmation = async (data: PrismaTypes.Prisma.AffirmationUncheckedCreateInput) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId || userId !== data.userId) throw new Error(ERROR_UNAUTHORIZED);

  const result = await prisma.affirmation.create({ data });

  return result;
};
