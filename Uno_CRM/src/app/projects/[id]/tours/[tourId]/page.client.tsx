"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Edit, Pencil, Briefcase, MapPin, CalendarDays, Users, Plus, X, Trash2, PlaneLanding, PlaneTakeoff, Hotel, Car, PersonStanding, Compass, Plane, Save, Package, FileText, Printer, AlertTriangle, FileSpreadsheet, Search, ChevronDown, ChevronRight, Building2, Truck, Paperclip, Upload, ExternalLink, Eye, Download } from 'lucide-react';

import TourCheckpointWidget from '@/components/TourCheckpointWidget';

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
  arrivalAirport?: string;
  departureAirport?: string;
  tourStatus?: { name: string };
  guideId?: number | null;
  [key: string]: any;
}

interface ServiceCategory {
  id: number;
  name: string;
  classification: string;
  isBase?: boolean;
  isRevenue?: boolean;
  isCost?: boolean;
  isOperational?: boolean;
  isExpandable?: boolean;
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
  flightNo?: string | null;
  serviceDate?: string | null;
  fromAirport?: string | null;
  toAirport?: string | null;
  [key: string]: any;
}

const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Twin', 'Suite'];

const getCurrencySymbol = (currencyCode?: string) => {
  switch (currencyCode) {
    case 'TRL': return '₺';
    case 'USD': return '$';
    case 'CZK': return 'Kč';
    case 'EUR':
    default: return '€';
  }
};

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();

  let projectId = (params?.id as string) || '';
  let tourId = (params?.tourId as string) || '';

  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const projIdx = parts.indexOf('projects');
    const tourIdx = parts.indexOf('tours');
    if (projIdx !== -1 && parts[projIdx + 1]) projectId = parts[projIdx + 1];
    if (tourIdx !== -1 && parts[tourIdx + 1] && parts[tourIdx + 1] !== 'tours') tourId = parts[tourIdx + 1];
  }

  const [activeTab, setActiveTab] = useState('info');
  const [tour, setTour] = useState<Tour | null>(null);
  const [tourNotes, setTourNotes] = useState<string>('');
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
  const [projects, setProjects] = useState<any[]>([]);

  // Invoices
  const [invoices, setInvoices] = useState<any[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<any | null>(null);
  const [isInvoiceEditing, setIsInvoiceEditing] = useState(false);
  const [editingInvoiceData, setEditingInvoiceData] = useState<any>(null);

  // Tour Invoice Attachments
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');

  // Add service modal
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState('Hotel');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (catName: string) => setCollapsedGroups(prev => ({ ...prev, [catName]: !prev[catName] }));

  // Passenger modal & search state & handlers
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [editingPassengerId, setEditingPassengerId] = useState<number | null>(null);
  const [passengerData, setPassengerData] = useState<any>({
    firstName: '', lastName: '', gender: 'Male', nationalId: '', passportNo: '',
    passportType: 'Regular', visaNo: '', phone: '', dateOfBirth: '', roomType: 'Double', pax: 1, address: ''
  });

  const openAddPassengerModal = () => {
    setEditingPassengerId(null);
    setPassengerData({
      firstName: '', lastName: '', gender: 'Male', nationalId: '', passportNo: '',
      passportType: 'Regular', visaNo: '', phone: '', dateOfBirth: '', roomType: 'Double', pax: 1, address: ''
    });
    setIsPassengerModalOpen(true);
  };

  const openEditPassengerModal = (p: any) => {
    setEditingPassengerId(p.id);
    setPassengerData({
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      gender: p.gender || 'Male',
      nationalId: p.nationalId || '',
      passportNo: p.passportNo || '',
      passportType: p.passportType || 'Regular',
      visaNo: p.visaNo || '',
      phone: p.phone || '',
      dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : '',
      roomType: p.roomType || 'Double',
      pax: p.pax || 1,
      address: p.address || ''
    });
    setIsPassengerModalOpen(true);
  };

  const handleSavePassenger = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew = !editingPassengerId;
      const url = isNew ? `${API}/passengers` : `${API}/passengers/${editingPassengerId}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...passengerData,
        id: editingPassengerId || 0,
        tourId: parseInt(tourId)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsPassengerModalOpen(false);
        fetchAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePassenger = async (passengerId: number) => {
    if (!confirm('Are you sure you want to delete this passenger?')) return;
    try {
      const res = await fetch(`${API}/passengers/${passengerId}`, { method: 'DELETE' });
      if (res.ok) fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const [isAccommodationExpanded, setIsAccommodationExpanded] = useState<boolean>(true);

  const [newService, setNewService] = useState<any>({
    description: '', quantity: 1, unitPrice: 0, serviceCategoryId: 0,
    hotelId: null, driverId: null, guideId: null, excursionId: null, transportCompanyId: null,
    roomType: 'Double', roomCount: 1, singleCount: 0, doubleCount: 0, twinCount: 0, tripleCount: 0, dblEbCount: 0,
    singleRate: 0, doubleRate: 0, twinRate: 0, tripleRate: 0, dblEbRate: 0,
    includeGuideRoom: false, guideStartDate: '', guideEndDate: '', guideRate: 0,
    includeDriverRoom: false, driverStartDate: '', driverEndDate: '', driverRate: 0,
    includeHotelTax: false, hotelTaxRate: 2.50,
    flightNo: '', serviceDate: '', fromAirport: '', toAirport: ''
  });

  useEffect(() => {
    if (tourId) fetchAll();
  }, [tourId]);

  const fetchAttachments = async () => {
    try {
      const res = await fetch(`${API}/tours/${tourId}/attachments`);
      if (res.ok) setAttachments(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleUploadAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (fileDescription) formData.append('description', fileDescription);

      const res = await fetch(`${API}/tours/${tourId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSelectedFile(null);
        setFileDescription('');
        setIsAttachModalOpen(false);
        await fetchAttachments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteAttachment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attached invoice file?')) return;
    try {
      const res = await fetch(`${API}/tours/${tourId}/attachments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAttachments(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tourRes, svcRes, catRes, hotelRes, driverRes, guideRes, excRes, transRes, statusRes, invoiceRes, projRes, attachRes] = await Promise.all([
        fetch(`${API}/tours/${tourId}`),
        fetch(`${API}/tourservices?tourId=${tourId}`).catch(() => null),
        fetch(`${API}/servicecategories`).catch(() => null),
        fetch(`${API}/hotels`).catch(() => null),
        fetch(`${API}/drivers`).catch(() => null),
        fetch(`${API}/guides`).catch(() => null),
        fetch(`${API}/excursions`).catch(() => null),
        fetch(`${API}/transportcompanies`).catch(() => null),
        fetch(`${API}/tourstatuses`).catch(() => null),
        fetch(`${API}/invoices?tourId=${tourId}`).catch(() => null),
        fetch(`${API}/projects`).catch(() => null),
        fetch(`${API}/tours/${tourId}/attachments`).catch(() => null),
      ]);

      let loadedServices: any[] = [];
      if (svcRes?.ok) {
        loadedServices = await svcRes.json();
        setServices(loadedServices);
      }

      if (tourRes.ok) {
        const t = await tourRes.json();
        setTour(t);
        setTourNotes(t.notes || '');
        const guideSvc = loadedServices.find((s: any) => s.guideId || s.serviceCategoryId === 4 || (s.description || '').toLowerCase().includes('guide'));
        setEditData({
          ...t,
          guideId: guideSvc?.guideId || '',
          arrivalDate: t.arrivalDate?.substring(0, 16) || '',
          endDate: t.endDate?.substring(0, 16) || '',
          notes: t.notes || '',
        });
      }
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
      if (invoiceRes?.ok) setInvoices(await invoiceRes.json());
      if (projRes?.ok) setProjects(await projRes.json());
      if (attachRes?.ok) setAttachments(await attachRes.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);
  const handleSaveNotes = async () => {
    if (!tourId) return;
    setSaving(true);
    try {
      let res = await fetch(`${API}/tours/${tourId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: tourNotes })
      });
      if (res.status === 405) {
        res = await fetch(`${API}/tours/${tourId}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: tourNotes })
        });
      }
      if (res.ok) {
        const data = await res.json();
        setTour((prev: any) => prev ? { ...prev, notes: data.notes } : prev);
        setNotesSavedSuccess(true);
        setTimeout(() => setNotesSavedSuccess(false), 3000);
      } else {
        alert('Failed to save notes. Error code: ' + res.status);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving notes: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { tourStatus, project, guideId, ...cleanData } = editData;
      cleanData.notes = tourNotes;
      cleanData.pax = (cleanData.adults || 0) + (cleanData.children || 0) + (cleanData.infants || 0);
      cleanData.totalFee = ((cleanData.adults || 0) * (cleanData.baseFee || 0)) + ((cleanData.children || 0) * (cleanData.baseFee || 0) * 0.5);
      
      const targetProjectId = cleanData.projectId;
      const res = await fetch(`${API}/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (res.ok) {
        if (guideId !== undefined) {
          const selectedGuide = guides.find((g: any) => g.id === parseInt(guideId));
          const guideCatId = getCategoryId('Guide') || 4;
          const existingGuideSvc = services.find((s: any) => s.guideId || s.serviceCategoryId === guideCatId || (s.description || '').toLowerCase().includes('guide'));

          if (selectedGuide) {
            const startD = cleanData.arrivalDate ? cleanData.arrivalDate.split('T')[0] : '';
            const endD = cleanData.endDate ? cleanData.endDate.split('T')[0] : '';
            const daysCount = (startD && endD) ? Math.max(1, Math.ceil((new Date(endD).getTime() - new Date(startD).getTime()) / (1000 * 3600 * 24)) + 1) : 1;

            const guidePayload = {
              tourId: parseInt(tourId),
              serviceCategoryId: guideCatId,
              guideId: selectedGuide.id,
              description: `Guide - ${selectedGuide.name}`,
              quantity: daysCount,
              unitPrice: selectedGuide.dailyRate || 150,
              totalAmount: daysCount * (selectedGuide.dailyRate || 150),
              isRevenue: false
            };

            if (existingGuideSvc) {
              await fetch(`${API}/tourservices/${existingGuideSvc.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...existingGuideSvc, ...guidePayload }),
              });
            } else {
              await fetch(`${API}/tourservices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guidePayload),
              });
            }
          } else if (!selectedGuide && existingGuideSvc && guideId === '') {
            await fetch(`${API}/tourservices/${existingGuideSvc.id}`, { method: 'DELETE' });
          }
        }

        setIsEditing(false);
        if (targetProjectId && targetProjectId.toString() !== projectId.toString()) {
          router.push(`/projects/${targetProjectId}/tours/${tourId}`);
        } else {
          fetchAll();
        }
      }
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const getCategoryId = (name: string): number => {
    const cat = serviceCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return cat?.id || 0;
  };

  const getServiceDescription = (svc: TourService) => {
    const cat = getCategoryName(svc);
    if (cat === 'Hotel') {
       const hName = hotels.find((x: any) => x.id === svc.hotelId)?.name || svc.description || '-';
       return svc.roomType ? `${hName} (${svc.roomType} ×${svc.roomCount || 1})` : hName;
    }
    if (cat === 'Guide') return guides.find((x: any) => x.id === svc.guideId)?.name || svc.description || '-';
    if (cat === 'Driver') return drivers.find((x: any) => x.id === svc.driverId)?.name || svc.description || '-';
    if (cat === 'Transport') return transportCompanies.find((x: any) => x.id === svc.transportCompanyId)?.name || svc.description || '-';
    if (cat === 'Excursion') return excursions.find((x: any) => x.id === svc.excursionId)?.name || svc.description || '-';
    return svc.description || '-';
  };

  const getServiceDetails = (svc: TourService) => {
    const cat = getCategoryName(svc);
    if (cat === 'Guide' || cat === 'Hotel') {
       const start = svc.serviceDate ? new Date(svc.serviceDate).toLocaleDateString() : '';
       const end = svc.serviceEndDate ? new Date(svc.serviceEndDate).toLocaleDateString() : '';
       return start && end ? `${start} — ${end}` : '-';
    }
    if (cat === 'Excursion') {
       return svc.serviceDate ? new Date(svc.serviceDate).toLocaleDateString() : '-';
    }
    if (svc.flightNo) return `${svc.flightNo} ${svc.fromAirport || ''}—${svc.toAirport || ''}`;
    return '-';
  };

  const openServiceModal = (type: string, isRevenue?: boolean) => {
    setServiceType(type);
    
    let defaultQty = 1;
    if (type === 'Invoiced Fee' || type === 'Client Flat Invoice' || type === 'Tour Package Fee') {
      defaultQty = (tour?.pax || 0) + 0.5 * (tour?.children || 0);
      if (defaultQty === 0) defaultQty = 1;
    } else if (type === 'Hotel') {
      defaultQty = '' as any;
    }

    setNewService({
      description: '', quantity: defaultQty, unitPrice: 0, serviceCategoryId: getCategoryId(type) || (type === 'Other' ? '' : 0),
      isRevenue: isRevenue,
      pax: tour?.pax || 0, children: tour?.children || 0, infants: tour?.infants || 0,
      hotelId: null, driverId: null, guideId: null, guideIds: [], excursionId: null, transportCompanyId: null,
      pricingBasis: 'Room',
      discountAmount: 0,
      discountNotes: '',
      roomType: 'Double', roomCount: 1, singleCount: 0, doubleCount: 0, twinCount: 0, tripleCount: 0, dblEbCount: 0,
      singleRate: 0, doubleRate: 0, twinRate: 0, tripleRate: 0, dblEbRate: 0,
      includeGuideRoom: false, guideStartDate: '', guideEndDate: '', guideRate: 0,
      includeDriverRoom: false, driverStartDate: '', driverEndDate: '', driverRate: 0,
      includeHotelTax: false, hotelTaxRate: 2.50,
      flightNo: '', serviceDate: '', startDate: type === 'Hotel' ? '' : (tour?.arrivalDate?.split('T')[0] || ''), endDate: type === 'Hotel' ? '' : (tour?.endDate?.split('T')[0] || ''), fromAirport: '', toAirport: '',
      guideAssignments: [{
        id: Date.now(),
        guideId: '',
        startDate: tour?.arrivalDate?.split('T')[0] || '',
        endDate: tour?.endDate?.split('T')[0] || '',
        quantity: Math.max(1, Math.ceil((new Date(tour?.endDate || new Date()).getTime() - new Date(tour?.arrivalDate || new Date()).getTime()) / (1000 * 3600 * 24)) + 1) || 1,
        unitPrice: 0
      }]
    });
    setIsServiceModalOpen(true);
  };

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const basePayload: any = {
        tourId: parseInt(tourId),
        serviceCategoryId: newService.serviceCategoryId || getCategoryId(serviceType),
        description: newService.description,
        quantity: Number(newService.quantity) || 0,
        unitPrice: newService.unitPrice,
        totalAmount: (Number(newService.quantity) || 0) * newService.unitPrice,
        isRevenue: newService.isRevenue,
      };

      if (newService.driverId) basePayload.driverId = newService.driverId;
      if (newService.excursionId) basePayload.excursionId = newService.excursionId;
      if (newService.transportCompanyId) basePayload.transportCompanyId = newService.transportCompanyId;
      
      if (serviceType === 'Flight') {
        basePayload.flightNo = newService.flightNo;
        basePayload.serviceDate = newService.serviceDate ? new Date(newService.serviceDate).toISOString() : null;
        basePayload.fromAirport = newService.fromAirport;
        basePayload.toAirport = newService.toAirport;
      } else if (serviceType === 'Excursion') {
        basePayload.serviceDate = newService.serviceDate ? new Date(newService.serviceDate).toISOString() : null;
      } else if (serviceType === 'Hotel') {
        basePayload.serviceDate = newService.startDate ? new Date(newService.startDate).toISOString() : null;
        basePayload.serviceEndDate = newService.endDate ? new Date(newService.endDate).toISOString() : null;
        basePayload.startDate = newService.startDate ? new Date(newService.startDate).toISOString() : null;
        basePayload.endDate = newService.endDate ? new Date(newService.endDate).toISOString() : null;
      }
      
      if (serviceType === 'Invoiced Fee') {
         basePayload.quantity = (newService.pax || 0) + 0.5 * (newService.children || 0);
         basePayload.totalAmount = newService.unitPrice * basePayload.quantity;
         if (!basePayload.description) {
           basePayload.description = `${newService.pax || 0} Pax, ${newService.children || 0} Children, ${newService.infants || 0} Infants`;
         }
      }

      let payloads: any[] = [];

      if (serviceType === 'Hotel' && !editingServiceId) {
        if (!newService.startDate || !newService.endDate) return alert('Please enter check-in and check-out dates.');
        const calculatedNights = newService.startDate && newService.endDate
          ? Math.max(1, Math.ceil((new Date(newService.endDate).getTime() - new Date(newService.startDate).getTime()) / (1000 * 3600 * 24)))
          : 1;
        const q = calculatedNights;
        if (q <= 0) return alert('Check-out date must be after check-in date.');

        const pb = newService.pricingBasis || 'Room';
        const discAmt = Number(newService.discountAmount) || 0;
        const discNote = newService.discountNotes || '';

        if (newService.singleCount > 0) {
            const hPrice = newService.singleRate !== undefined && newService.singleRate > 0 ? newService.singleRate : (hotels.find((h: any) => h.id === newService.hotelId)?.singleRate || 0);
            const totalQty = newService.singleCount * q;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Single', 
              roomCount: newService.singleCount, 
              quantity: totalQty, 
              unitPrice: hPrice, 
              totalAmount: hPrice * totalQty,
              pricingBasis: pb,
              discountAmount: discAmt,
              discountNotes: discNote,
              totalNights: q
            });
        }
        if (newService.doubleCount > 0) {
            const hPrice = newService.doubleRate !== undefined && newService.doubleRate > 0 ? newService.doubleRate : (hotels.find((h: any) => h.id === newService.hotelId)?.doubleRate || 0);
            const totalQty = newService.doubleCount * q;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Double', 
              roomCount: newService.doubleCount, 
              quantity: totalQty, 
              unitPrice: hPrice, 
              totalAmount: hPrice * totalQty,
              pricingBasis: pb,
              discountAmount: discAmt,
              discountNotes: discNote,
              totalNights: q
            });
        }
        if (newService.twinCount > 0) {
            const hPrice = newService.twinRate !== undefined && newService.twinRate > 0 ? newService.twinRate : (hotels.find((h: any) => h.id === newService.hotelId)?.twinRate || 0);
            const totalQty = newService.twinCount * q;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Twin', 
              roomCount: newService.twinCount, 
              quantity: totalQty, 
              unitPrice: hPrice, 
              totalAmount: hPrice * totalQty,
              pricingBasis: pb,
              discountAmount: discAmt,
              discountNotes: discNote,
              totalNights: q
            });
        }
        if (newService.tripleCount > 0) {
            const hPrice = newService.tripleRate !== undefined && newService.tripleRate > 0 ? newService.tripleRate : (hotels.find((h: any) => h.id === newService.hotelId)?.tripleRate || 0);
            const totalQty = newService.tripleCount * q;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Triple', 
              roomCount: newService.tripleCount, 
              quantity: totalQty, 
              unitPrice: hPrice, 
              totalAmount: hPrice * totalQty,
              pricingBasis: pb,
              discountAmount: discAmt,
              discountNotes: discNote,
              totalNights: q
            });
        }
        if (newService.dblEbCount > 0) {
            const hPrice = newService.dblEbRate !== undefined && newService.dblEbRate > 0 ? newService.dblEbRate : (hotels.find((h: any) => h.id === newService.hotelId)?.dblEbRate || 0);
            const totalQty = newService.dblEbCount * q;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Double + Extra Bed (DBL+EB)', 
              roomCount: newService.dblEbCount, 
              quantity: totalQty, 
              unitPrice: hPrice, 
              totalAmount: hPrice * totalQty,
              pricingBasis: pb,
              discountAmount: discAmt,
              discountNotes: discNote,
              totalNights: q
            });
        }

        // Staff Accommodation: Guide
        if (newService.includeGuideRoom && newService.guideStartDate && newService.guideEndDate) {
            const gStart = new Date(newService.guideStartDate);
            const gEnd = new Date(newService.guideEndDate);
            const diffG = gEnd.getTime() - gStart.getTime();
            const gNights = !isNaN(diffG) ? Math.max(1, Math.ceil(diffG / (1000 * 3600 * 24))) : 1;
            const gRate = newService.guideRate !== undefined && newService.guideRate > 0 ? newService.guideRate : (hotels.find((h: any) => h.id === newService.hotelId)?.singleRate || 0);
            const gTotal = gNights * gRate;
            payloads.push({
              ...basePayload,
              hotelId: newService.hotelId,
              guideId: tour?.assignedGuideId || newService.guideId || null,
              roomType: 'Guide Room',
              roomCount: 1,
              quantity: gNights,
              unitPrice: gRate,
              totalAmount: gTotal,
              startDate: newService.guideStartDate,
              endDate: newService.guideEndDate,
              totalNights: gNights,
              includeGuideRoom: true,
              guideStartDate: newService.guideStartDate,
              guideEndDate: newService.guideEndDate,
              guideNights: gNights,
              guideRate: gRate,
              guideTotal: gTotal
            });
        }

        // Staff Accommodation: Driver
        if (newService.includeDriverRoom && newService.driverStartDate && newService.driverEndDate) {
            const dStart = new Date(newService.driverStartDate);
            const dEnd = new Date(newService.driverEndDate);
            const diffD = dEnd.getTime() - dStart.getTime();
            const dNights = !isNaN(diffD) ? Math.max(1, Math.ceil(diffD / (1000 * 3600 * 24))) : 1;
            const dRate = newService.driverRate !== undefined && newService.driverRate > 0 ? newService.driverRate : (hotels.find((h: any) => h.id === newService.hotelId)?.singleRate || 0);
            const dTotal = dNights * dRate;
            payloads.push({
              ...basePayload,
              hotelId: newService.hotelId,
              driverId: tour?.assignedDriverId || newService.driverId || null,
              roomType: 'Driver Room',
              roomCount: 1,
              quantity: dNights,
              unitPrice: dRate,
              totalAmount: dTotal,
              startDate: newService.driverStartDate,
              endDate: newService.driverEndDate,
              totalNights: dNights,
              includeDriverRoom: true,
              driverStartDate: newService.driverStartDate,
              driverEndDate: newService.driverEndDate,
              driverNights: dNights,
              driverRate: dRate,
              driverTotal: dTotal
            });
        }

        // Hotel Tax / City Tax
        if (newService.includeHotelTax && (newService.hotelTaxRate || 0) > 0) {
            const taxRate = newService.hotelTaxRate || 0;
            const totalPax = tour?.pax || 1;
            const nightlyTaxUnit = taxRate * totalPax;
            const taxTotal = nightlyTaxUnit * q;
            payloads.push({
              ...basePayload,
              hotelId: newService.hotelId,
              roomType: 'City Tax',
              roomCount: totalPax,
              quantity: q,
              unitPrice: nightlyTaxUnit,
              totalAmount: taxTotal,
              description: `Hotel Tax (€${taxRate}/pax/night)`
            });
        }

        if (payloads.length === 0) return alert('Please enter at least one room type quantity, staff accommodation, or hotel tax selection');
      } else if (serviceType === 'Hotel' && editingServiceId) {
        const sDate = newService.startDate || newService.serviceDate;
        const eDate = newService.endDate || newService.serviceEndDate;
        const nights = (sDate && eDate) ? Math.max(1, Math.ceil((new Date(eDate).getTime() - new Date(sDate).getTime()) / (1000 * 3600 * 24))) : 1;
        const roomOrPaxCount = Number(newService.roomCount) || 1;
        const totalQty = roomOrPaxCount * nights;
        const uPrice = Number(newService.unitPrice) || 0;
        payloads.push({
          ...basePayload,
          hotelId: newService.hotelId,
          roomType: newService.roomType,
          roomCount: roomOrPaxCount,
          quantity: totalQty,
          unitPrice: uPrice,
          totalAmount: uPrice * totalQty,
          pricingBasis: newService.pricingBasis || 'Room',
          discountAmount: Number(newService.discountAmount) || 0,
          discountNotes: newService.discountNotes || '',
          totalNights: nights
        });
      } else if (serviceType === 'Guide' && !editingServiceId) {
        if (!newService.guideAssignments || newService.guideAssignments.length === 0) return alert('Please add at least one guide assignment');
        for (const ga of newService.guideAssignments) {
           if (!ga.guideId) continue;
           const g = guides.find(x => x.id === parseInt(String(ga.guideId)));
           const gPrice = g?.dailyRate || 0;
           payloads.push({
             ...basePayload,
             guideId: ga.guideId,
             quantity: ga.quantity,
             unitPrice: gPrice,
             totalAmount: gPrice * ga.quantity,
             serviceDate: ga.startDate ? new Date(ga.startDate).toISOString() : null,
             serviceEndDate: ga.endDate ? new Date(ga.endDate).toISOString() : null
           });
        }
        if (payloads.length === 0) return alert('Please complete at least one guide assignment');
      } else if (serviceType === 'Guide' && editingServiceId) {
        // For editing, we still use the single guideAssignments array but it only has one element representing the edited service.
        const ga = newService.guideAssignments[0];
        payloads.push({
           ...basePayload,
           guideId: ga.guideId,
           quantity: ga.quantity,
           unitPrice: ga.unitPrice || basePayload.unitPrice,
           totalAmount: (ga.unitPrice || basePayload.unitPrice) * ga.quantity,
           serviceDate: ga.startDate ? new Date(ga.startDate).toISOString() : null,
           serviceEndDate: ga.endDate ? new Date(ga.endDate).toISOString() : null
        });
      } else if (serviceType === 'Excursion' && !editingServiceId) {
        const ex = excursions.find((x: any) => x.id === newService.excursionId);
        if (ex) {
           // Revenue payload
           payloads.push({
             ...basePayload,
             unitPrice: newService.unitPrice, // user provided sale price
             totalAmount: newService.unitPrice * newService.quantity,
             isRevenue: true
           });
           // Expense payload
           payloads.push({
             ...basePayload,
             unitPrice: ex.price || 0, // fixed cost
             totalAmount: (ex.price || 0) * newService.quantity,
             isRevenue: false
           });
        } else {
           payloads.push(basePayload);
        }
      } else {
        payloads.push(basePayload);
      }

      let hasError = false;
      for (const payload of payloads) {
        if (editingServiceId) {
          payload.id = editingServiceId;
          const res = await fetch(`${API}/tourservices/${editingServiceId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!res.ok) hasError = true;
        } else {
          const res = await fetch(`${API}/tourservices`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!res.ok) hasError = true;
        }
      }

      if (hasError) alert('Failed to save some services');
      
      setIsServiceModalOpen(false);
      setEditingServiceId(null);
      const svcRes = await fetch(`${API}/tourservices?tourId=${tourId}`);
      if (svcRes.ok) setServices(await svcRes.json());
    } catch (err) { console.error(err); }
  };

  const openEditServiceModal = (svc: TourService) => {
    const catName = getCategoryName(svc);
    const knownTemplates = ['Hotel', 'Flight', 'Transport', 'Driver', 'Guide', 'Excursion', 'Invoiced Fee'];
    const templateType = knownTemplates.includes(catName) ? catName : 'Other';
    setServiceType(templateType);
    setEditingServiceId(svc.id);
    
    // Recalculate guide days from dates just in case DB quantity was corrupted by previous bug
    const sDate = svc.serviceDate?.split('T')[0] || tour?.arrivalDate?.split('T')[0] || '';
    const eDate = svc.serviceEndDate?.split('T')[0] || tour?.endDate?.split('T')[0] || '';
    let guideQty = svc.quantity;
    if (catName === 'Guide' && sDate && eDate) {
      guideQty = Math.max(1, Math.ceil((new Date(eDate).getTime() - new Date(sDate).getTime()) / (1000 * 3600 * 24)) + 1) || 1;
    }

    setNewService({
      description: svc.description || '',
      quantity: svc.quantity,
      unitPrice: svc.unitPrice,
      serviceCategoryId: svc.serviceCategoryId,
      isRevenue: svc.isRevenue,
      hotelId: svc.hotelId || null,
      driverId: svc.driverId || null,
      guideId: svc.guideId || null,
      excursionId: svc.excursionId || null,
      transportCompanyId: svc.transportCompanyId || null,
      pricingBasis: (svc as any).pricingBasis || 'Room',
      discountAmount: (svc as any).discountAmount || 0,
      discountNotes: (svc as any).discountNotes || '',
      roomType: svc.roomType || 'Double',
      roomCount: svc.roomCount || 1,
      singleCount: svc.roomType === 'Single' ? (svc.roomCount || 0) : 0,
      doubleCount: svc.roomType === 'Double' ? (svc.roomCount || 0) : 0,
      twinCount: svc.roomType === 'Twin' ? (svc.roomCount || 0) : 0,
      tripleCount: svc.roomType === 'Triple' ? (svc.roomCount || 0) : 0,
      dblEbCount: (svc.roomType === 'Double + Extra Bed (DBL+EB)' || svc.roomType === 'DBL+EB') ? (svc.roomCount || 0) : 0,
      flightNo: svc.flightNo || '',
      serviceDate: sDate,
      startDate: sDate,
      endDate: eDate,
      fromAirport: svc.fromAirport || '',
      toAirport: svc.toAirport || '',
      guideAssignments: svc.serviceCategoryId === getCategoryId('Guide') ? [{
        id: Date.now(),
        guideId: svc.guideId || '',
        startDate: sDate,
        endDate: eDate,
        quantity: guideQty,
        unitPrice: svc.unitPrice
      }] : []
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
  const getCategoryClassification = (svc: TourService): string => svc.serviceCategory?.classification || serviceCategories.find(c => c.id === svc.serviceCategoryId)?.classification || 'Standard';

  const isServiceRevenue = (s: TourService) => {
    if (s.isRevenue !== undefined && s.isRevenue !== null) return s.isRevenue;
    const cat = s.serviceCategory || serviceCategories.find(c => c.id === s.serviceCategoryId);
    return cat?.isRevenue === true;
  };

  const revenueServices = services.filter(s => isServiceRevenue(s));
  const costServices = services.filter(s => !isServiceRevenue(s));

  // Excursion sales calculation for Guide Commission
  const totalExcursionSales = revenueServices
    .filter(s => getCategoryName(s).toLowerCase() === 'excursion')
    .reduce((sum, s) => sum + (s.totalAmount || (s.quantity || 1) * s.unitPrice || 0), 0);

  const guideCommissionRate = tour?.guideCommission !== undefined && tour?.guideCommission !== null 
    ? Number(tour.guideCommission) 
    : 10;

  const guideCommissionAmount = (totalExcursionSales * guideCommissionRate) / 100;

  const guideCommissionService: TourService = {
    id: -999,
    tourId: parseInt(tourId),
    serviceCategoryId: getCategoryId('Guide') || 4,
    description: `Guide Commission (${guideCommissionRate}% on €${totalExcursionSales.toLocaleString()} Excursions)`,
    quantity: 1,
    unitPrice: guideCommissionAmount,
    totalAmount: guideCommissionAmount,
    isRevenue: false
  };

  const effectiveCostServices = [...costServices, guideCommissionService];

  const getServiceBuckets = (svcList: TourService[]) => {
    const base = svcList.filter(s => (serviceCategories.find(c => c.id === s.serviceCategoryId)?.isBase) || s.id === -999);
    const operational = svcList.filter(s => {
      const cat = serviceCategories.find(c => c.id === s.serviceCategoryId);
      return cat?.isOperational && !cat?.isBase && s.id !== -999;
    });
    const other = svcList.filter(s => {
      const cat = serviceCategories.find(c => c.id === s.serviceCategoryId);
      return !cat?.isBase && !cat?.isOperational && s.id !== -999;
    });
    return { base, operational, other };
  };

  const revenueBuckets = getServiceBuckets(revenueServices);
  const costBuckets = getServiceBuckets(effectiveCostServices);

  const totalSales = revenueServices.reduce((s, svc) => s + (svc.totalAmount || svc.unitPrice * (svc.quantity || 1) || 0), 0);
  const totalServiceCost = effectiveCostServices.reduce((s, svc) => s + (svc.totalAmount || svc.unitPrice * (svc.quantity || 1) || 0), 0);
  const totalRevenue = totalSales;
  const profit = totalRevenue - totalServiceCost;
  const costPerPax = tour ? Math.round(totalServiceCost / Math.max(tour.pax || 1, 1)) : 0;

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoiceData) return;
    try {
      const isNew = !editingInvoiceData.id;
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API}/invoices` : `${API}/invoices/${editingInvoiceData.id}`;
      
      const payload = {
        ...editingInvoiceData,
        tourId: parseInt(tourId),
        linesJson: typeof editingInvoiceData.linesJson === 'string' ? editingInvoiceData.linesJson : JSON.stringify(editingInvoiceData.linesJson)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsInvoiceEditing(false);
        const refetchRes = await fetch(`${API}/invoices?tourId=${tourId}`);
        if (refetchRes.ok) setInvoices(await refetchRes.json());
      } else {
        alert('Failed to save invoice');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save invoice');
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const res = await fetch(`${API}/invoices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInvoices(prev => prev.filter(i => i.id !== id));
        if (currentInvoice?.id === id) setCurrentInvoice(null);
      }
    } catch (err) { console.error(err); }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleCreateNewInvoice = () => {
    // Generate default lines from services
    const invoiceLines = [
      ...costServices.map(s => ({
        description: getServiceDescription(s),
        quantity: s.quantity,
        unitPrice: s.unitPrice,
        totalAmount: s.totalAmount || (s.quantity * s.unitPrice),
        isExpense: true
      })),
      ...revenueServices.map(s => ({
        description: getServiceDescription(s),
        quantity: s.quantity,
        unitPrice: s.unitPrice,
        totalAmount: s.totalAmount || (s.quantity * s.unitPrice),
        isExpense: false
      }))
    ];

    const initialTotalAmount = invoiceLines.reduce((sum, l) => sum + (l.totalAmount || 0), 0);

    setEditingInvoiceData({
      name: `Invoice for ${tour?.tourCode || 'Tour'}`,
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      fromCompany: 'UNO TRAVEL LTD',
      fromAddress: '123 Travel Street, London, UK',
      fromTel: '+44 20 1234 5678',
      fromVAT: 'GB123456789',
      toCompany: '',
      toAddress: '',
      isSimpleView: false,
      linesJson: JSON.stringify(invoiceLines),
      totalAmount: initialTotalAmount,
      currency: 'EUR'
    });
    setCurrentInvoice(null);
    setIsInvoiceEditing(true);
  };

  const renderServiceTable = (svcs: TourService[], isExtra: boolean, subtotalLabel?: string) => {
    const groups: Record<string, TourService[]> = {};
    svcs.forEach(svc => {
      const catName = getCategoryName(svc);
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(svc);
    });

    const totalSub = svcs.reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 w-48">Category</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Start/End Dates</th>
              <th className="px-6 py-3 text-center">Qty</th>
              <th className="px-6 py-3 text-right">Unit Price</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.keys(groups).length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No services yet.</td></tr>
            ) : (
              Object.entries(groups).map(([catName, groupSvcs]) => {
                const cat = serviceCategories.find(c => c.name === catName);
                const isExpandable = cat?.isExpandable;
                const isCollapsed = isExpandable && collapsedGroups[catName];
                const groupTotal = groupSvcs.reduce((sum, svc) => sum + (svc.totalAmount || svc.unitPrice * (svc.quantity || 1)), 0);
                
                return (
                  <React.Fragment key={catName}>
                    {isExpandable && (
                      <tr className="bg-slate-100/50 hover:bg-slate-100 cursor-pointer border-y border-slate-200" onClick={() => toggleGroup(catName)}>
                        <td className="px-6 py-2 font-bold text-slate-700 flex items-center gap-2">
                          <span className="text-xs bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 text-slate-500 font-mono w-5 h-5 flex items-center justify-center">{isCollapsed ? '+' : '-'}</span>
                          {catName}
                        </td>
                        <td colSpan={4} className="px-6 py-2 text-slate-500 text-xs italic">{groupSvcs.length} items</td>
                        <td className="px-6 py-2 text-right font-bold text-slate-800">€{groupTotal.toLocaleString()}</td>
                        <td></td>
                      </tr>
                    )}
                    
                    {(!isExpandable || !isCollapsed) && groupSvcs.map(svc => (
                      <tr key={svc.id} className={`hover:bg-slate-50 ${isExpandable ? 'bg-white' : ''}`}>
                        <td className={`px-6 py-3 ${isExpandable ? 'pl-14' : ''}`}>
                          {!isExpandable && <span className={`px-2 py-0.5 rounded text-xs font-medium ${isExtra ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{catName}</span>}
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-700">{getServiceDescription(svc)}</td>
                        <td className="px-6 py-3 text-slate-500">{getServiceDetails(svc)}</td>
                        <td className="px-6 py-3 text-center text-xs font-semibold">
                          {svc.hotelId && svc.roomCount && svc.roomType !== 'City Tax' && svc.roomType !== 'Hotel Tax' 
                            ? `${svc.quantity || 2} Nights (${svc.roomCount} Rooms)` 
                            : (svc.hotelId ? `${svc.quantity || 1} Nights` : svc.quantity)}
                        </td>
                        <td className="px-6 py-3 text-right">€{Number(svc.unitPrice).toFixed(2)}</td>
                        <td className="px-6 py-3 font-semibold text-slate-800 text-right">€{Number(svc.totalAmount || svc.unitPrice * (svc.quantity || 1)).toLocaleString()}</td>
                        <td className="px-6 py-3 text-right">
                          {svc.id === -999 ? (
                            <button 
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                const newRateStr = prompt('Enter Guide Commission Percentage (%):', String(guideCommissionRate));
                                if (newRateStr !== null && !isNaN(parseFloat(newRateStr))) {
                                  const newRate = parseFloat(newRateStr);
                                  fetch(`${API}/tours/${tourId}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ...tour, guideCommission: newRate }),
                                  }).then(res => { if (res.ok) fetchAll(); });
                                }
                              }} 
                              className="text-purple-600 hover:text-purple-800 transition-colors font-semibold text-xs flex items-center gap-1 ml-auto"
                              title="Edit Guide Commission Percentage"
                            >
                              <Edit className="w-4 h-4" /> Edit %
                            </button>
                          ) : (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); openEditServiceModal(svc); }} className="text-slate-400 hover:text-blue-500 transition-colors mr-2"><Edit className="w-4 h-4" /></button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteService(svc.id); }} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
          {svcs.length > 0 && subtotalLabel && (
            <tfoot className="border-t-2 border-slate-200 bg-slate-50/80">
              <tr>
                <td colSpan={5} className="px-6 py-2.5 text-right text-xs uppercase tracking-wider text-slate-600 font-bold">
                  {subtotalLabel}
                </td>
                <td className={`px-6 py-2.5 text-right font-black text-sm ${isExtra ? 'text-emerald-700' : 'text-rose-700'}`}>
                  €{totalSub.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  };

  const tabBtn = (tab: string, label: string, Icon: any) => (
    <button onClick={() => setActiveTab(tab)} className={`flex items-center px-5 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
      <Icon className="w-4 h-4 mr-2" /> {label}
    </button>
  );

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!tour) return <div className="p-8 text-center text-slate-500">Tour not found</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 w-full print:block print:h-auto print:bg-white">
      {/* Header */}
      <header className="print:hidden h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 shadow-sm z-10">
        <button 
          onClick={() => {
            if (typeof window !== 'undefined' && document.referrer && document.referrer.includes(window.location.host)) {
              router.back();
            } else if (tour?.projectId && tour.projectId > 0) {
              router.push(`/projects/${tour.projectId}`);
            } else {
              router.push('/tour-calendar');
            }
          }} 
          className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Back"
        >
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
      <div className="flex border-b border-slate-200 bg-white px-6 print:hidden">
        {tabBtn('info', 'Tour Info', MapPin)}
        {tabBtn('services', 'Services', Package)}
        {tabBtn('bookings', 'Bookings', Users)}
        {tabBtn('invoice', 'Invoice', FileText)}
      </div>

      <div className="flex-1 overflow-auto print:block print:overflow-visible">

        {/* ──── TOUR INFO TAB ──── */}
        {activeTab === 'info' && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN (7-8 Cols): Tour Information & Hotel Reservations */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
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
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Adults</label>
                          <input required type="number" min="1" value={editData.adults === ('' as any) ? '' : (editData.adults || 1)} onChange={e => setEditData({ ...editData, adults: e.target.value === '' ? ('' as any) : parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Children</label>
                          <input required type="number" min="0" value={editData.children === ('' as any) ? '' : (editData.children || 0)} onChange={e => setEditData({ ...editData, children: e.target.value === '' ? ('' as any) : parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Infants</label>
                          <input required type="number" min="0" value={editData.infants === ('' as any) ? '' : (editData.infants || 0)} onChange={e => setEditData({ ...editData, infants: e.target.value === '' ? ('' as any) : parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Fee (€)</label>
                          <input required type="number" min="0" value={editData.baseFee === ('' as any) ? '' : (editData.baseFee || 0)} onChange={e => setEditData({ ...editData, baseFee: e.target.value === '' ? ('' as any) : parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                        </div>
                      </div>
                      
                      {editData.baseFee > 0 && (
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center text-sm">
                          <span className="font-semibold text-emerald-800">Dynamic Total (Adults + 50% Children)</span>
                          <span className="font-bold text-emerald-900 text-lg">€{(((editData.adults || 0) * (editData.baseFee || 0)) + ((editData.children || 0) * (editData.baseFee || 0) * 0.5)).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">Flight Information</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Arrival Flight</label>
                            <input type="text" value={editData.arrivalFlight || ''} onChange={e => setEditData({ ...editData, arrivalFlight: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. TK 1234" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Arrival Date & Time</label>
                            <input required type="datetime-local" value={editData.arrivalDate} onChange={e => setEditData({ ...editData, arrivalDate: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Arrival City/Airport</label>
                            <input type="text" value={editData.arrivalAirport || ''} onChange={e => setEditData({ ...editData, arrivalAirport: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. IST / Istanbul" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Departure Flight</label>
                            <input type="text" value={editData.departureFlight || ''} onChange={e => setEditData({ ...editData, departureFlight: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. TK 1235" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Departure Date & Time</label>
                            <input required type="datetime-local" value={editData.endDate} onChange={e => setEditData({ ...editData, endDate: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Departure City/Airport</label>
                            <input type="text" value={editData.departureAirport || ''} onChange={e => setEditData({ ...editData, departureAirport: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. BUD / Budapest" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {projects.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Project</label>
                            <select value={editData.projectId} onChange={e => setEditData({ ...editData, projectId: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800">
                              {projects.map((p: any) => (
                                <option key={p.id} value={p.id}>{p.projectCode} — {p.description || p.client?.name || `Project #${p.id}`}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        {tourStatuses.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                            <select value={editData.tourStatusId} onChange={e => setEditData({ ...editData, tourStatusId: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                              {tourStatuses.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Guide</label>
                          <select value={editData.guideId || ''} onChange={e => setEditData({ ...editData, guideId: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800">
                            <option value="">No Guide Assigned</option>
                            {guides.map((g: any) => (
                              <option key={g.id} value={g.id}>{g.name} ({g.language || 'Guide'})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Guide Commission (%)</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="100" 
                            value={editData.guideCommission !== undefined ? editData.guideCommission : 10} 
                            onChange={e => setEditData({ ...editData, guideCommission: parseFloat(e.target.value) || 0 })} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold text-purple-700" 
                            placeholder="10 %" 
                          />
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
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Tour Code</p>
                          <p className="text-sm font-bold text-slate-800">{tour.tourCode}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Assigned Project</p>
                          <p className="text-sm font-bold text-blue-600 flex items-center">
                            <Briefcase className="w-4 h-4 mr-1.5 text-blue-500" />
                            {projects.find(p => p.id === tour.projectId)?.projectCode || tour.project?.projectCode || `Project #${tour.projectId}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Destination</p>
                          <p className="text-sm font-bold text-slate-800 flex items-center"><MapPin className="w-4 h-4 mr-1 text-indigo-400" /> {tour.destination}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Status & Guide(s)</p>
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">{tour.tourStatus?.name || 'N/A'}</span>
                            <span className="text-sm font-bold text-slate-700">
                              {(() => {
                                const svcGuides = services.filter(s => s.guideId).map(s => guides.find(g => g.id === s.guideId)?.name).filter(Boolean);
                                const allGuides = Array.from(new Set(svcGuides));
                                return allGuides.length > 0 ? allGuides.join(', ') : 'Unassigned';
                              })()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="col-span-4">
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Pricing & Passenger Breakdown</p>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                              <p className="text-xs text-slate-500 mb-1">Pax Breakdown</p>
                              <p className="text-sm font-bold text-slate-800">
                                {tour.adults || 0} A, {tour.children || 0} C, {tour.infants || 0} I <span className="text-slate-400 font-normal">({tour.pax || 0} Total)</span>
                              </p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
                              <p className="text-xs text-emerald-600 mb-1">Base Fee</p>
                              <p className="text-sm font-bold text-emerald-700">€{Number((tour.baseFee && tour.baseFee > 0) ? tour.baseFee : 250).toLocaleString()}</p>
                            </div>
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5">
                              <p className="text-xs text-purple-600 mb-1">Guide Commission</p>
                              <p className="text-sm font-bold text-purple-700">{tour.guideCommission !== undefined ? tour.guideCommission : 10}% (€{guideCommissionAmount.toLocaleString()})</p>
                            </div>
                            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5">
                              <p className="text-xs text-sky-600 mb-1">Dynamic Total</p>
                              <p className="text-sm font-bold text-sky-700">€{Number(tour.totalFee || 0).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <PlaneLanding className="w-4 h-4 mr-2.5 text-indigo-500 shrink-0" />
                            <span className="font-medium mr-2">Arrival:</span> {new Date(tour.arrivalDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            {tour.arrivalFlight && <span className="ml-2 font-semibold">({tour.arrivalFlight})</span>}
                            {tour.arrivalAirport && <span className="ml-2 text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold">{tour.arrivalAirport}</span>}
                          </div>
                          <div className="flex items-center text-sm text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <PlaneTakeoff className="w-4 h-4 mr-2.5 text-indigo-500 shrink-0" />
                            <span className="font-medium mr-2">Departure:</span> {new Date(tour.endDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            {tour.departureFlight && <span className="ml-2 font-semibold">({tour.departureFlight})</span>}
                            {tour.departureAirport && <span className="ml-2 text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold">{tour.departureAirport}</span>}
                          </div>
                        </div>

                      {/* ──── HOTEL RESERVATIONS TABLE ──── */}
                      {(() => {
                        const hotelServices = services.filter(s => s.hotelId || s.serviceCategoryId === 1 || (s.serviceCategory?.name || '').toLowerCase().includes('hotel'));
                        const hotelReservationsMap: Record<string, { hotelName: string; city: string; startDate: string; endDate: string; rooms: string[]; totalCost: number }> = {};
                        
                        hotelServices.forEach(svc => {
                          const hotelObj = hotels.find((h: any) => h.id === svc.hotelId);
                          const hotelName = hotelObj?.name || (svc.description ? svc.description.split('(')[0].trim() : 'Hotel Stay');
                          const city = hotelObj?.location || tour.destination || '-';
                          
                          const startDateStr = svc.startDate || svc.serviceStartDate || svc.serviceDate || tour.arrivalDate;
                          const endDateStr = svc.endDate || svc.serviceEndDate || tour.endDate;
                          
                          const key = `${hotelName}_${startDateStr}`;
                          if (!hotelReservationsMap[key]) {
                            hotelReservationsMap[key] = {
                              hotelName,
                              city,
                              startDate: startDateStr ? new Date(startDateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
                              endDate: endDateStr ? new Date(endDateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
                              rooms: [],
                              totalCost: 0
                            };
                          }
                          
                          if (svc.roomType && svc.roomCount && svc.roomType !== 'City Tax' && svc.roomType !== 'Hotel Tax') {
                            hotelReservationsMap[key].rooms.push(`${svc.roomCount}x ${svc.roomType}`);
                          } else if (svc.description && !svc.description.includes('City Tax') && !svc.description.includes('Hotel Tax')) {
                            hotelReservationsMap[key].rooms.push(svc.description);
                          }
                          
                          hotelReservationsMap[key].totalCost += (svc.totalAmount || (svc.unitPrice * (svc.quantity || 1)) || 0);
                        });

                        const hotelReservationsList = Object.values(hotelReservationsMap);

                        return (
                          <div className="border-t border-slate-100 pt-5 mt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-600" />
                                Hotel Reservations & Stays
                              </h3>
                              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                {hotelReservationsList.length} {hotelReservationsList.length === 1 ? 'Hotel' : 'Hotels'}
                              </span>
                            </div>

                            {hotelReservationsList.length > 0 ? (
                              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                <table className="w-full text-xs text-left text-slate-700">
                                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                                    <tr>
                                      <th className="px-4 py-2.5">Hotel Name</th>
                                      <th className="px-4 py-2.5">Dates / Stay</th>
                                      <th className="px-4 py-2.5">City / Location</th>
                                      <th className="px-4 py-2.5">Room Details</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white">
                                    {hotelReservationsList.map((hRes, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-800">
                                          <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                              <Building2 className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{hRes.hotelName}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 font-medium">
                                          <div className="flex items-center gap-1.5">
                                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{hRes.startDate} – {hRes.endDate}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 font-medium">
                                          <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                            <span>{hRes.city}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">
                                          {hRes.rooms.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                              {hRes.rooms.map((r, rIdx) => (
                                                <span key={rIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                                                  {r}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-slate-400 italic">Standard Stay</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                                No hotel reservations attached to this tour yet.
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <TourCheckpointWidget tourId={parseInt(tourId)} onStatusUpdated={fetchAll} />
              </div>

              {/* RIGHT COLUMN (4-5 Cols): Standalone Operational Remarks & Special Tour Notes Card */}
              <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 sticky top-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Operational Remarks & Notes
                  </h3>
                  <div className="flex items-center gap-2">
                    {notesSavedSuccess && (
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">
                        ✓ Saved!
                      </span>
                    )}
                    <button 
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={saving}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : '💾 Save Notes'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-normal">
                  Enter special tour instructions, guide/driver remarks, flight arrival notes, or client preferences:
                </p>

                <textarea
                  rows={14}
                  value={tourNotes}
                  onChange={e => setTourNotes(e.target.value)}
                  className="w-full p-4 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium leading-relaxed resize-y"
                  placeholder="Type special tour instructions, client preferences, operational remarks, guide notes, flight arrival/departure details..."
                />
              </div>

            </div>
          </div>
        )}

        {/* ──── SERVICES TAB ──── */}
        {activeTab === 'services' && (
          <div className="p-6 space-y-6 max-w-6xl mx-auto">
            
            {/* Services Revenue */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Services Revenue</h2>
                  <p className="text-sm text-slate-400">Sales and billable items</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {serviceCategories.filter(c => c.isRevenue).map(cat => (
                    <button key={cat.id} onClick={() => openServiceModal(cat.name, true)} className="flex items-center px-3 py-1.5 bg-white border border-slate-200 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                      <Plus className="w-3 h-3" /> {cat.name}
                    </button>
                  ))}
                  <button onClick={() => openServiceModal('Other', true)} className="flex items-center px-3 py-1.5 bg-white border border-slate-200 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                    <Plus className="w-3 h-3" /> Other
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-8">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-slate-700 flex items-center text-sm uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>Base Services
                    </h3>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                      Base Services SubTotal:
                      <span className="text-sm font-extrabold">€{revenueBuckets.base.reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                  </div>
                  {renderServiceTable(revenueBuckets.base, true, 'Base Services SubTotal')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-slate-700 flex items-center text-sm uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>Operational Services
                    </h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                      Operational Services SubTotal:
                      <span className="text-sm font-extrabold">€{revenueBuckets.operational.reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                  </div>
                  {renderServiceTable(revenueBuckets.operational, true, 'Operational Services SubTotal')}
                </div>
                {revenueBuckets.other.length > 0 && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <h3 className="font-bold text-slate-700 flex items-center text-sm uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-2"></span>Other Services
                      </h3>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                        Other Services SubTotal:
                        <span className="text-sm font-extrabold">€{revenueBuckets.other.reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </span>
                    </div>
                    {renderServiceTable(revenueBuckets.other, true, 'Other Services SubTotal')}
                  </div>
                )}
              </div>
            </div>

            {/* Services Cost */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Services Cost</h2>
                  <p className="text-sm text-slate-400">Expenses and supplier costs</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {serviceCategories.filter(c => c.isCost).map(cat => (
                    <button key={cat.id} onClick={() => openServiceModal(cat.name, false)} className="flex items-center px-3 py-1.5 bg-white border border-slate-200 shadow-sm hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                      <Plus className="w-3 h-3" /> {cat.name}
                    </button>
                  ))}
                  <button onClick={() => openServiceModal('Other', false)} className="flex items-center px-3 py-1.5 bg-white border border-slate-200 shadow-sm hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 rounded-lg text-xs font-medium transition-colors gap-1">
                    <Plus className="w-3 h-3" /> Other
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-8">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-slate-700 flex items-center text-sm uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>Base Services
                    </h3>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                      Base Services SubTotal:
                      <span className="text-sm font-extrabold">€{costBuckets.base.reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                  </div>
                  {renderServiceTable(costBuckets.base, false, 'Base Services SubTotal')}
                </div>
                <div>
                  {(() => {
                    const staffServices = costBuckets.operational.filter(s => s.roomType === 'Guide Room' || s.roomType === 'Driver Room' || s.includeGuideRoom || s.includeDriverRoom);
                    const staffTotal = staffServices.reduce((sum, s) => {
                      if (s.roomType === 'Guide Room' || s.roomType === 'Driver Room') return sum + (s.totalAmount || 0);
                      let sub = 0;
                      if (s.includeGuideRoom) sub += (s.guideTotal || (s.guideNights ? s.guideNights * (s.guideRate || 0) : 0));
                      if (s.includeDriverRoom) sub += (s.driverTotal || (s.driverNights ? s.driverNights * (s.driverRate || 0) : 0));
                      return sum + sub;
                    }, 0);

                    const passengerAndOtherTotal = costBuckets.operational
                      .filter(s => s.roomType !== 'Guide Room' && s.roomType !== 'Driver Room')
                      .reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0);

                    const opGrandTotal = passengerAndOtherTotal + staffTotal;

                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <h3 className="font-bold text-slate-700 flex items-center text-sm uppercase tracking-wider">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>Operational Services
                          </h3>
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                            Operational Services SubTotal:
                            <span className="text-sm font-extrabold">€{opGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </span>
                        </div>

                        {/* Main Operational Services Table (without inline subtotal tfoot) */}
                        {renderServiceTable(costBuckets.operational.filter(s => s.roomType !== 'Guide Room' && s.roomType !== 'Driver Room'), false)}

                        {/* Expandable Staff Accommodation Subsection */}
                        <div className="mt-4 border border-amber-200 rounded-2xl bg-amber-50/20 overflow-hidden shadow-sm">
                          <button 
                            type="button"
                            onClick={() => setIsAccommodationExpanded(!isAccommodationExpanded)} 
                            className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50/60 hover:from-amber-100/70 hover:to-orange-100/70 transition-all flex items-center justify-between font-bold text-slate-800 text-sm border-b border-amber-100"
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-amber-600" />
                              <span className="text-amber-950 font-extrabold">Staff Accommodation (Guide & Driver Stays)</span>
                              <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                {staffServices.length} Staff Stays
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-600">
                                Total Staff Accommodation: <strong className="text-amber-800 font-extrabold">€{staffTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                              </span>
                              {isAccommodationExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                            </div>
                          </button>

                          {isAccommodationExpanded && (
                            <div className="p-4 space-y-4 bg-white/90">
                              {/* 2. Guide Accommodation */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-amber-600" /> Guide Accommodation
                                  </h5>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      openServiceModal('Hotel', false);
                                      setNewService((prev: any) => ({
                                        ...prev,
                                        description: 'Guide Room Accommodation',
                                        roomType: 'Guide Room',
                                        includeGuideRoom: true,
                                        guideStartDate: tour?.arrivalDate?.split('T')[0] || '',
                                        guideEndDate: tour?.endDate?.split('T')[0] || '',
                                        guideRate: 60
                                      }));
                                    }}
                                    className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-all"
                                  >
                                    <Plus className="w-3 h-3" /> Add Guide Stay
                                  </button>
                                </div>
                                {costBuckets.operational.filter(s => s.roomType === 'Guide Room' || s.includeGuideRoom).length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">No guide accommodation entries.</p>
                                ) : (
                                  <div className="divide-y divide-amber-100 border border-amber-200 rounded-xl overflow-hidden bg-amber-50/30">
                                    {costBuckets.operational.filter(s => s.roomType === 'Guide Room' || s.includeGuideRoom).map(s => {
                                      const h = hotels.find(x => x.id === s.hotelId);
                                      const g = guides.find(x => x.id === s.guideId) || guides.find(x => x.id === tour?.assignedGuideId);
                                      return (
                                        <div key={s.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                          <div>
                                            <span className="font-bold text-amber-900">Guide: {g?.name || 'Assigned Tour Guide'}</span>
                                            <span className="ml-2 text-amber-700 font-medium">Hotel: {h?.name || 'Hotel Stay'}</span>
                                            {s.startDate && s.endDate && (
                                              <span className="ml-2 text-slate-500">Dates: {new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}</span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <div className="font-bold text-amber-900">
                                              {s.guideNights || s.quantity || 1} Nights @ €{s.guideRate || s.unitPrice || 0}/night = <span className="text-amber-700">€{(s.guideTotal || s.totalAmount || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <button type="button" onClick={() => openEditServiceModal(s)} className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors" title="Edit Guide Accommodation">
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              <button type="button" onClick={() => handleDeleteService(s.id)} className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors" title="Delete Guide Accommodation">
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* 3. Driver Accommodation */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5 text-slate-600" /> Driver Accommodation
                                  </h5>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      openServiceModal('Hotel', false);
                                      setNewService((prev: any) => ({
                                        ...prev,
                                        description: 'Driver Room Accommodation',
                                        roomType: 'Driver Room',
                                        includeDriverRoom: true,
                                        driverStartDate: tour?.arrivalDate?.split('T')[0] || '',
                                        driverEndDate: tour?.endDate?.split('T')[0] || '',
                                        driverRate: 50
                                      }));
                                    }}
                                    className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-300 px-2.5 py-1 rounded-lg transition-all"
                                  >
                                    <Plus className="w-3 h-3" /> Add Driver Stay
                                  </button>
                                </div>
                                {costBuckets.operational.filter(s => s.roomType === 'Driver Room' || s.includeDriverRoom).length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">No driver accommodation entries.</p>
                                ) : (
                                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                                    {costBuckets.operational.filter(s => s.roomType === 'Driver Room' || s.includeDriverRoom).map(s => {
                                      const h = hotels.find(x => x.id === s.hotelId);
                                      const d = drivers.find(x => x.id === s.driverId) || drivers.find(x => x.id === tour?.assignedDriverId);
                                      return (
                                        <div key={s.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                          <div>
                                            <span className="font-bold text-slate-800">Driver: {d?.name || 'Assigned Tour Driver'}</span>
                                            <span className="ml-2 text-slate-600 font-medium">Hotel: {h?.name || 'Hotel Stay'}</span>
                                            {s.startDate && s.endDate && (
                                              <span className="ml-2 text-slate-500">Dates: {new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}</span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <div className="font-bold text-slate-800">
                                              {s.driverNights || s.quantity || 1} Nights @ €{s.driverRate || s.unitPrice || 0}/night = <span className="text-blue-700">€{(s.driverTotal || s.totalAmount || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <button type="button" onClick={() => openEditServiceModal(s)} className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200 rounded-lg transition-colors" title="Edit Driver Accommodation">
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              <button type="button" onClick={() => handleDeleteService(s.id)} className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors" title="Delete Driver Accommodation">
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Operational Services SubTotal Bar Below Staff Accommodation */}
                        <div className="mt-3 p-3.5 bg-slate-100/90 border-2 border-slate-200/80 rounded-xl flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-700 shadow-2xs">
                          <span>Operational Services SubTotal</span>
                          <span className="text-rose-700 font-black text-sm">
                            €{opGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
                {costBuckets.other.length > 0 && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <h3 className="font-bold text-slate-700 flex items-center text-sm uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-2"></span>Other Services
                      </h3>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                        Other Services SubTotal:
                        <span className="text-sm font-extrabold">€{costBuckets.other.reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </span>
                    </div>
                    {renderServiceTable(costBuckets.other, false, 'Other Services SubTotal')}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-2xl p-6 text-white flex flex-col justify-center">
                <p className="text-slate-400 text-sm font-medium">Total Revenue (Sales)</p>
                <h3 className="text-2xl font-bold mt-1">€{totalSales.toLocaleString()}</h3>
              </div>
              <div className="bg-slate-100 rounded-2xl p-6 text-slate-800 flex flex-col justify-center border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Total Service Cost</p>
                <h3 className="text-2xl font-bold mt-1">€{totalServiceCost.toLocaleString()}</h3>
              </div>
              <div className={`col-span-2 rounded-2xl p-6 flex flex-col justify-center text-white ${profit >= 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                <p className="text-white/80 text-sm font-medium">Profit</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-4xl font-bold mt-1">€{Math.abs(profit).toLocaleString()} {profit >= 0 ? '(+)' : '(-)'}</h3>
                  <div className="text-right">
                    <p className="text-white/90 text-sm">{services.length} services total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──── BOOKINGS TAB ──── */}
        {activeTab === 'bookings' && (() => {
          const allPassengers = tour.passengers || [];
          const filteredPassengers = allPassengers.filter((p: any) => {
            if (!bookingSearchQuery.trim()) return true;
            const q = bookingSearchQuery.toLowerCase();
            const fullStr = `${p.firstName || ''} ${p.lastName || ''} ${p.gender || ''} ${p.nationalId || ''} ${p.passportNo || ''} ${p.passportType || ''} ${p.visaNo || ''} ${p.phone || ''} ${p.roomType || ''} ${p.pax || ''}`.toLowerCase();
            return fullStr.includes(q);
          });

          return (
            <div className="p-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Passenger & Booking List</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage passengers, rooming assignments, and booking details for this tour.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search passengers..."
                        value={bookingSearchQuery}
                        onChange={(e) => setBookingSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-slate-800"
                      />
                      {bookingSearchQuery && (
                        <button onClick={() => setBookingSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {allPassengers.length > 0 && (
                      <button
                        onClick={() => window.open(`${API}/tours/${tour.id}/download-sales-template`, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-sm transition-all hover:shadow text-xs"
                        title="Download prepopulated sales template Excel file for this passenger list"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Download Sale File
                      </button>
                    )}
                    <button
                      onClick={openAddPassengerModal}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all text-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Add Passenger
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Room #</th>
                        <th className="px-4 py-3">Pax Type</th>
                        <th className="px-4 py-3">First Name</th>
                        <th className="px-4 py-3">Surname</th>
                        <th className="px-4 py-3">Gender</th>
                        <th className="px-4 py-3">National ID</th>
                        <th className="px-4 py-3">Passport No</th>
                        <th className="px-4 py-3">Passport Type</th>
                        <th className="px-4 py-3">Visa No</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">DOB</th>
                        <th className="px-4 py-3">Room Type</th>
                        <th className="px-4 py-3 text-center">Pax</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPassengers.length === 0 ? (
                        <tr>
                          <td colSpan={14} className="px-4 py-8 text-center text-slate-400">
                            {bookingSearchQuery ? `No passengers matched "${bookingSearchQuery}".` : 'No passengers found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredPassengers.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-extrabold text-blue-700">
                            {p.roomNumber ? `Room ${p.roomNumber}` : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              (p.paxType || '').toLowerCase().includes('child') ? 'bg-amber-100 text-amber-800' :
                              (p.paxType || '').toLowerCase().includes('infant') ? 'bg-rose-100 text-rose-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {(p.paxType || '').toLowerCase().includes('child') ? 'Children 🧒' :
                               (p.paxType || '').toLowerCase().includes('infant') ? 'Infant 👶' :
                               'Adult'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{p.firstName || '-'}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{p.lastName || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.gender || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.nationalId || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.passportNo || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.passportType || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.visaNo || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.phone || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : '-'}</td>
                          <td className="px-4 py-3 text-slate-600 font-medium">{p.roomType || '-'}</td>
                          <td className="px-4 py-3 text-center font-medium text-slate-700">{p.pax}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEditPassengerModal(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Passenger">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeletePassenger(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Passenger">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
      </div>

      {/* ──── ADD / EDIT PASSENGER MODAL ──── */}
      {isPassengerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800">{editingPassengerId ? 'Edit' : 'Add'} Passenger / Booking</h2>
              <button onClick={() => setIsPassengerModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePassenger} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input required type="text" value={passengerData.firstName} onChange={e => setPassengerData({ ...passengerData, firstName: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="First Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Surname / Last Name</label>
                  <input required type="text" value={passengerData.lastName} onChange={e => setPassengerData({ ...passengerData, lastName: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Surname" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                  <select value={passengerData.gender} onChange={e => setPassengerData({ ...passengerData, gender: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                  <input type="date" value={passengerData.dateOfBirth} onChange={e => setPassengerData({ ...passengerData, dateOfBirth: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input type="text" value={passengerData.phone} onChange={e => setPassengerData({ ...passengerData, phone: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="+90 5XX XXX XX XX" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">National ID / TC</label>
                  <input type="text" value={passengerData.nationalId} onChange={e => setPassengerData({ ...passengerData, nationalId: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="National ID" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Passport No</label>
                  <input type="text" value={passengerData.passportNo} onChange={e => setPassengerData({ ...passengerData, passportNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Passport No" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Passport Type</label>
                  <select value={passengerData.passportType} onChange={e => setPassengerData({ ...passengerData, passportType: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="Regular">Regular (Umuma Mahsus)</option>
                    <option value="Special">Special (Hususi / Yeşil)</option>
                    <option value="Service">Service (Hizmet / Gri)</option>
                    <option value="Diplomatic">Diplomatic (Diplomatik / Siyah)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Visa No</label>
                  <input type="text" value={passengerData.visaNo} onChange={e => setPassengerData({ ...passengerData, visaNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Visa No" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Type</label>
                  <select value={passengerData.roomType} onChange={e => setPassengerData({ ...passengerData, roomType: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Twin">Twin</option>
                    <option value="Triple">Triple</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button type="button" onClick={() => setIsPassengerModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-60">
                  {saving ? 'Saving...' : (editingPassengerId ? 'Update Passenger' : 'Add Passenger')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──── ADD SERVICE MODAL ──── */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-2xl w-full ${serviceType === 'Hotel' ? 'max-w-4xl' : 'max-w-xl'} shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h2 className="text-lg font-bold text-slate-800">{editingServiceId ? 'Edit' : 'Add'} {serviceType} Service</h2>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddService} className="p-5 space-y-3.5">

              {/* Hotel */}
              {serviceType === 'Hotel' && (
                <>
                  <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Hotel</label>
                        <select required value={newService.hotelId || ''} onChange={e => {
                          const h = hotels.find((x: any) => x.id === parseInt(e.target.value));
                          const basis = h?.pricingBasis === 'Room' ? 'Room' : 'Pax';
                          
                          // Auto-calculate rooming list counts from passengers
                          const passList = tour?.passengers || [];
                          const sPass = passList.filter((p: any) => p.roomType === 'Single').length;
                          const dPass = passList.filter((p: any) => p.roomType === 'Double').length;
                          const twPass = passList.filter((p: any) => p.roomType === 'Twin').length;
                          const trPass = passList.filter((p: any) => p.roomType === 'Triple').length;
                          const ebPass = passList.filter((p: any) => (p.roomType || '').includes('Extra Bed') || (p.roomType || '').includes('DBL+EB')).length;

                          const sCount = basis === 'Room' ? sPass : sPass;
                          const dCount = basis === 'Room' ? Math.ceil(dPass / 2) : dPass;
                          const twCount = basis === 'Room' ? Math.ceil(twPass / 2) : twPass;
                          const trCount = basis === 'Room' ? Math.ceil(trPass / 3) : trPass;
                          const ebCount = basis === 'Room' ? Math.ceil(ebPass / 3) : ebPass;

                          const sRate = basis === 'Room' ? (h?.singleRoomRate || h?.singleRate || 0) : (h?.singlePaxRate || h?.singleRate || 0);
                          const dRate = basis === 'Room' ? (h?.doubleRoomRate || (h?.doubleRate ? h?.doubleRate * 2 : 0)) : (h?.doublePaxRate || h?.doubleRate || 0);
                          const twRate = basis === 'Room' ? (h?.twinRoomRate || (h?.twinRate ? h?.twinRate * 2 : 0)) : (h?.twinPaxRate || h?.twinRate || 0);
                          const trRate = basis === 'Room' ? (h?.tripleRoomRate || (h?.tripleRate ? h?.tripleRate * 3 : 0)) : (h?.triplePaxRate || h?.tripleRate || 0);
                          const ebRate = basis === 'Room' ? (h?.dblEbRoomRate || h?.dblEbRate || 0) : (h?.dblEbPaxRate || h?.dblEbRate || 0);

                          setNewService({ 
                            ...newService, 
                            hotelId: h?.id || null, 
                            description: h?.name || '', 
                            pricingBasis: basis,
                            singleCount: sCount,
                            doubleCount: dCount,
                            twinCount: twCount,
                            tripleCount: trCount,
                            dblEbCount: ebCount,
                            singleRate: sRate,
                            doubleRate: dRate,
                            twinRate: twRate,
                            tripleRate: trRate,
                            dblEbRate: ebRate,
                            unitPrice: dRate || 0,
                            guideRate: sRate || 60,
                            driverRate: sRate || 50
                          });
                        }} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 shadow-2xs">
                          <option value="">Select a Hotel...</option>
                          {hotels.map((h: any) => <option key={h.id} value={h.id}>{h.name} — {h.location} ({h.pricingBasis === 'Room' ? 'Per Room' : 'Per Pax'})</option>)}
                        </select>
                      </div>

                      {/* ──── PRICING BASIS TOGGLE ──── */}
                      <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pricing Basis</label>
                        <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-2xs w-full">
                          <button
                            type="button"
                            onClick={() => {
                              const newBasis = 'Room';
                              const h = hotels.find((x: any) => x.id === newService.hotelId);
                              const passList = tour?.passengers || [];
                              const sPass = passList.filter((p: any) => p.roomType === 'Single').length;
                              const dPass = passList.filter((p: any) => p.roomType === 'Double').length;
                              const twPass = passList.filter((p: any) => p.roomType === 'Twin').length;
                              const trPass = passList.filter((p: any) => p.roomType === 'Triple').length;
                              const ebPass = passList.filter((p: any) => (p.roomType || '').includes('Extra Bed') || (p.roomType || '').includes('DBL+EB')).length;

                              setNewService({
                                ...newService,
                                pricingBasis: newBasis,
                                singleCount: sPass,
                                doubleCount: Math.ceil(dPass / 2),
                                twinCount: Math.ceil(twPass / 2),
                                tripleCount: Math.ceil(trPass / 3),
                                dblEbCount: Math.ceil(ebPass / 3),
                                singleRate: h?.singleRoomRate || h?.singleRate || newService.singleRate || 0,
                                doubleRate: h?.doubleRoomRate || (h?.doubleRate ? h?.doubleRate * 2 : 0) || newService.doubleRate || 0,
                                twinRate: h?.twinRoomRate || (h?.twinRate ? h?.twinRate * 2 : 0) || newService.twinRate || 0,
                                tripleRate: h?.tripleRoomRate || (h?.tripleRate ? h?.tripleRate * 3 : 0) || newService.tripleRate || 0,
                                dblEbRate: h?.dblEbRoomRate || h?.dblEbRate || newService.dblEbRate || 0,
                              });
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${newService.pricingBasis === 'Room' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600'}`}
                          >
                            🏢 Per Room
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newBasis = 'Pax';
                              const h = hotels.find((x: any) => x.id === newService.hotelId);
                              const passList = tour?.passengers || [];
                              const sPass = passList.filter((p: any) => p.roomType === 'Single').length;
                              const dPass = passList.filter((p: any) => p.roomType === 'Double').length;
                              const twPass = passList.filter((p: any) => p.roomType === 'Twin').length;
                              const trPass = passList.filter((p: any) => p.roomType === 'Triple').length;
                              const ebPass = passList.filter((p: any) => (p.roomType || '').includes('Extra Bed') || (p.roomType || '').includes('DBL+EB')).length;

                              setNewService({
                                ...newService,
                                pricingBasis: newBasis,
                                singleCount: sPass,
                                doubleCount: dPass,
                                twinCount: twPass,
                                tripleCount: trPass,
                                dblEbCount: ebPass,
                                singleRate: h?.singlePaxRate || h?.singleRate || newService.singleRate || 0,
                                doubleRate: h?.doublePaxRate || h?.doubleRate || newService.doubleRate || 0,
                                twinRate: h?.twinPaxRate || h?.twinRate || newService.twinRate || 0,
                                tripleRate: h?.triplePaxRate || h?.tripleRate || newService.tripleRate || 0,
                                dblEbRate: h?.dblEbPaxRate || h?.dblEbRate || newService.dblEbRate || 0,
                              });
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${newService.pricingBasis === 'Pax' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}
                          >
                            👤 Per Pax
                          </button>
                        </div>
                      </div>

                      {/* ──── AUTO-FILL BUTTON ──── */}
                      <div className="md:col-span-3">
                        <button
                          type="button"
                          onClick={() => {
                            const passList = tour?.passengers || [];
                            const sPass = passList.filter((p: any) => p.roomType === 'Single').length;
                            const dPass = passList.filter((p: any) => p.roomType === 'Double').length;
                            const twPass = passList.filter((p: any) => p.roomType === 'Twin').length;
                            const trPass = passList.filter((p: any) => p.roomType === 'Triple').length;
                            const ebPass = passList.filter((p: any) => (p.roomType || '').includes('Extra Bed') || (p.roomType || '').includes('DBL+EB')).length;

                            const isRoom = newService.pricingBasis === 'Room';
                            setNewService({
                              ...newService,
                              singleCount: isRoom ? sPass : sPass,
                              doubleCount: isRoom ? Math.ceil(dPass / 2) : dPass,
                              twinCount: isRoom ? Math.ceil(twPass / 2) : twPass,
                              tripleCount: isRoom ? Math.ceil(trPass / 3) : trPass,
                              dblEbCount: isRoom ? Math.ceil(ebPass / 3) : ebPass,
                            });
                          }}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                          title="Sync room & pax counts with live tour passenger manifest"
                        >
                          ⚡ Auto-Fill Bookings
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Check-in Date</label>
                        <input required type="date" value={newService.startDate || ''} onChange={e => {
                          const newStart = e.target.value;
                          const diff = new Date(newService.endDate).getTime() - new Date(newStart).getTime();
                          const n = !isNaN(diff) ? Math.max(1, Math.ceil(diff / (1000 * 3600 * 24))) : 1;
                          setNewService({ ...newService, startDate: newStart, quantity: n });
                        }} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium" suppressHydrationWarning />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Check-out Date ({isNaN(newService.quantity) || !newService.quantity ? 1 : newService.quantity} Nights)</label>
                        <input required type="date" value={newService.endDate || ''} onChange={e => {
                          const newEnd = e.target.value;
                          const diff = new Date(newEnd).getTime() - new Date(newService.startDate).getTime();
                          const n = !isNaN(diff) ? Math.max(1, Math.ceil(diff / (1000 * 3600 * 24))) : 1;
                          setNewService({ ...newService, endDate: newEnd, quantity: n });
                        }} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium" suppressHydrationWarning />
                      </div>
                    </div>
                  </div>

                  {/* ──── LIVE OCCUPANCY MATCH BANNER ──── */}
                  {(() => {
                    const isRoom = newService.pricingBasis === 'Room';
                    const sC = newService.singleCount || 0;
                    const dC = newService.doubleCount || 0;
                    const twC = newService.twinCount || 0;
                    const trC = newService.tripleCount || 0;
                    const ebC = newService.dblEbCount || 0;

                    const accomPax = isRoom 
                      ? (sC * 1 + dC * 2 + twC * 2 + trC * 3 + ebC * 3) 
                      : (sC + dC + twC + trC + ebC);
                    const totalTourPax = (tour?.pax || 0);
                    const isMatched = accomPax === totalTourPax || totalTourPax === 0;

                    return (
                      <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${isMatched ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{isMatched ? '🟢' : '🟡'}</span>
                          <span>
                            Accommodating <strong>{accomPax} Pax</strong> {isRoom ? `in ${sC + dC + twC + trC + ebC} Rooms` : 'on Pax Basis'}
                            {isMatched ? ' — Matched with Tour Bookings' : ` (Tour Total: ${totalTourPax} Pax)`}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-80">
                          {isRoom ? 'Room Mode' : 'Pax Mode'}
                        </span>
                      </div>
                    );
                  })()}
                  
                  {!editingServiceId ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          {newService.pricingBasis === 'Pax' ? 'Passenger Counts & Nightly Rates (€/pax/night) [All Editable]' : 'Room Allocation & Nightly Rates (€/room/night) [All Editable]'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          {/* Single */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Single</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '# Pax' : '# Rooms'}</label>
                                <input type="number" min="0" value={newService.singleCount || 0} onChange={e => setNewService({ ...newService, singleCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">Rate (€)</label>
                                <input type="number" step="0.01" value={newService.singleRate !== undefined ? newService.singleRate : ''} onChange={e => setNewService({ ...newService, singleRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="100" />
                              </div>
                            </div>
                          </div>

                          {/* Double */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Double</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '# Pax' : '# Rooms'}</label>
                                <input type="number" min="0" value={newService.doubleCount || 0} onChange={e => setNewService({ ...newService, doubleCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">Rate (€)</label>
                                <input type="number" step="0.01" value={newService.doubleRate !== undefined ? newService.doubleRate : ''} onChange={e => setNewService({ ...newService, doubleRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="140" />
                              </div>
                            </div>
                          </div>

                          {/* Twin */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Twin</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '# Pax' : '# Rooms'}</label>
                                <input type="number" min="0" value={newService.twinCount || 0} onChange={e => setNewService({ ...newService, twinCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">Rate (€)</label>
                                <input type="number" step="0.01" value={newService.twinRate !== undefined ? newService.twinRate : ''} onChange={e => setNewService({ ...newService, twinRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="140" />
                              </div>
                            </div>
                          </div>

                          {/* Triple */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Triple</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '# Pax' : '# Rooms'}</label>
                                <input type="number" min="0" value={newService.tripleCount || 0} onChange={e => setNewService({ ...newService, tripleCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">Rate (€)</label>
                                <input type="number" step="0.01" value={newService.tripleRate !== undefined ? newService.tripleRate : ''} onChange={e => setNewService({ ...newService, tripleRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="180" />
                              </div>
                            </div>
                          </div>

                          {/* DBL + EB */}
                          <div className="bg-white p-2 rounded-lg border border-purple-200 shadow-2xs space-y-1 ring-1 ring-purple-100">
                            <span className="text-xs font-bold text-purple-900 block truncate" title="Double + Extra Bed">DBL + EB</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '# Pax' : '# Rooms'}</label>
                                <input type="number" min="0" value={newService.dblEbCount || 0} onChange={e => setNewService({ ...newService, dblEbCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-purple-50/50 border border-purple-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">Rate (€)</label>
                                <input type="number" step="0.01" value={newService.dblEbRate !== undefined ? newService.dblEbRate : ''} onChange={e => setNewService({ ...newService, dblEbRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-purple-50/50 border border-purple-200 rounded text-xs font-bold text-purple-700" placeholder="170" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ──── HOTEL DISCOUNT & NOTES FIELDS ──── */}
                      <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/80 space-y-2">
                        <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">Hotel Discount & Notes (Informational)</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-rose-800">Discount Amount (€)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newService.discountAmount !== undefined ? newService.discountAmount : ''}
                              onChange={e => setNewService({ ...newService, discountAmount: parseFloat(e.target.value) || 0 })}
                              className="w-full px-2 py-1 bg-white border border-rose-200 rounded text-xs font-bold text-rose-700"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-bold text-rose-800">Discount Details / Rationale</label>
                            <input
                              type="text"
                              value={newService.discountNotes || ''}
                              onChange={e => setNewService({ ...newService, discountNotes: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-rose-200 rounded text-xs text-slate-800"
                              placeholder="e.g. Early Bird 5% discount applied by hotel management"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Staff Accommodation (Left) & Hotel Tax (Right) Side-by-Side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Staff Accommodation */}
                        <div className="space-y-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-amber-600" /> Staff Accommodation
                            </span>
                            <span className="text-[9px] text-amber-700 italic">Adjust dates</span>
                          </div>

                          <div className="space-y-2">
                            {/* Guide Accommodation */}
                            <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs space-y-1.5">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={!!newService.includeGuideRoom} 
                                  onChange={e => {
                                    const checked = e.target.checked;
                                    setNewService({ 
                                      ...newService, 
                                      includeGuideRoom: checked,
                                      guideStartDate: checked ? (newService.guideStartDate || newService.startDate) : '',
                                      guideEndDate: checked ? (newService.guideEndDate || newService.endDate) : '',
                                      guideRate: checked ? (newService.guideRate || newService.singleRate || 60) : 0
                                    });
                                  }} 
                                  className="w-3.5 h-3.5 text-amber-600 rounded border-slate-300" 
                                />
                                <span className="text-xs font-bold text-slate-800">Include Guide Room</span>
                              </label>

                              {!!newService.includeGuideRoom && (
                                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <div>
                                      <label className="block text-[9px] font-semibold text-slate-500">Check-in</label>
                                      <input type="date" value={newService.guideStartDate || ''} onChange={e => setNewService({ ...newService, guideStartDate: e.target.value })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs" suppressHydrationWarning />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-semibold text-slate-500">Check-out</label>
                                      <input type="date" value={newService.guideEndDate || ''} onChange={e => setNewService({ ...newService, guideEndDate: e.target.value })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs" suppressHydrationWarning />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-semibold text-slate-500">Guide Rate (€/night)</label>
                                    <input type="number" step="0.01" value={newService.guideRate || ''} onChange={e => setNewService({ ...newService, guideRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-amber-700" placeholder="60" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Driver Accommodation */}
                            <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs space-y-1.5">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={!!newService.includeDriverRoom} 
                                  onChange={e => {
                                    const checked = e.target.checked;
                                    setNewService({ 
                                      ...newService, 
                                      includeDriverRoom: checked,
                                      driverStartDate: checked ? (newService.driverStartDate || newService.startDate) : '',
                                      driverEndDate: checked ? (newService.driverEndDate || newService.endDate) : '',
                                      driverRate: checked ? (newService.driverRate || newService.singleRate || 50) : 0
                                    });
                                  }} 
                                  className="w-3.5 h-3.5 text-amber-600 rounded border-slate-300" 
                                />
                                <span className="text-xs font-bold text-slate-800">Include Driver Room</span>
                              </label>

                              {!!newService.includeDriverRoom && (
                                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <div>
                                      <label className="block text-[9px] font-semibold text-slate-500">Check-in</label>
                                      <input type="date" value={newService.driverStartDate || ''} onChange={e => setNewService({ ...newService, driverStartDate: e.target.value })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs" suppressHydrationWarning />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] font-semibold text-slate-500">Check-out</label>
                                      <input type="date" value={newService.driverEndDate || ''} onChange={e => setNewService({ ...newService, driverEndDate: e.target.value })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs" suppressHydrationWarning />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-semibold text-slate-500">Driver Rate (€/night)</label>
                                    <input type="number" step="0.01" value={newService.driverRate || ''} onChange={e => setNewService({ ...newService, driverRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-amber-700" placeholder="50" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Hotel / City Tax (Per Night Per Pax) */}
                        <div className="space-y-2 bg-blue-50/60 p-3 rounded-xl border border-blue-200/80">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Hotel Tax (City Tax)
                            </span>
                            <span className="text-[9px] text-blue-700 italic">Per Pax / Night</span>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-blue-200 shadow-2xs space-y-1.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={!!newService.includeHotelTax} 
                                onChange={e => {
                                  const checked = e.target.checked;
                                  setNewService({ 
                                    ...newService, 
                                    includeHotelTax: checked,
                                    hotelTaxRate: checked ? (newService.hotelTaxRate || 2.50) : 0
                                  });
                                }} 
                                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300" 
                              />
                              <span className="text-xs font-bold text-slate-800">Include Hotel / City Tax</span>
                            </label>

                            {!!newService.includeHotelTax && (
                              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                <div>
                                  <label className="block text-[9px] font-semibold text-slate-500">Tax Rate (€ / pax / night)</label>
                                  <input 
                                    type="number" 
                                    step="0.10" 
                                    value={newService.hotelTaxRate || ''} 
                                    onChange={e => setNewService({ ...newService, hotelTaxRate: parseFloat(e.target.value) || 0 })} 
                                    className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-blue-700" 
                                    placeholder="2.50" 
                                  />
                                </div>
                                <div className="p-2 bg-blue-50/50 rounded-md text-[10px] text-blue-900 font-medium space-y-0.5 border border-blue-100">
                                  <div className="flex justify-between">
                                    <span>Total Pax:</span>
                                    <span className="font-bold">{tour?.pax || 0} Pax</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Nightly Tax ({tour?.pax || 0} × €{newService.hotelTaxRate || 0}):</span>
                                    <span className="font-bold">€{((tour?.pax || 0) * (newService.hotelTaxRate || 0)).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between pt-0.5 border-t border-blue-200/60 font-bold text-blue-950">
                                    <span>Total Stay Tax ({newService.quantity || 1} N):</span>
                                    <span>€{((tour?.pax || 0) * (newService.hotelTaxRate || 0) * (newService.quantity || 1)).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                        {/* Live Preview Column */}
                        <div className="md:col-span-1">
                          {!editingServiceId && newService.hotelId && (() => {
                            const safeQty = isNaN(newService.quantity) || !newService.quantity ? 0 : newService.quantity;
                            const gNights = !!newService.includeGuideRoom && newService.guideStartDate && newService.guideEndDate
                              ? Math.max(1, Math.ceil((new Date(newService.guideEndDate).getTime() - new Date(newService.guideStartDate).getTime()) / (1000 * 3600 * 24)))
                              : 0;
                            const dNights = !!newService.includeDriverRoom && newService.driverStartDate && newService.driverEndDate
                              ? Math.max(1, Math.ceil((new Date(newService.driverEndDate).getTime() - new Date(newService.driverStartDate).getTime()) / (1000 * 3600 * 24)))
                              : 0;

                            const gTotal = gNights * (newService.guideRate || 0);
                            const dTotal = dNights * (newService.driverRate || 0);
                            const taxTotal = newService.includeHotelTax ? (newService.hotelTaxRate || 0) * (tour?.pax || 0) * safeQty : 0;

                            const passengerTotal = (
                              (newService.singleCount * (newService.singleRate || 0) * safeQty) +
                              (newService.doubleCount * (newService.doubleRate || 0) * safeQty) +
                              (newService.twinCount * (newService.twinRate || 0) * safeQty) +
                              (newService.tripleCount * (newService.tripleRate || 0) * safeQty) +
                              (newService.dblEbCount * (newService.dblEbRate || 0) * safeQty)
                            );

                            return (
                              <div className="bg-indigo-50/80 border border-indigo-100 p-3 rounded-xl space-y-1.5 h-full flex flex-col justify-between">
                                <div>
                                  <h4 className="text-xs font-bold text-indigo-900 mb-1.5">Live Package Cost Summary</h4>
                                  <div className="space-y-1 text-xs text-indigo-800">
                                    {newService.singleCount > 0 && <div className="flex justify-between"><span>Single ({newService.singleCount} × €{newService.singleRate || 0})</span> <span>€{(newService.singleCount * (newService.singleRate || 0) * safeQty).toLocaleString()}</span></div>}
                                    {newService.doubleCount > 0 && <div className="flex justify-between"><span>Double ({newService.doubleCount} × €{newService.doubleRate || 0})</span> <span>€{(newService.doubleCount * (newService.doubleRate || 0) * safeQty).toLocaleString()}</span></div>}
                                    {newService.twinCount > 0 && <div className="flex justify-between"><span>Twin ({newService.twinCount} × €{newService.twinRate || 0})</span> <span>€{(newService.twinCount * (newService.twinRate || 0) * safeQty).toLocaleString()}</span></div>}
                                    {newService.tripleCount > 0 && <div className="flex justify-between"><span>Triple ({newService.tripleCount} × €{newService.tripleRate || 0})</span> <span>€{(newService.tripleCount * (newService.tripleRate || 0) * safeQty).toLocaleString()}</span></div>}
                                    {newService.dblEbCount > 0 && <div className="flex justify-between"><span>DBL+EB ({newService.dblEbCount} × €{newService.dblEbRate || 0})</span> <span>€{(newService.dblEbCount * (newService.dblEbRate || 0) * safeQty).toLocaleString()}</span></div>}
                                    {gNights > 0 && <div className="flex justify-between text-amber-800 font-medium"><span>Guide Room ({gNights}N × €{newService.guideRate || 0})</span> <span>€{gTotal.toLocaleString()}</span></div>}
                                    {dNights > 0 && <div className="flex justify-between text-amber-800 font-medium"><span>Driver Room ({dNights}N × €{newService.driverRate || 0})</span> <span>€{dTotal.toLocaleString()}</span></div>}
                                    {newService.includeHotelTax && (newService.hotelTaxRate || 0) > 0 && <div className="flex justify-between text-blue-800 font-medium"><span>Hotel Tax ({tour?.pax || 0} Pax × {safeQty}N × €{newService.hotelTaxRate})</span> <span>€{taxTotal.toLocaleString()}</span></div>}
                                  </div>
                                </div>
                                <div className="pt-2 border-t border-indigo-200 flex justify-between font-bold text-xs text-indigo-900">
                                  <span>Total Package Cost</span>
                                  <span>€{(passengerTotal + gTotal + dTotal + taxTotal).toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Room Type</label>
                        <select value={newService.roomType} onChange={e => setNewService({ ...newService, roomType: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                          {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Rooms</label>
                        <input required type="number" min="1" value={newService.roomCount} onChange={e => setNewService({ ...newService, roomCount: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                      </div>
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
                  <div className="mb-4 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                     <div>
                        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-0.5">Tour Bounds</p>
                        <p className="text-sm text-blue-900 font-medium">
                           {new Date(tour?.arrivalDate || '').toLocaleDateString()} — {new Date(tour?.endDate || '').toLocaleDateString()}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-0.5">Total Days</p>
                        <p className="text-sm text-blue-900 font-medium">
                           {Math.max(1, Math.ceil((new Date(tour?.endDate || '').getTime() - new Date(tour?.arrivalDate || '').getTime()) / (1000 * 3600 * 24)) + 1) || 1}
                        </p>
                     </div>
                  </div>

                  {newService.guideAssignments?.map((ga: any, index: number) => (
                    <div key={ga.id} className="relative bg-slate-50 border border-slate-200 p-4 rounded-xl mb-4">
                      {newService.guideAssignments.length > 1 && !editingServiceId && (
                        <button type="button" onClick={() => {
                          setNewService({ ...newService, guideAssignments: newService.guideAssignments.filter((_: any, i: number) => i !== index) })
                        }} className="absolute top-3 right-3 text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="mb-4 pr-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Guide</label>
                        <select required value={ga.guideId} onChange={e => {
                          const newAssignments = [...newService.guideAssignments];
                          newAssignments[index].guideId = e.target.value;
                          setNewService({ ...newService, guideAssignments: newAssignments });
                        }} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                          <option value="">Select a Guide...</option>
                          {guides.map((g: any) => <option key={g.id} value={g.id}>{g.name} — {g.language} (€{g.dailyRate}/day)</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                          <input required type="date" value={ga.startDate} onChange={e => {
                            const newStart = e.target.value;
                            const qty = Math.max(1, Math.ceil((new Date(ga.endDate).getTime() - new Date(newStart).getTime()) / (1000 * 3600 * 24)) + 1) || 1;
                            const newAssignments = [...newService.guideAssignments];
                            newAssignments[index].startDate = newStart;
                            newAssignments[index].quantity = qty;
                            setNewService({ ...newService, guideAssignments: newAssignments });
                          }} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                          <input required type="date" value={ga.endDate} onChange={e => {
                            const newEnd = e.target.value;
                            const qty = Math.max(1, Math.ceil((new Date(newEnd).getTime() - new Date(ga.startDate).getTime()) / (1000 * 3600 * 24)) + 1) || 1;
                            const newAssignments = [...newService.guideAssignments];
                            newAssignments[index].endDate = newEnd;
                            newAssignments[index].quantity = qty;
                            setNewService({ ...newService, guideAssignments: newAssignments });
                          }} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                      </div>

                      {editingServiceId && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Days</label>
                            <input required type="number" min="1" value={ga.quantity} onChange={e => {
                              const newAssignments = [...newService.guideAssignments];
                              newAssignments[index].quantity = parseInt(e.target.value);
                              setNewService({ ...newService, guideAssignments: newAssignments });
                            }} className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Daily Rate (€)</label>
                            <input required type="number" min="0" step="0.01" value={ga.unitPrice ?? newService.unitPrice} onChange={e => {
                              const newAssignments = [...newService.guideAssignments];
                              newAssignments[index].unitPrice = parseFloat(e.target.value);
                              setNewService({ ...newService, guideAssignments: newAssignments });
                            }} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {!editingServiceId && (
                    <button type="button" onClick={() => {
                       const lastEnd = newService.guideAssignments[newService.guideAssignments.length - 1]?.endDate || tour?.arrivalDate?.split('T')[0];
                       const nextStart = lastEnd;
                       const qty = Math.max(1, Math.ceil((new Date(tour?.endDate || new Date()).getTime() - new Date(nextStart).getTime()) / (1000 * 3600 * 24)) + 1) || 1;
                       setNewService({ 
                         ...newService, 
                         guideAssignments: [
                           ...newService.guideAssignments, 
                           { 
                             id: Date.now(), 
                             guideId: '', 
                             startDate: nextStart, 
                             endDate: tour?.endDate?.split('T')[0] || '', 
                             quantity: qty, 
                             unitPrice: 0 
                           }
                         ] 
                       });
                    }} className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 text-sm mb-4">
                      <Plus className="w-4 h-4" /> Add another Guide
                    </button>
                  )}
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (Passenger Names, etc)</label>
                    <input required type="text" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Flight for Group A" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Flight No</label>
                      <input required type="text" value={newService.flightNo} onChange={e => setNewService({ ...newService, flightNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="TK 1234" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Flight Date</label>
                      <input required type="date" value={newService.serviceDate} onChange={e => setNewService({ ...newService, serviceDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">From Airport</label>
                      <input required type="text" value={newService.fromAirport} onChange={e => setNewService({ ...newService, fromAirport: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="IST" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">To Airport</label>
                      <input required type="text" value={newService.toAirport} onChange={e => setNewService({ ...newService, toAirport: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="BUD" />
                    </div>
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
                      setNewService({ ...newService, excursionId: ex?.id || null, description: ex?.name || '', unitPrice: ex?.salePrice || 0 });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm">
                      <option value="">Select an Excursion...</option>
                      {excursions.map((ex: any) => <option key={ex.id} value={ex.id}>{ex.name} — {ex.type} (Sale: €{ex.salePrice}/pax)</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                      <input required type="date" value={newService.serviceDate || ''} onChange={e => setNewService({ ...newService, serviceDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pax / Qty</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Sale Price per Pax (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {/* Other */}
              {serviceType === 'Other' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                    <select required value={newService.serviceCategoryId || ''} onChange={e => {
                      setNewService({ ...newService, serviceCategoryId: parseInt(e.target.value) });
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select a Category...</option>
                      {serviceCategories.filter((c: any) => newService.isRevenue ? c.isRevenue : c.isCost).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <input required type="text" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Parking fee at Museum" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
                      <input required type="number" min="1" value={newService.quantity} onChange={e => setNewService({ ...newService, quantity: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit Price (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {/* Invoiced Fee */}
              {serviceType === 'Invoiced Fee' && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pax (Adults)</label>
                      <input required type="number" min="0" value={newService.pax ?? (tour?.pax || 0)} onChange={e => setNewService({ ...newService, pax: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Children</label>
                      <input required type="number" min="0" value={newService.children ?? (tour?.children || 0)} onChange={e => setNewService({ ...newService, children: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Infants</label>
                      <input required type="number" min="0" value={newService.infants ?? (tour?.infants || 0)} onChange={e => setNewService({ ...newService, infants: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>
                  {((newService.pax ?? 0) + (newService.children ?? 0) + (newService.infants ?? 0)) !== ((tour?.pax || 0) + (tour?.children || 0) + (tour?.infants || 0)) && (
                    <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-xs font-semibold mb-4 border border-amber-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Warning: The entered passengers ({(newService.pax ?? 0) + (newService.children ?? 0) + (newService.infants ?? 0)}) does not match the total Tour passengers ({(tour?.pax || 0) + (tour?.children || 0) + (tour?.infants || 0)}).
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit Price (€)</label>
                      <input required type="number" min="0" step="0.01" value={newService.unitPrice} onChange={e => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Calculated Total (€)</label>
                      <input disabled type="text" value={(newService.unitPrice * ((newService.pax ?? 0) + 0.5 * (newService.children ?? 0))).toFixed(2)} className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold text-sm" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <input type="text" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Optional (defaults to passenger breakdown)" />
                  </div>
                </>
              )}

              {/* Cost preview */}
              {newService.unitPrice > 0 && serviceType !== 'Invoiced Fee' && serviceType !== 'Hotel' && (
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

      {/* ──── INVOICE TAB ──── */}
      {activeTab === 'invoice' && (
        <div className="p-6 max-w-5xl mx-auto print:p-0 print:max-w-none">
          {!isInvoiceEditing && !currentInvoice ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Invoices</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage generated invoices and supplier attachments for this tour</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsAttachModalOpen(true)} className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors gap-1.5 border border-slate-200 shadow-2xs">
                    <Paperclip className="w-4 h-4 text-slate-500" /> Attach Invoice File
                  </button>
                  <button onClick={handleCreateNewInvoice} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors gap-1.5 shadow-2xs">
                    <Plus className="w-4 h-4" /> Create Invoice
                  </button>
                </div>
              </div>

              {invoices.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-slate-800 mb-1">No generated invoices yet</h3>
                  <p className="text-slate-500 text-xs mb-4">Create an in-app invoice for this tour.</p>
                  <button onClick={handleCreateNewInvoice} className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors">
                    Create Invoice
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Invoice No</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">To Company</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-800">{inv.invoiceNo}</td>
                          <td className="px-6 py-4 text-slate-600">{inv.name}</td>
                          <td className="px-6 py-4 text-slate-600">{new Date(inv.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-slate-600">{inv.toCompany || '-'}</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{getCurrencySymbol(inv.currency)}{inv.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setCurrentInvoice(inv)} className="text-blue-600 hover:text-blue-800 font-medium text-xs px-3 py-1 bg-blue-50 rounded-lg mr-2">View</button>
                            <button onClick={() => { setEditingInvoiceData(inv); setIsInvoiceEditing(true); setCurrentInvoice(null); }} className="text-slate-500 hover:text-slate-800 p-1.5"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteInvoice(inv.id)} className="text-red-400 hover:text-red-600 p-1.5"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Attached Invoice Files Subsection */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-blue-600" /> Attached Invoice Files & Receipts
                    </h3>
                    <p className="text-xs text-slate-500">External supplier invoices, excursion receipts, and documents attached to this tour</p>
                  </div>
                  <button onClick={() => setIsAttachModalOpen(true)} className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors gap-1">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>

                {attachments.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                    <Paperclip className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs font-medium mb-2">No files attached to this tour yet.</p>
                    <button onClick={() => setIsAttachModalOpen(true)} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors">
                      <Upload className="w-3.5 h-3.5 mr-1" /> Attach Invoice File
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                    {attachments.map(att => (
                      <div key={att.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {att.fileName.endsWith('.pdf') ? 'PDF' : att.fileName.match(/\.(png|jpg|jpeg)$/i) ? 'IMG' : 'DOC'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                              {att.fileName}
                            </p>
                            {att.description && <p className="text-xs text-slate-500 mt-0.5">{att.description}</p>}
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Uploaded: {new Date(att.uploadedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} • {(att.fileSize / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={`${API}/tours/${tourId}/attachments/${att.id}/view`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </a>
                          <a 
                            href={`${API}/tours/${tourId}/attachments/${att.id}/download`} 
                            download={att.fileName}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                          <button 
                            type="button"
                            onClick={() => handleDeleteAttachment(att.id)} 
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none">
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center rounded-t-2xl print:hidden">
                <button onClick={() => { setIsInvoiceEditing(false); setCurrentInvoice(null); }} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-800">
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Invoices
                </button>
                <div className="flex gap-2">
                  <button onClick={handlePrintInvoice} className="flex items-center px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                    <Printer className="w-4 h-4 mr-1.5" /> Print / PDF
                  </button>
                  {currentInvoice && (
                    <button onClick={() => { setEditingInvoiceData(currentInvoice); setIsInvoiceEditing(true); setCurrentInvoice(null); }} className="flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                      <Edit className="w-4 h-4 mr-1.5" /> Edit
                    </button>
                  )}
                  {isInvoiceEditing && (
                    <button onClick={handleSaveInvoice} className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                      <Save className="w-4 h-4 mr-1.5" /> Save Invoice
                    </button>
                  )}
                </div>
              </div>

              {/* Invoice Content */}
              <div className="p-12 print:p-0">
                {isInvoiceEditing ? (
                  <div className="space-y-8">
                    {/* Edit Form */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-800 border-b pb-2">From</h4>
                        <input value={editingInvoiceData.fromCompany} onChange={e => setEditingInvoiceData({...editingInvoiceData, fromCompany: e.target.value})} placeholder="Company Name" className="w-full text-sm border-b border-slate-200 py-1" />
                        <textarea value={editingInvoiceData.fromAddress} onChange={e => setEditingInvoiceData({...editingInvoiceData, fromAddress: e.target.value})} placeholder="Address" className="w-full text-sm border-b border-slate-200 py-1 h-20" />
                        <input value={editingInvoiceData.fromTel} onChange={e => setEditingInvoiceData({...editingInvoiceData, fromTel: e.target.value})} placeholder="Phone" className="w-full text-sm border-b border-slate-200 py-1" />
                        <input value={editingInvoiceData.fromVAT} onChange={e => setEditingInvoiceData({...editingInvoiceData, fromVAT: e.target.value})} placeholder="VAT Number" className="w-full text-sm border-b border-slate-200 py-1" />
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-800 border-b pb-2">To</h4>
                        <input value={editingInvoiceData.toCompany} onChange={e => setEditingInvoiceData({...editingInvoiceData, toCompany: e.target.value})} placeholder="Client Company Name" className="w-full text-sm border-b border-slate-200 py-1" />
                        <textarea value={editingInvoiceData.toAddress} onChange={e => setEditingInvoiceData({...editingInvoiceData, toAddress: e.target.value})} placeholder="Client Address" className="w-full text-sm border-b border-slate-200 py-1 h-20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Invoice Name (Internal)</label>
                        <input value={editingInvoiceData.name} onChange={e => setEditingInvoiceData({...editingInvoiceData, name: e.target.value})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Invoice No</label>
                        <input value={editingInvoiceData.invoiceNo} onChange={e => setEditingInvoiceData({...editingInvoiceData, invoiceNo: e.target.value})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                        <input type="date" value={editingInvoiceData.date} onChange={e => setEditingInvoiceData({...editingInvoiceData, date: e.target.value})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Currency</label>
                        <select value={editingInvoiceData.currency || 'EUR'} onChange={e => setEditingInvoiceData({...editingInvoiceData, currency: e.target.value})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1">
                          <option value="EUR">EU (€)</option>
                          <option value="TRL">TRL (₺)</option>
                          <option value="USD">USD ($)</option>
                          <option value="CZK">CZK (Kč)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">View Mode</label>
                        <select value={editingInvoiceData.isSimpleView ? 'simple' : 'detailed'} onChange={e => setEditingInvoiceData({...editingInvoiceData, isSimpleView: e.target.value === 'simple'})} className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1">
                          <option value="detailed">Detailed (Show Lines)</option>
                          <option value="simple">Simple (Total Only)</option>
                        </select>
                      </div>
                    </div>

                    {!editingInvoiceData.isSimpleView && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-800 border-b pb-2">Line Items</h4>
                        {(() => {
                          const lines = typeof editingInvoiceData.linesJson === 'string' ? JSON.parse(editingInvoiceData.linesJson) : editingInvoiceData.linesJson;
                          return (
                            <table className="w-full text-left text-sm">
                              <thead className="text-slate-500 border-b border-slate-200">
                                <tr>
                                  <th className="py-2">Description</th>
                                  <th className="py-2">Qty</th>
                                  <th className="py-2">Price</th>
                                  <th className="py-2">Total</th>
                                  <th className="py-2"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {lines.map((line: any, idx: number) => (
                                  <tr key={idx} className="border-b border-slate-50">
                                    <td className="py-2 pr-2">
                                      <input value={line.description} onChange={e => {
                                        const newLines = [...lines];
                                        newLines[idx].description = e.target.value;
                                        setEditingInvoiceData({...editingInvoiceData, linesJson: newLines});
                                      }} className="w-full bg-slate-50 px-2 py-1 border border-slate-200 rounded" />
                                    </td>
                                    <td className="py-2 pr-2 w-20">
                                      <input type="number" value={line.quantity} onChange={e => {
                                        const newLines = [...lines];
                                        newLines[idx].quantity = parseFloat(e.target.value) || 0;
                                        newLines[idx].totalAmount = newLines[idx].quantity * newLines[idx].unitPrice;
                                        setEditingInvoiceData({...editingInvoiceData, linesJson: newLines, totalAmount: newLines.reduce((acc: number, l: any) => acc + l.totalAmount, 0)});
                                      }} className="w-full bg-slate-50 px-2 py-1 border border-slate-200 rounded" />
                                    </td>
                                    <td className="py-2 pr-2 w-24">
                                      <input type="number" value={line.unitPrice} onChange={e => {
                                        const newLines = [...lines];
                                        newLines[idx].unitPrice = parseFloat(e.target.value) || 0;
                                        newLines[idx].totalAmount = newLines[idx].quantity * newLines[idx].unitPrice;
                                        setEditingInvoiceData({...editingInvoiceData, linesJson: newLines, totalAmount: newLines.reduce((acc: number, l: any) => acc + l.totalAmount, 0)});
                                      }} className="w-full bg-slate-50 px-2 py-1 border border-slate-200 rounded" />
                                    </td>
                                    <td className="py-2 font-medium">{getCurrencySymbol(editingInvoiceData.currency)}{line.totalAmount.toLocaleString()}</td>
                                    <td className="py-2 text-right">
                                      <button onClick={() => {
                                        const newLines = lines.filter((_: any, i: number) => i !== idx);
                                        setEditingInvoiceData({...editingInvoiceData, linesJson: newLines, totalAmount: newLines.reduce((acc: number, l: any) => acc + l.totalAmount, 0)});
                                      }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()}
                      </div>
                    )}
                    
                    {/* Total Amount always visible in edit mode */}
                    <div className="flex justify-between items-center pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const lines = typeof editingInvoiceData.linesJson === 'string' 
                            ? JSON.parse(editingInvoiceData.linesJson || '[]') 
                            : (editingInvoiceData.linesJson || []);
                          const sum = lines.reduce((acc: number, l: any) => acc + (l.totalAmount || 0), 0);
                          setEditingInvoiceData({ ...editingInvoiceData, totalAmount: sum });
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                      >
                        ⚡ Auto-Sum From Line Items
                      </button>
                      <div className="w-64">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-800 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                          <span>Total Amount:</span>
                          <div className="flex items-center">
                            <span className="mr-1">{getCurrencySymbol(editingInvoiceData.currency)}</span>
                            <input type="number" value={editingInvoiceData.totalAmount} onChange={e => setEditingInvoiceData({...editingInvoiceData, totalAmount: parseFloat(e.target.value) || 0})} className="w-24 text-right bg-white border border-slate-300 rounded px-2 py-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View / Print Layout
                  <div className="bg-white">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-16">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                           <img src="/logo.png" alt="UNO ERP Logo" className="w-10 h-10 object-contain" />
                           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">UNO TRAVEL</h1>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p className="font-medium text-slate-800">{currentInvoice.fromCompany}</p>
                          <p className="whitespace-pre-line">{currentInvoice.fromAddress}</p>
                          <p>{currentInvoice.fromTel}</p>
                          <p>{currentInvoice.fromVAT}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h2 className="text-4xl font-light text-slate-300 tracking-wider uppercase mb-6">Invoice</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <div className="font-medium text-slate-500">Invoice No:</div>
                          <div className="font-semibold text-slate-800">{currentInvoice.invoiceNo}</div>
                          <div className="font-medium text-slate-500">Date:</div>
                          <div className="font-semibold text-slate-800">{new Date(currentInvoice.date).toLocaleDateString()}</div>
                          <div className="font-medium text-slate-500">Tour Ref:</div>
                          <div className="font-semibold text-slate-800">{tour.tourCode}</div>
                        </div>
                      </div>
                    </div>

                    {/* Bill To */}
                    <div className="mb-12">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Bill To:</h3>
                      <div className="text-sm text-slate-800">
                        <p className="font-bold text-lg mb-1">{currentInvoice.toCompany || 'N/A'}</p>
                        <p className="whitespace-pre-line text-slate-600">{currentInvoice.toAddress}</p>
                      </div>
                    </div>

                    {/* Lines */}
                    {!currentInvoice.isSimpleView && (
                      <div className="mb-12">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr>
                              <th className="px-4 py-3 rounded-l-lg">Description</th>
                              <th className="px-4 py-3 text-center">Qty</th>
                              <th className="px-4 py-3 text-right">Price</th>
                              <th className="px-4 py-3 text-right rounded-r-lg">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(typeof currentInvoice.linesJson === 'string' ? JSON.parse(currentInvoice.linesJson) : currentInvoice.linesJson).map((line: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 font-medium text-slate-800">{line.description}</td>
                                <td className="px-4 py-3 text-center text-slate-600">{line.quantity}</td>
                                <td className="px-4 py-3 text-right text-slate-600">{getCurrencySymbol(currentInvoice.currency)}{line.unitPrice.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-medium text-slate-800">{getCurrencySymbol(currentInvoice.currency)}{line.totalAmount.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-end">
                      <div className="w-72 bg-slate-50 p-6 rounded-2xl">
                        <div className="flex justify-between items-center text-lg font-bold text-slate-800">
                          <span>Total Due</span>
                          <span>{getCurrencySymbol(currentInvoice.currency)}{currentInvoice.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attach Invoice File Modal */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-blue-600" /> Attach Invoice File
              </h3>
              <button type="button" onClick={() => setIsAttachModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadAttachment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select File (PDF, Image, Document)
                </label>
                <input 
                  required
                  type="file"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-xl p-1.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  File Title / Notes (Optional)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Excursion Receipt, Hotel Supplier Invoice"
                  value={fileDescription}
                  onChange={e => setFileDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAttachModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingFile || !selectedFile}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}



