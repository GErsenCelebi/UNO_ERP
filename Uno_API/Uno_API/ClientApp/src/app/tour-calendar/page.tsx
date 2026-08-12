"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter, Loader2, Calendar as CalendarIcon, MapPin, Users, AlertTriangle, User, Search, ChevronDown, Check, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API = '/api';

interface TourEvent {
  tourId: number;
  tourCode: string;
  destination: string;
  arrivalDate: string;
  endDate: string;
  pax: number;
  statusName: string;
  assignedGuideIds: number[];
  assignedGuideNames: string[];
  hasGuideConflict: boolean;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Draft': { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' },
  'Services Proposal': { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800' },
  'Proposal': { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800' },
  'Confirmed': { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
  'In Progress': { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
  'Completed': { bg: 'bg-slate-800', border: 'border-slate-900', text: 'text-white' },
  'Cancelled': { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
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
  const [viewMode, setViewMode] = useState<'month'>('month');
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters Data
  const [projects, setProjects] = useState<{ id: number, projectCode: string, client?: { name: string } }[]>([]);
  const [guides, setGuides] = useState<{ id: number, name: string }[]>([]);
  const [tourStatuses, setTourStatuses] = useState<{ id: number, name: string }[]>([]);

  // Selected Filters
  const [selectedGuideIds, setSelectedGuideIds] = useState<number[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Debounced Search
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  
  // Quick View Modal
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
  }, [currentDate, selectedGuideIds, selectedProjectIds, selectedStatusIds, debouncedSearch]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0).toISOString();
      
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

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay() - 1;
    if (day === -1) day = 6;
    return day;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const getEventsForDay = (date: Date) => {
    return events.filter(e => {
      const start = new Date(e.arrivalDate);
      const end = new Date(e.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      const current = new Date(date);
      current.setHours(12,0,0,0);
      return current >= start && current <= end;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-sm w-full">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 shrink-0 z-20 shadow-sm">
        {/* Main Header Row */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Tour Calendar
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={goToToday} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md shadow-sm transition-colors text-sm">
              Today
            </button>
            <div className="flex items-center bg-slate-100 rounded-md p-0.5 shadow-sm">
              <button onClick={prevMonth} className="p-1 hover:bg-white rounded text-slate-600 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="w-32 text-center font-semibold text-slate-800">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-white rounded text-slate-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
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
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-100 border border-green-300 rounded block"></span> Confirmed</div>
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-100 border border-orange-300 rounded block"></span> In Progress</div>
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-800 border border-slate-900 rounded block"></span> Completed</div>
             <div className="flex items-center gap-1.5 text-yellow-600 font-medium"><AlertTriangle className="w-3 h-3" /> Guide Conflict</div>
          </div>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4 relative bg-slate-50">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden h-full min-h-[600px] shadow-sm">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-slate-100 py-2 text-center font-semibold text-xs text-slate-600 uppercase tracking-wider">
              {day}
            </div>
          ))}
          
          {days.map((date, index) => {
            const isToday = date && date.toDateString() === new Date().toDateString();
            const dayEvents = date ? getEventsForDay(date) : [];
            
            return (
              <div 
                key={index} 
                className={`bg-white min-h-[100px] p-1 flex flex-col transition-colors ${date ? 'hover:bg-slate-50/50' : 'bg-slate-50/30'}`}
              >
                {date && (
                  <>
                    <div className={`text-right p-1 ${isToday ? 'mb-1' : ''}`}>
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-1 px-0.5">
                      {dayEvents.map(event => {
                        const style = STATUS_COLORS[event.statusName] || STATUS_COLORS['Draft'];
                        return (
                          <div 
                            key={event.tourId} 
                            className={`relative group px-1.5 py-1 text-[10px] rounded border ${style.bg} ${style.border} ${style.text} cursor-pointer truncate shadow-sm font-medium hover:shadow hover:z-10 hover:-translate-y-px transition-all`}
                            onMouseEnter={() => setHoveredEvent(event)}
                            onMouseLeave={() => setHoveredEvent(null)}
                            onClick={() => router.push(`/tour-details?projectId=0&tourId=${event.tourId}`)}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="truncate flex-1">{event.tourCode} {event.destination && `- ${event.destination}`}</span>
                              {event.hasGuideConflict && (
                                <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick View Modal (Hover) */}
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
              <div className="flex items-start gap-2 text-slate-600 mt-2 pt-2 border-t border-slate-100">
                <User className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700">Assigned Guides:</span>
                  {hoveredEvent.assignedGuideNames && hoveredEvent.assignedGuideNames.length > 0 ? (
                    <span className="text-slate-500">{hoveredEvent.assignedGuideNames.join(', ')}</span>
                  ) : (
                    <span className="text-slate-400 italic">None assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
