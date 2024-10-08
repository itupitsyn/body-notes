import { notFound } from "next/navigation";
import { Affirmations } from "@/components/Affirmations1/Affirmations";
import { prisma } from "@/prisma";
import { auth } from "@/utils/auth";

const Page = async () => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return notFound();

  const data = await prisma.affirmation.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });

  return <Affirmations affirmations={data} />;
};

export default Page;
