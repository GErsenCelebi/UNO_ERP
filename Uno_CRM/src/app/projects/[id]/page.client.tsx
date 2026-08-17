"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Edit, Briefcase, LayoutDashboard, Users, LineChart, Plus, X, MapPin, CalendarDays, Users as UsersIcon, DollarSign, Save, PlaneLanding, PlaneTakeoff, History } from 'lucide-react';
import AuditHistoryTab from '@/components/AuditHistoryTab';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API = '/api';

interface Client { id: number; name: string; location?: string; avatarUrl?: string; }
interface TourStatus { id: number; name: string; orderIndex: number; }
interface Tour {
  id: number;
  tourCode: string;
  destination: string;
  arrivalDate: string;
  endDate: string;
  pax: number;
  adults?: number;
  children?: number;
  infants?: number;
  baseFee?: number;
  totalFee?: number;
  tourStatusId: number;
  projectId: number;
  arrivalFlight?: string;
  departureFlight?: string;
  [key: string]: any;
}
interface Project {
  id: number;
  projectCode: string;
  clientId: number;
  client?: Client;
  startDate: string;
  endDate: string;
  description?: string;
  approxBudget: number;
  [key: string]: any;
}

/* ──── Tour Card (Sortable) ──── */
function SortableTourCard({ id, tour, projectId }: { id: string; tour: Tour; projectId: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data: tour });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => window.location.href = `/projects/${projectId}/tours/${tour.id}`}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer mb-3 hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{tour.tourCode}</span>
        <div className="flex items-center text-slate-500 text-xs font-medium">
          <UsersIcon className="w-3 h-3 mr-1" /> {tour.pax} Pax
        </div>
      </div>
      <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center">
        <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-400" /> {tour.destination}
      </h4>
      <p className="text-xs text-slate-500 mb-3">
        {new Date(tour.arrivalDate).toLocaleDateString()} — {new Date(tour.endDate).toLocaleDateString()}
      </p>
      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <div className="flex items-center text-xs text-slate-600">
          <PlaneLanding className="w-3.5 h-3.5 mr-2 text-indigo-400" />
          <span className="truncate">{tour.arrivalFlight || 'TBD'}</span>
        </div>
        <div className="flex items-center text-xs text-slate-600">
          <PlaneTakeoff className="w-3.5 h-3.5 mr-2 text-indigo-400" />
          <span className="truncate">{tour.departureFlight || 'TBD'}</span>
        </div>
      </div>
    </div>
  );
}

