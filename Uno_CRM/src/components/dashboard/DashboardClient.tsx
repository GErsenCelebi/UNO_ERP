"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import ProjectGanttChart from "./ProjectGanttChart";
import KPICards from "./KPICards";
import {
  Search,
  Sparkles,
  Filter,
  Calendar,
  ChevronDown,
  Bell,
  X,
  AlertTriangle,
  Layers,
  Plus,
  RefreshCw,
  Loader2,
  SlidersHorizontal
} from "lucide-react";
import { getApiUrl } from "@/lib/apiConfig";

const API = getApiUrl();

const getCurrentQuarterPeriod = () => {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  const y = now.getFullYear();
  return `Q${q} ${y}`;
};

const getQuarterBounds = (period: string) => {
  const match = period.match(/Q([1-4])\s+(\d{4})/);
  if (match) {
    const q = parseInt(match[1]);
    const y = parseInt(match[2]);
    if (q === 1) return { start: `${y - 1}-12-15`, end: `${y}-04-15` };
    if (q === 2) return { start: `${y}-03-15`, end: `${y}-07-15` };
    if (q === 3) return { start: `${y}-06-15`, end: `${y}-10-15` };
    if (q === 4) return { start: `${y}-09-15`, end: `${y + 1}-01-15` };
  }
  if (period.includes("Full Year")) {
    const y = parseInt(period.replace(/\D/g, "")) || new Date().getFullYear();
    return { start: `${y}-01-01`, end: `${y}-12-31` };
  }
  return { start: "", end: "" };
};

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Selected project for Phase 1 vs Phase 2 drilldown
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Filters & Controls
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<any[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([3]); // default: Active / Confirmed
  const [searchPrompt, setSearchPrompt] = useState<string>("" );
  const initialPeriod = getCurrentQuarterPeriod();
  const [selectedPeriod, setSelectedPeriod] = useState<string>(initialPeriod);
  const [panOffsetMonths, setPanOffsetMonths] = useState<number>(0);

  // Custom date bounds based on period selection
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>(
    getQuarterBounds(initialPeriod)
  );

  // Dropdown states
  const [isProjectFilterOpen, setIsProjectFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const periodDropdownRef = useRef<HTMLDivElement>(null);

  // Load Lookups
  useEffect(() => {
    Promise.all([
      fetch(`${API}/projects`).then(r => r.json()).catch(() => []),
      fetch(`${API}/projectstatuses`).then(r => r.json()).catch(() => [])
    ]).then(([projs, statuses]) => {
      setProjectsList(Array.isArray(projs) ? projs : []);
      setProjectStatuses(Array.isArray(statuses) ? statuses : []);
    });
  }, []);

  // Fetch Analytics
  useEffect(() => {
    fetchDashboardData();
  }, [selectedProjectIds, selectedStatusIds]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setIsProjectFilterOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target as Node)) {
        setIsPeriodOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedProjectIds.length > 0) params.append("projectIds", selectedProjectIds.join(","));
      if (selectedStatusIds.length > 0) params.append("projectStatusIds", selectedStatusIds.join(","));

      const res = await fetch(`${API}/dashboard/analytics?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle Period Change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsPeriodOpen(false);
    setPanOffsetMonths(0);
    setDateRange(getQuarterBounds(period));
  };

  const toggleProject = (id: number) => {
    setSelectedProjectIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const toggleStatus = (id: number) => {
    setSelectedStatusIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  // Filtered Gantt Projects
  const ganttProjects = useMemo(() => {
    if (!data?.ganttProjects) return [];
    let list = data.ganttProjects;

    if (selectedProjectIds.length > 0) {
      list = list.filter((p: any) => selectedProjectIds.includes(p.id));
    }
    if (selectedStatusIds.length > 0) {
      list = list.filter((p: any) => selectedStatusIds.includes(p.statusId));
    }
    return list;
  }, [data, selectedProjectIds, selectedStatusIds]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BAR: Adaptive AI Command Bar */}
      {/* ------------------------------------------------------------- */}
      <header suppressHydrationWarning className="h-14 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800/90 px-4 flex items-center justify-between gap-3 shrink-0 z-30 shadow-xs dark:shadow-md">
        {/* Unified AI Command Prompt & Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Ask UNO AI or search projects, tours, destination..."
              value={searchPrompt}
              onChange={e => setSearchPrompt(e.target.value)}
              suppressHydrationWarning
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              className="w-full bg-slate-100 dark:bg-[#111827] text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 pl-10 pr-20 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 transition-all shadow-inner"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60 text-[10px] font-bold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Period Switcher, Filter Pills, Bell, User Session */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Period Selector Dropdown */}
          <div className="relative" ref={periodDropdownRef}>
            <button
              onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
            {isPeriodOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl py-1 z-50 text-xs">
                {["Q4 2026", "Q3 2026", "Full Year 2026", "All Dates"].map(p => (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      selectedPeriod === p ? "text-blue-600 dark:text-cyan-400 font-bold bg-blue-50 dark:bg-cyan-950/40" : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Filter Pill */}
          <div className="relative" ref={projectDropdownRef}>
            <button
              onClick={() => setIsProjectFilterOpen(!isProjectFilterOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Projects</span>
              {selectedProjectIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {selectedProjectIds.length}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {isProjectFilterOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl p-2 z-50 text-xs max-h-72 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-2 py-1 mb-1">Filter by Project</div>
                {projectsList.map(p => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProjectIds.includes(p.id)}
                      onChange={() => toggleProject(p.id)}
                      suppressHydrationWarning
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 dark:text-cyan-500 focus:ring-0 bg-white dark:bg-slate-900"
                    />
                    <span className="truncate">{p.projectCode}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Pill */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Status</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold">
                {selectedStatusIds.length > 0 ? selectedStatusIds.length : "All"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
            {isStatusFilterOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl p-2 z-50 text-xs">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-2 py-1 mb-1">Project Status</div>
                {projectStatuses.map(s => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatusIds.includes(s.id)}
                      onChange={() => toggleStatus(s.id)}
                      suppressHydrationWarning
                      className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-500 focus:ring-0 bg-white dark:bg-slate-900"
                    />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <button className="p-2 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white relative transition-colors shadow-2xs">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0F172A]" />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN OPERATIONS CANVAS: Dual-Phase Gantt & Right KPI Stack */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
        {loading || !data ? (
          <div className="flex-1 flex flex-col justify-center items-center h-96 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-cyan-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Loading Operations Command Center...</span>
          </div>
        ) : (
          <div className="flex-1 flex flex-col xl:flex-row gap-4 overflow-hidden min-h-0">
            {/* Center Area: Operations Gantt Canvas */}
            <div className="flex-1 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl flex flex-col overflow-hidden min-h-[500px]">
              {/* Operations Gantt Header */}
              <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedProject ? (
                      <span className="flex items-center gap-2">
                        <span>Operations Gantt</span>
                        <span className="text-slate-400 font-normal">/</span>
                        <span className="text-blue-600 dark:text-cyan-400 font-bold">{selectedProject.projectCode}</span>
                      </span>
                    ) : (
                      <span>Projects Overview</span>
                    )}
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {selectedProject
                      ? "(Granular tour schedule breakdown)"
                      : "(Click any project to expand tour schedules)"}
                  </span>
                </div>

                {/* Navigation Panning & Quick Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/80 p-0.5 text-xs font-bold shadow-2xs">
                    <button
                      onClick={() => setPanOffsetMonths(p => p - 1)}
                      className="px-2.5 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                      title="Pan backward 1 month"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={() => {
                        setPanOffsetMonths(0);
                        const curr = getCurrentQuarterPeriod();
                        setSelectedPeriod(curr);
                        setDateRange(getQuarterBounds(curr));
                      }}
                      className="px-2.5 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-cyan-400 rounded-lg transition-colors font-semibold cursor-pointer"
                      title="Jump to Today & Current Quarter"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setPanOffsetMonths(p => p + 1)}
                      className="px-2.5 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                      title="Pan forward 1 month"
                    >
                      &rarr;
                    </button>
                  </div>

                  <button
                    onClick={fetchDashboardData}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => (window.location.href = "/projects")}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Convert Project</span>
                  </button>
                </div>
              </div>

              {/* Gantt Timeline Component (Phase 1 & Phase 2) */}
              <div className="flex-1 overflow-hidden">
                <ProjectGanttChart
                  projects={ganttProjects}
                  selectedProject={selectedProject}
                  onSelectProject={setSelectedProject}
                  startDateFilter={dateRange.start}
                  endDateFilter={dateRange.end}
                  panOffsetMonths={panOffsetMonths}
                  searchQuery={searchPrompt}
                />
              </div>
            </div>

            {/* Right-Hand Column: KPI Stack (Slimmer to prevent center scrollbar) */}
            <div className="w-full xl:w-56 shrink-0 flex flex-col gap-2.5">
              <KPICards data={data} selectedProject={selectedProject} />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. BOTTOM: Docked AI Operational Alert Banner */}
        {/* ------------------------------------------------------------- */}
        {showAlert && (
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-700/50 p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs">AI Operational Alert</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" /> Warning
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  2 Tours have unassigned hotel allotments — Tour 6102 (PVB17052026) reconciled with 34 pax capacity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => (window.location.href = "/tours")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/30"
              >
                Resolution
              </button>
              <button
                onClick={() => (window.location.href = "/master-data")}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700"
              >
                Review Allotments
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
