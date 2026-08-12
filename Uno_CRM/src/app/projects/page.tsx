"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, X, LayoutTemplate, Users, CalendarDays, DollarSign, Loader2, FolderOpen, ChevronDown, ArrowRight, Map, Briefcase } from 'lucide-react';

const API = '/api';

interface Client {
  id: number;
  name: string;
  location?: string;
  avatarUrl?: string;
}

interface ProjectStatus {
  id: number;
  name: string;
  orderIndex: number;
}

interface Project {
  id: number;
  projectCode: string;
  clientId: number;
  clientName?: string;
  client?: Client;
  projectStatusId: number;
  projectStatusName?: string;
  startDate: string;
  endDate: string;
  description?: string;
  approxBudget: number;
  tours?: any[];
  tourCount?: number;
  [key: string]: any;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; gradient: string; dot: string; text: string }> = {
  'Draft':      { bg: 'bg-slate-50',   border: 'border-slate-200',   gradient: 'from-slate-500 to-slate-700',     dot: 'bg-slate-400',   text: 'text-slate-700' },
  'Planning':   { bg: 'bg-indigo-50',  border: 'border-indigo-200',  gradient: 'from-indigo-500 to-violet-600',   dot: 'bg-indigo-400',  text: 'text-indigo-700' },
  'Active':     { bg: 'bg-emerald-50', border: 'border-emerald-200', gradient: 'from-emerald-500 to-green-600',   dot: 'bg-emerald-400', text: 'text-emerald-700' },
  'On Hold':    { bg: 'bg-amber-50',   border: 'border-amber-200',   gradient: 'from-amber-500 to-yellow-600',    dot: 'bg-amber-400',   text: 'text-amber-700' },
  'Completed':  { bg: 'bg-sky-50',     border: 'border-sky-200',     gradient: 'from-sky-500 to-cyan-600',        dot: 'bg-sky-400',     text: 'text-sky-700' },
  'Cancelled':  { bg: 'bg-rose-50',    border: 'border-rose-200',    gradient: 'from-rose-500 to-red-600',        dot: 'bg-rose-400',    text: 'text-rose-700' },
};

