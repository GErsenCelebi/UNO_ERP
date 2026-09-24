"use client"
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Edit, Pencil, Briefcase, MapPin, CalendarDays, Users, Plus, X, Trash2, PlaneLanding, PlaneTakeoff, Hotel, Car, PersonStanding, Compass, Plane, Save, Package, FileText, Printer, AlertTriangle, XCircle, FileSpreadsheet, Search, ChevronDown, ChevronRight, Building2, Truck, Paperclip, Upload, ExternalLink, Eye, Download, PieChart, DollarSign, Sparkles, Tag, Percent } from 'lucide-react';

import TourCheckpointWidget from '@/components/TourCheckpointWidget';
import { formatDate, getFlightAwareUrl } from '@/lib/utils';
import { getApiUrl } from '@/lib/apiConfig';

const API = getApiUrl();

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

const ROOM_TYPES = ['Single', 'Double', 'Twin', 'Triple', 'Double + Extra Bed (DBL+EB)', 'Suite', 'Guide Room', 'Driver Room'];

const getPaxPerRoom = (roomType?: string): number => {
  const rt = (roomType || '').toLowerCase();
  if (rt.includes('single') || rt.includes('guide') || rt.includes('driver') || rt.includes('sgl')) return 1;
  if (rt.includes('triple') || rt.includes('trp') || rt.includes('tpl')) return 3;
  if (rt.includes('extra bed') || rt.includes('eb') || rt.includes('dbl+eb')) return 3;
  if (rt.includes('quad') || rt.includes('qdr')) return 4;
  return 2;
};

const getHotelDefaultRate = (hotel: any, roomType: string, basis: string): number => {
  if (!hotel) return 0;
  const isRoom = (basis || 'Room').toLowerCase().includes('room');
  const rt = (roomType || '').toLowerCase();
  if (rt.includes('single') || rt.includes('sgl')) {
    return isRoom ? (hotel.singleRoomRate || hotel.singleRate || 0) : (hotel.singlePaxRate || hotel.singleRate || 0);
  }
  if (rt.includes('triple') || rt.includes('trp') || rt.includes('tpl')) {
    return isRoom 
      ? (hotel.tripleRoomRate || (hotel.triplePaxRate ? hotel.triplePaxRate * 3 : 0) || hotel.tripleRate || 0)
      : (hotel.triplePaxRate || (hotel.tripleRoomRate ? hotel.tripleRoomRate / 3 : 0) || hotel.tripleRate || 0);
  }
  if (rt.includes('extra bed') || rt.includes('eb') || rt.includes('dbl+eb')) {
    return isRoom 
      ? (hotel.dblEbRoomRate || (hotel.dblEbPaxRate ? hotel.dblEbPaxRate * 3 : 0) || hotel.dblEbRate || 0)
      : (hotel.dblEbPaxRate || (hotel.dblEbRoomRate ? hotel.dblEbRoomRate / 3 : 0) || hotel.dblEbRate || 0);
  }
  if (rt.includes('twin') || rt.includes('twn')) {
    return isRoom 
      ? (hotel.twinRoomRate || (hotel.twinPaxRate ? hotel.twinPaxRate * 2 : 0) || hotel.twinRate || 0)
      : (hotel.twinPaxRate || (hotel.twinRoomRate ? hotel.twinRoomRate / 2 : 0) || hotel.twinRate || 0);
  }
  if (rt.includes('guide') || rt.includes('driver')) {
    return isRoom ? (hotel.singleRoomRate || hotel.singleRate || 60) : (hotel.singlePaxRate || hotel.singleRate || 60);
  }
  // Double / default
  return isRoom 
    ? (hotel.doubleRoomRate || (hotel.doublePaxRate ? hotel.doublePaxRate * 2 : 0) || hotel.doubleRate || 0)
    : (hotel.doublePaxRate || (hotel.doubleRoomRate ? hotel.doubleRoomRate / 2 : 0) || hotel.doubleRate || 0);
};

const isHotelDiscountService = (s: TourService): boolean => {
  return s.serviceCategoryId === 1003 || s.roomType === 'Hotel Discount' || (s.description || '').toLowerCase().includes('hotel discount');
};

