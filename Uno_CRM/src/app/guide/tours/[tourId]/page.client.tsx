"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Compass } from 'lucide-react';
import GuideExcursionSalesPortal from '@/components/GuideExcursionSalesPortal';

export default function GuideMobilePortalPage() {
  const params = useParams();
  const router = useRouter();

  let tourId = (params?.tourId as string) || '';

  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const tourIdx = parts.indexOf('tours');
    if (tourIdx !== -1 && parts[tourIdx + 1]) {
      tourId = parts[tourIdx + 1];
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-bold text-sm text-white">
            <Compass className="w-4 h-4 text-blue-500" />
            <span>Guide Portal</span>
          </div>
        </div>
        <div className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
          Mobile Live View
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-4">
        {tourId ? (
          <GuideExcursionSalesPortal tourId={tourId} isStandaloneMobile={true} />
        ) : (
          <div className="p-8 text-center text-slate-400">
            No Tour ID specified in URL.
          </div>
        )}
      </main>
    </div>
  );
}
