import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { DEFAULT_LOCALE } from '@/api/constants';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'My personal body notes',
  description: 'Here you can make your body notes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE.split('_')[0]}>
      <head></head>
      <body className="min-w-[300px]">
        <ClientLayout>
          {children}

          <Toaster position="top-center" />
        </ClientLayout>
      </body>
    </html>
  );
}
