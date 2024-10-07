import { notFound } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/prisma";
import { Feelings } from "@/components/Feelings/Feelings";

const Page = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return notFound();

  const data = await prisma.feeling.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return <Feelings feelings={data} />;
};

export default Page;
