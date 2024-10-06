"use client";

import { addHomeTask, deleteHomeTask, updateHomeTask } from "@/api/methods";
import { ToastState, useToaster } from "@/contexts/Toaster";
import { PrismaTypes } from "@/types/prisma";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Datepicker, Textarea } from "flowbite-react";
import { FC, useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BiTrash } from "react-icons/bi";

import * as yup from "yup";

interface HomeTaskFormProps {
  task?: PrismaTypes.Hometask;
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

export const HomeTaskForm: FC<HomeTaskFormProps> = ({ task, onAfterUpdate }) => {
  const { addToast } = useToaster();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm<FormDataType>({
    defaultValues: {
      text: task?.text || "",
      date: task?.date || new Date(),
    },
    resolver: yupResolver(schema),
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
        addToast("Изменения сохранены", ToastState.Success);
        onAfterUpdate();
      } catch {
        addToast("Неизвестная ошибка", ToastState.Error);
      }
    },
    [addToast, task, onAfterUpdate, reset],
  );

  const deleteHandler = useCallback(async () => {
    if (!task) return;
    try {
      setIsProcessing(true);
      await deleteHomeTask(task.id);
      addToast("Изменения сохранены", ToastState.Success);
      onAfterUpdate();
    } catch {
      addToast("Неизвестная ошибка", ToastState.Error);
    } finally {
      setIsProcessing(false);
    }
  }, [addToast, task, onAfterUpdate]);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      {!task && <h2 className="font-medium">Новая домашка</h2>}
      {task && (
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

      <div>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Datepicker
              labelTodayButton="Сегодня"
              labelClearButton="Сбросить"
              language="ru-RU"
              weekStart={1}
              onSelectedDateChanged={field.onChange}
              onBlur={field.onBlur}
              value={field.value.toLocaleDateString("ru-RU")}
              defaultDate={field.value}
            />
          )}
        />
        {errors.date?.message && <div className="mt-1 text-sm text-red-600">{errors.date.message}</div>}
      </div>

      <div>
        <Controller control={control} name="text" render={({ field }) => <Textarea {...field} />} />
        {errors.text?.message && <div className="mt-1 text-sm text-red-600">{errors.text.message}</div>}
      </div>

      <Button type="submit" disabled={isSubmitting} gradientDuoTone="redToYellow" outline className="self-end">
        {task ? "Сохранить" : "Добавить"}
      </Button>
    </form>
  );
};
