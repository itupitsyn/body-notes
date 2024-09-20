"use client";

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { Navagation } from "./Navigation";

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
      <Navagation />
    </SessionProvider>
  );
};
