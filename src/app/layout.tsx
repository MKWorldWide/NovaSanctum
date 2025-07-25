import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SacredDataProvider } from '@/providers/SacredDataProvider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NovaSanctum - Research Platform',
  description: 'Bridging biological engineering and synthetic intelligence',
  keywords: ['research', 'biology', 'AI', 'synthetic intelligence', 'engineering'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script src="https://kit.fontawesome.com/your-kit-code.js" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        <SacredDataProvider>
          <div className="min-h-full">{children}</div>
        </SacredDataProvider>
      </body>
    </html>
  );
}
