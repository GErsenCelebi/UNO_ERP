"use client";

import React, { useEffect, useState, useRef } from "react";
import KPICards from "./KPICards";
import ProjectGanttChart from "./ProjectGanttChart";
import { Loader2, ChevronDown, Search, Filter, X } from "lucide-react";

function MultiSelectDropdown({ label, options, selectedIds, toggleOption }: { label: string, options: {id: number, label: string}[], selectedIds: number[], toggleOption: (id: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-1.5 border-2 border-slate-800 rounded-full text-xs font-medium bg-white hover:bg-slate-50 flex items-center gap-2 text-slate-800 shadow-sm transition-colors"
      >
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        {label}
        {selectedIds.length > 0 && (
          <span className="bg-blue-100 text-blue-700 py-0.5 px-1.5 rounded-full text-[10px] ml-1">{selectedIds.length}</span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 flex flex-col max-h-80 overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
              />
            </div>
          </div>
          <div className="overflow-y-auto p-1 flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500">No results found</div>
            ) : (
              filteredOptions.map(opt => (
                <label key={opt.id} className="flex items-center px-2.5 py-2 hover:bg-slate-50 rounded cursor-pointer group transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(opt.id)}
                    onChange={() => toggleOption(opt.id)}
                    className="mr-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                  />
                  <span className="text-xs text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const API = '/api';

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Filters
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<any[]>([]);
  
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([]);

  const [ganttStartDate, setGanttStartDate] = useState<string>("");
  const [ganttEndDate, setGanttEndDate] = useState<string>("");
  const [panOffsetMonths, setPanOffsetMonths] = useState<number>(0);

  useEffect(() => {
    // Fetch filter lookups
    Promise.all([
      fetch(`${API}/projects`).then(r => r.json()),
      fetch(`${API}/projectstatuses`).then(r => r.json())
    ]).then(([projs, statuses]) => {
      setProjectsList(projs);
      setProjectStatuses(statuses);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedProjectIds, selectedStatusIds]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedProjectIds.length > 0) params.append('projectIds', selectedProjectIds.join(','));
      if (selectedStatusIds.length > 0) params.append('projectStatusIds', selectedStatusIds.join(','));

      const res = await fetch(`${API}/dashboard/analytics?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProject = (id: number) => {
    setSelectedProjectIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleStatus = (id: number) => {
    setSelectedStatusIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleGanttDoubleClick = (projectId: number) => {
    setSelectedProjectIds([projectId]);
    setSelectedStatusIds([]);
  };

  const clearFilters = () => {
    setSelectedProjectIds([]);
    setSelectedStatusIds([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="h-10 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold text-slate-800">Analytics</h1>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3 items-center">
          <MultiSelectDropdown 
            label="Projects" 
            options={projectsList.map(p => ({id: p.id, label: p.projectCode}))}
            selectedIds={selectedProjectIds}
            toggleOption={toggleProject}
          />

          <MultiSelectDropdown 
            label="Statuses" 
            options={projectStatuses.map(s => ({id: s.id, label: s.name}))}
            selectedIds={selectedStatusIds}
            toggleOption={toggleStatus}
          />

          {(selectedProjectIds.length > 0 || selectedStatusIds.length > 0) && (
            <button onClick={clearFilters} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 flex items-center gap-1.5 transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5" /> Clear filter
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6 max-w-[1600px] mx-auto w-full">
        {loading || !data ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Main Column: Gantt Chart */}
            <div className="flex-1 min-w-0 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                <div>
                  <h5 className="text-lg font-bold text-slate-800">Project  Calendar</h5>
                  
                </div>
                
                <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Timeline:</span>
                    <input type="date" className="p-1.5 border border-slate-200 rounded text-xs text-slate-600 bg-white" value={ganttStartDate} onChange={e => setGanttStartDate(e.target.value)} title="Start Date" />
                    <span className="text-slate-400 text-xs">to</span>
                    <input type="date" className="p-1.5 border border-slate-200 rounded text-xs text-slate-600 bg-white" value={ganttEndDate} onChange={e => setGanttEndDate(e.target.value)} title="End Date (1 Year default)" />
                  </div>
                  <div className="flex bg-white rounded text-xs border border-slate-200 shadow-sm overflow-hidden">
                    <button onClick={() => setPanOffsetMonths(p => p - 1)} className="px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-bold border-r border-slate-200">&larr;</button>
                    <button onClick={() => setPanOffsetMonths(0)} className="px-3 py-1.5 hover:bg-slate-50 text-slate-500 font-medium border-r border-slate-200">Today</button>
                    <button onClick={() => setPanOffsetMonths(p => p + 1)} className="px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-bold">&rarr;</button>
                  </div>
                </div>
              </div>

              <div className="h-[500px]">
                <ProjectGanttChart 
                  projects={data.ganttProjects} 
                  onDoubleClick={handleGanttDoubleClick} 
                  startDateFilter={ganttStartDate}
                  endDateFilter={ganttEndDate}
                  panOffsetMonths={panOffsetMonths}
                />
              </div>
            </div>

            {/* Right Sidebar: KPIs and Alerts */}
            <div className="w-full lg:w-[120px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Key Metrics</h3>
              </div>
              <KPICards data={data} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
