import { PrismaTypes } from "@/types/prisma";
import axios from "axios";

const getTransformedDate = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

/// AFFIRMATIONS

export const addAffirmation = async (text: string) => {
  return await axios.post<PrismaTypes.Affirmation>("/api/affirmations", { text });
};

export const updateAffirmation = async (id: string, text: string) => {
  return await axios.patch<PrismaTypes.Affirmation>(`/api/affirmations/${id}`, { text });
};

export const changeAffirmationVisibility = async (id: string) => {
  return await axios.patch<PrismaTypes.Affirmation>(`/api/affirmations/${id}/change-visibility`);
};

export const deleteAffirmation = async (id: string) => {
  return await axios.delete(`/api/affirmations/${id}`);
};

/// HOME TASKS

export const addHomeTask = async (params: { text: string; date: Date }) => {
  return await axios.post<PrismaTypes.Affirmation>("/api/home-tasks", {
    ...params,
    date: getTransformedDate(params.date),
  });
};

export const updateHomeTask = async (id: string, params: { text: string; date: Date }) => {
  return await axios.patch<PrismaTypes.Affirmation>(`/api/home-tasks/${id}`, {
    ...params,
    date: getTransformedDate(params.date),
  });
};

export const deleteHomeTask = async (id: string) => {
  return await axios.delete(`/api/home-tasks/${id}`);
};

/// THOUGHTS

export const addThought = async (params: { text: string; date: Date }) => {
  return await axios.post<PrismaTypes.Affirmation>("/api/thoughts", {
    ...params,
    date: getTransformedDate(params.date),
  });
};

export const updateThought = async (id: string, params: { text: string; date: Date }) => {
  return await axios.patch<PrismaTypes.Affirmation>(`/api/thoughts/${id}`, {
    ...params,
    date: getTransformedDate(params.date),
  });
};

export const deleteThought = async (id: string) => {
  return await axios.delete(`/api/thoughts/${id}`);
};

/// FEELINGS

export const addFeeling = async (params: { text: string; date: Date }) => {
  return await axios.post<PrismaTypes.Affirmation>("/api/feelings", {
    ...params,
    date: getTransformedDate(params.date),
  });
};

export const updateFeeling = async (id: string, params: { text: string; date: Date }) => {
  return await axios.patch<PrismaTypes.Affirmation>(`/api/feelings/${id}`, {
    ...params,
    date: getTransformedDate(params.date),
  });
};

export const deleteFeeling = async (id: string) => {
  return await axios.delete(`/api/feelings/${id}`);
};
