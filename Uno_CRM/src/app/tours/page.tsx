"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Map, Filter, Loader2, CalendarDays, Users, MapPin, ChevronDown, ArrowRight, FolderOpen, Briefcase, X, Plus, User, Check, History } from 'lucide-react';
import AuditHistoryTab from '@/components/AuditHistoryTab';
import Can from '@/components/Can';
import SLAWarningBanner from '@/components/SLAWarningBanner';

const API = '/api';

interface TourStatus {
  id: number;
  name: string;
  orderIndex: number;
}

interface Tour {
  id: number;
  tourCode: string;
  destination: string;
  pax: number;
  startDate: string;
  endDate: string;
  tourStatusId: number;
  projectId: number;
  project?: { id: number; projectCode: string; client?: { name: string } };
  tourServices?: any[];
  [key: string]: any;
}

interface Project {
  id: number;
  projectCode: string;
  client?: { name: string };
}

const STATUS_COLORS: Record<string, { bg: string; border: string; gradient: string; dot: string; text: string }> = {
  'Draft':             { bg: 'bg-slate-50',   border: 'border-slate-200',  gradient: 'from-slate-500 to-slate-700',    dot: 'bg-slate-400',   text: 'text-slate-700' },
  'Services Proposal': { bg: 'bg-amber-50',   border: 'border-amber-200',  gradient: 'from-amber-500 to-orange-600',   dot: 'bg-amber-400',   text: 'text-amber-700' },
  'Proposal':          { bg: 'bg-amber-50',   border: 'border-amber-200',  gradient: 'from-amber-500 to-orange-600',   dot: 'bg-amber-400',   text: 'text-amber-700' },
  'Confirmed':         { bg: 'bg-indigo-50',  border: 'border-indigo-200', gradient: 'from-indigo-500 to-blue-600',    dot: 'bg-indigo-400',  text: 'text-indigo-700' },
  'In Progress':       { bg: 'bg-violet-50',  border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600',  dot: 'bg-violet-400',  text: 'text-violet-700' },
  'Completed':         { bg: 'bg-emerald-50', border: 'border-emerald-200',gradient: 'from-emerald-500 to-green-600',  dot: 'bg-emerald-400', text: 'text-emerald-700' },
  'Cancelled':         { bg: 'bg-rose-50',    border: 'border-rose-200',   gradient: 'from-rose-500 to-red-600',       dot: 'bg-rose-400',    text: 'text-rose-700' },
};

const getStatusColor = (name: string) => STATUS_COLORS[name] || STATUS_COLORS['Draft'];

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

export default function ToursKanbanPage() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [statuses, setStatuses] = useState<TourStatus[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [guides, setGuides] = useState<{ id: number, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([]);
  const [selectedGuideIds, setSelectedGuideIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTour, setNewTour] = useState({
    tourCode: '',
    destination: '',
    startDate: '',
    endDate: '',
    projectId: 0,
    tourStatusId: 1,
  });

  const [moveDropdownOpen, setMoveDropdownOpen] = useState<number | null>(null);
  const moveRef = useRef<HTMLDivElement>(null);
  const [draggedTourId, setDraggedTourId] = useState<number | null>(null);
  const [dragOverStatusId, setDragOverStatusId] = useState<number | null>(null);

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTour({ tourCode: '', destination: '', startDate: '', endDate: '', projectId: 0, tourStatusId: 1 });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toursRes, statusesRes, projectsRes, guidesRes] = await Promise.all([
        fetch(`${API}/tours`, { cache: 'no-store' }),
        fetch(`${API}/tourstatuses`, { cache: 'no-store' }),
        fetch(`${API}/projects`, { cache: 'no-store' }),
        fetch(`${API}/guides`, { cache: 'no-store' }),
      ]);
      if (toursRes.ok) setTours(await toursRes.json());
      if (statusesRes.ok) {
        const s = await statusesRes.json();
        setStatuses(s.sort((a: TourStatus, b: TourStatus) => a.orderIndex - b.orderIndex));
      }
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (guidesRes.ok) setGuides(await guidesRes.json());
    } catch (err) {
      console.error('Failed to fetch tours data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Close move dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moveRef.current && !moveRef.current.contains(e.target as Node)) {
        setMoveDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMoveToStatus = async (tour: Tour, newStatusId: number) => {
    setMoveDropdownOpen(null);
    try {
      const { tourServices, bookings, passengers, project, tourStatus, ...cleanTour } = tour as any;
      const res = await fetch(`${API}/tours/${tour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cleanTour, tourStatusId: newStatusId }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to move tour:', err);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, tour: Tour) => {
    setDraggedTourId(tour.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(tour.id));
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTourId(null);
    setDragOverStatusId(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, statusId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatusId(statusId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverStatusId(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStatusId: number) => {
    e.preventDefault();
    setDragOverStatusId(null);
    const tourId = parseInt(e.dataTransfer.getData('text/plain'));
    const tour = tours.find(t => t.id === tourId);
    if (tour && tour.tourStatusId !== targetStatusId) {
      await handleMoveToStatus(tour, targetStatusId);
    }
    setDraggedTourId(null);
  };

  const getProjectName = (tour: Tour): string => {
    if (tour.project?.client?.name) return tour.project.client.name;
    if (tour.project?.projectCode) return tour.project.projectCode;
    const proj = projects.find(p => p.id === tour.projectId);
    return proj?.projectCode || proj?.client?.name || `Project #${tour.projectId}`;
  };

  const getProjectCode = (tour: Tour): string => {
    if (tour.project?.projectCode) return tour.project.projectCode;
    const proj = projects.find(p => p.id === tour.projectId);
    return proj?.projectCode || `PRJ-${tour.projectId}`;
  };

  const getGuideNames = (tour: Tour): string => {
    const mainGuide = tour.guideId;
    const svcGuides = tour.tourServices?.filter((s: any) => s.guideId).map((s: any) => s.guideId) || [];
    const guideIds = Array.from(new Set([mainGuide, ...svcGuides].filter(Boolean)));
    
    const namesFromId = guideIds.map((id: any) => guides.find(g => g.id === id)?.name).filter(Boolean);
    if (namesFromId.length > 0) return namesFromId.join(', ');

    const svcGuideNames = tour.tourServices?.map((s: any) => s.guideName).filter(Boolean) || [];
    if (svcGuideNames.length > 0) return Array.from(new Set(svcGuideNames)).join(', ');

    const guideSvc = tour.tourServices?.find((s: any) => s.serviceCategoryId === 4 || (s.description || '').toLowerCase().includes('guide'));
    if (guideSvc?.description) {
      return guideSvc.description.replace(/^Guide\s*-\s*/i, '').trim();
    }

    return '';
  };

  const filtered = tours.filter(t => {
    if (selectedProjectIds.length > 0 && !selectedProjectIds.includes(t.projectId)) return false;
    if (selectedStatusIds.length > 0 && !selectedStatusIds.includes(t.tourStatusId)) return false;
    
    if (selectedGuideIds.length > 0) {
      if (!t.tourServices) return false;
      const tourGuideIds = t.tourServices.filter((ts: any) => ts.guideId).map((ts: any) => ts.guideId);
      const matchesGuide = selectedGuideIds.some(id => tourGuideIds.includes(id));
      if (!matchesGuide) return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        t.tourCode?.toLowerCase().includes(term) ||
        t.destination?.toLowerCase().includes(term) ||
        getProjectName(t).toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 sticky top-0 z-20">
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-6">
            <Can perform="edit-tours">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all hover:-translate-y-0.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> New Tour
              </button>
            </Can>
            
            <div className="flex items-center">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <div className="p-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded shadow-sm">
                  <Map className="w-3 h-3 text-white" />
                </div>
                Tours Board
              </h1>
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
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              suppressHydrationWarning
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
            options={statuses.map(s => ({ label: s.name, value: s.id }))}
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
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

        <div className="relative z-0">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : statuses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FolderOpen className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">No tour statuses found</h3>
              <p className="text-slate-500 max-w-md">Configure tour statuses in Master Data first.</p>
            </div>
          ) : (
            <div className="flex gap-4 pb-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
              {statuses.map(status => {
                const color = getStatusColor(status.name);
                const columnTours = filtered.filter(t => t.tourStatusId === status.id);

                return (
                  <div
                    key={status.id}
                    className={`flex-1 min-w-[180px] flex flex-col transition-all duration-200 ${dragOverStatusId === status.id ? 'scale-[1.01]' : ''}`}
                    onDragOver={(e) => handleDragOver(e, status.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, status.id)}
                  >
                    {/* Column header */}
                    <div className={`bg-gradient-to-r ${color.gradient} rounded-t-xl px-3 py-2 shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-xs tracking-wide truncate">{status.name}</h3>
                        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex-shrink-0">
                          {columnTours.length}
                        </span>
                      </div>
                    </div>

                    {/* Column body */}
                    <div className={`flex-1 ${color.bg} ${color.border} border border-t-0 rounded-b-xl p-2 space-y-2 overflow-y-auto transition-all duration-200 ${dragOverStatusId === status.id ? 'ring-1 ring-blue-400 ring-inset bg-blue-50/50' : ''}`}>
                      {columnTours.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center mb-2`}>
                            <Map className="w-5 h-5 text-slate-300" />
                          </div>
                          <p className="text-xs text-slate-400 font-medium">No tours</p>
                        </div>
                      ) : (
                        columnTours.map(tour => (
                          <div
                            key={tour.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, tour)}
                            onDragEnd={handleDragEnd}
                            className={`group bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden ${draggedTourId === tour.id ? 'opacity-50 scale-95' : ''}`}
                          >
                            <div
                              onClick={() => router.push(`/projects/${tour.projectId}/tours/${tour.id}`)}
                              className="p-2.5"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                  {tour.tourCode}
                                </span>
                                <span className="text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Briefcase className="w-2.5 h-2.5" />
                                  {getProjectCode(tour)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 mb-2">
                                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <h4 className="font-semibold text-xs text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                                  {tour.destination || 'No destination'}
                                </h4>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <Users className="w-3 h-3 text-slate-400" />
                                  <span>{tour.pax || 0} pax</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <CalendarDays className="w-3 h-3 text-slate-400" />
                                  <span>
                                    {(tour.startDate || tour.arrivalDate) ? new Date(tour.startDate || tour.arrivalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                                    {' → '}
                                    {tour.endDate ? new Date(tour.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <Briefcase className="w-3 h-3 text-slate-400" />
                                  <span className="truncate">{getProjectName(tour)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span className="truncate">{getGuideNames(tour) || 'No Guide Assigned'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Move action */}
                            <div className="relative border-t border-slate-100 px-2.5 py-1.5" ref={moveDropdownOpen === tour.id ? moveRef : undefined}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMoveDropdownOpen(moveDropdownOpen === tour.id ? null : tour.id);
                                }}
                                className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 transition-colors w-full"
                              >
                                <ArrowRight className="w-2.5 h-2.5" />
                                Move to…
                                <ChevronDown className="w-3 h-3 ml-auto" />
                              </button>

                              {moveDropdownOpen === tour.id && (
                                <div className="absolute left-0 right-0 bottom-full mb-1 bg-white rounded-lg shadow-xl border border-slate-200 z-30 py-1 mx-2">
                                  {statuses.filter(s => s.id !== tour.tourStatusId).map(s => {
                                    const sc = getStatusColor(s.name);
                                    return (
                                      <button
                                        key={s.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveToStatus(tour, s.id);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
                                      >
                                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                                        {s.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Tour Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Create New Tour</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTour} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tour Code</label>
                <input required type="text" value={newTour.tourCode} onChange={e => setNewTour({...newTour, tourCode: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. EU-2025" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Destination</label>
                <input required type="text" value={newTour.destination} onChange={e => setNewTour({...newTour, destination: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Paris, France" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project</label>
                <select required value={newTour.projectId || ''} onChange={e => setNewTour({...newTour, projectId: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option value="" disabled>Select a Project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.projectCode} {p.client?.name ? `(${p.client.name})` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
                  <input required type="date" value={newTour.startDate} onChange={e => setNewTour({...newTour, startDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date</label>
                  <input required type="date" value={newTour.endDate} onChange={e => setNewTour({...newTour, endDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
