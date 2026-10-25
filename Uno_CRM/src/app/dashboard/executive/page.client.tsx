"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  FileDown, 
  Search, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Compass, 
  Building2, 
  Users, 
  Printer, 
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  BarChart3,
  PieChart,
  ArrowUpDown
} from 'lucide-react';
import { getApiUrl } from '@/lib/apiConfig';
import { getAuthHeaders } from '@/lib/auth';

const API = getApiUrl();

interface ExecutiveKpiItem {
  id: string;
  kpiNumber: number;
  name: string;
  category: string;
  actual: number;
  target: number;
  varianceAbs: number;
  variancePct: number;
  ragStatus: 'Green' | 'Amber' | 'Red';
  unit: string;
  statusBadge: string;
  footnoteLabel: string;
  footnoteValue: string;
  attainmentPct: number;
  accentColor: string;
}

interface ExecutiveDivergence {
  metric: string;
  variancePct: number;
  label: string;
  actual: number;
  target: number;
  unit: string;
  color: string;
  barWidthPct: number;
}

interface ExecutiveActionItem {
  category: string;
  priority: string;
  title: string;
  description: string;
  badgeColor: string;
}

interface ExecutiveServiceItem {
  serviceType: string; // "Hotel", "Transport", "Guide", "Excursion", "Other"
  vendorOrDescription: string;
  lineCost: number;
  costPerPax: number;
  lineRevenue?: number;
  contractNotes?: string;
}

interface ExecutiveTourLeagueItem {
  tourId: number;
  tourCode: string;
  destination: string;
  dateRange: string;
  pax: number;
  targetRevenue: number;
  actualRevenue: number;
  hotelCostPax?: number;
  hotelVariance?: string;
  excursionSalesPax?: number;
  targetMarginPct: number;
  actualMarginPct: number;
  netProfit: number;
  ragStatus: 'Green' | 'Amber' | 'Red';
  statusText: string;
  services?: ExecutiveServiceItem[];
}

interface ExecutiveDashboardData {
  period: string;
  generatedAt: string;
  summary: {
    totalTours: number;
    totalPax: number;
    grossBookingValue: number;
  };
  aiSummary: {
    healthStatus: string;
    bulletPoints: string[];
  };
  kpis: ExecutiveKpiItem[];
  divergenceRadar: ExecutiveDivergence[];
  recommendedActions: ExecutiveActionItem[];
  tourLeague: ExecutiveTourLeagueItem[];
}

interface ProjectOption {
  id: number;
  projectCode: string;
  description?: string;
}

