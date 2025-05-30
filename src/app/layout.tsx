import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SacredDataProvider } from '@/providers/SacredDataProvider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BioExpress Solutions',
  description: 'Where Biology Meets Digital Transcendence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://kit.fontawesome.com/your-kit-code.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <SacredDataProvider>
          {children}
        </SacredDataProvider>
      </body>
    </html>
  )
} 