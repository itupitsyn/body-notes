import { notFound } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/prisma";
import { Thoughts } from "@/components/Thoughts/Thoughts";

const Page = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return notFound();

  const data = await prisma.thought.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return <Thoughts thoughts={data} />;
};

export default Page;