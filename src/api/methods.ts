import { PrismaTypes } from "@/types/prisma";
import axios from "axios";

export const addAffirmation = async (text: string) => {
  return await axios.post<PrismaTypes.Affirmation>("/api/affirmations", { text });
};

export const updateAffirmation = async (id: string, text: string) => {
  return await axios.patch<PrismaTypes.Affirmation>(`/api/affirmations/${id}`, { text });
};
