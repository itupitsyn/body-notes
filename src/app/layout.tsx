import type { Metadata } from "next";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "My personal body notes",
  description: "Here you can make your body notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <ThemeModeScript />
      </head>
      <body className="flex min-h-svh flex-col items-center justify-between">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
