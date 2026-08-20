"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter, Loader2, Calendar as CalendarIcon, MapPin, Users, AlertTriangle, User, Search, ChevronDown, Check, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API = '/api';

interface TourEvent {
  tourId: number;
  projectId?: number;
  tourCode: string;
  destination: string;
  arrivalDate: string;
  endDate: string;
  pax: number;
  statusName: string;
  assignedGuideIds: number[];
  assignedGuideNames: string[];
  guideAssignments: any[];
  hasGuideConflict: boolean;
}

const getTourColor = (tourCode: string) => {
  if (!tourCode) return '#334155';
  let hash = 0;
  for (let i = 0; i < tourCode.length; i++) {
    hash = tourCode.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 75%, 40%)`; 
};

const STATUS_COLORS: Record<string, { bg: string; border: string; gradient: string; dot: string; text: string }> = {
  'Draft':             { bg: 'bg-slate-50',   border: 'border-slate-200',  gradient: 'from-slate-500 to-slate-700',    dot: 'bg-slate-400',   text: 'text-slate-700' },
  'Services Proposal': { bg: 'bg-amber-50',   border: 'border-amber-200',  gradient: 'from-amber-500 to-orange-600',   dot: 'bg-amber-400',   text: 'text-amber-700' },
  'Proposal':          { bg: 'bg-amber-50',   border: 'border-amber-200',  gradient: 'from-amber-500 to-orange-600',   dot: 'bg-amber-400',   text: 'text-amber-700' },
  'Confirmed':         { bg: 'bg-indigo-50',  border: 'border-indigo-200', gradient: 'from-indigo-500 to-blue-600',    dot: 'bg-indigo-400',  text: 'text-indigo-700' },
  'In Progress':       { bg: 'bg-violet-50',  border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600',  dot: 'bg-violet-400',  text: 'text-violet-700' },
  'Completed':         { bg: 'bg-emerald-50', border: 'border-emerald-200',gradient: 'from-emerald-500 to-green-600',  dot: 'bg-emerald-400', text: 'text-emerald-700' },
  'Cancelled':         { bg: 'bg-rose-50',    border: 'border-rose-200',   gradient: 'from-rose-500 to-red-600',       dot: 'bg-rose-400',    text: 'text-rose-700' },
};

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder, icon: Icon }: any) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleOption = (val: any) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v: any) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const displayValue = selectedValues.length === 0 ? placeholder : `${selectedValues.length} selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors focus:ring-1 focus:ring-blue-500 min-w-[120px] justify-between"
      >
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
          {displayValue}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto py-1">
          {options.length === 0 ? <div className="px-3 py-2 text-xs text-slate-500">No options</div> : null}
          {options.map((opt: any) => (
            <div
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${selectedValues.includes(opt.value) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                {selectedValues.includes(opt.value) && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className="truncate">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function TourCalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'year' | 'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<{ id: number, projectCode: string, client?: { name: string } }[]>([]);
  const [guides, setGuides] = useState<{ id: number, name: string }[]>([]);
  const [tourStatuses, setTourStatuses] = useState<{ id: number, name: string }[]>([]);

  const [selectedGuideIds, setSelectedGuideIds] = useState<number[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [hoveredEvent, setHoveredEvent] = useState<TourEvent | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [projRes, guidesRes, statusRes] = await Promise.all([
          fetch(`${API}/projects`),
          fetch(`${API}/guides`),
          fetch(`${API}/tourstatuses`)
        ]);
        if (projRes.ok) setProjects(await projRes.json());
        if (guidesRes.ok) setGuides(await guidesRes.json());
        if (statusRes.ok) setTourStatuses(await statusRes.json());
      } catch (e) {
        console.error("Failed to load filter dropdown data", e);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [currentDate, viewMode, selectedGuideIds, selectedProjectIds, selectedStatusIds, debouncedSearch]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      let startDate, endDate;
      if (viewMode === 'year') {
         startDate = new Date(year, 0, 1).toISOString();
         endDate = new Date(year, 12, 0).toISOString();
      } else {
         startDate = new Date(year, month - 2, 1).toISOString();
         endDate = new Date(year, month + 1, 0).toISOString();
      }
      
      let url = `${API}/TourCalendar?StartDate=${startDate}&EndDate=${endDate}`;
      
      selectedGuideIds.forEach(id => url += `&GuideIds=${id}`);
      selectedProjectIds.forEach(id => url += `&ProjectIds=${id}`);
      selectedStatusIds.forEach(id => url += `&TourStatusIds=${id}`);
      if (debouncedSearch) {
        url += `&SearchQuery=${encodeURIComponent(debouncedSearch)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data: TourEvent[] = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch calendar events", error);
    } finally {
      setLoading(false);
    }
  };

  const nextPeriod = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === 'year') d.setFullYear(d.getFullYear() + 1);
      else if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
      else if (viewMode === 'week') d.setDate(d.getDate() + 7);
      else if (viewMode === 'day') d.setDate(d.getDate() + 1);
      return d;
    });
  };
  const prevPeriod = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === 'year') d.setFullYear(d.getFullYear() - 1);
      else if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
      else if (viewMode === 'week') d.setDate(d.getDate() - 7);
      else if (viewMode === 'day') d.setDate(d.getDate() - 1);
      return d;
    });
  };
  const goToToday = () => setCurrentDate(new Date());

  const formatHeaderTitle = () => {
    if (viewMode === 'year') return currentDate.getFullYear().toString();
    if (viewMode === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (viewMode === 'week') {
       const start = new Date(currentDate);
       start.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
       const end = new Date(start);
       end.setDate(end.getDate() + 6);
       return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getEventsForRange = (dateStart: Date, dateEnd: Date) => {
    return events.filter(e => {
      const start = new Date(e.arrivalDate);
      const end = new Date(e.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      const s = new Date(dateStart); s.setHours(0,0,0,0);
      const e2 = new Date(dateEnd); e2.setHours(23,59,59,999);
      return (start <= e2 && end >= s);
    });
  };

  const renderEventCard = (event: TourEvent) => {
    const style = STATUS_COLORS[event.statusName] || STATUS_COLORS['Draft'];
    return (
      <div 
        key={event.tourId} 
        className={`relative group px-1.5 py-1 text-[10px] rounded border ${style.bg} ${style.border} ${style.text} cursor-pointer truncate shadow-sm font-medium hover:shadow hover:z-10 hover:-translate-y-px transition-all my-0.5`}
        onMouseEnter={() => setHoveredEvent(event)}
        onMouseLeave={() => setHoveredEvent(null)}
        onClick={() => router.push(`/projects/${event.projectId || 0}/tours/${event.tourId}`)}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="truncate flex-1 font-bold" style={{ color: getTourColor(event.tourCode) }}>
            {event.tourCode} {event.destination && `- ${event.destination}`}
          </span>
          {event.hasGuideConflict && (
            <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
          )}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay() - 1;
    if (firstDay === -1) firstDay = 6;

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    return (
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden h-full min-h-[600px] shadow-sm">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="bg-slate-100 py-2 text-center font-semibold text-xs text-slate-600 uppercase tracking-wider">
            {day}
          </div>
        ))}
        {days.map((date, index) => {
          const isToday = date && date.toDateString() === new Date().toDateString();
          const dayEvents = date ? getEventsForRange(date, date) : [];
          return (
            <div key={index} className={`bg-white min-h-[100px] p-1 flex flex-col transition-colors ${date ? 'hover:bg-slate-50/50' : 'bg-slate-50/30'}`}>
              {date && (
                <>
                  <div className={`text-right p-1 ${isToday ? 'mb-1' : ''}`}>
                    <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-1 px-0.5">
                    {dayEvents.map(renderEventCard)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    return (
      <div className="grid grid-cols-3 gap-4 h-full min-h-[600px] overflow-auto pb-8">
        {months.map((monthDate, i) => {
          const mStart = new Date(year, i, 1);
          const mEnd = new Date(year, i + 1, 0);
          const mEvents = getEventsForRange(mStart, mEnd);
          
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow transition-shadow flex flex-col min-h-[200px]">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2 text-sm flex justify-between">
                {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{mEvents.length}</span>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {mEvents.length === 0 && <p className="text-xs text-slate-400 italic">No tours</p>}
                {mEvents.map(renderEventCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Monday
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden h-full min-h-[600px] shadow-sm">
        {weekDays.map(date => {
          const isToday = date.toDateString() === new Date().toDateString();
          const dayEvents = getEventsForRange(date, date);
          
          return (
            <div key={date.toISOString()} className="bg-white flex flex-col transition-colors hover:bg-slate-50/50">
              <div className={`bg-slate-100 py-2 text-center font-semibold text-xs text-slate-600 uppercase tracking-wider ${isToday ? 'bg-blue-50 text-blue-700' : ''}`}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                <div className={`mt-1 text-sm ${isToday ? 'font-bold' : ''}`}>{date.getDate()}</div>
              </div>
              <div className="flex-1 p-1 overflow-y-auto space-y-1">
                {dayEvents.map(renderEventCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForRange(currentDate, currentDate);
    return (
      <div className="bg-white border border-slate-200 rounded-lg h-full min-h-[600px] shadow-sm flex flex-col">
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-800">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{dayEvents.length} Tours</span>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <CalendarIcon className="w-12 h-12 mb-2 opacity-50" />
              <p>No tours scheduled for this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {dayEvents.map(event => {
                const style = STATUS_COLORS[event.statusName] || STATUS_COLORS['Draft'];
                return (
                  <div key={event.tourId} onClick={() => router.push(`/projects/${event.projectId || 0}/tours/${event.tourId}`)} className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800" style={{ color: getTourColor(event.tourCode) }}>{event.tourCode}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5"/> {event.destination}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${style.bg} ${style.text}`}>{event.statusName}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-blue-500" /> {new Date(event.arrivalDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</div>
                      <div className="w-px h-4 bg-slate-300"></div>
                      <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-500" /> {event.pax} Pax</div>
                    </div>

                    {event.guideAssignments && event.guideAssignments.length > 0 && (
                      <div className="border-t border-slate-100 pt-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Guides ({event.guideAssignments.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {event.guideAssignments.map((ga: any, i: number) => (
                            <span key={i} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                              <User className="w-3.5 h-3.5" />
                              {ga.guideName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-sm w-full">
      <header className="bg-white border-b border-slate-200 shrink-0 z-20 shadow-sm">
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Tour Calendar
            </h1>
            <div className="flex bg-slate-100 p-1 rounded-lg ml-2">
              {(['year', 'month', 'week', 'day'] as const).map((v) => (
                <button 
                  key={v}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize ${viewMode === v ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => setViewMode(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={goToToday} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md shadow-sm transition-colors text-sm">
              Today
            </button>
            <div className="flex items-center bg-slate-100 rounded-md p-0.5 shadow-sm min-w-[200px] justify-between">
              <button onClick={prevPeriod} className="p-1 hover:bg-white rounded text-slate-600 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-center font-semibold text-slate-800 text-xs px-2">
                {formatHeaderTitle()}
              </span>
              <button onClick={nextPeriod} className="p-1 hover:bg-white rounded text-slate-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-12 flex items-center px-6 gap-4 bg-slate-50/50">
          <div className="relative w-64 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-full focus:ring-1 focus:ring-blue-500 text-xs transition-all outline-none"
            />
          </div>
          
          <div className="h-4 w-px bg-slate-200 mx-1"></div>

          <MultiSelectDropdown 
            options={projects.map(p => ({ label: `${p.projectCode} ${p.client?.name ? `(${p.client.name})` : ''}`, value: p.id }))}
            selectedValues={selectedProjectIds}
            onChange={setSelectedProjectIds}
            placeholder="Projects"
            icon={Briefcase}
          />
          <MultiSelectDropdown 
            options={tourStatuses.map(s => ({ label: s.name, value: s.id }))}
            selectedValues={selectedStatusIds}
            onChange={setSelectedStatusIds}
            placeholder="Statuses"
            icon={Filter}
          />
          <MultiSelectDropdown 
            options={guides.map(g => ({ label: g.name, value: g.id }))}
            selectedValues={selectedGuideIds}
            onChange={setSelectedGuideIds}
            placeholder="Guides"
            icon={User}
          />

          <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-500">
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-50 border border-indigo-200 rounded block"></span> Confirmed</div>
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-violet-50 border border-violet-200 rounded block"></span> In Progress</div>
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-50 border border-emerald-200 rounded block"></span> Completed</div>
             <div className="flex items-center gap-1.5 text-yellow-600 font-medium"><AlertTriangle className="w-3 h-3" /> Guide Conflict</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 relative bg-slate-50">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'year' && renderYearView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}

        {hoveredEvent && (
          <div 
            className="fixed z-50 bg-white rounded-lg shadow-2xl border border-slate-200 p-4 w-72 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px] ml-[100px]"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45"></div>
            
            <div className="flex items-start justify-between mb-3 relative z-10">
              <div>
                <h4 className="font-bold text-slate-800">{hoveredEvent.tourCode}</h4>
                <p className="text-xs font-medium text-slate-500">{hoveredEvent.statusName}</p>
              </div>
              {hoveredEvent.hasGuideConflict && (
                <div className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border border-red-100">
                  <AlertTriangle className="w-3 h-3" /> Conflict
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-xs relative z-10">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{hoveredEvent.destination || 'No destination'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {new Date(hoveredEvent.arrivalDate).toLocaleDateString()} - {new Date(hoveredEvent.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{hoveredEvent.pax} Pax</span>
              </div>
              
              {hoveredEvent.guideAssignments && hoveredEvent.guideAssignments.length > 0 && (
                <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Assigned Guides:</div>
                  {hoveredEvent.guideAssignments.map((ga: any, i: number) => (
                    <div key={i} className="flex flex-col gap-0.5 text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span>{ga.guideName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal ml-5">
                        {ga.startDate ? new Date(ga.startDate).toLocaleDateString() : '-'} to {ga.endDate ? new Date(ga.endDate).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