const getStatusColor = (name: string) => STATUS_COLORS[name] || STATUS_COLORS['Draft'];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [moveDropdownOpen, setMoveDropdownOpen] = useState<number | null>(null);
  const moveRef = useRef<HTMLDivElement>(null);
  const [draggedProjectId, setDraggedProjectId] = useState<number | null>(null);
  const [dragOverStatusId, setDragOverStatusId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    projectCode: '',
    clientId: 0,
    startDate: '',
    endDate: '',
    description: '',
    approxBudget: 0,
    projectStatusId: 1,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, clientRes, statusRes] = await Promise.all([
        fetch(`${API}/projects`, { cache: 'no-store' }),
        fetch(`${API}/clients`, { cache: 'no-store' }),
        fetch(`${API}/projectstatuses`, { cache: 'no-store' }),
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (clientRes.ok) setClients(await clientRes.json());
      if (statusRes.ok) {
        const s = await statusRes.json();
        setStatuses(s.sort((a: ProjectStatus, b: ProjectStatus) => a.orderIndex - b.orderIndex));
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewProject({ projectCode: '', clientId: 0, startDate: '', endDate: '', description: '', approxBudget: 0, projectStatusId: 1 });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToStatus = async (project: Project, newStatusId: number) => {
    setMoveDropdownOpen(null);
    try {
      const res = await fetch(`${API}/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, projectStatusId: newStatusId }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to move project:', err);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggedProjectId(project.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(project.id));
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedProjectId(null);
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
    // Only clear if we're leaving the column entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverStatusId(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStatusId: number) => {
    e.preventDefault();
    setDragOverStatusId(null);
    const projectId = parseInt(e.dataTransfer.getData('text/plain'));
    const project = projects.find(p => p.id === projectId);
    if (project && project.projectStatusId !== targetStatusId) {
      await handleMoveToStatus(project, targetStatusId);
    }
    setDraggedProjectId(null);
  };

  const getClientName = (p: Project) => p.clientName || p.client?.name || clients.find(c => c.id === p.clientId)?.name || 'Unknown';
  const getTourCount = (p: Project) => p.tourCount ?? p.tours?.length ?? 0;

  const filtered = projects.filter(p => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      p.projectCode?.toLowerCase().includes(term) ||
      getClientName(p).toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <header className="h-10 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all hover:-translate-y-0.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> New Project
          </button>
          
          {/* Page Title */}
          <div className="flex items-center">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <div className="p-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded shadow-sm">
                <LayoutTemplate className="w-3 h-3 text-white" />
              </div>
              Projects Board
            </h1>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs transition-all"
          />
          </div>
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
              <h3 className="text-lg font-bold text-slate-700 mb-2">No project statuses found</h3>
              <p className="text-slate-500 max-w-md">Configure project statuses in Master Data first.</p>
            </div>
          ) : (
            <div className="flex gap-4 pb-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
              {statuses.map(status => {
                const color = getStatusColor(status.name);
                const columnProjects = filtered.filter(p => p.projectStatusId === status.id);

                return (
                  <div
                    key={status.id}
                    className={`flex-1 min-w-[200px] flex flex-col transition-all duration-200 ${dragOverStatusId === status.id ? 'scale-[1.01]' : ''}`}
                    onDragOver={(e) => handleDragOver(e, status.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, status.id)}
                  >
                    {/* Column header */}
                    <div className={`bg-gradient-to-r ${color.gradient} rounded-t-xl px-3 py-2 shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-xs tracking-wide truncate">{status.name}</h3>
                        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex-shrink-0">
                          {columnProjects.length}
                        </span>
                      </div>
                    </div>

                    {/* Column body */}
                    <div className={`flex-1 ${color.bg} ${color.border} border border-t-0 rounded-b-xl p-2 space-y-2 overflow-y-auto transition-all duration-200 ${dragOverStatusId === status.id ? 'ring-1 ring-blue-400 ring-inset bg-blue-50/50' : ''}`}>
                      {columnProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center mb-2`}>
                            <Briefcase className="w-5 h-5 text-slate-300" />
                          </div>
                          <p className="text-xs text-slate-400 font-medium">No projects</p>
                        </div>
                      ) : (
                        columnProjects.map(project => (
                          <div
                            key={project.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, project)}
                            onDragEnd={handleDragEnd}
                            className={`group bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden ${draggedProjectId === project.id ? 'opacity-50 scale-95' : ''}`}
                          >
                            {/* Card body - clickable */}
                            <div
                              onClick={() => router.push(`/projects/${project.id}`)}
                              className="p-2.5"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                  {project.projectCode}
                                </span>
                                <div className="flex items-center text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded gap-1">
                                  <Map className="w-2.5 h-2.5" />
                                  {getTourCount(project)} Tours
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                  {getClientName(project).charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-xs text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                                    {getClientName(project)}
                                  </h4>
                                  {project.description && (
                                    <p className="text-[9px] text-slate-400 truncate">{project.description}</p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1 border-t border-slate-100 pt-2">
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <CalendarDays className="w-3 h-3 text-slate-400" />
                                  <span>
                                    {project.startDate ? new Date(project.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                                    {' → '}
                                    {project.endDate ? new Date(project.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <DollarSign className="w-3 h-3 text-slate-400" />
                                  <span className="font-semibold text-emerald-600">
                                    €{Number(project.approxBudget || 0).toLocaleString()}
                                  </span>
                                  <span className="text-slate-400">budget</span>
                                </div>
                              </div>
                            </div>

                            {/* Move action */}
                            <div className="relative border-t border-slate-100 px-2.5 py-1.5" ref={moveDropdownOpen === project.id ? moveRef : undefined}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMoveDropdownOpen(moveDropdownOpen === project.id ? null : project.id);
                                }}
                                className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 transition-colors w-full"
                              >
                                <ArrowRight className="w-2.5 h-2.5" />
                                Move to…
                                <ChevronDown className="w-2.5 h-2.5 ml-auto" />
                              </button>

                              {moveDropdownOpen === project.id && (
                                <div className="absolute left-0 right-0 bottom-full mb-1 bg-white rounded-lg shadow-xl border border-slate-200 z-30 py-1 mx-2">
                                  {statuses.filter(s => s.id !== project.projectStatusId).map(s => {
                                    const sc = getStatusColor(s.name);
                                    return (
                                      <button
                                        key={s.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveToStatus(project, s.id);
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

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Code</label>
                <input
                  required
                  type="text"
                  value={newProject.projectCode}
                  onChange={e => setNewProject({ ...newProject, projectCode: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="e.g. PRJ-2025-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Client</label>
                <select
                  required
                  value={newProject.clientId || ''}
                  onChange={e => setNewProject({ ...newProject, clientId: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                >
                  <option value="" disabled>Select a client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}{c.location ? ` — ${c.location}` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="e.g. Summer group tour program"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                  <input
                    required
                    type="date"
                    value={newProject.startDate}
                    onChange={e => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                  <input
                    required
                    type="date"
                    value={newProject.endDate}
                    onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Approximate Budget (€)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="100"
                  value={newProject.approxBudget}
                  onChange={e => setNewProject({ ...newProject, approxBudget: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="e.g. 50000"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-60"
                >
                  {saving ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

