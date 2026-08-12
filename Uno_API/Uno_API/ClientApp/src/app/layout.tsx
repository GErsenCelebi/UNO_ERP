import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UNO ERP Dashboard',
  description: 'Travel Operations & DMC Management Platform',
  icons: {
    icon: '/logo.png'
  }
}

import Sidebar from '@/components/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
