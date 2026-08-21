import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppLayout from '@/components/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UNO ERP Dashboard',
  description: 'Travel Operations & DMC Management Platform',
  icons: {
    icon: '/logo.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} print:block print:h-auto print:overflow-visible print:bg-white`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