const isHotelTaxService = (s: TourService): boolean => {
  const rt = (s.roomType || '').toLowerCase();
  const desc = (s.description || '').toLowerCase();
  return rt === 'city tax' || rt === 'hotel tax' || desc.includes('hotel tax') || desc.includes('city tax');
};

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

  // Pivot breakdown state
  const [isBreakdownTableExpanded, setIsBreakdownTableExpanded] = useState(false);
  const [pivotGroupBy, setPivotGroupBy] = useState<'category' | 'bucket'>('category');
  const [pivotExpandAll, setPivotExpandAll] = useState(true);
  const [pivotExpandedRows, setPivotExpandedRows] = useState<Record<string, boolean>>({});
  const togglePivotRow = (groupName: string) => {
    setPivotExpandedRows(prev => ({
      ...prev,
      [groupName]: !(prev[groupName] ?? pivotExpandAll)
    }));
  };

  // Passenger age & classification helper (under 12 = Children, 12+ = Adult)
  const calculatePassengerAge = (dobStr: string, arrivalDateStr?: string): number | null => {
    if (!dobStr) return null;
    const ref = arrivalDateStr ? new Date(arrivalDateStr) : new Date();
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return null;
    let age = ref.getFullYear() - dob.getFullYear();
    const m = ref.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const getPassengerPaxType = (p: any, arrivalDateStr?: string): 'Adult' | 'Children' | 'Infant' => {
    if (p.dateOfBirth) {
      const age = calculatePassengerAge(p.dateOfBirth, arrivalDateStr);
      if (age !== null) {
        if (age < 2) return 'Infant';
        if (age < 12) return 'Children';
        return 'Adult';
      }
    }
    if (p.paxType) {
      const pt = String(p.paxType).toLowerCase();
      if (pt.includes('child') || pt.includes('chd') || pt.includes('çocuk') || pt.includes('cocuk')) return 'Children';
      if (pt.includes('infant') || pt.includes('bebek') || pt.includes('inf')) return 'Infant';
      return 'Adult';
    }
    return 'Adult';
  };

  // Passenger modal & search state & handlers
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [editingPassengerId, setEditingPassengerId] = useState<number | null>(null);
  const [passengerData, setPassengerData] = useState<any>({
    firstName: '', lastName: '', gender: 'Male', nationalId: '', passportNo: '',
    passportType: 'Regular', visaNo: '', phone: '', dateOfBirth: '', roomType: 'Double', pax: 1, address: '',
    paxType: 'Adult'
  });

  const openAddPassengerModal = () => {
    setEditingPassengerId(null);
    setPassengerData({
      firstName: '', lastName: '', gender: 'Male', nationalId: '', passportNo: '',
      passportType: 'Regular', visaNo: '', phone: '', dateOfBirth: '', roomType: 'Double', pax: 1, address: '',
      paxType: 'Adult'
    });
    setIsPassengerModalOpen(true);
  };

  const openEditPassengerModal = (p: any) => {
    setEditingPassengerId(p.id);
    const resolvedType = getPassengerPaxType(p, tour?.arrivalDate);
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
      address: p.address || '',
      paxType: p.paxType || resolvedType
    });
    setIsPassengerModalOpen(true);
  };

  // Missing Main Services Detection (Guide, Hotel booking, transportation, flight #)
  const missingMainServices: { key: string; label: string; action: string }[] = useMemo(() => {
    if (!tour) return [];
    const missing: { key: string; label: string; action: string }[] = [];
    
    // 1. Guide check
    const hasGuide = services.some(s => 
      s.guideId || 
      s.serviceCategoryId === 4 || 
      (s.serviceCategory?.name || '').toLowerCase().includes('guide') ||
      (s.description || '').toLowerCase().includes('guide')
    );
    if (!hasGuide) missing.push({ key: 'guide', label: 'Tour Guide', action: 'Assign a guide under Services' });

    // 2. Hotel booking check
    const hasHotel = services.some(s => 
      s.hotelId || 
      s.serviceCategoryId === 1 || 
      (s.serviceCategory?.name || '').toLowerCase().includes('hotel') ||
      (s.description || '').toLowerCase().includes('hotel')
    );
    if (!hasHotel) missing.push({ key: 'hotel', label: 'Hotel Booking', action: 'Add hotel booking under Services' });

    // 3. Transportation check
    const hasTransport = services.some(s => 
      s.driverId || 
      s.transportCompanyId || 
      s.serviceCategoryId === 3 || 
      s.serviceCategoryId === 5 || 
      (s.serviceCategory?.name || '').toLowerCase().includes('transport') || 
      (s.serviceCategory?.name || '').toLowerCase().includes('driver') ||
      (s.description || '').toLowerCase().includes('transport') ||
      (s.description || '').toLowerCase().includes('driver') ||
      (s.description || '').toLowerCase().includes('bus') ||
      (s.description || '').toLowerCase().includes('coach')
    );
    if (!hasTransport) missing.push({ key: 'transport', label: 'Transportation / Driver', action: 'Assign a driver or transport company under Services' });

    // 4. Flight # check
    const hasFlight = Boolean(
      (tour.arrivalFlight && tour.arrivalFlight.trim().length > 0) || 
      (tour.departureFlight && tour.departureFlight.trim().length > 0) || 
      services.some(s => s.flightNo && s.flightNo.trim().length > 0)
    );
    if (!hasFlight) missing.push({ key: 'flight', label: 'Flight #', action: 'Enter Arrival or Departure Flight #' });

    return missing;
  }, [tour, services]);

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
  const [isHotelDiscountExpanded, setIsHotelDiscountExpanded] = useState<boolean>(true);

  const isHotelDiscountService = (s: TourService) => {
    return s.serviceCategoryId === 1003 || s.roomType === 'Hotel Discount' || (s.roomType === 'Discount' && s.hotelId !== null);
  };

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

  const [isGeneratingHotels, setIsGeneratingHotels] = useState(false);
  const handleAutoGenerateHotels = async () => {
    if (!tourId) return;
    setIsGeneratingHotels(true);
    try {
      const res = await fetch(`${API}/tourservices/auto-generate-hotels/${tourId}`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchAll();
      } else {
        const err = await res.text();
        alert(`Failed to auto-generate hotels: ${err}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsGeneratingHotels(false);
    }
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
      
      if (cleanData.tourStatusId >= 3 && missingMainServices.length > 0) {
        alert(`Cannot move tour to Confirmed or In Progress!\n\nMissing main services:\n${missingMainServices.map(m => `• ${m.label}`).join('\n')}\n\nPlease define these services before confirming or running this tour.`);
        setSaving(false);
        return;
      }

      const targetProjectId = cleanData.projectId;
      const res = await fetch(`${API}/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        alert(errJson?.message || 'Failed to update tour');
        setSaving(false);
        return;
      }

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
       const start = svc.serviceDate ? formatDate(svc.serviceDate) : '';
       const end = svc.serviceEndDate ? formatDate(svc.serviceEndDate) : '';
       return start && end ? `${start} — ${end}` : '-';
    }
    if (cat === 'Excursion') {
       return svc.serviceDate ? formatDate(svc.serviceDate) : '-';
    }
    if (svc.flightNo) return `${svc.flightNo} ${svc.fromAirport || ''}—${svc.toAirport || ''}`;
    return '-';
  };

  const openServiceModal = (type: string, isRevenue: boolean = false) => {
    setEditingServiceId(null);
    let effectiveType = type;
    const isTax = type === 'City Tax' || type === 'Hotel Tax';
    if (isTax) {
      effectiveType = 'Hotel';
    }
    setServiceType(effectiveType);
    
    if (type === 'Hotel Discount') {
      setNewService({
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
        serviceCategoryId: 1003,
        isRevenue: false,
        hotelId: hotels[0]?.id || null,
        roomType: 'Hotel Discount',
        startDate: tour?.arrivalDate?.split('T')[0] || '',
        endDate: tour?.endDate?.split('T')[0] || '',
        serviceDate: tour?.arrivalDate?.split('T')[0] || '',
        serviceEndDate: tour?.endDate?.split('T')[0] || ''
      });
      setIsServiceModalOpen(true);
      return;
    }
    
    let defaultQty: any = 1;
    if (effectiveType === 'Invoiced Fee' || effectiveType === 'Client Flat Invoice' || effectiveType === 'Tour Package Fee') {
      defaultQty = (tour?.pax || 0) + 0.5 * (tour?.children || 0);
      if (defaultQty === 0) defaultQty = 1;
    } else if (effectiveType === 'Hotel') {
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
      includeHotelTax: isTax ? true : false, hotelTaxRate: 2.50,
      flightNo: '', serviceDate: '', startDate: effectiveType === 'Hotel' ? '' : (tour?.arrivalDate?.split('T')[0] || ''), endDate: effectiveType === 'Hotel' ? '' : (tour?.endDate?.split('T')[0] || ''), fromAirport: '', toAirport: '',
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

      if (serviceType === 'Hotel Discount') {
        const discAmt = Number(newService.totalAmount !== undefined && newService.totalAmount !== null && Number(newService.totalAmount) > 0 ? newService.totalAmount : newService.unitPrice) || 0;
        const hotelObj = hotels.find((h: any) => h.id === newService.hotelId);
        const desc = newService.description || (hotelObj ? `${hotelObj.name} Discount` : 'Hotel Discount');
        const sDate = newService.startDate || newService.serviceDate || null;
        const eDate = newService.endDate || newService.serviceEndDate || null;

        const payload: any = {
          tourId: parseInt(tourId),
          serviceCategoryId: 1003,
          hotelId: newService.hotelId || null,
          description: desc,
          roomType: 'Hotel Discount',
          quantity: 1,
          unitPrice: discAmt,
          totalAmount: discAmt,
          isRevenue: false,
          startDate: sDate ? new Date(sDate).toISOString() : null,
          endDate: eDate ? new Date(eDate).toISOString() : null,
          serviceDate: sDate ? new Date(sDate).toISOString() : null,
          serviceEndDate: eDate ? new Date(eDate).toISOString() : null
        };

        if (editingServiceId) {
          await fetch(`${API}/tourservices/${editingServiceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, id: editingServiceId })
          });
        } else {
          await fetch(`${API}/tourservices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        setIsServiceModalOpen(false);
        setEditingServiceId(null);
        fetchAll();
        return;
      }

      let payloads: any[] = [];

      if (serviceType === 'Hotel' && !editingServiceId) {
        if (!newService.startDate || !newService.endDate) return alert('Please enter check-in and check-out dates.');
        const calculatedNights = newService.startDate && newService.endDate
          ? Math.max(1, Math.ceil((new Date(newService.endDate).getTime() - new Date(newService.startDate).getTime()) / (1000 * 3600 * 24)))
          : 1;
        const q = calculatedNights;
        if (q <= 0) return alert('Check-out date must be after check-in date.');

        const pb = newService.pricingBasis || 'Pax';
        const isRoomBasis = pb.toLowerCase().includes('room');
        const discAmt = Number(newService.discountAmount) || 0;
        const discNote = newService.discountNotes || '';

        const matchedHotel = hotels.find((h: any) => h.id === newService.hotelId);

        if (newService.singleCount > 0) {
            const defaultSingle = isRoomBasis 
              ? (matchedHotel?.singleRoomRate || matchedHotel?.singleRate || 0)
              : (matchedHotel?.singlePaxRate || matchedHotel?.singleRate || 0);
            const hPrice = newService.singleRate !== undefined && newService.singleRate > 0 ? newService.singleRate : defaultSingle;
            const totalAmt = newService.singleCount * q * hPrice;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Single', 
              roomCount: newService.singleCount, 
              quantity: q, 
              unitPrice: hPrice, 
              totalAmount: totalAmt,
              pricingBasis: pb,
              discountAmount: 0,
              discountNotes: '',
              totalNights: q
            });
        }
        if (newService.doubleCount > 0) {
            const defaultDouble = isRoomBasis
              ? (matchedHotel?.doubleRoomRate || (matchedHotel?.doublePaxRate ? matchedHotel.doublePaxRate * 2 : 0) || matchedHotel?.doubleRate || 0)
              : (matchedHotel?.doublePaxRate || (matchedHotel?.doubleRoomRate ? matchedHotel.doubleRoomRate / 2 : 0) || matchedHotel?.doubleRate || 0);
            const hPrice = newService.doubleRate !== undefined && newService.doubleRate > 0 ? newService.doubleRate : defaultDouble;
            const multiplier = isRoomBasis ? newService.doubleCount : (newService.doubleCount * 2);
            const totalAmt = multiplier * q * hPrice;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Double', 
              roomCount: newService.doubleCount, 
              quantity: q, 
              unitPrice: hPrice, 
              totalAmount: totalAmt,
              pricingBasis: pb,
              discountAmount: 0,
              discountNotes: '',
              totalNights: q
            });
        }
        if (newService.twinCount > 0) {
            const defaultTwin = isRoomBasis
              ? (matchedHotel?.twinRoomRate || (matchedHotel?.twinPaxRate ? matchedHotel.twinPaxRate * 2 : 0) || matchedHotel?.twinRate || 0)
              : (matchedHotel?.twinPaxRate || (matchedHotel?.twinRoomRate ? matchedHotel.twinRoomRate / 2 : 0) || matchedHotel?.twinRate || 0);
            const hPrice = newService.twinRate !== undefined && newService.twinRate > 0 ? newService.twinRate : defaultTwin;
            const multiplier = isRoomBasis ? newService.twinCount : (newService.twinCount * 2);
            const totalAmt = multiplier * q * hPrice;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Twin', 
              roomCount: newService.twinCount, 
              quantity: q, 
              unitPrice: hPrice, 
              totalAmount: totalAmt,
              pricingBasis: pb,
              discountAmount: 0,
              discountNotes: '',
              totalNights: q
            });
        }
        if (newService.tripleCount > 0) {
            const defaultTriple = isRoomBasis
              ? (matchedHotel?.tripleRoomRate || (matchedHotel?.triplePaxRate ? matchedHotel.triplePaxRate * 3 : 0) || matchedHotel?.tripleRate || 0)
              : (matchedHotel?.triplePaxRate || (matchedHotel?.tripleRoomRate ? matchedHotel.tripleRoomRate / 3 : 0) || matchedHotel?.tripleRate || 0);
            const hPrice = newService.tripleRate !== undefined && newService.tripleRate > 0 ? newService.tripleRate : defaultTriple;
            const multiplier = isRoomBasis ? newService.tripleCount : (newService.tripleCount * 3);
            const totalAmt = multiplier * q * hPrice;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Triple', 
              roomCount: newService.tripleCount, 
              quantity: q, 
              unitPrice: hPrice, 
              totalAmount: totalAmt,
              pricingBasis: pb,
              discountAmount: 0,
              discountNotes: '',
              totalNights: q
            });
        }
        if (newService.dblEbCount > 0) {
            const defaultEb = isRoomBasis
              ? (matchedHotel?.dblEbRoomRate || (matchedHotel?.dblEbPaxRate ? matchedHotel.dblEbPaxRate * 3 : 0) || matchedHotel?.dblEbRate || 0)
              : (matchedHotel?.dblEbPaxRate || (matchedHotel?.dblEbRoomRate ? matchedHotel.dblEbRoomRate / 3 : 0) || matchedHotel?.dblEbRate || 0);
            const hPrice = newService.dblEbRate !== undefined && newService.dblEbRate > 0 ? newService.dblEbRate : defaultEb;
            const multiplier = isRoomBasis ? newService.dblEbCount : (newService.dblEbCount * 3);
            const totalAmt = multiplier * q * hPrice;
            payloads.push({ 
              ...basePayload, 
              hotelId: newService.hotelId, 
              roomType: 'Double + Extra Bed (DBL+EB)', 
              roomCount: newService.dblEbCount, 
              quantity: q, 
              unitPrice: hPrice, 
              totalAmount: totalAmt,
              pricingBasis: pb,
              discountAmount: 0,
              discountNotes: '',
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
            const totalPax = newService.taxPaxCount !== undefined ? newService.taxPaxCount : (tour?.pax || 1);
            const taxNights = newService.taxNights !== undefined ? newService.taxNights : q;
            const taxTotal = newService.hotelTaxTotal !== undefined ? newService.hotelTaxTotal : (taxRate * totalPax * taxNights);
            const unitPrice = taxNights > 0 ? (taxTotal / taxNights) : taxTotal;
            payloads.push({
              ...basePayload,
              hotelId: newService.hotelId,
              roomType: 'City Tax',
              roomCount: totalPax,
              quantity: taxNights,
              unitPrice: unitPrice,
              totalAmount: taxTotal,
              description: `Hotel Tax (€${taxRate}/pax/night)`
            });
        }

        // Dedicated Hotel Discount
        if (discAmt > 0) {
            const hObj = hotels.find((h: any) => h.id === newService.hotelId);
            payloads.push({
              tourId: parseInt(tourId),
              serviceCategoryId: 1003,
              hotelId: newService.hotelId || null,
              roomType: 'Hotel Discount',
              quantity: 1,
              unitPrice: discAmt,
              totalAmount: discAmt,
              isRevenue: false,
              description: discNote || (hObj ? `${hObj.name} Discount` : 'Hotel Discount'),
              startDate: newService.startDate ? new Date(newService.startDate).toISOString() : null,
              endDate: newService.endDate ? new Date(newService.endDate).toISOString() : null,
              serviceDate: newService.startDate ? new Date(newService.startDate).toISOString() : null,
              serviceEndDate: newService.endDate ? new Date(newService.endDate).toISOString() : null,
            });
        }

        if (payloads.length === 0) return alert('Please enter at least one room type quantity, hotel discount, staff accommodation, or hotel tax selection');
      } else if (serviceType === 'Hotel' && editingServiceId) {
        const sDate = newService.startDate || newService.serviceDate;
        const eDate = newService.endDate || newService.serviceEndDate;
        const nights = (sDate && eDate) ? Math.max(1, Math.ceil((new Date(eDate).getTime() - new Date(sDate).getTime()) / (1000 * 3600 * 24))) : (Number(newService.totalNights) || Number(newService.quantity) || 1);
        const roomCount = Number(newService.roomCount) || 1;
        const uPrice = Number(newService.unitPrice) || 0;
        const pb = newService.pricingBasis || 'Room';
        const isPerPax = pb.toLowerCase().includes('pax') || pb.toLowerCase().includes('person');
        const paxPerRoom = getPaxPerRoom(newService.roomType);
        const multiplier = isPerPax ? (roomCount * paxPerRoom) : roomCount;
        const discAmt = Number(newService.discountAmount) || 0;
        const calcTotal = Math.max(0, (multiplier * nights * uPrice) - discAmt);
        const totalAmount = (newService.totalAmount !== undefined && newService.totalAmount !== null && !isNaN(Number(newService.totalAmount)))
          ? Number(newService.totalAmount)
          : calcTotal;

        payloads.push({
          ...basePayload,
          hotelId: newService.hotelId,
          roomType: newService.roomType,
          roomCount: roomCount,
          quantity: nights,
          unitPrice: uPrice,
          totalAmount: totalAmount,
          pricingBasis: pb,
          discountAmount: discAmt,
          discountNotes: newService.discountNotes || '',
          totalNights: nights,
          startDate: sDate ? new Date(sDate).toISOString() : null,
          endDate: eDate ? new Date(eDate).toISOString() : null,
          serviceDate: sDate ? new Date(sDate).toISOString() : null,
          serviceEndDate: eDate ? new Date(eDate).toISOString() : null,
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
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const openEditServiceModal = (svc: TourService) => {
    if (isHotelDiscountService(svc)) {
      setServiceType('Hotel Discount');
      setEditingServiceId(svc.id);
      const sDate = svc.serviceDate?.split('T')[0] || svc.startDate?.split('T')[0] || '';
      const eDate = svc.serviceEndDate?.split('T')[0] || svc.endDate?.split('T')[0] || '';
      setNewService({
        description: svc.description || '',
        quantity: 1,
        unitPrice: svc.unitPrice || svc.totalAmount || 0,
        totalAmount: svc.totalAmount || svc.unitPrice || 0,
        serviceCategoryId: 1003,
        isRevenue: false,
        hotelId: svc.hotelId || null,
        roomType: 'Hotel Discount',
        startDate: sDate,
        endDate: eDate,
        serviceDate: sDate,
        serviceEndDate: eDate
      });
      setIsServiceModalOpen(true);
      return;
    }

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

    const hotelObj = hotels.find((h: any) => h.id === svc.hotelId);
    const hotelBasis = (svc as any).pricingBasis || 'Room';
    const rType = svc.roomType || 'Double';
    const rCount = svc.roomCount || 1;
    const nights = (sDate && eDate) ? Math.max(1, Math.ceil((new Date(eDate).getTime() - new Date(sDate).getTime()) / (1000 * 3600 * 24))) : (svc.quantity || 1);
    const pPerRoom = getPaxPerRoom(rType);
    const isPerPax = hotelBasis.toLowerCase().includes('pax');
    const multiplier = isPerPax ? (rCount * pPerRoom) : rCount;
    const resolvedUnitPrice = (svc.unitPrice !== undefined && svc.unitPrice !== null && svc.unitPrice > 0)
      ? svc.unitPrice
      : getHotelDefaultRate(hotelObj, rType, hotelBasis);
    const resolvedTotalAmount = (svc.totalAmount !== undefined && svc.totalAmount !== null && svc.totalAmount > 0)
      ? svc.totalAmount
      : Math.round(multiplier * nights * resolvedUnitPrice * 100) / 100;

    const rtLower = rType.toLowerCase();

    setNewService({
      description: svc.description || '',
      quantity: nights,
      unitPrice: resolvedUnitPrice,
      totalAmount: resolvedTotalAmount,
      serviceCategoryId: svc.serviceCategoryId,
      isRevenue: svc.isRevenue,
      hotelId: svc.hotelId || null,
      driverId: svc.driverId || null,
      guideId: svc.guideId || null,
      excursionId: svc.excursionId || null,
      transportCompanyId: svc.transportCompanyId || null,
      pricingBasis: hotelBasis,
      discountAmount: (svc as any).discountAmount || 0,
      discountNotes: (svc as any).discountNotes || '',
      roomType: rType,
      roomCount: rCount,
      singleCount: (rtLower.includes('single') || rtLower.includes('guide') || rtLower.includes('driver')) ? rCount : 0,
      doubleCount: (rtLower.includes('double') && !rtLower.includes('extra bed') && !rtLower.includes('eb')) ? rCount : 0,
      twinCount: rtLower.includes('twin') ? rCount : 0,
      tripleCount: rtLower.includes('triple') ? rCount : 0,
      dblEbCount: (rtLower.includes('extra bed') || rtLower.includes('eb')) ? rCount : 0,
      flightNo: svc.flightNo || '',
      serviceDate: sDate,
      startDate: sDate,
      endDate: eDate,
      totalNights: nights,
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
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const getCategoryName = (svc: TourService): string => svc.serviceCategory?.name || serviceCategories.find(c => c.id === svc.serviceCategoryId)?.name || 'Other';
  const getCategoryClassification = (svc: TourService): string => svc.serviceCategory?.classification || serviceCategories.find(c => c.id === svc.serviceCategoryId)?.classification || 'Standard';

  const isServiceRevenue = (s: TourService) => {
    if (isHotelDiscountService(s)) return false;
    if (s.isRevenue !== undefined && s.isRevenue !== null) return s.isRevenue;
    const cat = s.serviceCategory || serviceCategories.find(c => c.id === s.serviceCategoryId);
    return cat?.isRevenue === true;
  };

  const revenueServices = services.filter(s => isServiceRevenue(s));
  const costServices = services.filter(s => !isServiceRevenue(s));

  // Excursion sales calculation for Guide Commission
  const totalExcursionSales = revenueServices
    .filter(s => {
      const cat = getCategoryName(s).toLowerCase();
      return cat.includes('excursion') || s.excursionId !== null;
    })
    .reduce((sum, s) => sum + (s.totalAmount || (s.quantity || 1) * s.unitPrice || 0), 0);

  const guideCommissionRate = tour?.guideCommission !== undefined && tour?.guideCommission !== null 
    ? Number(tour.guideCommission) 
    : 10;

  const guideCommissionAmount = totalExcursionSales > 0 ? (totalExcursionSales * guideCommissionRate) / 100 : 0;

  const guideCommissionService: TourService | null = guideCommissionAmount > 0 ? {
    id: -999,
    tourId: parseInt(tourId),
    serviceCategoryId: getCategoryId('Guide') || 4,
    description: `Guide Commission (${guideCommissionRate}% on €${totalExcursionSales.toLocaleString()} Excursion Sales)`,
    quantity: 1,
    unitPrice: guideCommissionAmount,
    totalAmount: guideCommissionAmount,
    isRevenue: false
  } : null;

  const effectiveCostServices = guideCommissionService ? [...costServices, guideCommissionService] : costServices;

  const getServiceBuckets = (svcList: TourService[]) => {
    const base = svcList.filter(s => (serviceCategories.find(c => c.id === s.serviceCategoryId)?.isBase) || s.id === -999);
    const operational = svcList.filter(s => {
      if (isHotelDiscountService(s)) return true;
      const cat = serviceCategories.find(c => c.id === s.serviceCategoryId);
      return cat?.isOperational && !cat?.isBase && s.id !== -999;
    });
    const other = svcList.filter(s => {
      if (isHotelDiscountService(s)) return false;
      const cat = serviceCategories.find(c => c.id === s.serviceCategoryId);
      return !cat?.isBase && !cat?.isOperational && s.id !== -999;
    });
    return { base, operational, other };
  };

  const revenueBuckets = getServiceBuckets(revenueServices);
  const costBuckets = getServiceBuckets(effectiveCostServices);

  const totalSales = revenueServices.reduce((s, svc) => s + (svc.totalAmount || svc.unitPrice * (svc.quantity || 1) || 0), 0);
  const totalServiceCost = effectiveCostServices.reduce((s, svc) => {
    const amt = svc.totalAmount || svc.unitPrice * (svc.quantity || 1) || 0;
    if (isHotelDiscountService(svc)) {
      return s - Math.abs(amt);
    }
    return s + amt;
  }, 0);
  const totalRevenue = totalSales;
  const profit = totalRevenue - totalServiceCost;
  // Derive accommodated guest count from hotel services if tour.pax / adults / children are 0
  let inferredHotelPax = 0;
  effectiveCostServices.forEach(s => {
    if (s.roomType && s.roomCount && s.roomCount > 0 && !isHotelDiscountService(s) && !isHotelTaxService(s)) {
      const rType = (s.roomType || s.description || '').toLowerCase();
      let ppr = 2;
      if (rType.includes('single') || rType.includes('sgl')) ppr = 1;
      else if (rType.includes('triple') || rType.includes('trp') || rType.includes('tpl') || rType.includes('extra bed') || rType.includes('eb')) ppr = 3;
      else if (rType.includes('quad') || rType.includes('qdr')) ppr = 4;
      else if (rType.includes('double') || rType.includes('twin') || rType.includes('dbl') || rType.includes('twn')) ppr = 2;
      else if (rType.includes('guide') || rType.includes('driver')) ppr = 0; // staff rooms are not tour passengers
      inferredHotelPax += ((s.roomCount || 0) * ppr);
    }
  });
  const taxSvc = effectiveCostServices.find(s => isHotelTaxService(s));
  const fallbackHotelPax = inferredHotelPax > 0 ? inferredHotelPax : (taxSvc?.roomCount || 0);

  const effectiveTourPax = Math.max(
    tour?.pax || (tour?.adults || 0) + (tour?.children || 0) || (tour?.passengers?.length || 0) || fallbackHotelPax || 1,
    1
  );

  const costPerPax = tour ? Math.round(totalServiceCost / effectiveTourPax) : 0;

  // Financial Pivot Table Data Computation
  const getFinancialPivotData = () => {
    const totalPax = effectiveTourPax;

    const calculatedBaseRevenue = (tour?.baseFee && tour.baseFee > 0)
      ? ((tour.adults || 0) * tour.baseFee) + ((tour.children || 0) * tour.baseFee * 0.5)
      : Number(tour?.totalFee || 0);

    const hasBaseServiceInRevenue = revenueServices.some(s => {
      const cat = serviceCategories.find(c => c.id === s.serviceCategoryId);
      return (cat?.isBase && cat?.isRevenue) || s.serviceCategoryId === 8 || (s.description || '').startsWith('Base Tour Fee');
    });

    interface PivotItem {
      id: string;
      description: string;
      categoryName: string;
      bucketName: string;
      cost: number;
      revenue: number;
      qty: number;
      unitPrice: number;
      detailsText?: string;
      occupants?: number;
      roomCount?: number | null;
      pricingBasis?: string;
      roomType?: string;
      perPaxPrice?: number;
    }

    const items: PivotItem[] = [];

    if (calculatedBaseRevenue > 0 && !hasBaseServiceInRevenue) {
      items.push({
        id: 'base-package-fee',
        description: `Base Tour Fee (${tour?.adults || 0} Adults, ${tour?.children || 0} Children)`,
        categoryName: 'Base Package Revenue',
        bucketName: 'Tour Revenue',
        cost: 0,
        revenue: calculatedBaseRevenue,
        qty: totalPax,
        unitPrice: Math.round((calculatedBaseRevenue / totalPax) * 100) / 100,
        detailsText: `${totalPax} Pax @ €${(Math.round((calculatedBaseRevenue / totalPax) * 100) / 100).toFixed(2)}`,
        occupants: totalPax,
        pricingBasis: 'Pax',
        perPaxPrice: Math.round((calculatedBaseRevenue / totalPax) * 100) / 100
      });
    }

    const getServiceNights = (s: TourService): number => {
      if (s.totalNights && s.totalNights > 0) return s.totalNights;
      const sDate = s.serviceDate || s.startDate || s.serviceStartDate;
      const eDate = s.serviceEndDate || s.endDate || s.serviceEndDate;
      if (sDate && eDate) {
        const diff = Math.round((new Date(eDate).getTime() - new Date(sDate).getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) return diff;
      }
      if (s.roomCount && s.roomCount > 0 && s.quantity && s.quantity > s.roomCount && s.quantity % s.roomCount === 0) {
        return Math.round(s.quantity / s.roomCount);
      }
      return Math.max(1, Math.round(s.quantity || 1));
    };

    revenueServices.forEach((s) => {
      const catName = getCategoryName(s);
      const pb = (s.pricingBasis || 'Pax').trim();
      const isPerPaxBasis = pb.toLowerCase().includes('pax') || pb.toLowerCase().includes('person');
      const isHotelDiscount = isHotelDiscountService(s);
      const isHotelTax = isHotelTaxService(s);
      const isHotel = (catName.toLowerCase().includes('hotel') || s.hotelId !== null || s.serviceCategoryId === 1) && !isHotelDiscount;
      const isHotelRoom = isHotel && !isHotelTax;

      let itemOccupants = totalPax;
      let paxPerRoom = 2;

      if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        const rType = (s.roomType || s.description || '').toLowerCase();
        if (rType.includes('single') || rType.includes('guide') || rType.includes('driver') || rType.includes('sgl')) paxPerRoom = 1;
        else if (rType.includes('triple') || rType.includes('trp') || rType.includes('tpl') || rType.includes('extra bed') || rType.includes('eb')) paxPerRoom = 3;
        else if (rType.includes('quad') || rType.includes('qdr')) paxPerRoom = 4;
        else if (rType.includes('double') || rType.includes('twin') || rType.includes('dbl') || rType.includes('twn')) paxPerRoom = 2;
        itemOccupants = s.roomCount * paxPerRoom;
      }

      const nights = getServiceNights(s);

      // Flag-based Per Pax Price calculation:
      // If pricingBasis is Pax, use unitPrice as-is (with safety guard for room-level rates).
      // If pricingBasis is Room, divide unitPrice by accommodated guest count (paxPerRoom).
      let perPaxPrice: number;
      if (isHotelDiscount) {
        perPaxPrice = 0;
      } else if (isHotelTax) {
        const taxPax = s.roomCount || totalPax || 1;
        const taxNights = nights || 1;
        const rawAmt = (s.totalAmount !== undefined && s.totalAmount !== null && s.totalAmount !== 0) 
          ? s.totalAmount 
          : ((s.unitPrice || 0) * (s.quantity || 1));
        const descMatch = (s.description || '').match(/€\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*(?:pax|person)/i);
        perPaxPrice = descMatch ? parseFloat(descMatch[1]) : (taxPax * taxNights > 0 ? Math.round((rawAmt / (taxPax * taxNights)) * 100) / 100 : 0);
      } else if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        if (isPerPaxBasis) {
          if (paxPerRoom > 1 && s.unitPrice > 70) {
            perPaxPrice = Math.round((s.unitPrice / paxPerRoom) * 100) / 100;
          } else {
            perPaxPrice = s.unitPrice;
          }
        } else {
          perPaxPrice = Math.round((s.unitPrice / paxPerRoom) * 100) / 100;
        }
      } else {
        perPaxPrice = totalPax > 0 ? Math.round(((s.totalAmount || (s.unitPrice * (s.quantity || 1))) / totalPax) * 100) / 100 : (s.unitPrice || 0);
      }

      let revVal: number;
      if (isHotelDiscount) {
        const rawAmt = s.totalAmount || (s.unitPrice * (s.quantity || 1)) || 0;
        revVal = -Math.abs(rawAmt);
      } else if (isHotelTax) {
        revVal = (s.totalAmount !== undefined && s.totalAmount !== null && s.totalAmount !== 0) 
          ? s.totalAmount 
          : ((s.unitPrice || 0) * (s.quantity || 1));
      } else if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        const disc = s.discountAmount || 0;
        const expectedTotal = (s.roomCount * paxPerRoom * nights * perPaxPrice);
        if (s.totalAmount && s.totalAmount > 0) {
          if (paxPerRoom > 1 && Math.abs(s.totalAmount - (expectedTotal * paxPerRoom)) < 0.5) {
            revVal = expectedTotal - disc;
          } else if (Math.abs(s.totalAmount - expectedTotal) < 0.5 || Math.abs(s.totalAmount - (expectedTotal - disc)) < 0.5) {
            revVal = s.totalAmount;
          } else {
            revVal = expectedTotal - disc;
          }
        } else {
          revVal = expectedTotal - disc;
        }
      } else {
        revVal = (s.totalAmount !== undefined && s.totalAmount !== null && s.totalAmount !== 0) 
          ? s.totalAmount 
          : ((s.unitPrice || 0) * (s.quantity || 1));
      }

      const roomRate = perPaxPrice * paxPerRoom;
      let details: string;
      if (isHotelDiscount) {
        details = `Hotel Discount: -€${Math.abs(revVal).toFixed(2)}`;
      } else if (isHotelTax) {
        const taxPax = s.roomCount || totalPax || 1;
        const taxNights = nights || 1;
        const descMatch = (s.description || '').match(/€\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*(?:pax|person)/i);
        const taxRate = descMatch ? parseFloat(descMatch[1]) : perPaxPrice;
        details = `${taxPax} Pax × ${taxNights} Nt${taxNights > 1 ? 's' : ''} @ €${taxRate.toFixed(2)}/pax/night`;
      } else if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        details = `${s.roomCount} Rm${s.roomCount > 1 ? 's' : ''} × ${nights} Nt${nights > 1 ? 's' : ''} (${itemOccupants} Pax) @ €${perPaxPrice.toFixed(2)}/pax (€${roomRate.toFixed(2)}/rm)`;
      } else {
        details = `${s.quantity || 1} x €${(s.unitPrice || 0).toFixed(2)}`;
      }

      items.push({
        id: `rev-${s.id}`,
        description: s.description || `${catName} Sale`,
        categoryName: catName.toLowerCase().includes('excursion') ? 'Excursions & Optional Sales' : ((isHotelDiscount || isHotelTax) ? 'Hotel' : (catName || 'Other Revenue')),
        bucketName: 'Tour Revenue',
        cost: 0,
        revenue: revVal,
        qty: s.quantity || 1,
        unitPrice: s.unitPrice || 0,
        detailsText: details,
        occupants: isHotelTax ? (s.roomCount || totalPax) : itemOccupants,
        roomCount: isHotelTax ? undefined : (s.roomCount ?? undefined),
        pricingBasis: isHotelTax ? 'Pax' : pb,
        roomType: s.roomType ?? undefined,
        perPaxPrice: perPaxPrice
      });
    });

    costServices.forEach((s) => {
      const catName = getCategoryName(s);
      const catObj = serviceCategories.find(c => c.id === s.serviceCategoryId);
      const pb = (s.pricingBasis || 'Pax').trim();
      const isPerPaxBasis = pb.toLowerCase().includes('pax') || pb.toLowerCase().includes('person');

      let bucket = 'Operational Services';
      if (catObj?.isBase) bucket = 'Base Services';
      else if (s.roomType === 'Guide Room' || s.roomType === 'Driver Room' || s.guideId || s.driverId) bucket = 'Staff & Escorts';
      else if (catObj?.isOperational) bucket = 'Operational Services';

      const isHotelDiscount = isHotelDiscountService(s);
      const isHotelTax = isHotelTaxService(s);
      const isHotel = (catName.toLowerCase().includes('hotel') || s.hotelId !== null || s.serviceCategoryId === 1) && !isHotelDiscount;
      const isHotelRoom = isHotel && !isHotelTax;

      let itemOccupants = totalPax;
      let paxPerRoom = 2;

      if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        const rType = (s.roomType || s.description || '').toLowerCase();
        if (rType.includes('single') || rType.includes('guide') || rType.includes('driver') || rType.includes('sgl')) paxPerRoom = 1;
        else if (rType.includes('triple') || rType.includes('trp') || rType.includes('tpl') || rType.includes('extra bed') || rType.includes('eb')) paxPerRoom = 3;
        else if (rType.includes('quad') || rType.includes('qdr')) paxPerRoom = 4;
        else if (rType.includes('double') || rType.includes('twin') || rType.includes('dbl') || rType.includes('twn')) paxPerRoom = 2;
        itemOccupants = s.roomCount * paxPerRoom;
      }

      const nights = getServiceNights(s);

      // Flag-based Per Pax Price calculation:
      // If pricingBasis is Pax, use unitPrice as-is (with safety guard for room-level rates).
      // If pricingBasis is Room, divide unitPrice by accommodated guest count (paxPerRoom).
      let perPaxPrice: number;
      if (isHotelDiscount) {
        perPaxPrice = 0; // calculated below once costVal is determined
      } else if (isHotelTax) {
        const taxPax = s.roomCount || totalPax || 1;
        const taxNights = nights || 1;
        const rawAmt = (s.totalAmount !== undefined && s.totalAmount !== null && s.totalAmount !== 0) 
          ? s.totalAmount 
          : ((s.unitPrice || 0) * (s.quantity || 1));
        const descMatch = (s.description || '').match(/€\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*(?:pax|person)/i);
        perPaxPrice = descMatch ? parseFloat(descMatch[1]) : (taxPax * taxNights > 0 ? Math.round((rawAmt / (taxPax * taxNights)) * 100) / 100 : 0);
      } else if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        if (isPerPaxBasis) {
          if (paxPerRoom > 1 && s.unitPrice > 70) {
            perPaxPrice = Math.round((s.unitPrice / paxPerRoom) * 100) / 100;
          } else {
            perPaxPrice = s.unitPrice;
          }
        } else {
          perPaxPrice = Math.round((s.unitPrice / paxPerRoom) * 100) / 100;
        }
      } else {
        perPaxPrice = totalPax > 0 ? Math.round(((s.totalAmount || (s.unitPrice * (s.quantity || 1))) / totalPax) * 100) / 100 : (s.unitPrice || 0);
      }

      let costVal: number;
      if (isHotelDiscount) {
        const rawAmt = s.totalAmount || (s.unitPrice * (s.quantity || 1)) || 0;
        costVal = -Math.abs(rawAmt);
        perPaxPrice = totalPax > 0 ? -Math.round((Math.abs(costVal) / totalPax) * 100) / 100 : 0;
      } else if (isHotelTax) {
        costVal = (s.totalAmount !== undefined && s.totalAmount !== null && s.totalAmount !== 0) 
          ? s.totalAmount 
          : ((s.unitPrice || 0) * (s.quantity || 1));
      } else if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        const disc = s.discountAmount || 0;
        const expectedTotal = (s.roomCount * paxPerRoom * nights * perPaxPrice);
        if (s.totalAmount && s.totalAmount > 0) {
          if (paxPerRoom > 1 && Math.abs(s.totalAmount - (expectedTotal * paxPerRoom)) < 0.5) {
            costVal = expectedTotal - disc;
          } else if (Math.abs(s.totalAmount - expectedTotal) < 0.5 || Math.abs(s.totalAmount - (expectedTotal - disc)) < 0.5) {
            costVal = s.totalAmount;
          } else {
            costVal = expectedTotal - disc;
          }
        } else {
          costVal = expectedTotal - disc;
        }
      } else {
        costVal = (s.totalAmount !== undefined && s.totalAmount !== null && s.totalAmount !== 0) 
          ? s.totalAmount 
          : ((s.unitPrice || 0) * (s.quantity || 1));
      }

      const roomRate = perPaxPrice * paxPerRoom;
      let details: string;
      if (isHotelDiscount) {
        details = `Hotel Discount: -€${Math.abs(costVal).toFixed(2)}`;
      } else if (isHotelTax) {
        const taxPax = s.roomCount || totalPax || 1;
        const taxNights = nights || 1;
        const descMatch = (s.description || '').match(/€\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*(?:pax|person)/i);
        const taxRate = descMatch ? parseFloat(descMatch[1]) : perPaxPrice;
        details = `${taxPax} Pax × ${taxNights} Nt${taxNights > 1 ? 's' : ''} @ €${taxRate.toFixed(2)}/pax/night`;
      } else if (isHotelRoom && s.roomCount && s.roomCount > 0) {
        details = `${s.roomCount} Rm${s.roomCount > 1 ? 's' : ''} × ${nights} Nt${nights > 1 ? 's' : ''} (${itemOccupants} Pax) @ €${perPaxPrice.toFixed(2)}/pax (€${roomRate.toFixed(2)}/rm)`;
      } else {
        details = `${s.quantity || 1} x €${(s.unitPrice || 0).toFixed(2)}`;
      }

      items.push({
        id: `cost-${s.id}`,
        description: s.description || `${catName} Item`,
        categoryName: (isHotelDiscount || isHotelTax) ? 'Hotel' : (catName || 'Other Expenses'),
        bucketName: bucket,
        cost: costVal,
        revenue: 0,
        qty: s.quantity || 1,
        unitPrice: isHotelDiscount ? -Math.abs(s.unitPrice || costVal) : (s.unitPrice || 0),
        detailsText: details,
        occupants: isHotelTax ? (s.roomCount || totalPax) : itemOccupants,
        roomCount: isHotelTax ? undefined : (s.roomCount ?? undefined),
        pricingBasis: isHotelTax ? 'Pax' : pb,
        roomType: s.roomType ?? undefined,
        perPaxPrice: perPaxPrice
      });
    });

    if (guideCommissionAmount > 0) {
      items.push({
        id: 'cost-guide-commission',
        description: `Guide Commission (${guideCommissionRate}% on €${totalExcursionSales.toLocaleString()} Excursion Sales)`,
        categoryName: 'Guides & Staff',
        bucketName: 'Staff & Escorts',
        cost: guideCommissionAmount,
        revenue: 0,
        qty: 1,
        unitPrice: guideCommissionAmount,
        detailsText: `1 x €${guideCommissionAmount.toFixed(2)} (€${guideCommissionAmount.toLocaleString()})`,
        perPaxPrice: Math.round((guideCommissionAmount / totalPax) * 100) / 100
      });
    }

    const groupedMap: Record<string, {
      groupName: string;
      bucketName: string;
      items: PivotItem[];
      totalCost: number;
      totalRevenue: number;
      netMargin: number;
      costPerPax: number;
      revenuePerPax: number;
      marginPct: number;
    }> = {};

    items.forEach((item) => {
      const groupKey = pivotGroupBy === 'category' ? item.categoryName : item.bucketName;
      if (!groupedMap[groupKey]) {
        groupedMap[groupKey] = {
          groupName: groupKey,
          bucketName: item.bucketName,
          items: [],
          totalCost: 0,
          totalRevenue: 0,
          netMargin: 0,
          costPerPax: 0,
          revenuePerPax: 0,
          marginPct: 0
        };
      }
      groupedMap[groupKey].items.push(item);
      groupedMap[groupKey].totalCost += item.cost;
      groupedMap[groupKey].totalRevenue += item.revenue;
    });

    let grandTotalCost = 0;
    let grandTotalRevenue = 0;

    Object.values(groupedMap).forEach((grp) => {
      grp.netMargin = grp.totalRevenue - grp.totalCost;
      grp.costPerPax = Math.round((grp.totalCost / totalPax) * 100) / 100;
      grp.revenuePerPax = Math.round((grp.totalRevenue / totalPax) * 100) / 100;
      grp.marginPct = grp.totalRevenue > 0 ? (grp.netMargin / grp.totalRevenue) * 100 : 0;

      grandTotalCost += grp.totalCost;
      grandTotalRevenue += grp.totalRevenue;
    });

    const grandNetMargin = grandTotalRevenue - grandTotalCost;
    const grandCostPerPax = Math.round((grandTotalCost / totalPax) * 100) / 100;
    const grandRevenuePerPax = Math.round((grandTotalRevenue / totalPax) * 100) / 100;
    const grandMarginPct = grandTotalRevenue > 0 ? (grandNetMargin / grandTotalRevenue) * 100 : 0;

    return {
      totalPax,
      groups: Object.values(groupedMap),
      grandTotalCost,
      grandTotalRevenue,
      grandNetMargin,
      grandCostPerPax,
      grandRevenuePerPax,
      grandMarginPct
    };
  };

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
            {formatDate(tour.arrivalDate)} → {formatDate(tour.endDate)} | {tour.pax} Pax | {tour.tourStatus?.name || ''}
          </p>
        </div>
        {/* Top Bar Financial Metric Summary Cards */}
        {(() => {
          const pivot = getFinancialPivotData();
          const totalPax = pivot.totalPax;

          return (
            <div className="flex items-center gap-2 flex-wrap">
              {/* 1. Pax Breakdown */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-2xs text-center min-w-[90px]">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Pax Breakdown</p>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {tour.adults || 0} A, {tour.children || 0} C, {tour.infants || 0} I
                </p>
                <p className="text-[9px] text-slate-400 font-normal leading-tight">({totalPax} Total)</p>
              </div>

              {/* 2. Base Fee */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-2.5 py-1 shadow-2xs text-center min-w-[80px]">
                <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-tight">Base Fee</p>
                <p className="text-xs font-bold text-emerald-800 leading-tight">
                  €{Number(tour.baseFee || 0).toLocaleString()}
                </p>
                <p className="text-[9px] text-emerald-600 font-medium leading-tight">Per adult fee</p>
              </div>

              {/* 3. Cost / Pax */}
              <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl px-2.5 py-1 shadow-2xs text-center min-w-[90px]">
                <p className="text-[10px] font-semibold text-rose-700 uppercase tracking-tight">Cost / Pax</p>
                <p className="text-xs font-bold text-rose-800 leading-tight">€{pivot.grandCostPerPax.toFixed(2)}</p>
                <p className="text-[9px] text-rose-600 font-medium leading-tight">Total: €{pivot.grandTotalCost.toLocaleString()}</p>
              </div>

              {/* 4. Revenue / Pax */}
              <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl px-2.5 py-1 shadow-2xs text-center min-w-[90px]">
                <p className="text-[10px] font-semibold text-sky-700 uppercase tracking-tight">Revenue / Pax</p>
                <p className="text-xs font-bold text-sky-800 leading-tight">€{pivot.grandRevenuePerPax.toFixed(2)}</p>
                <p className="text-[9px] text-sky-600 font-medium leading-tight">Total: €{pivot.grandTotalRevenue.toLocaleString()}</p>
              </div>

              {/* 5. Guide Commission */}
              <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl px-2.5 py-1 shadow-2xs text-center min-w-[85px]">
                <p className="text-[10px] font-semibold text-purple-700 uppercase tracking-tight">Guide Comm.</p>
                <p className="text-xs font-bold text-purple-800 leading-tight">
                  {tour.guideCommission !== undefined ? tour.guideCommission : 10}%
                </p>
                <p className="text-[9px] text-purple-600 font-medium leading-tight">(€{guideCommissionAmount.toLocaleString()})</p>
              </div>

              {/* 6. Net Profit / Pax */}
              <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl px-2.5 py-1 shadow-2xs text-center min-w-[95px]">
                <p className="text-[10px] font-semibold text-indigo-700 uppercase tracking-tight">Net Profit / Pax</p>
                <p className={`text-xs font-bold leading-tight ${pivot.grandNetMargin >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  €{(pivot.grandNetMargin / totalPax).toFixed(2)}
                </p>
                <p className="text-[9px] text-indigo-600 font-bold leading-tight">{pivot.grandMarginPct.toFixed(1)}% Margin</p>
              </div>
            </div>
          );
        })()}
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
          <div className="p-4 sm:p-6 max-w-[1680px] w-full mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* LEFT COLUMN: Main Tour Information & Financial Breakdown (Expanded to 8-9 Cols) */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-slate-50 flex justify-between items-center">
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-800">Tour Information</h2>
                      <p className="text-xs text-slate-500 mt-0.5">View and edit tour details</p>
                    </div>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors gap-1.5">
                        <Edit className="w-3.5 h-3.5" /> Edit
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
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-sm font-medium text-slate-700">Arrival Flight</label>
                              {editData.arrivalFlight && (
                                <a
                                  href={getFlightAwareUrl(editData.arrivalFlight)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                                  title="Check flight status on FlightAware"
                                >
                                  <span>Check Live</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
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
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-sm font-medium text-slate-700">Departure Flight</label>
                              {editData.departureFlight && (
                                <a
                                  href={getFlightAwareUrl(editData.departureFlight)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                                  title="Check flight status on FlightAware"
                                >
                                  <span>Check Live</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
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
                            <select 
                              value={editData.tourStatusId} 
                              onChange={e => setEditData({ ...editData, tourStatusId: parseInt(e.target.value) })} 
                              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm ${missingMainServices.length > 0 ? 'border-amber-300' : 'border-slate-200'}`}
                            >
                              {tourStatuses.map((s: any) => {
                                const isBlocked = s.id >= 3 && missingMainServices.length > 0;
                                return (
                                  <option key={s.id} value={s.id} disabled={isBlocked} className={isBlocked ? 'text-red-500 font-semibold' : ''}>
                                    {s.name} {isBlocked ? '⚠️ (Blocked: Missing Main Services)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                            {missingMainServices.length > 0 && (
                              <p className="text-[11px] text-red-600 font-medium mt-1">
                                Confirmed & In Progress blocked until all 4 main services are assigned.
                              </p>
                            )}
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
                      {missingMainServices.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600 mt-0.5 sm:mt-0">
                              <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">
                                  Action Required: Missing Main Services ({missingMainServices.length})
                                </h3>
                                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                  Action Required
                                </span>
                              </div>
                              <p className="text-xs text-red-700 mt-0.5 font-medium">
                                Cannot move this tour to <span className="font-bold underline">Confirmed</span> or <span className="font-bold underline">In Progress</span> until the following services are completed:
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {missingMainServices.map(m => (
                                  <span key={m.key} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 border border-red-300 text-red-800 text-xs font-semibold rounded-md shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                    {m.label}
                                    <span className="text-[10px] text-red-500 font-normal">({m.action})</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const hasFlightMissing = missingMainServices.some(m => m.key === 'flight');
                              if (hasFlightMissing && !isEditing) {
                                setIsEditing(true);
                              } else {
                                const svcElem = document.getElementById('tour-services-section');
                                if (svcElem) svcElem.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            Resolve Missing
                          </button>
                        </div>
                      )}

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
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">{tour.tourStatus?.name || 'N/A'}</span>
                            {missingMainServices.length > 0 && (
                              <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-white" />
                                Action Required
                              </span>
                            )}
                            <span className="text-sm font-bold text-slate-700">
                              {(() => {
                                const svcGuides = services.filter(s => s.guideId).map(s => guides.find(g => g.id === s.guideId)?.name).filter(Boolean);
                                const allGuides = Array.from(new Set(svcGuides));
                                return allGuides.length > 0 ? allGuides.join(', ') : 'Unassigned';
                              })()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="col-span-4 space-y-4">

                          {/* INLINE PER-PAX COLLAPSIBLE BREAKDOWN TABLE AT THIS SPOT */}
                          {(() => {
                            const pivot = getFinancialPivotData();
                            const totalPax = pivot.totalPax;

                            return (
                              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                                  {/* HEADER BAR (CLICKABLE TO COLLAPSE/EXPAND TABLE) */}
                                  <div 
                                    onClick={() => setIsBreakdownTableExpanded(prev => !prev)}
                                    className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors select-none"
                                  >
                                    <div className="flex items-center gap-2">
                                      <button type="button" className="p-0.5 rounded bg-slate-800 text-slate-300">
                                        {isBreakdownTableExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                      </button>
                                      <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                                      <span>Services Cost &amp; Revenue Breakdown (per Pax)</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {/* Quick Summary Pill when collapsed */}
                                      {!isBreakdownTableExpanded && (
                                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold text-slate-300">
                                          <span className="bg-slate-800 px-2 py-0.5 rounded text-rose-300">Cost: €{pivot.grandTotalCost.toLocaleString()}</span>
                                          <span className="bg-slate-800 px-2 py-0.5 rounded text-sky-300">Rev: €{pivot.grandTotalRevenue.toLocaleString()}</span>
                                          <span className={`px-2 py-0.5 rounded font-bold ${pivot.grandNetMargin >= 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                                            Profit: €{pivot.grandNetMargin.toLocaleString()} ({pivot.grandMarginPct.toFixed(1)}%)
                                          </span>
                                        </div>
                                      )}

                                      {/* Grouping Selector when expanded */}
                                      {isBreakdownTableExpanded && (
                                        <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px] flex items-center">
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setPivotGroupBy('category'); }}
                                            className={`px-2 py-0.5 rounded ${pivotGroupBy === 'category' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                                          >
                                            By Category
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setPivotGroupBy('bucket'); }}
                                            className={`px-2 py-0.5 rounded ${pivotGroupBy === 'bucket' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                                          >
                                            By Bucket
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* EXPANDED BREAKDOWN TABLE CONTENT */}
                                  {isBreakdownTableExpanded && (
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-xs text-left border-collapse table-fixed">
                                        <colgroup>
                                          <col className="w-[36%]" />
                                          <col className="w-[34%]" />
                                          <col className="w-[15%]" />
                                          <col className="w-[15%]" />
                                        </colgroup>
                                        <thead className="bg-slate-100/90 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                                          <tr>
                                            <th className="px-3 py-2">Service Category / Line Item</th>
                                            <th className="px-2.5 py-2">Details</th>
                                            <th className="px-2.5 py-2 text-right bg-rose-50/60 text-rose-700">Cost / Pax</th>
                                            <th className="px-2.5 py-2 text-right bg-sky-50/60 text-sky-700">Revenue / Pax</th>
                                          </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                          {pivot.groups.length === 0 ? (
                                            <tr>
                                              <td colSpan={4} className="p-6 text-center text-slate-400">
                                                <div className="italic text-sm">No services or financial items linked to this tour yet.</div>
                                                {(tour?.passengers?.length || 0) > 0 && (
                                                  <div className="mt-3">
                                                    <button
                                                      type="button"
                                                      onClick={handleAutoGenerateHotels}
                                                      disabled={isGeneratingHotels}
                                                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer"
                                                    >
                                                      <Sparkles className="w-4 h-4 text-amber-300" />
                                                      {isGeneratingHotels ? 'Generating Stays...' : '✨ Auto-Generate Hotel Stays from Rooming'}
                                                    </button>
                                                    <p className="text-[11px] text-slate-400 mt-1.5 font-normal">
                                                      Builds hotel accommodation for Budapest (2 Nts), Vienna (2 Nts), and Prague (3 Nts) matching passenger room allocations.
                                                    </p>
                                                  </div>
                                                )}
                                              </td>
                                            </tr>
                                          ) : (
                                            pivot.groups.map((group) => {
                                              const isExpanded = pivotExpandedRows[group.groupName] ?? pivotExpandAll;

                                              return (
                                                <React.Fragment key={group.groupName}>
                                                  <tr
                                                    onClick={() => togglePivotRow(group.groupName)}
                                                    className="bg-slate-50/90 hover:bg-slate-100 transition-colors cursor-pointer select-none font-bold text-slate-800 text-[11px] border-b border-slate-200/80"
                                                  >
                                                    <td className="px-3 py-2 truncate">
                                                      <div className="flex items-center gap-1.5">
                                                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                                                        <span className="flex items-center gap-1.5 text-slate-900 font-extrabold truncate">
                                                          {group.groupName.includes('Hotel') && <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                                          {group.groupName.includes('Transport') && <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                                                          {group.groupName.includes('Excursion') && <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                                          {group.groupName.includes('Guide') && <PersonStanding className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                                                          {group.groupName.includes('Revenue') && <DollarSign className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                                                          <span className="truncate">{group.groupName}</span>
                                                        </span>
                                                        <span className="bg-white border border-slate-200 text-slate-500 px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0">
                                                          {group.items.length}
                                                        </span>
                                                      </div>
                                                    </td>

                                                    <td className="px-2.5 py-2 text-slate-400 font-normal text-[10px] truncate">
                                                      {group.bucketName}
                                                    </td>

                                                    <td className="px-2.5 py-2 text-right font-bold text-rose-700 bg-rose-50/40 whitespace-nowrap">
                                                      {group.totalCost > 0 ? (
                                                        <div>
                                                          <span>€{group.costPerPax.toFixed(2)}</span>
                                                          <span className="block text-[9px] text-slate-400 font-normal">Total: €{group.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                      ) : '—'}
                                                    </td>

                                                    <td className="px-2.5 py-2 text-right font-bold text-sky-700 bg-sky-50/40 whitespace-nowrap">
                                                      {group.totalRevenue > 0 ? (
                                                        <div>
                                                          <span>€{group.revenuePerPax.toFixed(2)}</span>
                                                          <span className="block text-[9px] text-slate-400 font-normal">Total: €{group.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                      ) : '—'}
                                                    </td>
                                                  </tr>

                                                  {isExpanded && group.items.map((item) => {
                                                    const itemCostPerPax = item.perPaxPrice !== undefined
                                                      ? item.perPaxPrice
                                                      : (item.cost > 0 ? Math.round((item.cost / totalPax) * 100) / 100 : 0);
                                                    const itemRevenuePerPax = item.perPaxPrice !== undefined
                                                      ? item.perPaxPrice
                                                      : (item.revenue > 0 ? Math.round((item.revenue / totalPax) * 100) / 100 : 0);

                                                    return (
                                                      <tr key={item.id} className="hover:bg-slate-50 transition-colors text-[11px] bg-white border-b border-slate-100">
                                                        <td className="px-3 py-1.5 pl-6 text-slate-700 font-medium">
                                                          <div className="flex items-center gap-1.5">
                                                            <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                                                            <span className="break-words leading-tight">{item.description}</span>
                                                          </div>
                                                        </td>

                                                        <td className="px-2.5 py-1.5 text-slate-500 text-[10px] leading-snug break-words whitespace-normal">
                                                          {item.detailsText || `${item.qty} x €${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                        </td>

                                                        <td className="px-2.5 py-1.5 text-right text-rose-600 font-semibold bg-rose-50/20 whitespace-nowrap">
                                                          {item.cost !== 0 ? (
                                                            <div>
                                                              <span className={item.cost < 0 ? "text-emerald-600 font-bold" : ""}>
                                                                {item.cost < 0 ? `-€${Math.abs(itemCostPerPax).toFixed(2)}` : `€${itemCostPerPax.toFixed(2)}`}
                                                              </span>
                                                              <span className="block text-[9px] text-slate-400 font-normal">
                                                                Total: {item.cost < 0 ? `-€${Math.abs(item.cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `€${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                              </span>
                                                            </div>
                                                          ) : '—'}
                                                        </td>

                                                        <td className="px-2.5 py-1.5 text-right text-sky-600 font-semibold bg-sky-50/20 whitespace-nowrap">
                                                          {item.revenue > 0 ? (
                                                            <div>
                                                              <span>€{itemRevenuePerPax.toFixed(2)}</span>
                                                              <span className="block text-[9px] text-slate-400 font-normal">Total: €{item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                            </div>
                                                          ) : '—'}
                                                        </td>
                                                      </tr>
                                                    );
                                                  })}
                                                </React.Fragment>
                                              );
                                            })
                                          )}
                                        </tbody>

                                        <tfoot className="bg-slate-900 text-white font-bold text-[11px]">
                                          <tr>
                                            <td className="px-3 py-2 uppercase tracking-wider text-slate-200">
                                              Total ({totalPax} Pax)
                                            </td>
                                            <td className="px-2.5 py-2 text-slate-400 font-normal text-[10px]">
                                              Summary
                                            </td>
                                            <td className="px-2.5 py-2 text-right text-rose-300 bg-rose-950/40 whitespace-nowrap">
                                              <div>
                                                <span>€{pivot.grandCostPerPax.toFixed(2)}</span>
                                                <span className="block text-[9px] text-rose-200/70 font-normal">Total: €{pivot.grandTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                              </div>
                                            </td>
                                            <td className="px-2.5 py-2 text-right text-sky-300 bg-sky-950/40 whitespace-nowrap">
                                              <div>
                                                <span>€{pivot.grandRevenuePerPax.toFixed(2)}</span>
                                                <span className="block text-[9px] text-sky-200/70 font-normal">Total: €{pivot.grandTotalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                              </div>
                                            </td>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    </div>
                                  )}
                                </div>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                          <div className="flex flex-wrap items-center gap-y-1.5 text-sm text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <PlaneLanding className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                            <span className="font-medium mr-1.5">Arrival:</span> {new Date(tour.arrivalDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            {tour.arrivalAirport && <span className="ml-2 text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold">{tour.arrivalAirport}</span>}
                            {tour.arrivalFlight && (
                              <div className="inline-flex items-center gap-1.5 ml-2">
                                <a
                                  href={getFlightAwareUrl(tour.arrivalFlight)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Check ${tour.arrivalFlight} live status on FlightAware`}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200/80 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
                                >
                                  <span>{tour.arrivalFlight}</span>
                                  <ExternalLink className="w-3 h-3 text-indigo-500 group-hover:text-indigo-700 shrink-0" />
                                </a>
                                {(() => {
                                  const match = tour.arrivalFlight.match(/([A-Za-z0-9]{2,3})\s*([0-9]{1,4})/);
                                  if (match) {
                                    const fr24 = `${match[1]}${match[2]}`.toLowerCase();
                                    return (
                                      <a
                                        href={`https://www.flightradar24.com/data/flights/${fr24}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`View ${tour.arrivalFlight} on FlightRadar24 live radar`}
                                        className="inline-flex items-center px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold tracking-tight transition-all cursor-pointer shadow-2xs"
                                      >
                                        Radar24
                                      </a>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-y-1.5 text-sm text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <PlaneTakeoff className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                            <span className="font-medium mr-1.5">Departure:</span> {new Date(tour.endDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            {tour.departureAirport && <span className="ml-2 text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold">{tour.departureAirport}</span>}
                            {tour.departureFlight && (
                              <div className="inline-flex items-center gap-1.5 ml-2">
                                <a
                                  href={getFlightAwareUrl(tour.departureFlight)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Check ${tour.departureFlight} live status on FlightAware`}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200/80 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
                                >
                                  <span>{tour.departureFlight}</span>
                                  <ExternalLink className="w-3 h-3 text-indigo-500 group-hover:text-indigo-700 shrink-0" />
                                </a>
                                {(() => {
                                  const match = tour.departureFlight.match(/([A-Za-z0-9]{2,3})\s*([0-9]{1,4})/);
                                  if (match) {
                                    const fr24 = `${match[1]}${match[2]}`.toLowerCase();
                                    return (
                                      <a
                                        href={`https://www.flightradar24.com/data/flights/${fr24}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`View ${tour.departureFlight} on FlightRadar24 live radar`}
                                        className="inline-flex items-center px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold tracking-tight transition-all cursor-pointer shadow-2xs"
                                      >
                                        Radar24
                                      </a>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
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
                              startDate: formatDate(startDateStr),
                              endDate: formatDate(endDateStr),
                              rooms: [],
                              totalCost: 0
                            };
                          }
                          
                          if (isHotelDiscountService(svc)) {
                            hotelReservationsMap[key].rooms.push(`Discount: -€${Math.abs(svc.totalAmount || svc.unitPrice || 0)}`);
                            hotelReservationsMap[key].totalCost -= Math.abs(svc.totalAmount || (svc.unitPrice * (svc.quantity || 1)) || 0);
                          } else {
                            if (svc.roomType && svc.roomCount && svc.roomType !== 'City Tax' && svc.roomType !== 'Hotel Tax') {
                              hotelReservationsMap[key].rooms.push(`${svc.roomCount}x ${svc.roomType}`);
                            } else if (svc.description && !svc.description.includes('City Tax') && !svc.description.includes('Hotel Tax')) {
                              hotelReservationsMap[key].rooms.push(svc.description);
                            }
                            hotelReservationsMap[key].totalCost += (svc.totalAmount || (svc.unitPrice * (svc.quantity || 1)) || 0);
                          }
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

              {/* RIGHT COLUMN (3-4 Cols): Compact Operational Remarks & Special Tour Notes Card */}
              <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3 sticky top-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Operational Remarks
                  </h3>
                  <div className="flex items-center gap-2">
                    {notesSavedSuccess && (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                        ✓ Saved!
                      </span>
                    )}
                    <button 
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={saving}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? 'Saving...' : '💾 Save'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                  Special tour instructions, guide/driver remarks, flight arrival notes, or client preferences:
                </p>

                <textarea
                  rows={10}
                  value={tourNotes}
                  onChange={e => setTourNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium leading-relaxed resize-y"
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
              <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50 gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-slate-800">Services Revenue</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Sales and billable items</p>
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
              <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50 gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-slate-800">Services Cost</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Expenses and supplier costs</p>
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
                  {services.filter(s => s.serviceCategoryId === 1).length === 0 && (tour?.passengers?.length || 0) > 0 && (
                    <button 
                      onClick={handleAutoGenerateHotels} 
                      disabled={isGeneratingHotels}
                      className="flex items-center px-3 py-1.5 bg-indigo-50 border border-indigo-200 shadow-sm hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      {isGeneratingHotels ? 'Generating...' : 'Auto-Generate Hotels'}
                    </button>
                  )}
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
                      .filter(s => s.roomType !== 'Guide Room' && s.roomType !== 'Driver Room' && !isHotelDiscountService(s))
                      .reduce((sum, s) => sum + (s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0);

                    const hotelDiscountServices = costBuckets.operational.filter(s => isHotelDiscountService(s));
                    const hotelDiscountTotal = hotelDiscountServices.reduce((sum, s) => sum + Math.abs(s.totalAmount || s.unitPrice * (s.quantity || 1) || 0), 0);

                    const opGrandTotal = passengerAndOtherTotal + staffTotal - hotelDiscountTotal;

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
                        {renderServiceTable(costBuckets.operational.filter(s => s.roomType !== 'Guide Room' && s.roomType !== 'Driver Room' && !isHotelDiscountService(s)), false)}

                        {/* Expandable Hotel Discounts Subsection */}
                        <div className="mt-4 border border-emerald-200 rounded-2xl bg-emerald-50/20 overflow-hidden shadow-sm">
                          <button 
                            type="button"
                            onClick={() => setIsHotelDiscountExpanded(!isHotelDiscountExpanded)} 
                            className="w-full p-4 bg-gradient-to-r from-emerald-50 to-teal-50/60 hover:from-emerald-100/70 hover:to-teal-100/70 transition-all flex items-center justify-between font-bold text-slate-800 text-sm border-b border-emerald-100"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-950 font-extrabold">Hotel Discounts</span>
                              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                {hotelDiscountServices.length} {hotelDiscountServices.length === 1 ? 'Discount' : 'Discounts'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-600">
                                Total Hotel Discount: <strong className="text-emerald-800 font-extrabold">-€{hotelDiscountTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                              </span>
                              {isHotelDiscountExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                            </div>
                          </button>

                          {isHotelDiscountExpanded && (
                            <div className="p-4 space-y-3 bg-white/90">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                                  <Tag className="w-3.5 h-3.5 text-emerald-600" /> Hotel Discounts & Deductions
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => {
                                    openServiceModal('Hotel Discount', false);
                                  }}
                                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-all"
                                >
                                  <Plus className="w-3 h-3" /> Add Hotel Discount
                                </button>
                              </div>

                              {hotelDiscountServices.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No hotel discount entries.</p>
                              ) : (
                                <div className="divide-y divide-emerald-100 border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/30">
                                  {hotelDiscountServices.map(s => {
                                    const h = hotels.find(x => x.id === s.hotelId);
                                    const amt = Math.abs(s.totalAmount || s.unitPrice * (s.quantity || 1) || 0);
                                    return (
                                      <div key={s.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <div>
                                          <span className="font-bold text-emerald-950">{h?.name || 'General Hotel Discount'}</span>
                                          <span className="ml-2 text-emerald-700 font-medium">{s.description || 'Hotel Discount'}</span>
                                          {s.startDate && s.endDate && (
                                            <span className="ml-2 text-slate-500">Dates: {formatDate(s.startDate)} - {formatDate(s.endDate)}</span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="font-bold text-emerald-800">
                                            Discount: <span className="text-emerald-700 font-extrabold">-€{amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <button type="button" onClick={() => openEditServiceModal(s)} className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors" title="Edit Hotel Discount">
                                              <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button type="button" onClick={() => handleDeleteService(s.id)} className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors" title="Delete Hotel Discount">
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
                          )}
                        </div>

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
                                              <span className="ml-2 text-slate-500">Dates: {formatDate(s.startDate)} - {formatDate(s.endDate)}</span>
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
                                              <span className="ml-2 text-slate-500">Dates: {formatDate(s.startDate)} - {formatDate(s.endDate)}</span>
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
                <div className="px-6 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-slate-800">Passenger & Booking List</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage passengers, rooming assignments, and booking details for this tour.</p>
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
                            {(() => {
                              const pType = getPassengerPaxType(p, tour?.arrivalDate);
                              return (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  pType === 'Children' ? 'bg-amber-100 text-amber-800' :
                                  pType === 'Infant' ? 'bg-rose-100 text-rose-800' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {pType === 'Children' ? 'Children 🧒' :
                                   pType === 'Infant' ? 'Infant 👶' :
                                   'Adult'}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{p.firstName || '-'}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{p.lastName || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.gender || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.nationalId || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.passportNo || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.passportType || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.visaNo || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{p.phone || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(p.dateOfBirth, '-')}</td>
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
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <h2 className="text-base font-bold text-slate-800">{editingPassengerId ? 'Edit' : 'Add'} Passenger / Booking</h2>
              <button onClick={() => setIsPassengerModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <input
                    type="date"
                    value={passengerData.dateOfBirth}
                    onChange={e => {
                      const newDob = e.target.value;
                      const age = calculatePassengerAge(newDob, tour?.arrivalDate);
                      let newPaxType = passengerData.paxType || 'Adult';
                      if (age !== null) {
                        if (age < 2) newPaxType = 'Infant';
                        else if (age < 12) newPaxType = 'Children';
                        else newPaxType = 'Adult';
                      }
                      setPassengerData({ ...passengerData, dateOfBirth: newDob, paxType: newPaxType });
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {passengerData.dateOfBirth && (() => {
                    const age = calculatePassengerAge(passengerData.dateOfBirth, tour?.arrivalDate);
                    if (age !== null) {
                      return (
                        <p className="text-[11px] font-medium text-slate-500 mt-1">
                          Age: <span className="font-bold text-slate-800">{age} yrs</span> {age < 12 ? '→ Children' : '→ Adult'}
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pax Classification</label>
                  <select
                    value={passengerData.paxType || 'Adult'}
                    onChange={e => setPassengerData({ ...passengerData, paxType: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold ${
                      passengerData.paxType === 'Children' ? 'bg-amber-50 border-amber-300 text-amber-900' :
                      passengerData.paxType === 'Infant' ? 'bg-rose-50 border-rose-300 text-rose-900' :
                      'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Adult">Adult</option>
                    <option value="Children">Children</option>
                    <option value="Infant">Infant</option>
                  </select>
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
                          const basis = newService.pricingBasis || 'Room';
                          
                          // Rooming list counts from passengers
                          const passList = tour?.passengers || [];
                          const sPass = passList.filter((p: any) => p.roomType === 'Single').length;
                          const dPass = passList.filter((p: any) => p.roomType === 'Double').length;
                          const twPass = passList.filter((p: any) => p.roomType === 'Twin').length;
                          const trPass = passList.filter((p: any) => p.roomType === 'Triple').length;
                          const ebPass = passList.filter((p: any) => (p.roomType || '').includes('Extra Bed') || (p.roomType || '').includes('DBL+EB')).length;

                          const sCount = sPass;
                          const dCount = Math.ceil(dPass / 2);
                          const twCount = Math.ceil(twPass / 2);
                          const trCount = Math.ceil(trPass / 3);
                          const ebCount = Math.ceil(ebPass / 3);

                          const sRate = basis === 'Room' ? (h?.singleRoomRate || h?.singleRate || 0) : (h?.singlePaxRate || h?.singleRate || 0);
                          const dRate = basis === 'Room' ? (h?.doubleRoomRate || (h?.doublePaxRate ? h.doublePaxRate * 2 : 0) || (h?.doubleRate ? h.doubleRate * 2 : 0)) : (h?.doublePaxRate || (h?.doubleRoomRate ? h.doubleRoomRate / 2 : 0) || h?.doubleRate || 0);
                          const twRate = basis === 'Room' ? (h?.twinRoomRate || (h?.twinPaxRate ? h.twinPaxRate * 2 : 0) || (h?.twinRate ? h.twinRate * 2 : 0)) : (h?.twinPaxRate || (h?.twinRoomRate ? h.twinRoomRate / 2 : 0) || h?.twinRate || 0);
                          const trRate = basis === 'Room' ? (h?.tripleRoomRate || (h?.triplePaxRate ? h.triplePaxRate * 3 : 0) || (h?.tripleRate ? h.tripleRate * 3 : 0)) : (h?.triplePaxRate || (h?.tripleRoomRate ? h.tripleRoomRate / 3 : 0) || h?.tripleRate || 0);
                          const ebRate = basis === 'Room' ? (h?.dblEbRoomRate || (h?.dblEbPaxRate ? h.dblEbPaxRate * 3 : 0) || (h?.dblEbRate ? h.dblEbRate * 3 : 0)) : (h?.dblEbPaxRate || (h?.dblEbRoomRate ? h.dblEbRoomRate / 3 : 0) || h?.dblEbRate || 0);

                          let editedUp = dRate || 0;
                          let editedTot = newService.totalAmount;
                          if (editingServiceId) {
                            editedUp = getHotelDefaultRate(h, newService.roomType || 'Double', basis);
                            const ppr = getPaxPerRoom(newService.roomType || 'Double');
                            const mult = (basis === 'Pax') ? ((newService.roomCount || 1) * ppr) : (newService.roomCount || 1);
                            editedTot = Math.round(mult * (newService.quantity || 1) * editedUp * 100) / 100;
                          }

                          setNewService({ 
                            ...newService, 
                            hotelId: h?.id || null, 
                            description: h?.name || '', 
                            pricingBasis: basis,
                            singleCount: editingServiceId ? newService.singleCount : sCount,
                            doubleCount: editingServiceId ? newService.doubleCount : dCount,
                            twinCount: editingServiceId ? newService.twinCount : twCount,
                            tripleCount: editingServiceId ? newService.tripleCount : trCount,
                            dblEbCount: editingServiceId ? newService.dblEbCount : ebCount,
                            singleRate: sRate,
                            doubleRate: dRate,
                            twinRate: twRate,
                            tripleRate: trRate,
                            dblEbRate: ebRate,
                            unitPrice: editingServiceId ? editedUp : (dRate || 0),
                            totalAmount: editedTot,
                            guideRate: sRate || 60,
                            driverRate: sRate || 50
                          });
                        }} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 shadow-2xs">
                          <option value="">Select a Hotel...</option>
                          {hotels.map((h: any) => <option key={h.id} value={h.id}>{h.name} — {h.location}</option>)}
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
                              const prevBasis = newService.pricingBasis || 'Pax';
                              const isFromPax = prevBasis === 'Pax';

                              let editedUp = newService.unitPrice;
                              let editedTot = newService.totalAmount;
                              if (editingServiceId) {
                                const ppr = getPaxPerRoom(newService.roomType || 'Double');
                                if (isFromPax && newService.unitPrice > 0) {
                                  editedUp = Math.round(newService.unitPrice * ppr * 100) / 100;
                                } else {
                                  editedUp = getHotelDefaultRate(h, newService.roomType || 'Double', 'Room');
                                }
                                const mult = newService.roomCount || 1;
                                editedTot = Math.round(mult * (newService.quantity || 1) * editedUp * 100) / 100;
                              }

                              setNewService({
                                ...newService,
                                pricingBasis: newBasis,
                                unitPrice: editingServiceId ? editedUp : newService.unitPrice,
                                totalAmount: editingServiceId ? editedTot : newService.totalAmount,
                                singleRate: h?.singleRoomRate || (h?.singlePaxRate ? h.singlePaxRate : (newService.singleRate || 0)),
                                doubleRate: h?.doubleRoomRate || (h?.doublePaxRate ? h.doublePaxRate * 2 : (newService.doubleRate ? (isFromPax ? newService.doubleRate * 2 : newService.doubleRate) : 0)),
                                twinRate: h?.twinRoomRate || (h?.twinPaxRate ? h.twinPaxRate * 2 : (newService.twinRate ? (isFromPax ? newService.twinRate * 2 : newService.twinRate) : 0)),
                                tripleRate: h?.tripleRoomRate || (h?.triplePaxRate ? h.triplePaxRate * 3 : (newService.tripleRate ? (isFromPax ? newService.tripleRate * 3 : newService.tripleRate) : 0)),
                                dblEbRate: h?.dblEbRoomRate || (h?.dblEbPaxRate ? h.dblEbPaxRate * 3 : (newService.dblEbRate ? (isFromPax ? newService.dblEbRate * 3 : newService.dblEbRate) : 0)),
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
                              const prevBasis = newService.pricingBasis || 'Room';
                              const isFromRoom = prevBasis === 'Room';

                              let editedUp = newService.unitPrice;
                              let editedTot = newService.totalAmount;
                              if (editingServiceId) {
                                const ppr = getPaxPerRoom(newService.roomType || 'Double');
                                if (isFromRoom && newService.unitPrice > 0) {
                                  editedUp = Math.round((newService.unitPrice / ppr) * 100) / 100;
                                } else {
                                  editedUp = getHotelDefaultRate(h, newService.roomType || 'Double', 'Pax');
                                }
                                const mult = (newService.roomCount || 1) * ppr;
                                editedTot = Math.round(mult * (newService.quantity || 1) * editedUp * 100) / 100;
                              }

                              setNewService({
                                ...newService,
                                pricingBasis: newBasis,
                                unitPrice: editingServiceId ? editedUp : newService.unitPrice,
                                totalAmount: editingServiceId ? editedTot : newService.totalAmount,
                                singleRate: h?.singlePaxRate || (h?.singleRoomRate ? h.singleRoomRate : (newService.singleRate || 0)),
                                doubleRate: h?.doublePaxRate || (h?.doubleRoomRate ? h.doubleRoomRate / 2 : (newService.doubleRate ? (isFromRoom ? newService.doubleRate / 2 : newService.doubleRate) : 0)),
                                twinRate: h?.twinPaxRate || (h?.twinRoomRate ? h.twinRoomRate / 2 : (newService.twinRate ? (isFromRoom ? newService.twinRate / 2 : newService.twinRate) : 0)),
                                tripleRate: h?.triplePaxRate || (h?.tripleRoomRate ? h.tripleRoomRate / 3 : (newService.tripleRate ? (isFromRoom ? newService.tripleRate / 3 : newService.tripleRate) : 0)),
                                dblEbRate: h?.dblEbPaxRate || (h?.dblEbRoomRate ? h.dblEbRoomRate / 3 : (newService.dblEbRate ? (isFromRoom ? newService.dblEbRate / 3 : newService.dblEbRate) : 0)),
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

                            setNewService({
                              ...newService,
                              singleCount: sPass,
                              doubleCount: Math.ceil(dPass / 2),
                              twinCount: Math.ceil(twPass / 2),
                              tripleCount: Math.ceil(trPass / 3),
                              dblEbCount: Math.ceil(ebPass / 3),
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
                          let newTot = newService.totalAmount;
                          if (editingServiceId) {
                            const ppr = getPaxPerRoom(newService.roomType);
                            const mult = (newService.pricingBasis === 'Pax') ? ((newService.roomCount || 1) * ppr) : (newService.roomCount || 1);
                            newTot = Math.round(mult * n * (newService.unitPrice || 0) * 100) / 100;
                          }
                          setNewService({ ...newService, startDate: newStart, quantity: n, totalAmount: newTot });
                        }} className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium" suppressHydrationWarning />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Check-out Date ({isNaN(newService.quantity) || !newService.quantity ? 1 : newService.quantity} Nights)</label>
                        <input required type="date" value={newService.endDate || ''} onChange={e => {
                          const newEnd = e.target.value;
                          const diff = new Date(newEnd).getTime() - new Date(newService.startDate).getTime();
                          const n = !isNaN(diff) ? Math.max(1, Math.ceil(diff / (1000 * 3600 * 24))) : 1;
                          let newTot = newService.totalAmount;
                          if (editingServiceId) {
                            const ppr = getPaxPerRoom(newService.roomType);
                            const mult = (newService.pricingBasis === 'Pax') ? ((newService.roomCount || 1) * ppr) : (newService.roomCount || 1);
                            newTot = Math.round(mult * n * (newService.unitPrice || 0) * 100) / 100;
                          }
                          setNewService({ ...newService, endDate: newEnd, quantity: n, totalAmount: newTot });
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

                    const accomPax = sC * 1 + dC * 2 + twC * 2 + trC * 3 + ebC * 3;
                    const totalRooms = sC + dC + twC + trC + ebC;
                    const totalTourPax = (tour?.pax || 0);
                    const isMatched = accomPax === totalTourPax || totalTourPax === 0;

                    return (
                      <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${isMatched ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{isMatched ? '🟢' : '🟡'}</span>
                          <span>
                            Accommodating <strong>{accomPax} Pax</strong> in <strong>{totalRooms} Rooms</strong>
                            {isMatched ? ' — Matched with Tour Bookings' : ` (Tour Total: ${totalTourPax} Pax)`}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-white/70 border border-current shadow-2xs">
                          {isRoom ? '🏢 Room Pricing Mode' : '👤 Pax Pricing Mode'}
                        </span>
                      </div>
                    );
                  })()}
                  
                  {!editingServiceId ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          {newService.pricingBasis === 'Pax' ? 'Room Allocation & Nightly Pax Rates (€/pax/night) [All Editable]' : 'Room Allocation & Nightly Room Rates (€/room/night) [All Editable]'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          {/* Single */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Single (1 Pax)</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400"># Rooms</label>
                                <input type="number" min="0" value={newService.singleCount || 0} onChange={e => setNewService({ ...newService, singleCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '€/Pax/Nt' : '€/Rm/Nt'}</label>
                                <input type="number" step="0.01" value={newService.singleRate !== undefined ? newService.singleRate : ''} onChange={e => setNewService({ ...newService, singleRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="100" />
                              </div>
                            </div>
                          </div>

                          {/* Double */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Double (2 Pax)</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400"># Rooms</label>
                                <input type="number" min="0" value={newService.doubleCount || 0} onChange={e => setNewService({ ...newService, doubleCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '€/Pax/Nt' : '€/Rm/Nt'}</label>
                                <input type="number" step="0.01" value={newService.doubleRate !== undefined ? newService.doubleRate : ''} onChange={e => setNewService({ ...newService, doubleRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="140" />
                              </div>
                            </div>
                          </div>

                          {/* Twin */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Twin (2 Pax)</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400"># Rooms</label>
                                <input type="number" min="0" value={newService.twinCount || 0} onChange={e => setNewService({ ...newService, twinCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '€/Pax/Nt' : '€/Rm/Nt'}</label>
                                <input type="number" step="0.01" value={newService.twinRate !== undefined ? newService.twinRate : ''} onChange={e => setNewService({ ...newService, twinRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="140" />
                              </div>
                            </div>
                          </div>

                          {/* Triple */}
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-800 block">Triple (3 Pax)</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400"># Rooms</label>
                                <input type="number" min="0" value={newService.tripleCount || 0} onChange={e => setNewService({ ...newService, tripleCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '€/Pax/Nt' : '€/Rm/Nt'}</label>
                                <input type="number" step="0.01" value={newService.tripleRate !== undefined ? newService.tripleRate : ''} onChange={e => setNewService({ ...newService, tripleRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-700" placeholder="180" />
                              </div>
                            </div>
                          </div>

                          {/* DBL + EB */}
                          <div className="bg-white p-2 rounded-lg border border-purple-200 shadow-2xs space-y-1 ring-1 ring-purple-100">
                            <span className="text-xs font-bold text-purple-900 block truncate" title="Double + Extra Bed (3 Pax)">DBL + EB (3 Pax)</span>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400"># Rooms</label>
                                <input type="number" min="0" value={newService.dblEbCount || 0} onChange={e => setNewService({ ...newService, dblEbCount: parseInt(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-purple-50/50 border border-purple-200 rounded text-xs font-bold text-slate-800" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-400">{newService.pricingBasis === 'Pax' ? '€/Pax/Nt' : '€/Rm/Nt'}</label>
                                <input type="number" step="0.01" value={newService.dblEbRate !== undefined ? newService.dblEbRate : ''} onChange={e => setNewService({ ...newService, dblEbRate: parseFloat(e.target.value) || 0 })} className="w-full px-1.5 py-0.5 bg-purple-50/50 border border-purple-200 rounded text-xs font-bold text-purple-700" placeholder="170" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ──── HOTEL DISCOUNT & NOTES FIELDS ──── */}
                      <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">Hotel Discount & Notes</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {Number(newService.discountAmount) > 0 ? `Applied: -€${Number(newService.discountAmount).toFixed(2)}` : 'Processed as Hotel Discount'}
                          </span>
                        </div>
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

                            {!!newService.includeHotelTax && (() => {
                              const currentPax = newService.taxPaxCount !== undefined ? newService.taxPaxCount : (tour?.pax || 0);
                              const currentNights = newService.taxNights !== undefined ? newService.taxNights : (newService.quantity || 1);
                              const currentRate = newService.hotelTaxRate || 0;
                              
                              const calcNightly = currentPax * currentRate;
                              const currentNightly = newService.taxNightlyTotal !== undefined ? newService.taxNightlyTotal : calcNightly;
                              
                              const calcTotal = currentNightly * currentNights;
                              const currentTotal = newService.hotelTaxTotal !== undefined ? newService.hotelTaxTotal : calcTotal;

                              return (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tax Rate (€/pax/N)</label>
                                      <input 
                                        type="number" 
                                        step="0.10" 
                                        value={newService.hotelTaxRate || ''} 
                                        onChange={e => {
                                          const rate = parseFloat(e.target.value) || 0;
                                          setNewService((prev: any) => ({
                                            ...prev,
                                            hotelTaxRate: rate,
                                            taxNightlyTotal: undefined,
                                            hotelTaxTotal: undefined
                                          }));
                                        }} 
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs font-bold text-blue-700 focus:bg-white focus:border-blue-500" 
                                        placeholder="2.50" 
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Total Pax</label>
                                      <input 
                                        type="number" 
                                        value={currentPax} 
                                        onChange={e => {
                                          const p = parseInt(e.target.value) || 0;
                                          setNewService((prev: any) => ({
                                            ...prev,
                                            taxPaxCount: p,
                                            taxNightlyTotal: undefined,
                                            hotelTaxTotal: undefined
                                          }));
                                        }} 
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs font-bold text-blue-700 focus:bg-white focus:border-blue-500" 
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Total Nights (N)</label>
                                      <input 
                                        type="number" 
                                        value={currentNights} 
                                        onChange={e => {
                                          const n = parseInt(e.target.value) || 0;
                                          setNewService((prev: any) => ({
                                            ...prev,
                                            taxNights: n,
                                            hotelTaxTotal: undefined
                                          }));
                                        }} 
                                        className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs font-bold text-blue-700 focus:bg-white focus:border-blue-500" 
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-100/80">
                                    <div>
                                      <label className="block text-[10px] font-bold text-blue-800 mb-0.5">Nightly Tax (€)</label>
                                      <input 
                                        type="number" 
                                        step="0.01" 
                                        value={currentNightly} 
                                        onChange={e => {
                                          const nTax = parseFloat(e.target.value) || 0;
                                          setNewService((prev: any) => ({
                                            ...prev,
                                            taxNightlyTotal: nTax,
                                            hotelTaxTotal: undefined
                                          }));
                                        }} 
                                        className="w-full px-2 py-1 bg-blue-50/80 border border-blue-300 rounded-md text-xs font-extrabold text-blue-900 focus:bg-white focus:border-blue-600" 
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-blue-900 mb-0.5">Total Stay Tax (€)</label>
                                      <input 
                                        type="number" 
                                        step="0.01" 
                                        value={currentTotal} 
                                        onChange={e => {
                                          const tot = parseFloat(e.target.value) || 0;
                                          setNewService((prev: any) => ({
                                            ...prev,
                                            hotelTaxTotal: tot
                                          }));
                                        }} 
                                        className="w-full px-2 py-1 bg-blue-100/80 border-2 border-blue-400 rounded-md text-xs font-black text-blue-950 focus:bg-white focus:border-blue-600" 
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
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
                            const curTaxPax = newService.taxPaxCount !== undefined ? newService.taxPaxCount : (tour?.pax || 0);
                            const curTaxNights = newService.taxNights !== undefined ? newService.taxNights : safeQty;
                            const curTaxRate = newService.hotelTaxRate || 0;
                            const curTaxNightly = newService.taxNightlyTotal !== undefined ? newService.taxNightlyTotal : (curTaxPax * curTaxRate);
                            const taxTotal = newService.includeHotelTax 
                              ? (newService.hotelTaxTotal !== undefined ? newService.hotelTaxTotal : (curTaxNightly * curTaxNights)) 
                              : 0;

                            const passengerTotal = (
                              (newService.singleCount * (newService.singleRate || 0) * safeQty) +
                              (newService.doubleCount * (newService.doubleRate || 0) * safeQty) +
                              (newService.twinCount * (newService.twinRate || 0) * safeQty) +
                              (newService.tripleCount * (newService.tripleRate || 0) * safeQty) +
                              (newService.dblEbCount * (newService.dblEbRate || 0) * safeQty)
                            );
                            const discAmt = Number(newService.discountAmount) || 0;
                            const packageTotal = Math.max(0, passengerTotal + gTotal + dTotal + taxTotal - discAmt);

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
                                    {discAmt > 0 && (
                                      <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200">
                                        <span>Hotel Discount ({newService.discountNotes || 'Discount'})</span>
                                        <span>-€{discAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="pt-2 border-t border-indigo-200 flex justify-between font-bold text-xs text-indigo-900">
                                  <span>Total Package Cost</span>
                                  <span>€{packageTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (() => {
                      const h = hotels.find((x: any) => x.id === newService.hotelId);
                      const basis = newService.pricingBasis || 'Room';
                      const isPaxBasis = basis.toLowerCase().includes('pax');
                      const rType = newService.roomType || 'Double';
                      const rCount = Number(newService.roomCount) || 1;
                      const nights = Number(newService.quantity) || 1;
                      const paxPerRoom = getPaxPerRoom(rType);
                      const totalPaxAccommodated = rCount * paxPerRoom;
                      const multiplier = isPaxBasis ? totalPaxAccommodated : rCount;
                      const currentUnitPrice = Number(newService.unitPrice) || 0;
                      const currentTotalAmount = (newService.totalAmount !== undefined && newService.totalAmount !== null && !isNaN(Number(newService.totalAmount)))
                        ? Number(newService.totalAmount)
                        : Math.round(multiplier * nights * currentUnitPrice * 100) / 100;
                      const defaultRate = getHotelDefaultRate(h, rType, basis);
                      const isRateDefault = Math.abs(currentUnitPrice - defaultRate) < 0.01;

                      const updateRoomTypeAndCount = (newRt: string, newRc: number, newUp?: number) => {
                        const effectiveUp = newUp !== undefined ? newUp : currentUnitPrice;
                        const ppr = getPaxPerRoom(newRt);
                        const mult = isPaxBasis ? (newRc * ppr) : newRc;
                        const newTot = Math.round(mult * nights * effectiveUp * 100) / 100;
                        const rtLower = newRt.toLowerCase();
                        setNewService({
                          ...newService,
                          roomType: newRt,
                          roomCount: newRc,
                          unitPrice: effectiveUp,
                          totalAmount: newTot,
                          singleCount: (rtLower.includes('single') || rtLower.includes('guide') || rtLower.includes('driver')) ? newRc : 0,
                          doubleCount: (rtLower.includes('double') && !rtLower.includes('extra bed') && !rtLower.includes('eb')) ? newRc : 0,
                          twinCount: rtLower.includes('twin') ? newRc : 0,
                          tripleCount: rtLower.includes('triple') ? newRc : 0,
                          dblEbCount: (rtLower.includes('extra bed') || rtLower.includes('eb') || rtLower.includes('dbl+eb')) ? newRc : 0,
                        });
                      };

                      return (
                        <div className="space-y-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                          {/* Row 1: Room Type & Room Count */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Room Type</label>
                              <select 
                                value={newService.roomType} 
                                onChange={e => {
                                  const selectedRt = e.target.value;
                                  const fetchedRate = getHotelDefaultRate(h, selectedRt, basis);
                                  updateRoomTypeAndCount(selectedRt, rCount, fetchedRate);
                                }} 
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-800 shadow-2xs"
                              >
                                {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                              </select>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                Accommodates {paxPerRoom} Pax per room
                              </span>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Number of Rooms</label>
                              <input 
                                required 
                                type="number" 
                                min="1" 
                                value={newService.roomCount || ''} 
                                onChange={e => {
                                  const count = Math.max(1, parseInt(e.target.value) || 1);
                                  updateRoomTypeAndCount(rType, count, currentUnitPrice);
                                }} 
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-800 shadow-2xs" 
                              />
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                Total: {totalPaxAccommodated} Pax across {rCount} room{rCount > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>

                          {/* Row 2: Editable Nightly Rate & Editable Final Price */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                            {/* Nightly Rate Input */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-800">
                                  {isPaxBasis ? 'Nightly Rate per Pax (€/pax/night)' : 'Nightly Rate per Room (€/room/night)'}
                                </label>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isRateDefault ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                  {isRateDefault ? '⚡ Fetched from Hotel' : '✏️ Custom Rate'}
                                </span>
                              </div>
                              <div className="relative">
                                <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">€</span>
                                <input 
                                  required 
                                  type="number" 
                                  step="0.01" 
                                  min="0" 
                                  value={newService.unitPrice !== undefined && newService.unitPrice !== null ? newService.unitPrice : ''} 
                                  onChange={e => {
                                    const up = parseFloat(e.target.value) || 0;
                                    const newTot = Math.round(multiplier * nights * up * 100) / 100;
                                    setNewService({
                                      ...newService,
                                      unitPrice: up,
                                      totalAmount: newTot
                                    });
                                  }} 
                                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500" 
                                  placeholder={defaultRate ? defaultRate.toFixed(2) : '0.00'}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>Default hotel metadata rate: €{defaultRate.toFixed(2)}</span>
                                {!isRateDefault && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newTot = Math.round(multiplier * nights * defaultRate * 100) / 100;
                                      setNewService({
                                        ...newService,
                                        unitPrice: defaultRate,
                                        totalAmount: newTot
                                      });
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                                  >
                                    Reset to Default
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Final Price / Total Cost Input */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-800">
                                  Final Price / Total Cost (€)
                                </label>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {nights} Night{nights > 1 ? 's' : ''} Stay
                                </span>
                              </div>
                              <div className="relative">
                                <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">€</span>
                                <input 
                                  required 
                                  type="number" 
                                  step="0.01" 
                                  min="0" 
                                  value={newService.totalAmount !== undefined && newService.totalAmount !== null ? newService.totalAmount : ''} 
                                  onChange={e => {
                                    const tot = parseFloat(e.target.value) || 0;
                                    const derivedUp = (multiplier * nights > 0) ? Math.round((tot / (multiplier * nights)) * 100) / 100 : 0;
                                    setNewService({
                                      ...newService,
                                      totalAmount: tot,
                                      unitPrice: derivedUp
                                    });
                                  }} 
                                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500" 
                                  placeholder="0.00"
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate">
                                Direct total override; updates nightly rate to match
                              </span>
                            </div>
                          </div>

                          {/* Calculation Details Banner */}
                          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center gap-1.5">
                                ℹ️ Price Calculation Breakdown ({isPaxBasis ? 'Per Pax Basis' : 'Per Room Basis'}):
                              </span>
                              <span className="text-blue-700 font-extrabold">
                                Total: €{currentTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="text-[11px] text-blue-800">
                              {isPaxBasis ? (
                                <span>
                                  <strong>{totalPaxAccommodated} Pax</strong> ({rCount} Rooms × {paxPerRoom} Pax/Rm) × <strong>{nights} Nights</strong> @ <strong>€{currentUnitPrice.toFixed(2)}/pax/night</strong> = <strong>€{currentTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                  <span className="ml-2 text-slate-500">(Effective room rate: €{(currentUnitPrice * paxPerRoom).toFixed(2)}/room/night)</span>
                                </span>
                              ) : (
                                <span>
                                  <strong>{rCount} Rooms</strong> × <strong>{nights} Nights</strong> @ <strong>€{currentUnitPrice.toFixed(2)}/room/night</strong> = <strong>€{currentTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                  <span className="ml-2 text-slate-500">(Effective pax rate: €{(currentUnitPrice / paxPerRoom).toFixed(2)}/pax/night)</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
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
                            {formatDate(tour?.arrivalDate)} — {formatDate(tour?.endDate)}
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

              {/* Hotel Discount */}
              {serviceType === 'Hotel Discount' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Hotel (Optional)</label>
                    <select 
                      value={newService.hotelId || ''} 
                      onChange={e => {
                        const hid = e.target.value ? parseInt(e.target.value) : null;
                        const h = hotels.find((x: any) => x.id === hid);
                        setNewService({
                          ...newService,
                          hotelId: hid,
                          description: newService.description || (h ? `${h.name} Discount` : '')
                        });
                      }} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                    >
                      <option value="">General / All Hotels</option>
                      {hotels.map((h: any) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description / Rationale</label>
                    <input 
                      required 
                      type="text" 
                      value={newService.description} 
                      onChange={e => setNewService({ ...newService, description: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" 
                      placeholder="e.g. 1 room free for 15 Double Room, Early Booking 10%, etc." 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                      <input 
                        type="date" 
                        value={newService.startDate ? newService.startDate.split('T')[0] : ''} 
                        onChange={e => setNewService({ ...newService, startDate: e.target.value, serviceDate: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                      <input 
                        type="date" 
                        value={newService.endDate ? newService.endDate.split('T')[0] : ''} 
                        onChange={e => setNewService({ ...newService, endDate: e.target.value, serviceEndDate: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Amount (€)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">€</span>
                      <input 
                        required 
                        type="number" 
                        step="0.01" 
                        min="0.01" 
                        value={newService.unitPrice || newService.totalAmount || ''} 
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setNewService({ ...newService, unitPrice: val, totalAmount: val, quantity: 1 });
                        }} 
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-emerald-700" 
                        placeholder="e.g. 50.00" 
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">This discount will be deducted from Hotel costs and Operational Services total.</p>
                  </div>
                </div>
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
              {serviceType === 'Hotel Discount' && (newService.unitPrice > 0 || newService.totalAmount > 0) && (
                <div className="p-3 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
                  <span>Total Hotel Discount:</span>
                  <strong className="text-base font-black text-emerald-700">-€{(newService.totalAmount || newService.unitPrice || 0).toFixed(2)}</strong>
                </div>
              )}
              {newService.unitPrice > 0 && serviceType !== 'Invoiced Fee' && serviceType !== 'Hotel' && serviceType !== 'Hotel Discount' && (
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
                          <td className="px-6 py-4 text-slate-600">{formatDate(inv.date)}</td>
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
                          <div className="font-semibold text-slate-800">{formatDate(currentInvoice.date)}</div>
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



