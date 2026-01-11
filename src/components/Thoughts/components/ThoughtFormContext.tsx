'use client';

import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface ThoughtFormContextType {
  isThoughtFormSubmitting: boolean;
  setIsThoughtFormSubmitting: Dispatch<SetStateAction<boolean>>;
}

export const ThoughtFormContext = createContext<ThoughtFormContextType>({} as ThoughtFormContextType);

export const useThoughtFormContext = () => {
  const ctx = useContext(ThoughtFormContext);

  return ctx;
};
