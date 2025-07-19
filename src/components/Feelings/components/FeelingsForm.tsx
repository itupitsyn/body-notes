'use client';

import { addFeeling, deleteFeeling, updateFeeling } from '@/api/methods';
import { Button } from '@/components/ui/button';
import { DateTimePicker24h } from '@/components/ui/datetimepicker24h';
import { Textarea } from '@/components/ui/textarea';
import { PrismaTypes } from '@/types/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiTrash } from 'react-icons/bi';
import { toast } from 'sonner';

import { z } from 'zod';

interface FeelingFormProps {
  feeling?: PrismaTypes.Feeling;
  onAfterUpdate: () => void;
}

type FormDataType = {
  text: string;
  date: Date;
};

const schema = z.object({
  text: z.string().trim().max(4096, 'Максимальная длина 4096'),
  date: z.date(),
});

export const FeelingForm: FC<FeelingFormProps> = ({ feeling, onAfterUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm<FormDataType>({
    defaultValues: {
      text: feeling?.text || '',
      date: feeling?.date || new Date(),
    },
    resolver: zodResolver(schema),
  });

  const submitHandler: SubmitHandler<FormDataType> = useCallback(
    async (formData) => {
      try {
        if (feeling) {
          await updateFeeling(feeling.id, formData);
        } else {
          await addFeeling(formData);
          reset();
        }
        toast.success('Изменения сохранены');
        onAfterUpdate();
      } catch {
        toast.error('Неизвестная ошибка');
      }
    },
    [feeling, onAfterUpdate, reset],
  );

  const deleteHandler = useCallback(async () => {
    if (!feeling) return;
    try {
      setIsProcessing(true);
      await deleteFeeling(feeling.id);
      toast.success('Изменения сохранены');
      onAfterUpdate();
    } catch {
      toast.error('Неизвестная ошибка');
    } finally {
      setIsProcessing(false);
    }
  }, [feeling, onAfterUpdate]);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {!feeling && <h2 className="font-medium">Новая запись</h2>}
      {feeling && (
        <div className="flex gap-4 self-end">
          <Button type="button" disabled={isProcessing} size="sm" onClick={deleteHandler}>
            <BiTrash />
          </Button>
        </div>
      )}

      <div className="flex flex-col items-start gap-1">
        <Controller control={control} name="date" render={({ field }) => <DateTimePicker24h {...field} />} />
        {errors.date?.message && <div className="text-sm text-red-600">{errors.date.message}</div>}
      </div>

      <div>
        <Controller control={control} name="text" render={({ field }) => <Textarea {...field} />} />
        {errors.text?.message && <div className="mt-1 text-sm text-red-600">{errors.text.message}</div>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-end">
        {feeling ? 'Сохранить' : 'Добавить'}
      </Button>
    </form>
  );
};
