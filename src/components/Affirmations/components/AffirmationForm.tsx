"use client";

import { addAffirmation, changeAffirmationVisibility, deleteAffirmation, updateAffirmation } from "@/api/methods";
import { ToastState, useToaster } from "@/contexts/Toaster";
import { PrismaTypes } from "@/types/prisma";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Textarea } from "flowbite-react";
import { FC, useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BiHide, BiShow, BiTrash } from "react-icons/bi";

import * as yup from "yup";

interface AffirmationFormProps {
  affirmation?: PrismaTypes.Affirmation;
  onAfterUpdate: () => void;
}

type FormDataType = {
  text: string;
};

const schema = yup.object().shape({
  text: yup.string().nullable().required().max(4096),
});

export const AffirmationForm: FC<AffirmationFormProps> = ({ affirmation, onAfterUpdate }) => {
  const { addToast } = useToaster();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm<FormDataType>({
    defaultValues: { text: affirmation?.text || "" },
    resolver: yupResolver(schema),
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
        addToast("Изменения сохранены", ToastState.Success);
        onAfterUpdate();
      } catch {
        addToast("Неизвестная ошибка", ToastState.Error);
      }
    },
    [addToast, affirmation, onAfterUpdate, reset],
  );

  const changeVisibilityHandler = useCallback(async () => {
    if (!affirmation) return;
    try {
      setIsProcessing(true);
      await changeAffirmationVisibility(affirmation.id);
      addToast("Изменения сохранены", ToastState.Success);
      onAfterUpdate();
    } catch {
      addToast("Неизвестная ошибка", ToastState.Error);
    } finally {
      setIsProcessing(false);
    }
  }, [addToast, affirmation, onAfterUpdate]);

  const deleteHandler = useCallback(async () => {
    if (!affirmation) return;
    try {
      setIsProcessing(true);
      await deleteAffirmation(affirmation.id);
      addToast("Изменения сохранены", ToastState.Success);
      onAfterUpdate();
    } catch {
      addToast("Неизвестная ошибка", ToastState.Error);
    } finally {
      setIsProcessing(false);
    }
  }, [addToast, affirmation, onAfterUpdate]);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {!affirmation && <h2 className="font-medium">Новое внушение</h2>}
      {affirmation && (
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
          <Button
            type="button"
            disabled={isProcessing}
            gradientDuoTone="redToYellow"
            outline
            size="sm"
            onClick={changeVisibilityHandler}
          >
            {affirmation.visible ? <BiHide /> : <BiShow />}
          </Button>
        </div>
      )}

      <div>
        <Controller control={control} name="text" render={({ field }) => <Textarea {...field} />} />
        {errors.text?.message && <div className="mt-1 text-sm text-red-600">{errors.text.message}</div>}
      </div>

      <Button type="submit" disabled={isSubmitting} gradientDuoTone="redToYellow" outline className="self-end">
        {affirmation ? "Сохранить" : "Добавить"}
      </Button>
    </form>
  );
};
