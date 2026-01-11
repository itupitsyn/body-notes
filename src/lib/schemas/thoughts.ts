import z from 'zod';

export const addThoughtSchema = z.object({
  text: z.string().trim().max(4096, 'Максимальная длина 4096'),
  date: z.date(),
});

export const updateThoughtSchema = z.object({
  id: z.string(),
  text: z.string().trim().max(4096, 'Максимальная длина 4096'),
  date: z.date(),
});

export const deleteThoughtSchema = z.object({
  id: z.string(),
});
