import { notFound } from "next/navigation";
import { getAffirmations } from "../../../prisma/model/affirmations";
import { ERROR_UNAUTHORIZED } from "@/constants/common";
import { Affirmations } from "@/components/affirmations/Affirmations";

const Page = async () => {
  try {
    const data = await getAffirmations();
    return <Affirmations affirmations={data} />;
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_UNAUTHORIZED) return notFound();
    throw error;
  }
};

export default Page;
