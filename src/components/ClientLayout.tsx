"use client";

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { Navigation } from "./Navigation";
import { ToastProvider } from "@/contexts/Toaster";

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="container flex min-h-svh flex-col justify-between">
          <div>{children}</div>
          <Navigation />
        </div>
      </ToastProvider>
    </SessionProvider>
  );
};
