import { notFound } from "next/navigation";
import { getAffirmations } from "../../../prisma/model/affirmations";
import { PrismaTypes } from "@/types/prisma";
import { ERROR_UNAUTHORIZED } from "@/constants/common";
import { Affirmations } from "@/components/affirmations/Affirmations";

const Page = async () => {
  let data: PrismaTypes.Affirmation[] = [];
  try {
    data = await getAffirmations();
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_UNAUTHORIZED) return notFound();
    throw error;
  }

  return <Affirmations affirmations={data} />;
};

export default Page;
