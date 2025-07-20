'use client';

import { addThought, deleteThought, updateThought } from '@/api/methods';
import { Button } from '@/components/ui/button';
import { DateTimePicker24h } from '@/components/ui/datetimepicker24h';
import { Textarea } from '@/components/ui/textarea';
import { PrismaTypes } from '@/types/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { FC, useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { z } from 'zod';

interface ThoughtFormProps {
  thought?: PrismaTypes.Thought;
  onAfterUpdate: () => void;
}

type FormDataType = {
  text: string;
  date: Date;
};

const schema = z.object({
  text: z.string().max(4096, 'Максимальная длина 4096'),
  date: z.date(),
});

export const ThoughtForm: FC<ThoughtFormProps> = ({ thought, onAfterUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm<FormDataType>({
    defaultValues: {
      text: thought?.text || '',
      date: thought?.date || new Date(),
    },
    resolver: zodResolver(schema),
  });

  const submitHandler: SubmitHandler<FormDataType> = useCallback(
    async (formData) => {
      try {
        if (thought) {
          await updateThought(thought.id, formData);
        } else {
          await addThought(formData);
          reset();
        }
        toast.success('Изменения сохранены');
        onAfterUpdate();
      } catch {
        toast.error('Неизвестная ошибка');
      }
    },
    [thought, onAfterUpdate, reset],
  );

  const deleteHandler = useCallback(async () => {
    if (!thought) return;
    try {
      setIsProcessing(true);
      await deleteThought(thought.id);
      toast.success('Изменения сохранены');
      onAfterUpdate();
    } catch {
      toast.error('Неизвестная ошибка');
    } finally {
      setIsProcessing(false);
    }
  }, [thought, onAfterUpdate]);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {!thought && <h2 className="font-medium">Новая запись</h2>}
      {thought && (
        <div className="flex gap-4 self-end">
          <Button variant="destructive" type="button" disabled={isProcessing} size="sm" onClick={deleteHandler}>
            <Trash2 />
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

      <Button variant="outline" type="submit" disabled={isSubmitting} className="self-end">
        {thought ? 'Сохранить' : 'Добавить'}
      </Button>
    </form>
  );
};
