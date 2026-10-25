"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Calendar, Users, Layers, ExternalLink, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProjectGanttChartProps {
  projects: any[];
  selectedProject: any | null;
  onSelectProject: (project: any | null) => void;
  startDateFilter?: string;
  endDateFilter?: string;
  panOffsetMonths?: number;
  searchQuery?: string;
}

// Color palettes matching Design 06 and 07
const projectGradients = [
  "from-blue-600 to-indigo-600 border-blue-400/40 text-blue-100",
  "from-emerald-600 to-teal-600 border-emerald-400/40 text-emerald-100",
  "from-purple-600 to-indigo-700 border-purple-400/40 text-purple-100",
  "from-amber-600 to-orange-600 border-amber-400/40 text-amber-100",
  "from-cyan-600 to-blue-700 border-cyan-400/40 text-cyan-100",
  "from-rose-600 to-pink-700 border-rose-400/40 text-rose-100"
];

const tourStatusColors: Record<number, { bg: string; border: string; text: string }> = {
  3: { bg: "bg-emerald-600", border: "border-emerald-400", text: "text-emerald-100" }, // Confirmed
  4: { bg: "bg-cyan-600", border: "border-cyan-300", text: "text-cyan-100" },          // In Progress
  2: { bg: "bg-amber-600", border: "border-amber-300", text: "text-amber-100" },        // Proposal / Pre-Confirmed
  5: { bg: "bg-violet-600", border: "border-violet-300", text: "text-violet-100" },      // Completed
  1: { bg: "bg-slate-600", border: "border-slate-400", text: "text-slate-200" },         // Draft
};

