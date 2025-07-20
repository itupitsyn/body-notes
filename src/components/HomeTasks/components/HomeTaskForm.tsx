'use client';

import { addHomeTask, deleteHomeTask, updateHomeTask } from '@/api/methods';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datepicker';
import { Textarea } from '@/components/ui/textarea';
import { PrismaTypes } from '@/types/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { FC, useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { z } from 'zod';

interface HomeTaskFormProps {
  task?: PrismaTypes.Hometask;
  onAfterUpdate: () => void;
}

type FormDataType = {
  text: string;
  date: Date;
};

const schema = z.object({
  text: z.string().max(4096),
  date: z.date(),
});

export const HomeTaskForm: FC<HomeTaskFormProps> = ({ task, onAfterUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm<FormDataType>({
    defaultValues: {
      text: task?.text || '',
      date: task?.date || new Date(),
    },
    resolver: zodResolver(schema),
  });

  const submitHandler: SubmitHandler<FormDataType> = useCallback(
    async (formData) => {
      try {
        if (task) {
          await updateHomeTask(task.id, formData);
        } else {
          await addHomeTask(formData);
          reset();
        }
        toast.success('Изменения сохранены');
        onAfterUpdate();
      } catch {
        toast.error('Неизвестная ошибка');
      }
    },
    [task, onAfterUpdate, reset],
  );

  const deleteHandler = useCallback(async () => {
    if (!task) return;
    try {
      setIsProcessing(true);
      await deleteHomeTask(task.id);
      toast.success('Изменения сохранены');
      onAfterUpdate();
    } catch {
      toast.error('Неизвестная ошибка');
    } finally {
      setIsProcessing(false);
    }
  }, [task, onAfterUpdate]);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {!task && <h2 className="font-medium">Новая домашка</h2>}
      {task && (
        <div className="flex gap-4 self-end">
          <Button variant="destructive" type="button" disabled={isProcessing} size="sm" onClick={deleteHandler}>
            <Trash2 />
          </Button>
        </div>
      )}

      <div className="flex flex-col items-start gap-1">
        <Controller
          control={control}
          name="date"
          render={({ field }) => <DatePicker placeholder="Дата" {...field} />}
        />
        {errors.date?.message && <div className="text-sm text-red-600">{errors.date.message}</div>}
      </div>

      <div>
        <Controller control={control} name="text" render={({ field }) => <Textarea {...field} />} />
        {errors.text?.message && <div className="mt-1 text-sm text-red-600">{errors.text.message}</div>}
      </div>

      <Button variant="outline" type="submit" disabled={isSubmitting} className="self-end">
        {task ? 'Сохранить' : 'Добавить'}
      </Button>
    </form>
  );
};
