'use client';

import { addThoughtAction } from '@/app/thoughts-action';
import { Button } from '@/components/ui/button';
import { DateTimePicker24h } from '@/components/ui/datetimepicker24h';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { addThoughtSchema } from '@/lib/schemas/thoughts';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const ADD_THOUGHT_FORM_ID = 'add-thought-form';

type AddThoughtFormData = z.infer<typeof addThoughtSchema>;

export const AddThoughtButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { refresh } = useRouter();

  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<AddThoughtFormData>({
    defaultValues: {
      text: '',
      date: new Date(),
    },
    resolver: zodResolver(addThoughtSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<AddThoughtFormData> = useCallback(async (data) => {
    try {
      await addThoughtAction(data);
      toast.success('Успешно добавлено');
      setIsOpen(false);
      refreshRef.current();
    } catch {
      toast.error('Неизвестная ошибка');
    }
  }, []);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="size-6" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить мысль</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} id={ADD_THOUGHT_FORM_ID}>
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

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Отмена
            </Button>
          </DialogClose>

          <Button type="submit" disabled={isSubmitting} form={ADD_THOUGHT_FORM_ID}>
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
