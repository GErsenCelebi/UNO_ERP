"use client"
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, X, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface SLAWarning {
  tourId: number;
  tourCode: string;
  warningCode: string;
  title: string;
  message: string;
  severity: 'AMBER' | 'ROSE';
  arrivalDate: string;
}

export default function SLAWarningBanner() {
  const [warnings, setWarnings] = useState<SLAWarning[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/tourstatuscheckpoints/warnings')
      .then(res => res.ok ? res.json() : [])
      .then(data => setWarnings(data))
      .catch(err => console.error(err));
  }, []);

  if (dismissed || warnings.length === 0) return null;

  const topWarning = warnings[0];
  const isCritical = topWarning.severity === 'ROSE';

  return (
    <div className={`w-full px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs font-semibold ${
      isCritical 
        ? 'bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white' 
        : 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white'
    }`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
          {topWarning.title}
        </span>
        <p className="truncate text-white font-medium">
          {topWarning.message}
        </p>
        {warnings.length > 1 && (
          <span className="bg-black/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            +{warnings.length - 1} more alerts
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={`/tours`}
          className="flex items-center gap-1 bg-white text-slate-900 hover:bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          View Tour Alerts <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-white/80 hover:text-white rounded-md transition-colors"
          title="Dismiss warning banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
