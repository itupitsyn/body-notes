import { PrismaTypes } from '@/types/prisma';
import { FC } from 'react';
import { AddThoughtButton } from './components/AddThoughtButton';
import { ThoughtCard } from './components/ThoughtCard';

interface ThoughtsProps {
  thoughts: PrismaTypes.Thought[];
}

export const Thoughts: FC<ThoughtsProps> = ({ thoughts }) => {
  return (
    <>
      <div className="mt-10 flex items-center justify-between gap-6 px-2 sm:px-0">
        <h1 className="text-4xl font-semibold">Мысли</h1>

        <AddThoughtButton />
      </div>

      <div className="mt-10 flex flex-col gap-4 px-2 sm:px-0">
        {thoughts.map((item) => (
          <ThoughtCard key={item.id} thought={item} />
        ))}
      </div>
    </>
  );
};
