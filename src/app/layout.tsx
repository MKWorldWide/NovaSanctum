import type { Metadata } from 'next';
import { Merriweather, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { ProgramDataProvider } from '@/providers/ProgramDataProvider';

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
});

const headingFont = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'NovaSanctum | Open Learning Pathways',
  description:
    'NovaSanctum curates open educational resources into structured learning pathways with assistive AI support.',
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
      <body className={`${bodyFont.variable} ${headingFont.variable} h-full`}>
        <ProgramDataProvider>
          <div className="min-h-full">{children}</div>
        </ProgramDataProvider>
      </body>
    </html>
  );
}