/* ──── Droppable Column for Kanban ──── */
function DroppableColumn({ status, tours, projectId }: { status: TourStatus; tours: Tour[]; projectId: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status.id}` });
  return (
    <div className={`kanban-column flex flex-col rounded-2xl w-80 shrink-0 border overflow-hidden h-full transition-colors ${isOver ? 'border-blue-400 bg-blue-50/60' : 'bg-slate-100/50 border-slate-200'}`}>
      <div className="p-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center sticky top-0 z-10">
        <h3 className="font-bold text-slate-700">{status.name}</h3>
        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{tours.length}</span>
      </div>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-3 min-h-[80px]">
        <SortableContext id={`col-${status.id}`} items={tours.map(t => t.id.toString())} strategy={verticalListSortingStrategy}>
          {tours.map(t => <SortableTourCard key={t.id} id={t.id.toString()} tour={t} projectId={projectId} />)}
        </SortableContext>
      </div>
    </div>
  );
}

/* ──── Main Page ──── */
export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();

  let projectId = params?.id as string;
  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const projIdx = parts.indexOf('projects');
    if (projIdx !== -1 && parts[projIdx + 1] && parts[projIdx + 1] !== 'tours') {
      projectId = parts[projIdx + 1];
    }
  }

  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tours Kanban
  const [tours, setTours] = useState<Tour[]>([]);
  const [tourStatuses, setTourStatuses] = useState<TourStatus[]>([]);
  const [activeTour, setActiveTour] = useState<Tour | null>(null);

  // Edit project
  const [editData, setEditData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // New tour modal
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [newTour, setNewTour] = useState({ tourCode: '', destination: '', arrivalDate: '', endDate: '', adults: 1, children: 0, infants: 0, baseFee: 0, tourStatusId: 1, arrivalFlight: '', departureFlight: '' });

  // Tour services and bookings for finance/dashboard
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) fetchAll();
  }, [projectId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [projRes, clientRes, tourRes, statusRes, guideRes, catRes] = await Promise.all([
        fetch(`${API}/projects/${projectId}`),
        fetch(`${API}/clients`).catch(() => null),
        fetch(`${API}/tours?projectId=${projectId}`).catch(() => null),
        fetch(`${API}/tourstatuses`).catch(() => null),
        fetch(`${API}/guides`).catch(() => null),
        fetch(`${API}/servicecategories`).catch(() => null),
      ]);
      if (projRes.ok) {
        const p = await projRes.json();
        setProject(p);
        setEditData({
          ...p,
          startDate: p.startDate?.split('T')[0] || '',
          endDate: p.endDate?.split('T')[0] || '',
        });
      }
      if (clientRes?.ok) setClients(await clientRes.json());
      if (guideRes?.ok) setGuides(await guideRes.json());
      if (tourRes?.ok) setTours(await tourRes.json());
      if (catRes?.ok) setServiceCategories(await catRes.json());
      if (statusRes?.ok) {
        const s = await statusRes.json();
        setTourStatuses(s.sort((a: any, b: any) => a.orderIndex - b.orderIndex));
        if (s.length > 0 && newTour.tourStatusId === 1) {
          setNewTour(prev => ({ ...prev, tourStatusId: s[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tour services and bookings for finance/dashboard
  const fetchAllServices = async () => {
    try {
      // Find the 'Cancelled' status ID to exclude those tours
      const cancelledStatus = tourStatuses.find(s => s.name.toLowerCase() === 'cancelled');
      const activeTours = cancelledStatus
        ? tours.filter(t => t.tourStatusId !== cancelledStatus.id)
        : tours;

      const svcResults: any[] = [];
      const bookResults: any[] = [];
      for (const tour of activeTours) {
        const [svcRes, bookRes] = await Promise.all([
          fetch(`${API}/tourservices?tourId=${tour.id}`).catch(() => null),
          fetch(`${API}/bookings?tourId=${tour.id}`).catch(() => null),
        ]);
        if (svcRes?.ok) {
          const services = await svcRes.json();
          svcResults.push(...services.map((s: any) => ({ ...s, tourCode: tour.tourCode })));
        }
        if (bookRes?.ok) {
          const bookings = await bookRes.json();
          const bookArray = Array.isArray(bookings) ? bookings : bookings.value || bookings.$values || [];
          bookResults.push(...bookArray.map((b: any) => ({ ...b, tourCode: tour.tourCode })));
        }
      }
      setAllServices(svcResults);
      setAllBookings(bookResults);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if ((activeTab === 'finance' || activeTab === 'dashboard') && tours.length > 0) fetchAllServices();
  }, [activeTab, tours, tourStatuses]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { client, tours: _tours, ...cleanData } = editData;
      const res = await fetch(`${API}/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });
      if (res.ok) { setIsEditing(false); fetchAll(); }
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTour, pax: (newTour.adults || 0) + (newTour.children || 0) + (newTour.infants || 0), totalFee: ((newTour.adults || 0) * (newTour.baseFee || 0)) + ((newTour.children || 0) * (newTour.baseFee || 0) * 0.5), projectId: parseInt(projectId) }),
      });
      if (res.ok) {
        setIsTourModalOpen(false);
        setNewTour({ tourCode: '', destination: '', arrivalDate: '', endDate: '', adults: 1, children: 0, infants: 0, baseFee: 0, tourStatusId: tourStatuses[0]?.id || 1, arrivalFlight: '', departureFlight: '' });
        fetchAll();
      }
    } catch (err) { console.error(err); }
  };

  // DnD for Tours Kanban
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: any) => {
    setActiveTour(tours.find(t => t.id.toString() === event.active.id) || null);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveTour(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTourObj = tours.find(t => t.id.toString() === activeId);
    if (!activeTourObj) return;

    let destStatusId: number | null = null;
    if (overId.startsWith('col-')) {
      destStatusId = parseInt(overId.replace('col-', ''));
    } else {
      const overTour = tours.find(t => t.id.toString() === overId);
      destStatusId = overTour ? overTour.tourStatusId : null;
    }
    if (!destStatusId || activeTourObj.tourStatusId === destStatusId) return;

    // Optimistic update
    setTours(prev => prev.map(t => t.id === activeTourObj.id ? { ...t, tourStatusId: destStatusId! } : t));

    try {
      const { tourServices, bookings, passengers, tourStatus, project: _proj, ...cleanTour } = activeTourObj as any;
      const res = await fetch(`${API}/tours/${activeTourObj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cleanTour, tourStatusId: destStatusId }),
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      console.error(err);
      fetchAll();
    }
  };

  const getClientName = () => project?.client?.name || clients.find(c => c.id === project?.clientId)?.name || 'Unknown';

  const getServiceClassification = (svc: any) => {
    const cat = svc.serviceCategory || serviceCategories.find(c => c.id === svc.serviceCategoryId);
    const catName = (cat?.name || '').toLowerCase();
    if (catName.includes('excursion') || catName.includes('balloon') || catName.includes('extra')) return 'Extra';
    return cat?.classification || 'Standard';
  };

  const getServiceCategoryName = (svc: any) => {
    const cat = svc.serviceCategory || serviceCategories.find(c => c.id === svc.serviceCategoryId);
    return cat?.name || svc.categoryName || '-';
  };

  const standardAllServices = allServices.filter(s => {
      const cls = getServiceClassification(s);
      return s.isRevenue === false || (s.isRevenue == null && (cls === 'Standard' || cls === 'Other'));
  });
  
  const extraAllServices = allServices.filter(s => {
      const cls = getServiceClassification(s);
      return s.isRevenue === true || (s.isRevenue == null && cls === 'Extra');
  });
  
  const totalServiceCost = standardAllServices.reduce((s, svc) => s + (svc.totalAmount || svc.unitPrice * (svc.quantity || 1) || 0), 0);
  const totalSales = extraAllServices.reduce((s, svc) => s + (svc.totalAmount || svc.unitPrice * (svc.quantity || 1) || 0), 0);
  const totalRevenue = totalSales; // Flat model for now
  
  const totalPax = tours.reduce((s, t) => s + (t.pax || 0), 0);
  const costPerPax = totalPax > 0 ? Math.round(totalServiceCost / totalPax) : 0;
  const salesPerPax = totalPax > 0 ? Math.round(totalSales / totalPax) : 0;

  const tabBtn = (tab: string, label: string, Icon: any) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
        activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" /> {label}
    </button>
  );

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!project) return <div className="p-8 text-center text-slate-500">Project not found</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 w-full">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 shadow-sm z-10">
        <button onClick={() => router.push('/projects')} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {project.client?.avatarUrl && (
              <img src={`/${project.client.avatarUrl}`} alt="Client Logo" className="w-8 h-8 rounded-full object-cover border border-slate-200" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            <h1 className="font-bold text-lg text-slate-800">{project.projectCode}</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {getClientName()} | {new Date(project.startDate).toLocaleDateString()} → {new Date(project.endDate).toLocaleDateString()} | Est. Budget: €{Number(project.approxBudget || 0).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{tours.length} Tours</span>
          {totalServiceCost > 0 && (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">Cost: €{totalServiceCost.toLocaleString()}</span>
          )}
          {totalRevenue > 0 && (
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">Revenue: €{totalRevenue.toLocaleString()}</span>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6">
        {tabBtn('overview', 'Overview', Briefcase)}
        {tabBtn('tours', 'Tours', MapPin)}
        {tabBtn('dashboard', 'Dashboard', LayoutDashboard)}
        {tabBtn('finance', 'Finance', LineChart)}
        {tabBtn('history', 'Audit History', History)}
      </div>

      <div className="flex-1 overflow-auto">

        {/* ──── OVERVIEW TAB ──── */}
        {activeTab === 'overview' && (
          <div className="p-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Project Information</h2>
                  <p className="text-sm text-slate-500 mt-1">View and edit project details</p>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors gap-1.5">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              {isEditing && editData ? (
                <form onSubmit={handleUpdateProject} className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Code</label>
                      <input required type="text" value={editData.projectCode} onChange={e => setEditData({ ...editData, projectCode: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Client</label>
                      <select value={editData.clientId} onChange={e => setEditData({ ...editData, clientId: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <input type="text" value={editData.description || ''} onChange={e => setEditData({ ...editData, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                      <input required type="date" value={editData.startDate} onChange={e => setEditData({ ...editData, startDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                      <input required type="date" value={editData.endDate} onChange={e => setEditData({ ...editData, endDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimated Budget (€)</label>
                      <input required type="number" min="0" step="100" value={editData.approxBudget} onChange={e => setEditData({ ...editData, approxBudget: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl">Cancel</button>
                    <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-60">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Project Code</p>
                      <p className="text-sm font-bold text-slate-800">{project.projectCode}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Client</p>
                      <div className="flex items-center gap-2">
                        {project.client?.avatarUrl && (
                          <img src={`/${project.client.avatarUrl}`} alt="Client Logo" className="w-5 h-5 rounded-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        )}
                        <p className="text-sm font-bold text-slate-800">{getClientName()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Start Date</p>
                      <p className="text-sm text-slate-700">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">End Date</p>
                      <p className="text-sm text-slate-700">{new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Estimated Budget</p>
                      <p className="text-sm font-bold text-emerald-600">€{Number(project.approxBudget || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Tours</p>
                      <p className="text-sm font-bold text-blue-600">{tours.length} tours</p>
                    </div>
                  </div>
                  {project.description && (
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Description</p>
                      <p className="text-sm text-slate-700">{project.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──── TOURS KANBAN TAB ──── */}
        {activeTab === 'tours' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-8 pt-6 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Tour Pipeline</h2>
                <p className="text-sm text-slate-500 mt-0.5">Drag tours between columns to update their status</p>
              </div>
              <button
                onClick={() => setIsTourModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> New Tour
              </button>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8">
              <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex space-x-6 h-full items-start">
                  {tourStatuses.map(status => (
                    <DroppableColumn
                      key={status.id}
                      status={status}
                      tours={tours.filter(t => t.tourStatusId === status.id)}
                      projectId={parseInt(projectId)}
                    />
                  ))}
                </div>
                <DragOverlay>
                  {activeTour ? (
                    <div className="opacity-90 rotate-2 scale-105 shadow-xl">
                      <SortableTourCard id={activeTour.id.toString()} tour={activeTour} projectId={parseInt(projectId)} />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        )}

        {/* ──── DASHBOARD TAB ──── */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Tours', value: tours.length, icon: MapPin, color: 'blue' },
                { label: 'Total Pax', value: totalPax, icon: UsersIcon, color: 'purple' },
                { label: 'Total Expense', value: `€${totalServiceCost.toLocaleString()}`, icon: LineChart, color: 'amber' },
                { label: 'Cost / Pax', value: `€${costPerPax.toLocaleString()}`, icon: UsersIcon, color: 'rose' },
                { label: 'Actual Revenue', value: `€${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'sky' },
                { label: 'Sale / Pax', value: `€${salesPerPax.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center mb-3`}>
                    <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{kpi.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</h3>
                </div>
              ))}
            </div>

            {/* Estimated Total Revenue */}
            {project.approxBudget > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-700 mb-4">Estimated Total Revenue Progress</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">€{totalRevenue.toLocaleString()} of €{Number(project.approxBudget).toLocaleString()}</span>
                  <span className="font-bold text-slate-700">{Math.min(100, Math.round((totalRevenue / project.approxBudget) * 100))}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all bg-sky-500"
                    style={{ width: `${Math.min(100, (totalRevenue / project.approxBudget) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tours Status Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-700 mb-4">Tour Status Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tourStatuses.map(status => {
                  const count = tours.filter(t => t.tourStatusId === status.id).length;
                  return (
                    <div key={status.id} className="bg-slate-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-slate-800">{count}</p>
                      <p className="text-sm text-slate-500 mt-1">{status.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ──── FINANCE TAB ──── */}
        {activeTab === 'finance' && (
          <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 font-medium mb-1">Estimated Budget</p>
                <h3 className="text-2xl font-bold text-blue-600">€{Number(project.approxBudget || 0).toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 font-medium mb-1">Total Service Cost</p>
                <h3 className="text-2xl font-bold text-red-600">€{totalServiceCost.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 font-medium mb-1">Remaining</p>
                <h3 className={`text-2xl font-bold ${(project.approxBudget || 0) - totalServiceCost >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  €{((project.approxBudget || 0) - totalServiceCost).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Financial Performance by Tour</h3>
                <p className="text-sm text-slate-400">Monitor costs, revenues, and profit margins</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Tour Code</th>
                      <th className="px-6 py-3">Guide Name</th>
                      <th className="px-6 py-3">Dates</th>
                      <th className="px-6 py-3">Pax</th>
                      <th className="px-6 py-3">Days</th>
                      <th className="px-6 py-3">Total Cost</th>
                      <th className="px-6 py-3">Total Sales (Extra)</th>
                      <th className="px-6 py-3">Total Revenue</th>
                      <th className="px-6 py-3">Profit (+/-)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tours.map(tour => {
                      const tourServices = allServices.filter(s => s.tourId === tour.id);
                      const standardSvcs = tourServices.filter(s => 
                         s.isRevenue === false || 
                         (s.isRevenue == null && (getServiceClassification(s) === 'Standard' || getServiceClassification(s) === 'Other'))
                      );
                      const extraSvcs = tourServices.filter(s => 
                         s.isRevenue === true || 
                         (s.isRevenue == null && getServiceClassification(s) === 'Extra')
                      );
                      
                      const cost = standardSvcs.reduce((sum, s) => sum + (s.totalAmount || (s.unitPrice * (s.quantity || 1)) || 0), 0);
                      const sales = extraSvcs.reduce((sum, s) => sum + (s.totalAmount || (s.unitPrice * (s.quantity || 1)) || 0), 0);
                      const revenue = sales; // Flat model for now
                      const profit = revenue - cost;
                      
                      // Find guide name(s) from services (any service with guideId)
                      const guideSvcs = tourServices.filter(s => s.guideId != null);
                      const guideNames = Array.from(new Set(guideSvcs.map(s => guides.find(g => g.id === s.guideId)?.name).filter(Boolean)));
                      const guideName = guideNames.length > 0 ? guideNames.join(', ') : '-';
                      
                      const startDate = new Date(tour.arrivalDate);
                      const endDate = new Date(tour.endDate);
                      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));

                      return (
                        <tr key={tour.id} className="hover:bg-slate-50">
                          <td className="px-6 py-3"><a href={`/projects/${projectId}/tours/${tour.id}`} className="font-medium text-blue-600 hover:underline">{tour.tourCode}</a></td>
                          <td className="px-6 py-3 text-slate-600">{guideName}</td>
                          <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</td>
                          <td className="px-6 py-3 text-slate-600">{tour.pax}</td>
                          <td className="px-6 py-3 text-slate-600">{days}</td>
                          <td className="px-6 py-3 font-medium text-amber-600">€{cost.toLocaleString()}</td>
                          <td className="px-6 py-3 font-medium text-blue-600">€{sales.toLocaleString()}</td>
                          <td className="px-6 py-3 font-medium text-sky-600">€{revenue.toLocaleString()}</td>
                          <td className={`px-6 py-3 font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            €{Math.abs(profit).toLocaleString()} {profit >= 0 ? '(+)' : '(-)'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">All Tour Services</h3>
                <p className="text-sm text-slate-400">Aggregated services across all tours</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Tour</th>
                      <th className="px-6 py-3">Service</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Unit Price</th>
                      <th className="px-6 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allServices.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No services recorded yet across tours.</td></tr>
                    ) : [...allServices].sort((a, b) => {
                      const isRevA = a.isRevenue === true || (a.isRevenue == null && getServiceClassification(a) === 'Extra');
                      const isRevB = b.isRevenue === true || (b.isRevenue == null && getServiceClassification(b) === 'Extra');
                      return (isRevA === isRevB) ? 0 : isRevA ? -1 : 1;
                    }).map((svc, i) => {
                      const cls = getServiceClassification(svc);
                      const isRev = svc.isRevenue === true || (svc.isRevenue == null && cls === 'Extra');
                      const colorClass = isRev ? 'text-emerald-600' : 'text-red-600';
                      const badgeClass = isRev ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700';

                      return (
                        <tr key={svc.id || i} className={`hover:bg-slate-50 ${colorClass}`}>
                          <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeClass}`}>{svc.tourCode}</span></td>
                          <td className="px-6 py-3 font-medium">{svc.description || svc.serviceName || '-'}</td>
                          <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded text-xs ${badgeClass}`}>{getServiceCategoryName(svc)}</span></td>
                          <td className="px-6 py-3">{svc.quantity || 1}</td>
                          <td className="px-6 py-3">€{Number(svc.unitPrice || 0).toFixed(2)}</td>
                          <td className="px-6 py-3 font-bold">
                            {isRev ? '+' : '-'}€{Number(svc.totalAmount || svc.unitPrice * (svc.quantity || 1) || 0).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ──── AUDIT HISTORY TAB ──── */}
        {activeTab === 'history' && (
          <div className="p-6 max-w-4xl mx-auto">
            <AuditHistoryTab entityName="Project" entityId={project.id} />
          </div>
        )}
      </div>

      {/* ──── NEW TOUR MODAL ──── */}
      {isTourModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Create New Tour</h2>
              <button onClick={() => setIsTourModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTour} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tour Code</label>
                  <input required type="text" value={newTour.tourCode} onChange={e => setNewTour({ ...newTour, tourCode: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. TR-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Destination</label>
                  <input required type="text" value={newTour.destination} onChange={e => setNewTour({ ...newTour, destination: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Istanbul" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Arrival Date</label>
                  <input required type="date" value={newTour.arrivalDate} onChange={e => setNewTour({ ...newTour, arrivalDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                  <input required type="date" value={newTour.endDate} onChange={e => setNewTour({ ...newTour, endDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Adults</label>
                  <input required type="number" min="1" value={newTour.adults === ('' as any) ? '' : newTour.adults} onChange={e => setNewTour({ ...newTour, adults: e.target.value === '' ? ('' as any) : parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Children</label>
                  <input required type="number" min="0" value={newTour.children === ('' as any) ? '' : newTour.children} onChange={e => setNewTour({ ...newTour, children: e.target.value === '' ? ('' as any) : parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Infants</label>
                  <input required type="number" min="0" value={newTour.infants === ('' as any) ? '' : newTour.infants} onChange={e => setNewTour({ ...newTour, infants: e.target.value === '' ? ('' as any) : parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Fee (€)</label>
                  <input required type="number" min="0" value={newTour.baseFee === ('' as any) ? '' : newTour.baseFee} onChange={e => setNewTour({ ...newTour, baseFee: e.target.value === '' ? ('' as any) : parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
              </div>
              
              {newTour.baseFee > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center text-sm">
                  <span className="font-semibold text-emerald-800">Dynamic Total (Adults + 50% Children)</span>
                  <span className="font-bold text-emerald-900 text-lg">€{(((newTour.adults || 0) * (newTour.baseFee || 0)) + ((newTour.children || 0) * (newTour.baseFee || 0) * 0.5)).toLocaleString()}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Arrival Flight</label>
                  <input type="text" placeholder="e.g. TK 1234 10:30" value={newTour.arrivalFlight} onChange={e => setNewTour({ ...newTour, arrivalFlight: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Departure Flight</label>
                  <input type="text" placeholder="e.g. TK 1235 15:45" value={newTour.departureFlight} onChange={e => setNewTour({ ...newTour, departureFlight: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              {tourStatuses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Status</label>
                  <select value={newTour.tourStatusId} onChange={e => setNewTour({ ...newTour, tourStatusId: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                    {tourStatuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              <div className="pt-2 flex space-x-3">
                <button type="button" onClick={() => setIsTourModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm">Create Tour</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



