import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import IconSprite from '@/components/ui/IconSprite';
import MagneticCursor from '@/components/ui/MagneticCursor';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Invest Nova LG — IT Solutions',
  description:
    'European IT company. We build enterprise IT systems, web platforms and digital solutions for businesses in Europe and the USA.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <IconSprite />
        <MagneticCursor />
        {children}
      </body>
    </html>
  );
}
