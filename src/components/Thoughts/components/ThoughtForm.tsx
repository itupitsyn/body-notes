"use client";

import { addThought, deleteThought, updateThought } from "@/api/methods";
import { DateTimePicker } from "@/components/DateTimePicker";
import { ToastState, useToaster } from "@/contexts/Toaster";
import { PrismaTypes } from "@/types/prisma";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Textarea } from "flowbite-react";
import { FC, useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BiTrash } from "react-icons/bi";

import * as yup from "yup";

interface ThoughtFormProps {
  thought?: PrismaTypes.Thought;
  onAfterUpdate: () => void;
}

type FormDataType = {
  text: string;
  date: Date;
};

const schema = yup.object().shape({
  text: yup.string().nullable().required().max(4096),
  date: yup.date().nullable().required(),
});

export const ThoughtForm: FC<ThoughtFormProps> = ({ thought, onAfterUpdate }) => {
  const { addToast } = useToaster();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm<FormDataType>({
    defaultValues: {
      text: thought?.text || "",
      date: thought?.date || new Date(),
    },
    resolver: yupResolver(schema),
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
        addToast("Изменения сохранены", ToastState.Success);
        onAfterUpdate();
      } catch {
        addToast("Неизвестная ошибка", ToastState.Error);
      }
    },
    [addToast, thought, onAfterUpdate, reset],
  );

  const deleteHandler = useCallback(async () => {
    if (!thought) return;
    try {
      setIsProcessing(true);
      await deleteThought(thought.id);
      addToast("Изменения сохранены", ToastState.Success);
      onAfterUpdate();
    } catch {
      addToast("Неизвестная ошибка", ToastState.Error);
    } finally {
      setIsProcessing(false);
    }
  }, [addToast, thought, onAfterUpdate]);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {!thought && <h2 className="font-medium">Новая запись</h2>}
      {thought && (
        <div className="flex gap-4 self-end">
          <Button
            type="button"
            disabled={isProcessing}
            gradientDuoTone="redToYellow"
            outline
            size="sm"
            onClick={deleteHandler}
          >
            <BiTrash />
          </Button>
        </div>
      )}

      <div className="flex flex-col items-start gap-1">
        <Controller control={control} name="date" render={({ field }) => <DateTimePicker {...field} />} />
        {errors.date?.message && <div className="text-sm text-red-600">{errors.date.message}</div>}
      </div>

      <div>
        <Controller control={control} name="text" render={({ field }) => <Textarea {...field} />} />
        {errors.text?.message && <div className="mt-1 text-sm text-red-600">{errors.text.message}</div>}
      </div>

      <Button type="submit" disabled={isSubmitting} gradientDuoTone="redToYellow" outline className="self-end">
        {thought ? "Сохранить" : "Добавить"}
      </Button>
    </form>
  );
};
