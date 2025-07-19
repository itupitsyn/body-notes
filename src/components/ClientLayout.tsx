'use client';

import { SessionProvider } from 'next-auth/react';
import { FC, PropsWithChildren } from 'react';
import { Navigation } from './Navigation';

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <div className="container mx-auto min-w-80 pb-36 sm:pb-24">
        {children}
        <Navigation />
      </div>
    </SessionProvider>
  );
};
