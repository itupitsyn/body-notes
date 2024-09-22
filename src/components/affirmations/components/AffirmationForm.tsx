"use client";

import { updateAffirmation } from "@/api/methods";
import { ToastState, useToaster } from "@/contexts/Toaster";
import { PrismaTypes } from "@/types/prisma";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Textarea } from "flowbite-react";
import { FC, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import * as yup from "yup";

interface AffirmationFormProps {
  affirmation: PrismaTypes.Affirmation;
}

type FormDataType = {
  text: string;
};

const schema = yup.object().shape({
  text: yup.string().nullable().required().max(4096),
});

export const AffirmationForm: FC<AffirmationFormProps> = ({ affirmation }) => {
  const { addToast } = useToaster();

  const {
    control,
    formState: { isSubmitting, errors },
    reset,
    handleSubmit,
  } = useForm<FormDataType>({
    defaultValues: { text: affirmation.text },
    resolver: yupResolver(schema),
  });

  const submitHandler: SubmitHandler<FormDataType> = useCallback(
    async (formData) => {
      try {
        const response = await updateAffirmation(affirmation.id, formData.text);
        reset({ text: response.data.text });
        addToast("Изменения сохранены", ToastState.Success);
      } catch {
        addToast("Неизвестная ошибка", ToastState.Error);
      }
    },
    [addToast, affirmation.id, reset],
  );

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <div>
        <Controller control={control} name="text" render={({ field }) => <Textarea {...field} />} />
        {errors.text?.message && <div className="mt-1 text-sm text-red-600">{errors.text.message}</div>}
      </div>

      <Button type="submit" disabled={isSubmitting} gradientDuoTone="redToYellow" outline className="self-end">
        Сохранить
      </Button>
    </form>
  );
};
