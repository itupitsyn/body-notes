'use server';

import { ActionError, authActionClient } from '@/lib/safe-action';
import { addThoughtSchema, deleteThoughtSchema, updateThoughtSchema } from '@/lib/schemas/thoughts';
import { prisma } from '@/prisma';
import { flattenValidationErrors } from 'next-safe-action';

export const addThoughtAction = authActionClient
  .metadata({ actionName: 'addThought' })
  .inputSchema(addThoughtSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const data = await prisma.thought.create({
      data: {
        text: parsedInput.text,
        userId: ctx.userId,
        date: parsedInput.date,
      },
    });

    return data;
  });

export const updateThoughtAction = authActionClient
  .metadata({ actionName: 'updateThought' })
  .inputSchema(updateThoughtSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const found = await prisma.thought.findFirst({ where: { id: parsedInput.id } });

    if (found?.userId !== userId) {
      throw new ActionError('Wrong user');
    }

    const data = await prisma.thought.update({
      where: {
        id: parsedInput.id,
      },
      data: {
        text: parsedInput.text,
        date: parsedInput.date,
      },
    });

    return data;
  });

export const deleteThoughtAction = authActionClient
  .metadata({ actionName: 'deletethought' })
  .inputSchema(deleteThoughtSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const found = await prisma.thought.findFirst({ where: { id: parsedInput.id } });

    if (found?.userId !== userId) {
      throw new ActionError('Wrong user');
    }

    await prisma.thought.delete({ where: { id: parsedInput.id } });

    return { ok: true };
  });
