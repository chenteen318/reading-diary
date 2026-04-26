import './globals.css';
import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Reading Diary',
  description: 'Capture meaningful reading moments and turn them into your personal reading diary.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}