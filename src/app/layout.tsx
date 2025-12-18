import './globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from '@/components/session-provider';

export const metadata: Metadata = {
  title: 'Facebook Page Monitor Admin',
  description: 'Admin console for Facebook page monitoring'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
