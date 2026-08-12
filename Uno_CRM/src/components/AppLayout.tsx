"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <div className="w-full min-h-screen bg-slate-950">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col relative z-10 print:block print:h-auto print:overflow-visible print:bg-white">
        {children}
      </main>
    </div>
  );
}
