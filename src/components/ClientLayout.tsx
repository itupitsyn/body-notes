"use client";

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { Navigation } from "./Navigation";
import { ToastProvider } from "@/contexts/Toaster";

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="container min-w-80 pb-36 sm:pb-24">
          {children}
          <Navigation />
        </div>
      </ToastProvider>
    </SessionProvider>
  );
};
