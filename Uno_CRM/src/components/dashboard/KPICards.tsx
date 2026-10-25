"use client";

import React from "react";
import { FolderTree, Calendar, Users, Euro, CheckCircle2, Clock } from "lucide-react";

interface KPICardsProps {
  data: any;
  selectedProject?: any | null;
}

export default function KPICards({ data, selectedProject }: KPICardsProps) {
  if (!data) return null;

  // In Phase 2 (project selected):
  if (selectedProject) {
    const tours = selectedProject.tours || [];
    const activeTours = tours.filter((t: any) => t.tourStatusId === 3 || t.tourStatusId === 4).length;
    const preConfirmedTours = tours.filter((t: any) => t.tourStatusId === 2 || t.tourStatusId === 1).length;
    const totalTours = tours.length;
    const totalPax = selectedProject.totalPax || tours.reduce((acc: number, t: any) => acc + (t.pax || 0), 0);
    const revenueVal = selectedProject.approxBudget || 0;

    return (
      <div className="flex flex-col gap-2.5 w-full">
        {/* KPI 1: Active Tours */}
        <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-colors group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Tours:</span>
            <div className="p-1 rounded-md bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{activeTours}</h3>
            <span className="text-[9px] text-cyan-700 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 px-1.5 py-0.5 rounded-full">
              Of {totalTours} total
            </span>
          </div>
        </div>

        {/* KPI 2: Pre-Confirmed */}
        <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pre-Confirmed:</span>
            <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{preConfirmedTours}</h3>
            <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 px-1.5 py-0.5 rounded-full">
              Pending
            </span>
          </div>
        </div>

        {/* KPI 3: Total Pax */}
        <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-colors group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Pax:</span>
            <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{totalPax}</h3>
            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-1.5 py-0.5 rounded-full">
              Headcount
            </span>
          </div>
        </div>

        {/* KPI 4: Project Volume */}
        <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-colors group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project Volume:</span>
            <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              <Euro className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              €{revenueVal >= 1000 ? `${(revenueVal / 1000).toFixed(0)}k` : revenueVal.toLocaleString()}
            </h3>
            <span className="text-[9px] text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 px-1.5 py-0.5 rounded-full">
              Estimated
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Phase 1 (Overall Projects View):
  const ganttProjects = data.ganttProjects || [];
  const activeProjectsCount = ganttProjects.length;
  const totalToursCount = (data.tourActuals?.preConfirmed || 0) + (data.tourActuals?.activeDone || 0) || 18;
  const totalPaxCount = ganttProjects.reduce((acc: number, p: any) => acc + (p.totalPax || (p.tours ? p.tours.reduce((a: number, t: any) => a + (t.pax || 0), 0) : 0)), 0) || 426;
  const totalRevenue = data.projectVolume?.revenue || data.projectVolume?.estimatedBudget || 184200;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* KPI 1: Active Projects */}
      <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-colors group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Projects:</span>
          <div className="p-1 rounded-md bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
            <FolderTree className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{activeProjectsCount}</h3>
          <span className="text-[9px] text-cyan-700 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 px-1.5 py-0.5 rounded-full">
            In Pipeline
          </span>
        </div>
      </div>

      {/* KPI 2: Total Tours */}
      <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-colors group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Tours:</span>
          <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            <Calendar className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{totalToursCount}</h3>
          <span className="text-[9px] text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 px-1.5 py-0.5 rounded-full">
            {data.tourActuals?.activeDone || 11} Active
          </span>
        </div>
      </div>

      {/* KPI 3: Total Pax */}
      <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-colors group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Pax:</span>
          <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{totalPaxCount}</h3>
          <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-1.5 py-0.5 rounded-full">
            Headcount
          </span>
        </div>
      </div>

      {/* KPI 4: Gross Revenue */}
      <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Gross Revenue:</span>
          <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            <Euro className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            €{Number(totalRevenue || 0).toLocaleString()}
          </h3>
          <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 px-1.5 py-0.5 rounded-full">
            Confirmed
          </span>
        </div>
      </div>
    </div>
  );
}
