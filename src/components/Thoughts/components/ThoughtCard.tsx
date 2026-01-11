'use client';

import { DEFAULT_LOCALE } from '@/api/constants';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PrismaTypes } from '@/types/prisma';
import { FC, useMemo, useState } from 'react';
import { EditThoughtForm } from './EditThoughtForm';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { DeleteThoughtButton } from './DeleteThoughtButton';

import { ThoughtFormContext, useThoughtFormContext } from './ThoughtFormContext';

interface ThoughtCardProps {
  thought: PrismaTypes.Thought;
}

const Component: FC<ThoughtCardProps> = ({ thought }) => {
  const { refresh } = useRouter();
  const { isThoughtFormSubmitting } = useThoughtFormContext();

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  return (
    <Card>
      {mode === 'view' ? (
        <>
          <CardHeader>
            <CardTitle>
              {thought.date.toLocaleString(DEFAULT_LOCALE, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}
            </CardTitle>

            <CardDescription />

            <CardAction>
              <Button
                onClick={() => {
                  setMode('edit');
                }}
                size="icon-sm"
                variant="ghost"
              >
                <SquarePen />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="whitespace-pre-wrap">{thought.text}</CardContent>
        </>
      ) : (
        <>
          <CardContent>
            <EditThoughtForm
              onAfterUpdate={() => {
                refresh();
                setMode('view');
              }}
              thought={thought}
            />
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-between sm:gap-4">
            <DeleteThoughtButton thought={thought} />

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setMode('view');
                }}
                size="sm"
              >
                Отмена
              </Button>

              <Button
                variant="outline"
                type="submit"
                size="sm"
                form={`form-${thought.id}`}
                disabled={isThoughtFormSubmitting}
              >
                Сохранить
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export const ThoughtCard: FC<ThoughtCardProps> = (props) => {
  const [isThoughtFormSubmitting, setIsThoughtFormSubmitting] = useState(false);

  const value = useMemo(() => {
    return {
      isThoughtFormSubmitting,
      setIsThoughtFormSubmitting,
    };
  }, [isThoughtFormSubmitting]);

  return (
    <ThoughtFormContext.Provider value={value}>
      <Component {...props} />
    </ThoughtFormContext.Provider>
  );
};
