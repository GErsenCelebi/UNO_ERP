"use client"
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Edit, MapPin, CalendarDays, Users, Plus, X, Trash2, PlaneLanding, PlaneTakeoff, Hotel, Car, PersonStanding, Compass, Plane, Save, Package } from 'lucide-react';

const API = '/api';

interface Tour {
  id: number;
  tourCode: string;
  destination: string;
  arrivalDate: string;
  endDate: string;
  pax: number;
  tourStatusId: number;
  projectId: number;
  arrivalFlight?: string;
  departureFlight?: string;
  tourStatus?: { name: string };
  [key: string]: any;
}

interface ServiceCategory {
  id: number;
  name: string;
}

interface TourService {
  id: number;
  tourId: number;
  serviceCategoryId: number;
  serviceCategory?: ServiceCategory;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  hotelId?: number | null;
  driverId?: number | null;
  guideId?: number | null;
  excursionId?: number | null;
  transportCompanyId?: number | null;
  roomType?: string | null;
  roomCount?: number | null;
  [key: string]: any;
}

const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Twin', 'Suite'];
const STANDARD_CATEGORIES = ['Hotel', 'Flight', 'Transport', 'Guide', 'Driver'];
const EXTRA_CATEGORIES = ['Excursion'];

function TourDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("projectId") ?? "";
  const tourId = searchParams.get("tourId") ?? "";

  const [activeTab, setActiveTab] = useState('info');
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit tour
  const [editData, setEditData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Services
  const [services, setServices] = useState<TourService[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);

  // Master data
  const [hotels, setHotels] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [excursions, setExcursions] = useState<any[]>([]);
  const [transportCompanies, setTransportCompanies] = useState<any[]>([]);
  const [tourStatuses, setTourStatuses] = useState<any[]>([]);

  // Add service modal
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState('Hotel');
  const [newService, setNewService] = useState<any>({
    description: '', quantity: 1, unitPrice: 0, serviceCategoryId: 0,
    hotelId: null, driverId: null, guideId: null, excursionId: null, transportCompanyId: null,
    roomType: 'Double', roomCount: 1,
  });

  useEffect(() => {
    if (tourId) fetchAll();
  }, [tourId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tourRes, svcRes, catRes, hotelRes, driverRes, guideRes, excRes, transRes, statusRes] = await Promise.all([
        fetch(`${API}/tours/${tourId}`),
        fetch(`${API}/tourservices?tourId=${tourId}`).catch(() => null),
        fetch(`${API}/servicecategories`).catch(() => null),
        fetch(`${API}/hotels`).catch(() => null),
        fetch(`${API}/drivers`).catch(() => null),
        fetch(`${API}/guides`).catch(() => null),
        fetch(`${API}/excursions`).catch(() => null),
        fetch(`${API}/transportcompanies`).catch(() => null),
        fetch(`${API}/tourstatuses`).catch(() => null),
      ]);

      if (tourRes.ok) {
        const t = await tourRes.json();
        setTour(t);
        setEditData({
          ...t,
          arrivalDate: t.arrivalDate?.split('T')[0] || '',
          endDate: t.endDate?.split('T')[0] || '',
        });
      }
      if (svcRes?.ok) setServices(await svcRes.json());
      if (catRes?.ok) setServiceCategories(await catRes.json());
      if (hotelRes?.ok) setHotels(await hotelRes.json());
      if (driverRes?.ok) setDrivers(await driverRes.json());
      if (guideRes?.ok) setGuides(await guideRes.json());
      if (excRes?.ok) setExcursions(await excRes.json());
      if (transRes?.ok) setTransportCompanies(await transRes.json());
      if (statusRes?.ok) {
        const s = await statusRes.json();
        setTourStatuses(s.sort((a: any, b: any) => a.orderIndex - b.orderIndex));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpdateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { tourStatus, project, ...cleanData } = editData;
      const res = await fetch(`${API}/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });
      if (res.ok) { setIsEditing(false); fetchAll(); }
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const getCategoryId = (name: string): number => {
    const cat = serviceCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return cat?.id || 0;
  };

  const openServiceModal = (type: string) => {
    setServiceType(type);
    setNewService({
      description: '', quantity: 1, unitPrice: 0, serviceCategoryId: getCategoryId(type),
      hotelId: null, driverId: null, guideId: null, excursionId: null, transportCompanyId: null,
      roomType: 'Double', roomCount: 1,
    });
    setIsServiceModalOpen(true);
  };

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        tourId: parseInt(tourId),
        serviceCategoryId: newService.serviceCategoryId || getCategoryId(serviceType),
        description: newService.description,
        quantity: newService.quantity,
        unitPrice: newService.unitPrice,
        totalAmount: 0,
      };
      // Include entity references
      if (newService.hotelId) { payload.hotelId = newService.hotelId; payload.roomType = newService.roomType; payload.roomCount = newService.roomCount; }
      if (newService.driverId) payload.driverId = newService.driverId;
      if (newService.guideId) payload.guideId = newService.guideId;
      if (newService.excursionId) payload.excursionId = newService.excursionId;
      if (newService.transportCompanyId) payload.transportCompanyId = newService.transportCompanyId;

      // If editing, use PUT
      if (editingServiceId) {
        payload.id = editingServiceId;
        const res = await fetch(`${API}/tourservices/${editingServiceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsServiceModalOpen(false);
          setEditingServiceId(null);
          const svcRes = await fetch(`${API}/tourservices?tourId=${tourId}`);
          if (svcRes.ok) setServices(await svcRes.json());
        } else {
          const err = await res.text();
          alert(`Failed: ${err}`);
        }
      } else {
        const res = await fetch(`${API}/tourservices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsServiceModalOpen(false);
          const svcRes = await fetch(`${API}/tourservices?tourId=${tourId}`);
          if (svcRes.ok) setServices(await svcRes.json());
        } else {
          const err = await res.text();
          alert(`Failed: ${err}`);
        }
      }
    } catch (err) { console.error(err); }
  };

  const openEditServiceModal = (svc: TourService) => {
    const catName = getCategoryName(svc);
    setServiceType(catName);
    setEditingServiceId(svc.id);
    setNewService({
      description: svc.description || '',
      quantity: svc.quantity,
      unitPrice: svc.unitPrice,
      serviceCategoryId: svc.serviceCategoryId,
      hotelId: svc.hotelId || null,
      driverId: svc.driverId || null,
      guideId: svc.guideId || null,
      excursionId: svc.excursionId || null,
      transportCompanyId: svc.transportCompanyId || null,
      roomType: svc.roomType || 'Double',
      roomCount: svc.roomCount || 1,
    });
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`${API}/tourservices/${id}`, { method: 'DELETE' });
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  const getCategoryName = (svc: TourService): string => svc.serviceCategory?.name || serviceCategories.find(c => c.id === svc.serviceCategoryId)?.name || 'Other';

  const standardServices = services.filter(s => STANDARD_CATEGORIES.includes(getCategoryName(s)));
  const extraServices = services.filter(s => !STANDARD_CATEGORIES.includes(getCategoryName(s)));

  const totalServiceCost = services.reduce((s, svc) => s + (svc.totalAmount || svc.unitPrice * (svc.quantity || 1) * (svc.roomCount || 1) || 0), 0);
  const costPerPax = tour ? Math.round(totalServiceCost / Math.max(tour.pax || 1, 1)) : 0;

  const tabBtn = (tab: string, label: string, Icon: any) => (
    <button onClick={() => setActiveTab(tab)} className={`flex items-center px-5 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
      <Icon className="w-4 h-4 mr-2" /> {label}
    </button>
  );

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!tour) return <div className="p-8 text-center text-slate-500">Tour not found</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 w-full">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 shadow-sm z-10">
        <button onClick={() => router.push(`/project-details?id=${projectId}`)} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-slate-800">{tour.tourCode} — {tour.destination}</h1>
          <p className="text-xs text-slate-500">
            {new Date(tour.arrivalDate).toLocaleDateString()} → {new Date(tour.endDate).toLocaleDateString()} | {tour.pax} Pax | {tour.tourStatus?.name || ''}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
            Total Expense: €{totalServiceCost.toLocaleString()}
          </span>
          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-semibold">
            Cost/Pax: €{costPerPax.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6">
        {tabBtn('info', 'Tour Info', MapPin)}
        {tabBtn('services', 'Services', Package)}
        {tabBtn('bookings', 'Bookings', Users)}
      </div>

      <div className="flex-1 overflow-auto">

        {/* ──── TOUR INFO TAB ──── */}
        {activeTab === 'info' && (
          <div className="p-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Tour Information</h2>
                  <p className="text-sm text-slate-500 mt-1">View and edit tour details</p>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors gap-1.5">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              {isEditing && editData ? (
                <form onSubmit={handleUpdateTour} className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tour Code</label>
                      <input required type="text" value={editData.tourCode} onChange={e => setEditData({ ...editData, tourCode: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Destination</label>
                      <input required type="text" value={editData.destination} onChange={e => setEditData({ ...editData, destination: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Arrival Date</label>
                      <input required type="date" value={editData.arrivalDate} onChange={e => setEditData({ ...editData, arrivalDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                      <input required type="date" value={editData.endDate} onChange={e => setEditData({ ...editData, endDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pax</label>
                      <input required type="number" min="1" value={editData.pax} onChange={e => setEditData({ ...editData, pax: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Arrival Flight</label>
                      <input type="text" value={editData.arrivalFlight || ''} onChange={e => setEditData({ ...editData, arrivalFlight: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. TK 1234 10:30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Departure Flight</label>
                      <input type="text" value={editData.departureFlight || ''} onChange={e => setEditData({ ...editData, departureFlight: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. TK 1235 15:45" />
                    </div>
                  </div>
                  {tourStatuses.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                      <select value={editData.tourStatusId} onChange={e => setEditData({ ...editData, tourStatusId: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                        {tourStatuses.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
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
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Tour Code</p>
                      <p className="text-sm font-bold text-slate-800">{tour.tourCode}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Destination</p>
                      <p className="text-sm font-bold text-slate-800 flex items-center"><MapPin className="w-4 h-4 mr-1 text-indigo-400" /> {tour.destination}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Arrival Date</p>
                      <p className="text-sm text-slate-700">{new Date(tour.arrivalDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">End Date</p>
                      <p className="text-sm text-slate-700">{new Date(tour.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Pax</p>
                      <p className="text-sm font-bold text-blue-600">{tour.pax}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Status</p>
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">{tour.tourStatus?.name || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <PlaneLanding className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="font-medium mr-2">Arrival:</span> {tour.arrivalFlight || 'TBD'}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <PlaneTakeoff className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="font-medium mr-2">Departure:</span> {tour.departureFlight || 'TBD'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──── SERVICES TAB ──── */}
        {activeTab === 'services' && (
          <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Standard Services */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Standard Services</h3>
                  <p className="text-sm text-slate-400">Hotel, Flight, Transport, Guide, Driver</p>
                </div>
                <div className="flex gap-2">
                  {STANDARD_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => openServiceModal(cat)} className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                      <Plus className="w-3 h-3" /> {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Room</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Unit Price</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {standardServices.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No standard services yet. Add Hotel, Flight, Transport, Guide, or Driver above.</td></tr>
                    ) : standardServices.map(svc => (
                      <tr key={svc.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{getCategoryName(svc)}</span></td>
                        <td className="px-6 py-3 font-medium text-slate-700">{svc.description || '-'}</td>
                        <td className="px-6 py-3 text-slate-500">{svc.roomType ? `${svc.roomType} ×${svc.roomCount || 1}` : '-'}</td>
                        <td className="px-6 py-3 text-slate-500">{svc.quantity} {getCategoryName(svc) === 'Hotel' ? 'nights' : ''}</td>

                        <td className="px-6 py-3">€{Number(svc.unitPrice).toFixed(2)}</td>
                        <td className="px-6 py-3 font-semibold text-slate-800">€{Number(svc.totalAmount || svc.unitPrice * svc.quantity * (svc.roomCount || 1)).toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => openEditServiceModal(svc)} className="text-slate-400 hover:text-blue-500 transition-colors mr-2"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteService(svc.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Extra Services */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Extra Services</h3>
                  <p className="text-sm text-slate-400">Excursions, add-ons, and extras</p>
                </div>
                <button onClick={() => openServiceModal('Excursion')} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors gap-1">
                  <Plus className="w-4 h-4" /> Add Excursion
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Unit Price</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {extraServices.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No extra services yet. Add excursions or extras above.</td></tr>
                    ) : extraServices.map(svc => (
                      <tr key={svc.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">{getCategoryName(svc)}</span></td>
                        <td className="px-6 py-3 font-medium text-slate-700">{svc.description || '-'}</td>
                        <td className="px-6 py-3">{svc.quantity}</td>
                        <td className="px-6 py-3">€{Number(svc.unitPrice).toFixed(2)}</td>
                        <td className="px-6 py-3 font-semibold text-slate-800">€{Number(svc.totalAmount || svc.unitPrice * svc.quantity).toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => openEditServiceModal(svc)} className="text-slate-400 hover:text-blue-500 transition-colors mr-2"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteService(svc.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Services Total */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Service Cost</p>
                <h3 className="text-3xl font-bold mt-1">€{totalServiceCost.toLocaleString()}</h3>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">{services.length} services</p>
                <p className="text-blue-100 text-sm">{standardServices.length} standard + {extraServices.length} extras</p>
              </div>
            </div>
          </div>
        )}

        {/* ──── BOOKINGS TAB ──── */}
        {activeTab === 'bookings' && (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Tour Bookings</h3>
              <p className="text-slate-500">Bookings module for this tour coming soon...</p>
              <p className="text-xs text-slate-400 mt-2">Tour ID: {tourId}</p>
            </div>
          </div>
        )}
      </div>

      {/* ──── ADD SERVICE MODAL ──── */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800">{editingServiceId ? 'Edit' : 'Add'} {serviceType} Service</h2>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddService} className="p-6 space-y-4">

              {/* Hotel */}
              {serviceType === 'Hotel' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Hotel</label>
                    <select required value={newService.hotelId || ''} onChange={e => {
                      const h = hotels.find((x: any) => x.id === parseInt(e.target.value));
                      setNewService({ ...newService, hotelId: h?.id || null, description: h?.name || '', unitPrice: h?.nightlyRate || 0 });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select a Hotel...</option>
                      {hotels.map((h: any) => <option key={h.id} value={h.id}>{h.name} — {h.location} (€{h.nightlyRate}/night)</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Type</label>
                      <select value={newService.roomType} onChange={e => setNewService({ ...newService, roomType: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                        {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Rooms</label>
                      <input required type="number" min="1" value={newService.roomCount} onChange={e => setNewService({ ...newService, roomCount: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nights</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Rate/Night (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  {newService.unitPrice > 0 && newService.roomCount > 0 && (
                    <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700 font-medium">
                      Total: {newService.quantity} nights × €{newService.unitPrice} × {newService.roomCount} rooms = <strong>€{(newService.quantity * newService.unitPrice * newService.roomCount).toLocaleString()}</strong>
                    </div>
                  )}
                </>
              )}

              {/* Driver */}
              {serviceType === 'Driver' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Driver</label>
                    <select required value={newService.driverId || ''} onChange={e => {
                      const d = drivers.find((x: any) => x.id === parseInt(e.target.value));
                      setNewService({ ...newService, driverId: d?.id || null, description: d?.name || '', unitPrice: d?.dailyRate || 0 });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select a Driver...</option>
                      {drivers.map((d: any) => <option key={d.id} value={d.id}>{d.name} (€{d.dailyRate}/day)</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Days</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Daily Rate (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {/* Guide */}
              {serviceType === 'Guide' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Guide</label>
                    <select required value={newService.guideId || ''} onChange={e => {
                      const g = guides.find((x: any) => x.id === parseInt(e.target.value));
                      setNewService({ ...newService, guideId: g?.id || null, description: g?.name || '', unitPrice: g?.dailyRate || 0 });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select a Guide...</option>
                      {guides.map((g: any) => <option key={g.id} value={g.id}>{g.name} — {g.language} (€{g.dailyRate}/day)</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Days</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Daily Rate (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {/* Transport */}
              {serviceType === 'Transport' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Transport Company</label>
                    <select required value={newService.transportCompanyId || ''} onChange={e => {
                      const t = transportCompanies.find((x: any) => x.id === parseInt(e.target.value));
                      setNewService({ ...newService, transportCompanyId: t?.id || null, description: t?.name || '' });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select a Transport Company...</option>
                      {transportCompanies.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Days</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {/* Flight */}
              {serviceType === 'Flight' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <input required type="text" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Return flight IST-BUD" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tickets (Qty)</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per Ticket (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {/* Excursion */}
              {serviceType === 'Excursion' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Excursion</label>
                    <select required value={newService.excursionId || ''} onChange={e => {
                      const ex = excursions.find((x: any) => x.id === parseInt(e.target.value));
                      setNewService({ ...newService, excursionId: ex?.id || null, description: ex?.name || '', unitPrice: ex?.price || 0 });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm">
                      <option value="">Select an Excursion...</option>
                      {excursions.map((ex: any) => <option key={ex.id} value={ex.id}>{ex.name} — {ex.type} (€{ex.price}/pax)</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pax / Qty</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per Pax (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {/* Cost preview */}
              {newService.unitPrice > 0 && (
                <div className={`p-3 rounded-xl text-sm font-medium ${serviceType === 'Excursion' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  Total: {newService.quantity} × €{newService.unitPrice}{newService.roomCount > 1 && serviceType === 'Hotel' ? ` × ${newService.roomCount} rooms` : ''} = <strong>€{(newService.quantity * newService.unitPrice * (serviceType === 'Hotel' ? newService.roomCount : 1)).toLocaleString()}</strong>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm">{editingServiceId ? 'Save Changes' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TourDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <TourDetailContent />
    </Suspense>
  );
}
