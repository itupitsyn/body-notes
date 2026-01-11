'use client';

import { updateThoughtAction } from '@/app/thoughts-action';
import { DateTimePicker24h } from '@/components/ui/datetimepicker24h';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { updateThoughtSchema } from '@/lib/schemas/thoughts';
import { PrismaTypes } from '@/types/prisma';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useThoughtFormContext } from './ThoughtFormContext';

interface EditThoughtFormProps {
  thought: PrismaTypes.Thought;
  onAfterUpdate: () => void;
}

type UpdateThoughtFormData = z.infer<typeof updateThoughtSchema>;

export const EditThoughtForm: FC<EditThoughtFormProps> = ({ thought, onAfterUpdate }) => {
  const { setIsThoughtFormSubmitting } = useThoughtFormContext();

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<UpdateThoughtFormData>({
    defaultValues: {
      id: thought.id,
      text: thought?.text || '',
      date: thought?.date || new Date(),
    },
    resolver: zodResolver(updateThoughtSchema),
  });

  useEffect(() => {
    setIsThoughtFormSubmitting(isSubmitting);
  }, [isSubmitting, setIsThoughtFormSubmitting]);

  const submitHandler: SubmitHandler<UpdateThoughtFormData> = useCallback(
    async (formData) => {
      try {
        await updateThoughtAction({ ...formData, id: thought.id });
        toast.success('Изменения сохранены');
        onAfterUpdate();
        reset();
      } catch {
        toast.error('Неизвестная ошибка');
      }
    },
    [thought, onAfterUpdate, reset],
  );

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4" id={`form-${thought.id}`}>
      <Controller
        control={control}
        name="date"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}></FieldLabel>
            <DateTimePicker24h {...field} id={field.name} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={control}
        name="text"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}></FieldLabel>

            <Textarea {...field} id={field.name} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};
