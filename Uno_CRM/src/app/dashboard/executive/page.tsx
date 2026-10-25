"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ExecutiveDashboardClient = dynamic(() => import('./page.client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Loading Executive KPI Cockpit...</span>
      </div>
    </div>
  ),
});

export default function ExecutiveDashboardPage() {
  return <ExecutiveDashboardClient />;
}
