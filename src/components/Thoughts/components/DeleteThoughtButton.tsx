'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { deleteThoughtAction } from '@/app/thoughts-action';
import { PrismaTypes } from '@/types/prisma';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface DeleteThoughtFormProps {
  thought: PrismaTypes.Thought;
}

export const DeleteThoughtButton: FC<DeleteThoughtFormProps> = ({ thought }) => {
  const { refresh } = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteThoughtAction({ id: thought.id });
      toast.success('Изменения сохранены');
      refresh();
    } catch {
      toast.error('Неизвестная ошибка');
    } finally {
      setIsDeleting(false);
    }
  }, [thought.id, refresh]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" disabled={isDeleting} size="sm">
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
          <AlertDialogDescription>Это действие нельзя отменить</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
