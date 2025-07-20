import { PrismaTypes } from '@/types/prisma';
import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { AffirmationForm } from './AffirmationForm';
import { useRouter } from 'next/navigation';
import { GripVertical } from 'lucide-react';

interface AffirmationItemProps {
  affirmation: PrismaTypes.Affirmation;
  mode: 'view' | 'edit';
}

export const AffirmationItem: FC<AffirmationItemProps> = ({ affirmation, mode }) => {
  const { refresh } = useRouter();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: affirmation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} className="relative pr-8 pl-6">
      {mode === 'view' ? (
        <div className="overflow-hidden text-ellipsis whitespace-pre-wrap">{affirmation.text}</div>
      ) : (
        <AffirmationForm affirmation={affirmation} onAfterUpdate={refresh} />
      )}
      <GripVertical
        {...listeners}
        className="absolute right-2 bottom-4 size-5 touch-none hover:cursor-grab active:cursor-grabbing sm:top-4"
      />
    </Card>
  );
};