export default function ProjectGanttChart({
  projects,
  selectedProject,
  onSelectProject,
  startDateFilter,
  endDateFilter,
  panOffsetMonths = 0,
  searchQuery = ""
}: ProjectGanttChartProps) {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<any | null>(null);

  // Safe Date Parser
  const parseSafeDate = (dStr: any, fallbackYear = 2026): number => {
    if (!dStr) return new Date(`${fallbackYear}-07-01T00:00:00`).getTime();
    const t = new Date(dStr).getTime();
    if (isNaN(t) || t < new Date("2000-01-01T00:00:00").getTime()) {
      return new Date(`${fallbackYear}-07-01T00:00:00`).getTime();
    }
    return t;
  };

  // Determine timeline domain [minDate, maxDate]
  const { minDate, maxDate, monthsList, todayPct } = useMemo(() => {
    let startMs = startDateFilter ? new Date(startDateFilter).getTime() : new Date("2026-09-15T00:00:00").getTime();
    let endMs = endDateFilter ? new Date(endDateFilter).getTime() : new Date("2027-01-15T00:00:00").getTime();

    if (isNaN(startMs)) startMs = new Date("2026-09-15T00:00:00").getTime();
    if (isNaN(endMs)) endMs = new Date("2027-01-15T00:00:00").getTime();

    // Apply pan offset
    if (panOffsetMonths !== 0) {
      const offsetMs = panOffsetMonths * 30.44 * 24 * 60 * 60 * 1000;
      startMs += offsetMs;
      endMs += offsetMs;
    }

    const totalSpan = Math.max(endMs - startMs, 1000 * 60 * 60 * 24 * 30);

    // Build list of months in this span
    const mList: { name: string; year: number; leftPct: number; widthPct: number }[] = [];
    const cur = new Date(startMs);
    cur.setDate(1);

    while (cur.getTime() <= endMs) {
      const mStart = cur.getTime();
      const nextM = new Date(cur);
      nextM.setMonth(nextM.getMonth() + 1);
      nextM.setDate(1);
      const mEnd = nextM.getTime();

      const segStart = Math.max(mStart, startMs);
      const segEnd = Math.min(mEnd, endMs);

      if (segEnd > segStart) {
        const leftPct = ((segStart - startMs) / totalSpan) * 100;
        const widthPct = ((segEnd - segStart) / totalSpan) * 100;
        mList.push({
          name: cur.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          year: cur.getFullYear(),
          leftPct,
          widthPct
        });
      }
      cur.setMonth(cur.getMonth() + 1);
    }

    // Today indicator (actual current date if inside visible domain)
    const todayTimestamp = new Date().getTime();
    let todayPct: number | null = null;
    if (todayTimestamp >= startMs && todayTimestamp <= endMs) {
      todayPct = Math.max(0, Math.min(100, ((todayTimestamp - startMs) / totalSpan) * 100));
    }

    return { minDate: startMs, maxDate: endMs, monthsList: mList, todayPct };
  }, [startDateFilter, endDateFilter, panOffsetMonths]);

  const totalDomainMs = Math.max(maxDate - minDate, 1);

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p =>
      (p.projectCode || "").toLowerCase().includes(q) ||
      (p.tours || []).some((t: any) => (t.tourCode || "").toLowerCase().includes(q) || (t.destination || "").toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  // Handle tour click in Phase 2
  const handleTourClick = (tour: any, project: any) => {
    router.push(`/projects/${project.id}/tours/${tour.id}`);
  };

  // -------------------------------------------------------------
  // PHASE 2: TOUR BREAKDOWN VIEW (When a project is selected)
  // -------------------------------------------------------------
  if (selectedProject) {
    const toursList = selectedProject.tours || [];
    const activeProjectTours = searchQuery.trim()
      ? toursList.filter((t: any) =>
          (t.tourCode || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.destination || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      : toursList;

    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-slate-200 select-none">
        {/* Phase 2 Header Breadcrumb & Control */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectProject(null)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs"
              title="Return to Projects Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Projects</span>
            </button>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Project:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{selectedProject.projectCode}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-cyan-950 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-800 text-[10px] font-bold">
                {toursList.length} Tours
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold">
                {selectedProject.totalPax || 0} Total Pax
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-cyan-400" /> Phase 2: Tour Operations Breakdown
          </span>
        </div>

        {/* Table & Timeline Grid */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="w-full min-w-0">
            {/* Header Row */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] sticky top-0 z-20 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <div className="w-36 sm:w-44 px-2.5 py-2 border-r border-slate-200 dark:border-slate-800 shrink-0">Tour Code</div>
              <div className="w-16 sm:w-20 px-2 py-2 border-r border-slate-200 dark:border-slate-800 shrink-0 text-right">Pax</div>
              <div className="flex-1 relative h-9">
                {/* Month Headers */}
                {monthsList.map((m, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 border-r border-slate-200 dark:border-slate-800/80 px-2 py-1.5 text-center text-slate-600 dark:text-slate-300 font-semibold truncate text-[10px] sm:text-[11px]"
                    style={{ left: `${m.leftPct}%`, width: `${m.widthPct}%` }}
                  >
                    {m.name}
                  </div>
                ))}
                {/* Today Marker in Header */}
                {todayPct !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-rose-500 z-30 pointer-events-none"
                    style={{ left: `${todayPct}%` }}
                  >
                    <span className="absolute -top-1 -left-4 px-1.5 py-0.2 bg-rose-600 text-white rounded text-[9px] font-black uppercase tracking-tight shadow-md">
                      Today
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tour Rows */}
            {activeProjectTours.length === 0 ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs">
                No tours found for this project matching criteria.
              </div>
            ) : (
              activeProjectTours.map((tour: any, idx: number) => {
                const s = parseSafeDate(tour.arrivalDate);
                let e = parseSafeDate(tour.endDate);
                if (e <= s) e = s + 7 * 24 * 60 * 60 * 1000;

                const leftPct = Math.max(0, Math.min(100, ((s - minDate) / totalDomainMs) * 100));
                const widthPct = Math.max(1.8, Math.min(100 - leftPct, ((e - s) / totalDomainMs) * 100));

                const colorConfig = tourStatusColors[tour.tourStatusId] || tourStatusColors[3];
                const isHovered = hoveredItem?.id === tour.id;

                return (
                  <div
                    key={tour.id || idx}
                    className={`flex items-center border-b border-slate-200/80 dark:border-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-900/60 transition-colors h-11 relative group ${
                      idx % 2 === 0 ? "bg-white dark:bg-[#0B0F19]" : "bg-slate-50/50 dark:bg-[#0E1322]"
                    }`}
                  >
                    {/* Fixed Columns */}
                    <div className="w-36 sm:w-44 px-2.5 py-2 border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate font-mono" title={tour.tourCode}>
                        {tour.tourCode}
                      </span>
                      <button
                        onClick={() => handleTourClick(tour, selectedProject)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-blue-600 dark:text-cyan-400 transition-opacity"
                        title="Open Tour Details"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-16 sm:w-20 px-2 py-2 border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 text-right">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                        {tour.pax || 0} Pax
                      </span>
                    </div>

                    {/* Timeline Canvas */}
                    <div className="flex-1 relative h-full">
                      {/* Vertical Grid Lines */}
                      {monthsList.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="absolute top-0 bottom-0 border-r border-slate-800/40 pointer-events-none"
                          style={{ left: `${m.leftPct + m.widthPct}%` }}
                        />
                      ))}

                      {/* Today Vertical Line */}
                      {todayPct !== null && (
                        <div
                          className="absolute top-0 bottom-0 w-px bg-rose-500/80 pointer-events-none z-10"
                          style={{ left: `${todayPct}%` }}
                        />
                      )}

                      {/* Tour Gantt Bar */}
                      <div
                        onClick={() => handleTourClick(tour, selectedProject)}
                        onMouseEnter={() => setHoveredItem(tour)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`absolute top-1.5 bottom-1.5 rounded-lg border shadow-md flex items-center px-2.5 gap-2 cursor-pointer transition-all duration-200 z-10 overflow-hidden ${
                          colorConfig.bg
                        } ${colorConfig.border} ${
                          isHovered ? "ring-2 ring-cyan-400 brightness-110 shadow-cyan-500/20" : ""
                        }`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        title={`${tour.tourCode} (${tour.pax} Pax) • ${tour.destination || "Tour"}`}
                      >
                        <span className="font-extrabold text-[11px] text-white tracking-tight truncate shrink-0">
                          {tour.tourCode}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-black/30 text-white font-mono text-[10px] font-bold shrink-0">
                          {tour.pax} Pax
                        </span>
                        {tour.destination && (
                          <span className="text-[10px] text-white/80 font-medium truncate hidden sm:inline">
                            {tour.destination}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE 1: PROJECTS TIMELINE VIEW (Initial Landing View)
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-slate-200 select-none">
      {/* Table & Timeline Grid */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="w-full min-w-0">
          {/* Header Row */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] sticky top-0 z-20 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <div className="w-48 sm:w-56 px-3 py-2 border-r border-slate-200 dark:border-slate-800 shrink-0">Project</div>
            <div className="w-14 sm:w-16 px-1.5 py-2 border-r border-slate-200 dark:border-slate-800 shrink-0 text-center">Tours</div>
            <div className="w-16 sm:w-20 px-2 py-2 border-r border-slate-200 dark:border-slate-800 shrink-0 text-right">Pax</div>
            <div className="flex-1 relative h-9">
              {/* Month Headers */}
              {monthsList.map((m, idx) => (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 border-r border-slate-200 dark:border-slate-800/80 px-2 py-1.5 text-center text-slate-600 dark:text-slate-300 font-semibold truncate text-[10px] sm:text-[11px]"
                  style={{ left: `${m.leftPct}%`, width: `${m.widthPct}%` }}
                >
                  {m.name}
                </div>
              ))}
              {/* Today Marker in Header */}
              {todayPct !== null && (
                <div
                  className="absolute top-0 bottom-0 w-px bg-rose-500 z-30 pointer-events-none"
                  style={{ left: `${todayPct}%` }}
                >
                  <span className="absolute -top-1 -left-4 px-1.5 py-0.2 bg-rose-600 text-white rounded text-[9px] font-black uppercase tracking-tight shadow-md">
                    Today
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Project Rows */}
          {filteredProjects.length === 0 ? (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500 text-xs">
              No projects found matching current criteria.
            </div>
          ) : (
            filteredProjects.map((project: any, idx: number) => {
              const s = parseSafeDate(project.startDate);
              let e = parseSafeDate(project.endDate);
              if (e <= s) e = s + 30 * 24 * 60 * 60 * 1000;

              const leftPct = Math.max(0, Math.min(100, ((s - minDate) / totalDomainMs) * 100));
              const widthPct = Math.max(3.0, Math.min(100 - leftPct, ((e - s) / totalDomainMs) * 100));

              const gradientClass = projectGradients[idx % projectGradients.length];
              const isHovered = hoveredItem?.id === project.id;
              const tourCount = project.tourCount || (project.tours ? project.tours.length : 0);
              const totalPax = project.totalPax || (project.tours ? project.tours.reduce((acc: number, t: any) => acc + (t.pax || 0), 0) : 0);

              return (
                <div
                  key={project.id || idx}
                  className={`flex items-center border-b border-slate-200/80 dark:border-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-900/80 transition-colors h-14 relative group cursor-pointer ${
                    idx % 2 === 0 ? "bg-white dark:bg-[#0B0F19]" : "bg-slate-50/50 dark:bg-[#0E1322]"
                  }`}
                  onClick={() => onSelectProject(project)}
                >
                  {/* Fixed Columns */}
                  <div className="w-48 sm:w-56 px-3 py-2 border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold group-hover:bg-blue-600 dark:group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div className="truncate">
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate" title={project.projectCode}>
                          {project.projectCode}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {formatDate(s)} – {formatDate(e)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-14 sm:w-16 px-1.5 py-2 border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 text-center">
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono">
                      {tourCount}
                    </span>
                  </div>

                  <div className="w-16 sm:w-20 px-2 py-2 border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 text-right">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-extrabold font-mono">
                      {totalPax} Pax
                    </span>
                  </div>

                  {/* Timeline Canvas */}
                  <div className="flex-1 relative h-full">
                    {/* Vertical Month Divider Lines */}
                    {monthsList.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="absolute top-0 bottom-0 border-r border-slate-800/40 pointer-events-none"
                        style={{ left: `${m.leftPct + m.widthPct}%` }}
                      />
                    ))}

                    {/* Today Vertical Line */}
                    {todayPct !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-rose-500/80 pointer-events-none z-10"
                        style={{ left: `${todayPct}%` }}
                      />
                    )}

                    {/* Project Gantt Span Bar */}
                    <div
                      onMouseEnter={() => setHoveredItem(project)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`absolute top-2.5 bottom-2.5 rounded-xl border bg-gradient-to-r shadow-lg flex items-center px-3 gap-2.5 transition-all duration-200 z-10 overflow-hidden ${gradientClass} ${
                        isHovered ? "ring-2 ring-cyan-400 brightness-110 shadow-cyan-500/30 scale-[1.01]" : ""
                      }`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      title={`${project.projectCode} • ${tourCount} Tours • ${totalPax} Pax (Click to drill down into tour operations)`}
                    >
                      <span className="font-black text-xs tracking-tight truncate drop-shadow-xs">
                        {project.projectCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/40 text-white font-mono text-[10px] font-extrabold shrink-0 border border-white/20">
                        {tourCount} Tours • {totalPax} Pax
                      </span>
                      <span className="text-[10px] text-white/80 font-medium ml-auto hidden md:flex items-center gap-1">
                        Click to expand <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