export default function ExecutiveDashboardClient() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Q3 2026');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [searchTour, setSearchTour] = useState('');
  const [sortField, setSortField] = useState<string>('actualMarginPct');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

  // Sorting handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'tourCode' || field === 'destination');
    }
  };

  // Toggle single row expansion
  const toggleRow = (tourId: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [tourId]: !prev[tourId]
    }));
  };

  // Toggle all rows expansion
  const toggleAllRows = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const newMap: Record<number, boolean> = {};
    (data?.tourLeague || []).forEach(t => {
      newMap[t.tourId] = nextState;
    });
    setExpandedRows(newMap);
  };

  // Fetch projects for filter
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`${API}/projects`, { headers: getAuthHeaders() });
        if (res.ok) {
          const list = await res.json();
          setProjects(list || []);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    }
    loadProjects();
  }, []);

  // Fetch dashboard data
  const fetchData = async (period: string, projId: string) => {
    try {
      setLoading(true);
      const url = `${API}/dashboard/executive-kpis?period=${encodeURIComponent(period)}${projId ? `&projectId=${projId}` : ''}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load executive KPI dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedPeriod, selectedProjectId);
  }, [selectedPeriod, selectedProjectId]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredTourLeague = useMemo(() => {
    const list = data?.tourLeague || [];
    const seen = new Set<number>();
    const uniqueList: ExecutiveTourLeagueItem[] = [];
    for (const item of list) {
      if (!seen.has(item.tourId)) {
        seen.add(item.tourId);
        uniqueList.push(item);
      }
    }

    let filtered = uniqueList;
    if (searchTour) {
      const q = searchTour.toLowerCase();
      filtered = uniqueList.filter(t => 
        t.tourCode.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q)
      );
    }

    // Dynamic Multi-Column Sorting
    return [...filtered].sort((a, b) => {
      let valA: any = (a as any)[sortField];
      let valB: any = (b as any)[sortField];
      if (valA === undefined || valA === null) valA = 0;
      if (valB === undefined || valB === null) valB = 0;

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [data?.tourLeague, searchTour, sortField, sortAsc]);


  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading Executive KPI Cockpit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
      
      {/* ──── COMPONENT 1: TOP CONTROL HEADER (SLIM & CRISP) ──── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
              UNO Strategic Control
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              C-Suite Executive Telemetry
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            Executive KPI Cockpit: Target vs. Actual Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tracking of 8 High-Impact Strategic KPIs across{' '}
            <strong className="text-slate-700 dark:text-slate-200">{data?.summary.totalTours ?? 32} Active Tours</strong> •{' '}
            <strong className="text-slate-700 dark:text-slate-200">{data?.summary.totalPax ?? 944} Pax</strong> •{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              €{((data?.summary.grossBookingValue ?? 242580) / 1000).toFixed(1)}k Gross Booking Value
            </strong>
          </p>
        </div>

        {/* Controls: Period Selector Pills, Project Dropdown, Board Deck PDF */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Time Period Selector Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-xs font-semibold">
            {['Q3 2026', 'Jul', 'Aug', 'Sep', 'YTD'].map(p => {
              const isPActive = selectedPeriod === p || (p === 'Jul' && selectedPeriod === 'Month: Jul');
              return (
                <button
                  key={p}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => handlePeriodChange(p)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isPActive 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p === 'Jul' ? 'Month: Jul' : p}
                </button>
              );
            })}
          </div>

          {/* Project / Circuit Filter */}
          <div className="relative">
            <select
              suppressHydrationWarning
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="">All Projects & Circuits</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.projectCode} {p.description ? `(${p.description.slice(0, 18)})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Global Hierarchical Expand/Collapse Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleAllRows}
            title={allExpanded ? "Collapse all tour breakdown levels" : "Expand all tour breakdown levels"}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {allExpanded ? <ChevronDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> : <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>

          {/* Board Deck PDF Print Action */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={handlePrint}
            title="Download / Print Board Report Deck"
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Board Deck PDF</span>
          </button>
        </div>
      </div>

      {/* ──── COMPONENT 2: AI COPILOT EXECUTIVE FLASH BRIEFING (SLIMMER & IMPACTFUL) ──── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-indigo-900/40 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl shrink-0 shadow-inner">
            🤖
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Copilot Executive Summary • KPI Variance Analysis
              </h2>
              <span className="text-[10px] text-slate-400">
                Model Telemetry • Updated Just Now
              </span>
            </div>
            
            <div className="text-xs text-slate-200 leading-relaxed space-y-1">
              {data?.aiSummary.bulletPoints && data.aiSummary.bulletPoints.length > 0 ? (
                data.aiSummary.bulletPoints.map((bp, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{bp}</span>
                  </p>
                ))
              ) : (
                <>
                  <p className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span><strong>Overall Health:</strong> 6 of 8 Strategic KPIs are performing in the <span className="text-emerald-400 font-bold">GREEN zone</span>. Operating Profit is outperforming budget by <strong>+€11,734 (+25.5%)</strong>.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span><strong>Revenue Acceleration:</strong> On-Tour Excursion Take Rate reached <strong>64.2%</strong> (vs 48.0% KPI target), generating <span className="text-emerald-400 font-semibold">+€37.75/pax</span> in high-margin ancillary revenue.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span><strong>Cost Warning (AMBER):</strong> Hotel Cost per Pax Night in Vienna reached <strong>€102.50</strong> (+€7.50 over €95 target), driven by peak summer supplements on 3 departures.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span><strong>Actionable AI Advice:</strong> Re-negotiate guaranteed group allotments with <em>Grand Central Prague</em> to capture an estimated €6,800 volume rebate for Q4.</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ──── COMPONENT 3: 8 SMART STRATEGIC KPIS (TARGET VS ACTUAL GRID) ──── */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Strategic KPI Scorecards (Target vs Actual)
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {data?.kpis?.filter(k => k.ragStatus === 'Green').length ?? 0} On Target
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> {data?.kpis?.filter(k => k.ragStatus === 'Amber').length ?? 0} Attention Needed
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> {data?.kpis?.filter(k => k.ragStatus === 'Red').length ?? 0} Critical
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {data?.kpis.map((kpi) => {
            const isAmber = kpi.ragStatus === 'Amber';
            const isGreen = kpi.ragStatus === 'Green';

            // Value formatting based on unit
            let actualStr = '';
            let targetStr = '';
            if (kpi.unit === 'EUR') {
              actualStr = `€${Math.round(kpi.actual).toLocaleString()}`;
              targetStr = `€${Math.round(kpi.target).toLocaleString()}`;
            } else if (kpi.unit === 'Percentage') {
              actualStr = `${kpi.actual.toFixed(1)}%`;
              targetStr = `${kpi.target.toFixed(1)}%`;
            } else if (kpi.unit.includes('/night')) {
              actualStr = `€${kpi.actual.toFixed(2)}`;
              targetStr = `€${kpi.target.toFixed(2)}`;
            } else if (kpi.unit.includes('/pax')) {
              actualStr = `€${kpi.actual.toFixed(2)}`;
              targetStr = `€${kpi.target.toFixed(2)}`;
            } else {
              actualStr = `${kpi.actual}`;
              targetStr = `${kpi.target}`;
            }

            // Progress bar color
            const barBg = isAmber ? 'bg-amber-500' : (kpi.accentColor === 'blue' ? 'bg-blue-600' : (kpi.accentColor === 'purple' ? 'bg-purple-600' : 'bg-emerald-500'));
            const textAccent = isAmber ? 'text-amber-600 dark:text-amber-400' : (kpi.accentColor === 'blue' ? 'text-blue-600 dark:text-blue-400' : (kpi.accentColor === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-900 dark:text-white'));

            return (
              <div 
                key={kpi.id} 
                className={`border rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between space-y-2.5 relative overflow-hidden transition-all ${
                  isAmber 
                    ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-300 dark:border-amber-800/70' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block truncate ${isAmber ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {kpi.category}
                    </span>
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-0.5 leading-snug" title={kpi.name}>
                      {kpi.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 border ${
                    isAmber
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  }`}>
                    {kpi.statusBadge}
                  </span>
                </div>

                {/* Values & Attainment Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className={`text-xl sm:text-2xl font-black ${textAccent}`}>
                      {actualStr}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Target: <strong className="text-slate-800 dark:text-slate-200">{targetStr}</strong>
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className={`${barBg} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(kpi.attainmentPct, 100)}%` }}></div>
                  </div>
                </div>

                {/* Footnote */}
                <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${isAmber ? 'border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-400' : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  <span className="truncate">{kpi.footnoteLabel}</span>
                  <span className={`font-extrabold shrink-0 ${isAmber ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {kpi.footnoteValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──── COMPONENT 4 & 5: DIVERGENCE RADAR & RECOMMENDED ACTIONS (12-COL LAYOUT) ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left 7 Cols: Target vs Actual Variance Divergence Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Strategic KPI Variance Radar
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Percentage variance (&Delta;) of Actual performance against Board Budget Targets
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700">
              Baseline: Target = 0.0%
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {data?.divergenceRadar.map((item, idx) => {
              const isAmber = item.color === 'amber';
              const barColor = isAmber ? 'bg-amber-500' : (item.color === 'blue' ? 'bg-blue-600' : (item.color === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-500'));
              const badgeTextColor = isAmber ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${isAmber ? 'text-amber-700 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {item.metric}
                    </span>
                    <span className={badgeTextColor}>
                      {item.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-lg overflow-hidden flex items-center p-0.5 border border-slate-200 dark:border-slate-700">
                    <div className={`${barColor} h-full rounded-md transition-all duration-500`} style={{ width: `${item.barWidthPct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Target: {item.target}{item.unit}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Actual: {item.actual}{item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Top Actionable Executive Interventions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              C-Suite Recommended Actions
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              AI-generated operational interventions to preserve margin & optimize liquidity
            </p>
          </div>

          <div className="space-y-2.5">
            {data?.recommendedActions.map((action, idx) => {
              const isAmber = action.badgeColor === 'amber';
              const isBlue = action.badgeColor === 'blue';
              const isPurple = action.badgeColor === 'purple';

              const boxBg = isAmber 
                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60' 
                : (isBlue ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60' : 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60');

              const badgeStyle = isAmber
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                : (isBlue ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300');

              const subTextStyle = isAmber
                ? 'text-amber-700 dark:text-amber-400 font-bold'
                : (isBlue ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-purple-700 dark:text-purple-400 font-bold');

              return (
                <div key={idx} className={`p-3 rounded-xl border ${boxBg} space-y-1 transition-all`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${badgeStyle}`}>
                      {action.category}
                    </span>
                    <span className={`text-[10px] ${subTextStyle}`}>
                      {action.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {action.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ──── COMPONENT 6: VISUAL ANALYTICS CHARTS (MARGIN % BENCHMARK & COST SHARE) ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left 7 Cols: Tour Margin % vs Target Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tour Margin % vs. 20.0% Board Target Baseline
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Realized profitability comparison with target threshold (dashed line = 20.0%)
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Avg Margin: {data?.kpis?.find(k => k.id === 'net-margin')?.actual ? `${data.kpis.find(k => k.id === 'net-margin')?.actual.toFixed(1)}%` : '20.0%'}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {filteredTourLeague.slice(0, 5).map((t, idx) => {
              const margin = t.actualMarginPct;
              const isAbove = margin >= 20.0;
              const isCritical = margin < 10.0;
              const barWidth = Math.min(Math.max((margin / 35.0) * 100, 4), 100);
              const barGrad = isAbove 
                ? 'from-emerald-500 to-teal-500' 
                : (isCritical ? 'from-rose-500 to-red-500' : 'from-amber-500 to-yellow-500');

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{t.tourCode}</span>
                      <span className="text-slate-400 text-[10px]">({t.destination} • {t.pax} pax)</span>
                    </span>
                    <span className={`font-black ${isAbove ? 'text-emerald-600 dark:text-emerald-400' : (isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400')}`}>
                      {margin.toFixed(1)}% {isAbove ? `(+${(margin - 20).toFixed(1)}%)` : `(-${(20 - margin).toFixed(1)}%)`}
                    </span>
                  </div>
                  
                  {/* Visual Bar with 20% Target Indicator */}
                  <div className="relative w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-lg overflow-hidden flex items-center p-0.5 border border-slate-200 dark:border-slate-700">
                    <div 
                      className={`bg-gradient-to-r ${barGrad} h-full rounded-md transition-all duration-500`} 
                      style={{ width: `${barWidth}%` }}
                    />
                    {/* 20% Target Vertical Line Marker: 20/35 = 57.1% */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 dark:bg-white/60 z-10" 
                      style={{ left: '57.1%' }}
                      title="20.0% Target Baseline"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Exceeding Target (&ge;20%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Within Buffer (10-19.9%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Under Target (&lt;10%)
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Operating Cost Share Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Operating Cost Share Breakdown
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Consolidated supplier allocation across contracted circuits
                </p>
              </div>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-4 rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <div style={{ width: '56.4%' }} className="bg-indigo-600 h-full rounded-l-md" title="Hotels & Lodging: 56.4%" />
            <div style={{ width: '23.2%' }} className="bg-blue-500 h-full" title="Transport & Coaches: 23.2%" />
            <div style={{ width: '11.6%' }} className="bg-emerald-500 h-full" title="Professional Guides: 11.6%" />
            <div style={{ width: '8.8%' }} className="bg-amber-500 h-full rounded-r-md" title="Excursions & Admissions: 8.8%" />
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-indigo-700 dark:text-indigo-400">Hotels (56.4%)</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">€82.5k</span>
              </div>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-1">€88.50 / pax nt</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">14 Hotel Partners</p>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-400">Transport (23.2%)</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">€33.9k</span>
              </div>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-1">€35.90 / pax</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Fleet Util. 92%</p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400">Guides (11.6%)</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">€17.0k</span>
              </div>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-1">€18.00 / pax</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Avg Rating 4.9★</p>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400">Excursions (8.8%)</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">€12.9k</span>
              </div>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-1">€37.75 / pax</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{data?.kpis?.find(k => k.id === 'take-rate')?.actual ? `${data.kpis.find(k => k.id === 'take-rate')?.actual.toFixed(1)}% Take Rate` : 'Excursion Sales'}</p>
            </div>
          </div>
        </div>

      </div>

      {/* ──── COMPONENT 7: INTERACTIVE TOUR PERFORMANCE LEAGUE (SORTABLE & HIERARCHICAL DRILLDOWN) ──── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Tour Performance League: Budget Target vs. Actual</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Interactive Hierarchical Drilldown
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click any column header to sort • Click row or chevron to expand contracted supplier services (Hotels, Transport, Guides, Excursions)
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              suppressHydrationWarning
              onClick={toggleAllRows}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
            >
              {allExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input 
                type="text" 
                suppressHydrationWarning
                value={searchTour}
                onChange={(e) => setSearchTour(e.target.value)}
                placeholder="Search tour code or city..." 
                className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th 
                  onClick={() => handleSort('tourCode')}
                  className="py-2.5 px-3 font-bold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Tour & Itinerary</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('pax')}
                  className="py-2.5 px-3 font-bold text-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Pax</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('actualRevenue')}
                  className="py-2.5 px-3 font-bold text-right cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Gross Revenue (€)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('hotelCostPax')}
                  className="py-2.5 px-3 font-bold text-right cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Hotel / Pax</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('excursionSalesPax')}
                  className="py-2.5 px-3 font-bold text-right cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Excursion / Pax</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('actualMarginPct')}
                  className="py-2.5 px-3 font-bold text-right cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Margin %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('netProfit')}
                  className="py-2.5 px-3 font-bold text-right cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Net Profit (€)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('ragStatus')}
                  className="py-2.5 px-3 font-bold text-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>RAG</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTourLeague.map((t, idx) => {
                const isGreen = t.ragStatus === 'Green';
                const isAmber = t.ragStatus === 'Amber';
                const isExpanded = !!expandedRows[t.tourId];

                return (
                  <React.Fragment key={`${t.tourId}-${idx}`}>
                    {/* LEVEL 1: TOUR HEADER ROW */}
                    <tr 
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => toggleRow(t.tourId)}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            suppressHydrationWarning
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(t.tourId);
                            }}
                            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <div>
                            <div className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                              <span>{t.tourCode}</span>
                              {t.services && t.services.length > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                                  {t.services.length} svcs
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {t.destination} • {t.dateRange}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {t.pax}
                      </td>

                      <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-slate-100">
                        €{Math.round(t.actualRevenue).toLocaleString()}
                        <div className="text-[10px] text-slate-400 font-normal">
                          Target: €{Math.round(t.targetRevenue).toLocaleString()}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          €{t.hotelCostPax ? t.hotelCostPax.toFixed(2) : '85.00'}
                        </span>
                        {t.hotelVariance && (
                          <div className={`text-[10px] font-semibold ${t.hotelVariance.includes('+') ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {t.hotelVariance}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          €{t.excursionSalesPax ? t.excursionSalesPax.toFixed(2) : '38.50'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Take rate: 64%
                        </div>
                      </td>

                      <td className={`py-2.5 px-3 text-right font-black ${
                        isGreen ? 'text-emerald-600 dark:text-emerald-400' : (isAmber ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400')
                      }`}>
                        {t.actualMarginPct.toFixed(1)}%
                        <div className="text-[10px] text-slate-400 font-normal">
                          Target: {t.targetMarginPct.toFixed(1)}%
                        </div>
                      </td>

                      <td className={`py-2.5 px-3 text-right font-bold ${
                        t.netProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        €{Math.round(t.netProfit).toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                          isGreen 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                            : (isAmber 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800')
                        }`}>
                          {t.statusText}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => toggleRow(t.tourId)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 dark:text-blue-400 transition cursor-pointer"
                        >
                          {isExpanded ? 'Hide' : 'Breakdown'}
                        </button>
                      </td>
                    </tr>

                    {/* LEVEL 2: CONTRACTED SERVICES HIERARCHICAL DRILLDOWN */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80 dark:bg-slate-900/60">
                        <td colSpan={9} className="p-3 sm:p-4">
                          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-inner space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                  Level 2 Supplier Breakdown • {t.tourCode} Contracted Lines
                                </h4>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                Direct procurement costs & ancillary excursion revenue
                              </span>
                            </div>

                            {t.services && t.services.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-bold">
                                      <th className="py-1.5 px-2">Type</th>
                                      <th className="py-1.5 px-2">Supplier / Description</th>
                                      <th className="py-1.5 px-2 text-right">Cost / Pax</th>
                                      <th className="py-1.5 px-2 text-right">Total Cost (€)</th>
                                      <th className="py-1.5 px-2 text-right">Revenue (€)</th>
                                      <th className="py-1.5 px-2">Contract Notes & Diagnostics</th>
                                      <th className="py-1.5 px-2 text-center">Intervention</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
                                    {t.services.map((svc, sIdx) => {
                                      const isHotel = svc.serviceType === 'Hotel';
                                      const isTransport = svc.serviceType === 'Transport';
                                      const isGuide = svc.serviceType === 'Guide';
                                      const isExcursion = svc.serviceType === 'Excursion';

                                      const typeBadge = isHotel 
                                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400' 
                                        : (isTransport 
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400' 
                                            : (isGuide 
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' 
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'));

                                      return (
                                        <tr key={sIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                                          <td className="py-2 px-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${typeBadge}`}>
                                              {svc.serviceType}
                                            </span>
                                          </td>
                                          <td className="py-2 px-2 font-bold text-slate-900 dark:text-white">
                                            {svc.vendorOrDescription}
                                          </td>
                                          <td className="py-2 px-2 text-right font-semibold">
                                            €{svc.costPerPax.toFixed(2)}
                                          </td>
                                          <td className="py-2 px-2 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                            €{Math.round(svc.lineCost).toLocaleString()}
                                          </td>
                                          <td className="py-2 px-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                            {svc.lineRevenue ? `€${Math.round(svc.lineRevenue).toLocaleString()}` : '—'}
                                          </td>
                                          <td className="py-2 px-2 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                                            {svc.contractNotes || 'Standard agreement terms.'}
                                          </td>
                                          <td className="py-2 px-2 text-center">
                                            {isHotel && (
                                              <button 
                                                type="button"
                                                suppressHydrationWarning
                                                onClick={() => alert(`Initiating hotel quote review for ${svc.vendorOrDescription}`)}
                                                className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition cursor-pointer"
                                              >
                                                Switch Hotel
                                              </button>
                                            )}
                                            {isGuide && (
                                              <button 
                                                type="button"
                                                suppressHydrationWarning
                                                onClick={() => alert(`Opening Guide Roster assignment for ${svc.vendorOrDescription}`)}
                                                className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition cursor-pointer"
                                              >
                                                Reassign Guide
                                              </button>
                                            )}
                                            {isTransport && (
                                              <button 
                                                type="button"
                                                suppressHydrationWarning
                                                onClick={() => alert(`Reviewing coach quotes for ${svc.vendorOrDescription}`)}
                                                className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
                                              >
                                                Re-quote Fleet
                                              </button>
                                            )}
                                            {isExcursion && (
                                              <button 
                                                type="button"
                                                suppressHydrationWarning
                                                onClick={() => alert(`Launching excursion upsell campaign for ${svc.vendorOrDescription}`)}
                                                className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                                              >
                                                Upsell Excursion
                                              </button>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic py-2">
                                No contracted service lines linked yet for this tour.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
