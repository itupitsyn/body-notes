import { notFound } from "next/navigation";
import { HomeTasks } from "@/components/HomeTasks/HomeTasks";
import { prisma } from "@/prisma";
import { auth } from "@/utils/auth";

const Page = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return notFound();

  const data = await prisma.hometask.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return <HomeTasks tasks={data} />;
};

export default Page;
