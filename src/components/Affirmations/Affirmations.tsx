'use client';

import { PrismaTypes } from '@/types/prisma';
import { FC, startTransition, useId, useOptimistic, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AffirmationForm } from './components/AffirmationForm';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { SquarePen } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { AffirmationItem } from './components/AffirmationItem';
import { reorderAffirmations } from '@/api/methods';
import { toast } from 'sonner';

interface AffirmationsProps {
  affirmations: PrismaTypes.Affirmation[];
}

export const Affirmations: FC<AffirmationsProps> = ({ affirmations }) => {
  const { refresh } = useRouter();
  const id = useId();

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const [optimisticItems, setOptimisticItems] = useOptimistic(affirmations, (prev, payload: DragEndEvent) => {
    const { active, over } = payload;
    if (!active || !over) {
      return prev;
    }
    const oldIndex = prev.findIndex((item) => item.id === active.id);
    const newIndex = prev.findIndex((item) => item.id === over.id);

    return arrayMove(prev, oldIndex, newIndex);
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    if (active.id !== over.id) {
      startTransition(async () => {
        setOptimisticItems(event);
        try {
          await reorderAffirmations(String(active.id), String(over.id));
          refresh();
        } catch {
          toast.error('Неизвестная ошибка');
        }
      });
    }
  };

  return (
    <>
      <div className="mt-10 flex items-center justify-between gap-6 px-2 sm:px-0">
        <h1 className="text-4xl font-semibold">Внушения</h1>
        <Button variant="ghost" onClick={() => setMode((prev) => (prev === 'edit' ? 'view' : 'edit'))}>
          <SquarePen className="size-6" />
        </Button>
      </div>

      {mode === 'edit' && (
        <Card className="mx-2 mt-10 px-6 sm:mx-0">
          <AffirmationForm onAfterUpdate={refresh} />
        </Card>
      )}

      <div className="mt-10 flex flex-col gap-4 px-2 sm:px-0">
        <DndContext
          id={id}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={optimisticItems} strategy={verticalListSortingStrategy}>
            {optimisticItems
              .filter((item) => mode === 'edit' || item.visible)
              .map((item) => (
                <AffirmationItem key={item.id} affirmation={item} mode={mode} />
              ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};
