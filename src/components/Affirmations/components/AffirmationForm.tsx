'use client';

import { addAffirmation, changeAffirmationVisibility, deleteAffirmation, updateAffirmation } from '@/api/methods';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PrismaTypes } from '@/types/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { FC, useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { z } from 'zod';

interface AffirmationFormProps {
  affirmation?: PrismaTypes.Affirmation;
  onAfterUpdate: () => void;
}

type FormDataType = {
  text: string;
};

const schema = z.object({
  text: z.string().trim().max(4096, 'Максимальная длина 4096'),
});

export const AffirmationForm: FC<AffirmationFormProps> = ({ affirmation, onAfterUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm<FormDataType>({
    defaultValues: { text: affirmation?.text || '' },
    resolver: zodResolver(schema),
  });

  const submitHandler: SubmitHandler<FormDataType> = useCallback(
    async (formData) => {
      try {
        if (affirmation) {
          await updateAffirmation(affirmation.id, formData.text);
        } else {
          await addAffirmation(formData.text);
          reset();
        }
        toast.success('Изменения сохранены');
        onAfterUpdate();
      } catch {
        toast.error('Неизвестная ошибка');
      }
    },
    [affirmation, onAfterUpdate, reset],
  );

  const changeVisibilityHandler = useCallback(async () => {
    if (!affirmation) return;
    try {
      setIsProcessing(true);
      await changeAffirmationVisibility(affirmation.id);
      toast.success('Изменения сохранены');
      onAfterUpdate();
    } catch {
      toast.error('Неизвестная ошибка');
    } finally {
      setIsProcessing(false);
    }
  }, [affirmation, onAfterUpdate]);

  const deleteHandler = useCallback(async () => {
    if (!affirmation) return;
    try {
      setIsProcessing(true);
      await deleteAffirmation(affirmation.id);
      toast.success('Изменения сохранены');
      onAfterUpdate();
    } catch {
      toast.error('Неизвестная ошибка');
    } finally {
      setIsProcessing(false);
    }
  }, [affirmation, onAfterUpdate]);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {!affirmation && <h2 className="font-medium">Новое внушение</h2>}
      {affirmation && (
        <div className="flex gap-4 self-end">
          <Button variant="destructive" type="button" disabled={isProcessing} size="sm" onClick={deleteHandler}>
            <Trash2 />
          </Button>
          <Button variant="outline" type="button" disabled={isProcessing} size="sm" onClick={changeVisibilityHandler}>
            {affirmation.visible ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      )}

      <div>
        <Controller control={control} name="text" render={({ field }) => <Textarea {...field} />} />
        {errors.text?.message && <div className="mt-1 text-sm text-red-600">{errors.text.message}</div>}
      </div>

      <Button variant="outline" type="submit" disabled={isSubmitting} className="self-end">
        {affirmation ? 'Сохранить' : 'Добавить'}
      </Button>
    </form>
  );
};
