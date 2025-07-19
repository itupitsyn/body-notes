'use client';

import { PrismaTypes } from '@/types/prisma';
import { FC, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { AffirmationForm } from './components/AffirmationForm';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface AffirmationsProps {
  affirmations: PrismaTypes.Affirmation[];
}

export const Affirmations: FC<AffirmationsProps> = ({ affirmations }) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { refresh } = useRouter();

  return (
    <>
      <div className="mt-10 flex items-center justify-between gap-6 px-2 sm:px-0">
        <h1 className="text-4xl font-semibold">Внушения</h1>
        <Button variant="ghost" onClick={() => setMode((prev) => (prev === 'edit' ? 'view' : 'edit'))}>
          <BiEdit className="size-6" />
        </Button>
      </div>

      {mode === 'edit' && (
        <Card className="mx-2 mt-10 px-6 sm:mx-0">
          <AffirmationForm onAfterUpdate={refresh} />
        </Card>
      )}

      <div className="mt-10 flex flex-col gap-4 px-2 sm:px-0">
        {mode === 'view'
          ? affirmations
              .filter((item) => item.visible)
              .map((item) => (
                <Card key={item.id} className="px-6">
                  <div className="overflow-hidden text-ellipsis whitespace-pre-wrap">{item.text}</div>
                </Card>
              ))
          : affirmations.map((item) => (
              <Card key={item.id} className="px-6">
                <AffirmationForm affirmation={item} onAfterUpdate={refresh} />
              </Card>
            ))}
      </div>
    </>
  );
};
