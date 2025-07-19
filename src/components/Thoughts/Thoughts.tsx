'use client';

import { PrismaTypes } from '@/types/prisma';
import { FC, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { ThoughtForm } from './components/ThoughtForm';
import { DEFAULT_LOCALE } from '@/api/constants';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ThoughtsProps {
  thoughts: PrismaTypes.Thought[];
}

export const Thoughts: FC<ThoughtsProps> = ({ thoughts }) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { refresh } = useRouter();

  return (
    <>
      <div className="mt-10 flex items-center justify-between gap-6 px-2 sm:px-0">
        <h1 className="text-4xl font-semibold">Мысли</h1>
        <Button variant="ghost" onClick={() => setMode((prev) => (prev === 'edit' ? 'view' : 'edit'))}>
          <BiEdit className="size-6" />
        </Button>
      </div>

      {mode === 'edit' && (
        <Card className="mx-2 mt-10 px-6 sm:mx-0">
          <ThoughtForm onAfterUpdate={refresh} />
        </Card>
      )}

      <div className="mt-10 flex flex-col gap-4 px-2 sm:px-0">
        {mode === 'view'
          ? thoughts.map((item) => (
              <Card key={item.id} className="px-6">
                <div className="flex justify-end font-medium">
                  {item.date.toLocaleString(DEFAULT_LOCALE, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-pre-wrap">{item.text}</div>
              </Card>
            ))
          : thoughts.map((item) => (
              <Card key={item.id} className="px-6">
                <ThoughtForm thought={item} onAfterUpdate={refresh} />
              </Card>
            ))}
      </div>
    </>
  );
};
