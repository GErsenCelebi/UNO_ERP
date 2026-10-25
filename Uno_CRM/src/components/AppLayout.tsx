"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AIChatDrawer from '@/components/AIChatDrawer';
import { useTheme } from '@/context/ThemeContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const isLoginPage = pathname === '/login';
  const isGuideMobilePage = pathname?.startsWith('/guide');

  if (isLoginPage || isGuideMobilePage) {
    return <div className="w-full min-h-screen bg-slate-950">{children}</div>;
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDark ? 'bg-[#0B0F19]' : 'bg-slate-50'} relative transition-colors duration-200`}>
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col relative z-10 print:block print:h-auto print:overflow-visible print:bg-white">
        {children}
      </main>
      <AIChatDrawer />
    </div>
  );
}
