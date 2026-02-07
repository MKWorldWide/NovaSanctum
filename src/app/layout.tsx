import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SacredDataProvider } from '@/providers/SacredDataProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NovaSanctum - Open Learning Pathways',
  description:
    'NovaSanctum is an open online learning initiative that curates free educational resources into structured pathways with assistive AI guidance.',
  keywords: [
    'open education',
    'learning pathways',
    'self-directed learning',
    'nonprofit education',
    'resource curation',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <SacredDataProvider>
          <div className="min-h-full">{children}</div>
        </SacredDataProvider>
      </body>
    </html>
  );
}
