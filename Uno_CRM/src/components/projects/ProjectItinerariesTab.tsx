"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Copy, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Users, 
  DollarSign, 
  Percent, 
  MapPin, 
  Bus, 
  BedDouble, 
  Utensils, 
  Check, 
  X, 
  Loader2, 
  Printer, 
  Sparkles, 
  ArrowRight, 
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { getApiUrl } from '@/lib/apiConfig';
import { getAuthHeaders } from '@/lib/auth';

const API = getApiUrl();

export interface ItineraryDay {
  DayNumber: number;
  Title: string;
  City: string;
  OvernightCity: string;
  MealsIncluded?: string;
  TransitLeg?: string;
  DrivingHours?: number;
  MandatoryRestStopInserted?: boolean;
  RestStopLocation?: string;
  Description: string;
}

export interface ProjectItinerary {
  id: number;
  projectId: number;
  title: string;
  itineraryCode: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  season: string;
  targetPax: number;
  estimatedCostPerPax: number;
  estimatedSellPricePerPax: number;
  targetMarginPct: number;
  status: 'Draft' | 'Proposed' | 'Active' | 'Confirmed' | 'Archived';
  isPrimary: boolean;
  description?: string;
  daysJson?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectItinerariesTabProps {
  project: any;
  projectId: string | number;
}

const PRESET_TEMPLATES = [
  {
    name: "Classic Central Europe 8D/7N (Budapest-Vienna-Prague)",
    destination: "Budapest → Bratislava → Vienna → Český Krumlov → Prague",
    durationDays: 8,
    durationNights: 7,
    season: "Summer 2026",
    targetPax: 35,
    estimatedCostPerPax: 460,
    estimatedSellPricePerPax: 590,
    targetMarginPct: 22.03,
    status: "Active" as const,
    description: "The flagship Central Europe tripartite capital circuit. Perfectly balanced 8-day flow covering Hungary, Slovakia, Austria, and the Czech Republic with minimal transit deadhead and verified 4★ properties.",
    days: [
      { DayNumber: 1, Title: "Arrival in Budapest & Danube Evening Cruise", City: "Budapest", OvernightCity: "Budapest", MealsIncluded: "Dinner", TransitLeg: "Inbound Flight to BUD Airport", DrivingHours: 0.5, Description: "Arrival at BUD Airport. Private coach transfer to 4★ hotel. Evening panoramic sightseeing Danube river cruise with welcome drink." },
      { DayNumber: 2, Title: "Grand Budapest City Sightseeing & Castle District", City: "Budapest", OvernightCity: "Budapest", MealsIncluded: "Breakfast", TransitLeg: "Budapest Local Circuit", DrivingHours: 1.0, Description: "Full-day guided tour covering Buda Castle, Fisherman's Bastion, Matthias Church, and Heroes' Square. Optional folklore dinner." },
      { DayNumber: 3, Title: "Budapest to Vienna via Bratislava Old Town", City: "Bratislava & Vienna", OvernightCity: "Vienna", MealsIncluded: "Breakfast, Lunch", TransitLeg: "Budapest → Bratislava (200 km) → Vienna (80 km)", DrivingHours: 3.5, MandatoryRestStopInserted: true, RestStopLocation: "Bratislava Castle & Historic Centre", Description: "Scenic stop in Slovakia's capital, Bratislava. Walking tour of St. Martin's Cathedral. Afternoon arrival in Vienna." },
      { DayNumber: 4, Title: "Imperial Vienna: Schönbrunn Palace & Ringstraße", City: "Vienna", OvernightCity: "Vienna", MealsIncluded: "Breakfast", TransitLeg: "Vienna City Circuit", DrivingHours: 1.0, Description: "Morning guided tour of the Habsburg dynasty's summer residence, Schönbrunn Palace. Afternoon drive along Ringstraße." },
      { DayNumber: 5, Title: "Vienna to Prague via Český Krumlov UNESCO Heritage", City: "Český Krumlov & Prague", OvernightCity: "Prague", MealsIncluded: "Breakfast", TransitLeg: "Vienna → Český Krumlov (210 km) → Prague (175 km)", DrivingHours: 4.2, MandatoryRestStopInserted: true, RestStopLocation: "Český Krumlov Historic Center", Description: "Cross into Southern Bohemia. Guided walking tour through UNESCO Český Krumlov. Continue north to Prague." },
      { DayNumber: 6, Title: "Prague Castle & Historic Charles Bridge", City: "Prague", OvernightCity: "Prague", MealsIncluded: "Breakfast", TransitLeg: "Prague Walking & Coach Transfer", DrivingHours: 0.5, Description: "Explore Hradčany Prague Castle complex, St. Vitus Cathedral, Golden Lane, and stroll across historic Charles Bridge." },
      { DayNumber: 7, Title: "Old Town Square, Astronomical Clock & Vltava Cruise", City: "Prague", OvernightCity: "Prague", MealsIncluded: "Breakfast, Dinner", TransitLeg: "Prague City Core", DrivingHours: 0.5, Description: "Old Town Square, medieval Astronomical Clock. Afternoon at leisure for shopping. Traditional farewell Czech dinner." },
      { DayNumber: 8, Title: "Prague Departure & Outbound Flight", City: "Prague", OvernightCity: "-", MealsIncluded: "Breakfast", TransitLeg: "Hotel → Prague Airport (PRG)", DrivingHours: 0.5, Description: "Breakfast at hotel. Private coach transfer to Prague Airport for outbound departure." }
    ]
  },
  {
    name: "Imperial Capitals & Alpine Gateway 7D/6N (Vienna-Salzburg-Prague)",
    destination: "Vienna → Wachau → Salzburg → Plzeň → Prague",
    durationDays: 7,
    durationNights: 6,
    season: "Summer 2026",
    targetPax: 30,
    estimatedCostPerPax: 540,
    estimatedSellPricePerPax: 720,
    targetMarginPct: 25.00,
    status: "Proposed" as const,
    description: "Premium cultural and Alpine itinerary featuring Austria's Wachau wine valley, Mozart's Salzburg, Bohemian brewery heritage, and medieval Prague.",
    days: [
      { DayNumber: 1, Title: "Arrival in Vienna & Imperial Orientation", City: "Vienna", OvernightCity: "Vienna", MealsIncluded: "Dinner", TransitLeg: "Inbound Flight to VIE Airport", DrivingHours: 0.5, Description: "Arrival at Vienna Airport. Coach transfer to hotel. Evening welcome dinner in traditional Grinzing tavern." },
      { DayNumber: 2, Title: "Vienna Classical Heritage & Hofburg Palace", City: "Vienna", OvernightCity: "Vienna", MealsIncluded: "Breakfast", TransitLeg: "Vienna City Tour", DrivingHours: 1.0, Description: "Guided tour of St. Stephen's Cathedral, Hofburg Imperial Apartments, and Belvedere Palace." },
      { DayNumber: 3, Title: "Vienna to Salzburg via Wachau Valley & Melk Abbey", City: "Salzburg", OvernightCity: "Salzburg", MealsIncluded: "Breakfast", TransitLeg: "Vienna → Melk (90 km) → Salzburg (215 km)", DrivingHours: 3.5, MandatoryRestStopInserted: true, RestStopLocation: "Melk Benedictine Abbey", Description: "Scenic drive through Wachau valley with visit to baroque Melk Abbey. Arrive in Mozart's Salzburg." },
      { DayNumber: 4, Title: "Salzburg: Sound of Music & Hohensalzburg Fortress", City: "Salzburg", OvernightCity: "Salzburg", MealsIncluded: "Breakfast", TransitLeg: "Salzburg Walking Tour", DrivingHours: 0.5, Description: "Mirabell Gardens, Getreidegasse, Mozart's birthplace, and funicular ascent to Hohensalzburg Fortress." },
      { DayNumber: 5, Title: "Salzburg to Prague via Plzeň Brewery", City: "Plzeň & Prague", OvernightCity: "Prague", MealsIncluded: "Breakfast, Lunch", TransitLeg: "Salzburg → Plzeň (250 km) → Prague (95 km)", DrivingHours: 4.0, MandatoryRestStopInserted: true, RestStopLocation: "Pilsner Urquell Brewery", Description: "Cross into Western Bohemia. VIP tour and lunch at Pilsner Urquell Brewery. Evening arrival in golden Prague." },
      { DayNumber: 6, Title: "Prague Royal Circuit & Charles Bridge", City: "Prague", OvernightCity: "Prague", MealsIncluded: "Breakfast, Dinner", TransitLeg: "Prague City Core", DrivingHours: 0.5, Description: "Prague Castle, Golden Lane, Charles Bridge, Old Town Square, and evening gala cruise on the Vltava River." },
      { DayNumber: 7, Title: "Prague Outbound Flight Departure", City: "Prague", OvernightCity: "-", MealsIncluded: "Breakfast", TransitLeg: "Hotel → PRG Airport", DrivingHours: 0.5, Description: "Breakfast, morning souvenir shopping. Private coach transfer to Václav Havel Airport for departure." }
    ]
  },
  {
    name: "Bohemian & Austrian Express 5D/4N (Prague & Vienna)",
    destination: "Prague → Kutná Hora → Vienna",
    durationDays: 5,
    durationNights: 4,
    season: "All Year",
    targetPax: 25,
    estimatedCostPerPax: 380,
    estimatedSellPricePerPax: 495,
    targetMarginPct: 23.23,
    status: "Draft" as const,
    description: "Compact 5-day dual-capital express connecting Prague and Vienna with a cultural stop at UNESCO Kutná Hora Sedlec Ossuary.",
    days: [
      { DayNumber: 1, Title: "Arrival in Prague & Old Town Stroll", City: "Prague", OvernightCity: "Prague", MealsIncluded: "Dinner", TransitLeg: "Arrival PRG Airport", DrivingHours: 0.5, Description: "Arrival in Prague, hotel check-in. Evening orientation walk through Old Town Square." },
      { DayNumber: 2, Title: "Prague Castle & Charles Bridge Exploration", City: "Prague", OvernightCity: "Prague", MealsIncluded: "Breakfast", TransitLeg: "Prague City Tour", DrivingHours: 0.5, Description: "Full day sightseeing: Hradčany Castle, St. Vitus Cathedral, Charles Bridge, and Astronomical Clock." },
      { DayNumber: 3, Title: "Prague to Vienna via Kutná Hora Bone Church", City: "Kutná Hora & Vienna", OvernightCity: "Vienna", MealsIncluded: "Breakfast", TransitLeg: "Prague → Kutná Hora (85 km) → Vienna (240 km)", DrivingHours: 3.8, MandatoryRestStopInserted: true, RestStopLocation: "Kutná Hora UNESCO Bone Church & St. Barbara", Description: "Visit Sedlec Ossuary and St. Barbara Cathedral in Kutná Hora. Cross into Austria arriving in Vienna." },
      { DayNumber: 4, Title: "Imperial Vienna & Schönbrunn Palace", City: "Vienna", OvernightCity: "Vienna", MealsIncluded: "Breakfast, Dinner", TransitLeg: "Vienna City Circuit", DrivingHours: 1.0, Description: "Guided tour of Schönbrunn Palace, Ringstraße boulevard, and evening Viennese Heuriger farewell dinner." },
      { DayNumber: 5, Title: "Vienna Departure", City: "Vienna", OvernightCity: "-", MealsIncluded: "Breakfast", TransitLeg: "Hotel → VIE Airport", DrivingHours: 0.5, Description: "Breakfast at hotel and private coach transfer to Vienna International Airport for return flight." }
    ]
  }
];

export default function ProjectItinerariesTab({ project, projectId }: ProjectItinerariesTabProps) {
  const [itineraries, setItineraries] = useState<ProjectItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItinerary | null>(null);
  const [modalDays, setModalDays] = useState<ItineraryDay[]>([]);
  const [saving, setSaving] = useState(false);

  // Export / Print Modal
  const [exportItem, setExportItem] = useState<ProjectItinerary | null>(null);

  // Delete Confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    itineraryCode: string;
    destination: string;
    durationDays: number;
    durationNights: number;
    season: string;
    targetPax: number;
    estimatedCostPerPax: number;
    estimatedSellPricePerPax: number;
    targetMarginPct: number;
    status: 'Draft' | 'Proposed' | 'Active' | 'Confirmed' | 'Archived';
    isPrimary: boolean;
    description: string;
  }>({
    title: '',
    itineraryCode: '',
    destination: '',
    durationDays: 7,
    durationNights: 6,
    season: 'Summer 2026',
    targetPax: 35,
    estimatedCostPerPax: 450,
    estimatedSellPricePerPax: 580,
    targetMarginPct: 22.4,
    status: 'Draft',
    isPrimary: false,
    description: ''
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/projectitineraries?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setItineraries(data);
        // Expand primary itinerary by default
        const primary = data.find((i: ProjectItinerary) => i.isPrimary);
        if (primary) {
          setExpandedIds(new Set([primary.id]));
        } else if (data.length > 0) {
          setExpandedIds(new Set([data[0].id]));
        }
      }
    } catch (err) {
      console.error("Failed to load itineraries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchItineraries();
    }
  }, [projectId]);

  useEffect(() => {
    const handleDataUpdate = (e: any) => {
      const detail = e.detail;
      if (
        detail?.category === 'Itinerary' || 
        detail?.category === 'ProjectItinerary' || 
        detail?.entity === 'projectitinerary' ||
        (detail?.projectId && String(detail.projectId) === String(projectId))
      ) {
        fetchItineraries();
        showNotification("✨ AI Itinerary package synced to this project!");
      }
    };
    window.addEventListener('uno-erp-data-updated', handleDataUpdate);
    return () => window.removeEventListener('uno-erp-data-updated', handleDataUpdate);
  }, [projectId]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const parseDays = (daysJson?: string): ItineraryDay[] => {
    if (!daysJson) return [];
    try {
      return JSON.parse(daysJson);
    } catch {
      return [];
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    const count = itineraries.length + 1;
    const defaultDays: ItineraryDay[] = Array.from({ length: 7 }, (_, i) => ({
      DayNumber: i + 1,
      Title: `Day ${i + 1} Program`,
      City: project?.description?.includes('BVP') ? (i < 2 ? 'Budapest' : i < 4 ? 'Vienna' : 'Prague') : 'City',
      OvernightCity: i < 6 ? (i < 2 ? 'Budapest' : i < 4 ? 'Vienna' : 'Prague') : '-',
      MealsIncluded: 'Breakfast',
      TransitLeg: '',
      DrivingHours: 0,
      Description: `Standard daily program for Day ${i + 1}.`
    }));

    setFormData({
      title: `${project?.projectCode || 'Project'} Itinerary Variant ${count}`,
      itineraryCode: `ITN-${project?.projectCode ? project.projectCode.replace(/\s+/g, '') : 'PRJ'}-${count.toString().padStart(2, '0')}`,
      destination: "Central Europe (Budapest - Vienna - Prague)",
      durationDays: 7,
      durationNights: 6,
      season: "Summer 2026",
      targetPax: 35,
      estimatedCostPerPax: 450,
      estimatedSellPricePerPax: 580,
      targetMarginPct: 22.4,
      status: "Draft",
      isPrimary: itineraries.length === 0,
      description: "Custom multi-day itinerary package configured for this project."
    });
    setModalDays(defaultDays);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: ProjectItinerary) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      itineraryCode: item.itineraryCode,
      destination: item.destination,
      durationDays: item.durationDays,
      durationNights: item.durationNights,
      season: item.season || 'All Year',
      targetPax: item.targetPax,
      estimatedCostPerPax: item.estimatedCostPerPax,
      estimatedSellPricePerPax: item.estimatedSellPricePerPax,
      targetMarginPct: item.targetMarginPct,
      status: item.status as any,
      isPrimary: item.isPrimary,
      description: item.description || ''
    });
    setModalDays(parseDays(item.daysJson));
    setIsModalOpen(true);
  };

  // Apply Preset Template
  const handleApplyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    const margin = preset.estimatedSellPricePerPax > 0 
      ? Math.round(((preset.estimatedSellPricePerPax - preset.estimatedCostPerPax) / preset.estimatedSellPricePerPax) * 10000) / 100 
      : 20;

    setFormData(prev => ({
      ...prev,
      title: preset.name,
      destination: preset.destination,
      durationDays: preset.durationDays,
      durationNights: preset.durationNights,
      season: preset.season,
      targetPax: preset.targetPax,
      estimatedCostPerPax: preset.estimatedCostPerPax,
      estimatedSellPricePerPax: preset.estimatedSellPricePerPax,
      targetMarginPct: margin,
      status: preset.status,
      description: preset.description
    }));
    setModalDays(preset.days);
  };

  // Handle Day Count change in modal
  const handleDurationChange = (days: number) => {
    const numDays = Math.max(1, Math.min(30, days));
    setFormData(prev => ({
      ...prev,
      durationDays: numDays,
      durationNights: Math.max(0, numDays - 1)
    }));

    setModalDays(prev => {
      if (numDays > prev.length) {
        const extra: ItineraryDay[] = [];
        for (let i = prev.length + 1; i <= numDays; i++) {
          extra.push({
            DayNumber: i,
            Title: `Day ${i} Itinerary Schedule`,
            City: prev[prev.length - 1]?.City || "Prague",
            OvernightCity: i < numDays ? (prev[prev.length - 1]?.OvernightCity || "Prague") : "-",
            MealsIncluded: "Breakfast",
            TransitLeg: "",
            DrivingHours: 0,
            Description: `Tour activities and itinerary schedule for Day ${i}.`
          });
        }
        return [...prev, ...extra];
      } else {
        return prev.slice(0, numDays);
      }
    });
  };

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    setModalDays(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddDay = () => {
    const newDayNum = modalDays.length + 1;
    setModalDays(prev => [
      ...prev,
      {
        DayNumber: newDayNum,
        Title: `Day ${newDayNum} Schedule`,
        City: "Prague",
        OvernightCity: "Prague",
        MealsIncluded: "Breakfast",
        TransitLeg: "",
        DrivingHours: 0,
        Description: "Custom day activities and excursion schedule."
      }
    ]);
    setFormData(prev => ({
      ...prev,
      durationDays: newDayNum,
      durationNights: newDayNum - 1
    }));
  };

  const handleRemoveDay = (index: number) => {
    if (modalDays.length <= 1) return;
    setModalDays(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((d, i) => ({ ...d, DayNumber: i + 1 }));
    });
    setFormData(prev => ({
      ...prev,
      durationDays: prev.durationDays - 1,
      durationNights: Math.max(0, prev.durationNights - 1)
    }));
  };

  // Submit Modal Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        projectId: Number(projectId),
        daysJson: JSON.stringify(modalDays)
      };

      if (editingItem) {
        const res = await fetch(`${API}/projectitineraries/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ ...payload, id: editingItem.id })
        });
        if (res.ok) {
          showNotification(`Itinerary "${formData.title}" updated successfully.`);
          setIsModalOpen(false);
          fetchItineraries();
        } else {
          alert("Failed to update itinerary.");
        }
      } else {
        const res = await fetch(`${API}/projectitineraries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          showNotification(`New itinerary "${formData.title}" created successfully.`);
          setIsModalOpen(false);
          fetchItineraries();
          setExpandedIds(prev => new Set([...prev, created.id]));
        } else {
          alert("Failed to create itinerary.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving itinerary.");
    } finally {
      setSaving(false);
    }
  };

  // Duplicate Itinerary
  const handleDuplicate = async (item: ProjectItinerary) => {
    try {
      const res = await fetch(`${API}/projectitineraries/${item.id}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const cloned = await res.json();
        showNotification(`Duplicated "${item.title}" as "${cloned.title}".`);
        fetchItineraries();
        setExpandedIds(prev => new Set([...prev, cloned.id]));
      } else {
        alert("Failed to duplicate itinerary.");
      }
    } catch (err) {
      console.error(err);
      alert("Error duplicating itinerary.");
    }
  };

  // Set as Primary
  const handleSetPrimary = async (item: ProjectItinerary) => {
    try {
      const res = await fetch(`${API}/projectitineraries/${item.id}/set-primary`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showNotification(`"${item.title}" is now the primary project itinerary.`);
        fetchItineraries();
      } else {
        alert("Failed to set primary itinerary.");
      }
    } catch (err) {
      console.error(err);
      alert("Error setting primary itinerary.");
    }
  };

  // Delete Itinerary
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/projectitineraries/${deleteId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showNotification("Itinerary was successfully removed.");
        setDeleteId(null);
        fetchItineraries();
      } else {
        alert("Failed to delete itinerary.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting itinerary.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Itineraries
  const filteredItineraries = useMemo(() => {
    return itineraries.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itineraryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [itineraries, searchQuery, statusFilter]);

  const primaryItinerary = useMemo(() => itineraries.find(i => i.isPrimary), [itineraries]);

  // Copy itinerary summary to clipboard
  const handleCopyToClipboard = (item: ProjectItinerary) => {
    const days = parseDays(item.daysJson);
    let text = `=================================================\n`;
    text += `ITINERARY: ${item.title} (${item.itineraryCode})\n`;
    text += `ROUTE: ${item.destination}\n`;
    text += `DURATION: ${item.durationDays} Days / ${item.durationNights} Nights | SEASON: ${item.season}\n`;
    text += `EST. PRICE: €${item.estimatedSellPricePerPax} / pax (Target: ${item.targetPax} pax)\n`;
    text += `=================================================\n\n`;
    days.forEach(d => {
      text += `DAY ${d.DayNumber}: ${d.Title}\n`;
      text += `  City: ${d.City} | Overnight: ${d.OvernightCity} | Meals: ${d.MealsIncluded || '-'}\n`;
      if (d.TransitLeg) text += `  Transit: ${d.TransitLeg} (${d.DrivingHours || 0} hrs)\n`;
      text += `  Activities: ${d.Description}\n\n`;
    });
    navigator.clipboard.writeText(text);
    showNotification("Itinerary text summary copied to clipboard!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-700';
      case 'Proposed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-700';
      case 'Archived':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
    }
  };

  if (loading && itineraries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p className="text-sm">Loading project itineraries...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-cyan-500/40 flex items-center gap-2.5 z-50 animate-bounce">
          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Banner & Quick Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Stored Itineraries</div>
            <div className="text-xl font-black text-slate-800 dark:text-white">{itineraries.length} Packages</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="truncate">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Primary Itinerary</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
              {primaryItinerary ? primaryItinerary.itineraryCode : 'None Selected'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Duration</div>
            <div className="text-xl font-black text-slate-800 dark:text-white">
              {itineraries.length > 0 
                ? (itineraries.reduce((acc, i) => acc + i.durationDays, 0) / itineraries.length).toFixed(1) 
                : 0} Days
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Avg Margin</div>
            <div className="text-xl font-black text-slate-800 dark:text-white">
              {itineraries.length > 0 
                ? (itineraries.reduce((acc, i) => acc + Number(i.targetMarginPct || 0), 0) / itineraries.length).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Status Filter, Create Button */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search itineraries by title, code, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['All', 'Active', 'Proposed', 'Draft', 'Confirmed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchItineraries}
            title="Refresh itineraries"
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Clock className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Itinerary</span>
          </button>
        </div>
      </div>

      {/* Itinerary Cards List */}
      {filteredItineraries.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No Itineraries Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            {searchQuery || statusFilter !== 'All' 
              ? 'No stored itineraries match your current search and status filters.' 
              : 'This project does not have any stored itineraries yet. Create an itinerary to organize daily schedules, hotel stops, and cost calculations.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Itinerary</span>
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('uno-open-ai-drawer', {
                    detail: {
                      category: 'Itinerary',
                      prompt: `Design a new 7-day ${project?.title || project?.projectCode || 'Central Europe'} tour for 36 pax (18 doubles) with 20% margin`
                    }
                  }));
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ Generate with AI Co-pilot</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItineraries.map(itn => {
            const isExpanded = expandedIds.has(itn.id);
            const days = parseDays(itn.daysJson);

            return (
              <div 
                key={itn.id}
                className={`bg-white dark:bg-[#1E293B] rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  itn.isPrimary 
                    ? 'border-blue-400 dark:border-blue-500/60 ring-1 ring-blue-400/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header Bar */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Primary Badge or Action */}
                    {itn.isPrimary ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Primary Itinerary</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetPrimary(itn)}
                        title="Set this itinerary as the primary package for the project"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500 hover:border-amber-300 text-xs font-medium transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Set Primary</span>
                      </button>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                      {itn.itineraryCode}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(itn.status)}`}>
                      {itn.status}
                    </span>

                    {itn.season && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{itn.season}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyToClipboard(itn)}
                      title="Copy text summary to clipboard"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setExportItem(itn)}
                      title="Print or export formatted itinerary"
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(itn)}
                      title="Duplicate as a new variation"
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(itn)}
                      title="Edit itinerary"
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors border border-blue-200 dark:border-blue-800/80"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteId(itn.id)}
                      title="Delete itinerary"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Card Summary */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{itn.title}</span>
                    </h3>
                    {itn.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {itn.description}
                      </p>
                    )}
                  </div>

                  {/* Destination Route Pills */}
                  {itn.destination && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Route:</span>
                      {itn.destination.split('→').map((city, idx, arr) => (
                        <React.Fragment key={idx}>
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                            {city.trim()}
                          </span>
                          {idx < arr.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Financial & Operational Telemetry Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Duration</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        {itn.durationDays} Days / {itn.durationNights} Nts
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Target Pax</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-indigo-400" />
                        <span>{itn.targetPax} Passengers</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Est. Cost / Pax</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        €{Number(itn.estimatedCostPerPax || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Est. Sell / Pax</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        €{Number(itn.estimatedSellPricePerPax || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Target Margin</div>
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                        {Number(itn.targetMarginPct || 0).toFixed(1)}%
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Total Volume</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        €{(Number(itn.estimatedSellPricePerPax || 0) * (itn.targetPax || 1)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Day-by-Day Accordion Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleExpand(itn.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-colors text-xs font-bold text-slate-700 dark:text-slate-200"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>{isExpanded ? 'Hide Day-by-Day Itinerary' : `Show Day-by-Day Itinerary (${days.length} Days)`}</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Day-by-Day Schedule */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {days.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center">No day-by-day schedule added yet for this itinerary.</p>
                      ) : (
                        days.map((day, dIdx) => (
                          <div 
                            key={dIdx}
                            className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-2 relative hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {day.DayNumber}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {day.Title}
                                </h4>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                {day.City && (
                                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium flex items-center gap-1 border border-blue-200/60 dark:border-blue-800/60">
                                    <MapPin className="w-3 h-3 text-blue-500" />
                                    <span>{day.City}</span>
                                  </span>
                                )}

                                {day.OvernightCity && day.OvernightCity !== '-' && (
                                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1 border border-indigo-200/60 dark:border-indigo-800/60">
                                    <BedDouble className="w-3 h-3 text-indigo-500" />
                                    <span>Overnight: {day.OvernightCity}</span>
                                  </span>
                                )}

                                {day.MealsIncluded && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/60">
                                    <Utensils className="w-3 h-3 text-emerald-500" />
                                    <span>{day.MealsIncluded}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Transit Leg / Driving compliance */}
                            {day.TransitLeg && (
                              <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                                <Bus className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="font-semibold text-slate-700 dark:text-slate-200">{day.TransitLeg}</span>
                                {day.DrivingHours ? (
                                  <span className="text-slate-400">({day.DrivingHours} hrs drive)</span>
                                ) : null}
                                {day.MandatoryRestStopInserted && (
                                  <span className="ml-auto px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>EU Rest Stop: {day.RestStopLocation || 'Mandatory 45m break'}</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Activities / Description */}
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                              {day.Description}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create or Edit Itinerary */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  {editingItem ? 'Edit Project Itinerary' : 'Create New Project Itinerary'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Presets Bar (Only on create) */}
              {!editingItem && (
                <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Quick Preset Templates (1-Click Auto-Fill):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_TEMPLATES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleApplyPreset(preset)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-all hover:border-blue-400 shadow-2xs"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Itinerary Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Classic Central Europe 8D/7N"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Itinerary Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.itineraryCode}
                    onChange={e => setFormData(p => ({ ...p, itineraryCode: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. ITN-BVP-01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Route / Destination Corridor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={e => setFormData(p => ({ ...p, destination: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Budapest → Bratislava → Vienna → Český Krumlov → Prague"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.durationDays}
                    onChange={e => handleDurationChange(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Nights)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={formData.durationNights}
                    onChange={e => setFormData(p => ({ ...p, durationNights: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Season / Period
                  </label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={e => setFormData(p => ({ ...p, season: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Summer 2026, All Year"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Group Size (Pax)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetPax}
                    onChange={e => setFormData(p => ({ ...p, targetPax: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Est. Cost / Pax (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estimatedCostPerPax}
                    onChange={e => {
                      const cost = parseFloat(e.target.value) || 0;
                      const sell = formData.estimatedSellPricePerPax;
                      const margin = sell > 0 ? Math.round(((sell - cost) / sell) * 10000) / 100 : 20;
                      setFormData(p => ({ ...p, estimatedCostPerPax: cost, targetMarginPct: margin }));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Est. Sell Price / Pax (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estimatedSellPricePerPax}
                    onChange={e => {
                      const sell = parseFloat(e.target.value) || 0;
                      const cost = formData.estimatedCostPerPax;
                      const margin = sell > 0 ? Math.round(((sell - cost) / sell) * 10000) / 100 : 20;
                      setFormData(p => ({ ...p, estimatedSellPricePerPax: sell, targetMarginPct: margin }));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Margin (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetMarginPct}
                    onChange={e => setFormData(p => ({ ...p, targetMarginPct: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Proposed">Proposed</option>
                    <option value="Active">Active</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={e => setFormData(p => ({ ...p, isPrimary: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Set as Primary Project Itinerary (Default package for tour calculations)
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description & Overview Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="Brief description of the package scope, theme, and included highlights..."
                  />
                </div>
              </div>

              {/* Day-by-Day Schedule Builder */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>Day-by-Day Schedule Builder ({modalDays.length} Days)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Configure daily stops, overnight cities, meals, and route details</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {modalDays.map((day, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {day.DayNumber}
                          </span>
                          <input
                            type="text"
                            value={day.Title}
                            onChange={e => handleUpdateDay(idx, 'Title', e.target.value)}
                            placeholder={`Day ${day.DayNumber} Title`}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 w-64 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {modalDays.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(idx)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md"
                            title="Remove day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">City</label>
                          <input
                            type="text"
                            value={day.City}
                            onChange={e => handleUpdateDay(idx, 'City', e.target.value)}
                            placeholder="e.g. Budapest"
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Overnight City</label>
                          <input
                            type="text"
                            value={day.OvernightCity}
                            onChange={e => handleUpdateDay(idx, 'OvernightCity', e.target.value)}
                            placeholder="e.g. Vienna"
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Meals Included</label>
                          <input
                            type="text"
                            value={day.MealsIncluded || ''}
                            onChange={e => handleUpdateDay(idx, 'MealsIncluded', e.target.value)}
                            placeholder="e.g. Breakfast, Dinner"
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Transit Leg / Drive</label>
                          <input
                            type="text"
                            value={day.TransitLeg || ''}
                            onChange={e => handleUpdateDay(idx, 'TransitLeg', e.target.value)}
                            placeholder="e.g. Budapest → Vienna"
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Day Description & Excursions</label>
                        <textarea
                          rows={2}
                          value={day.Description}
                          onChange={e => handleUpdateDay(idx, 'Description', e.target.value)}
                          placeholder="Detailed itinerary schedule, guided tours, museum visits, dinners..."
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save Changes' : 'Create Itinerary'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Project Itinerary?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to permanently delete this itinerary package? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                {deleting ? 'Deleting...' : 'Delete Itinerary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Print / Export Itinerary */}
      {exportItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">UNO ERP DMC Itinerary Sheet</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{exportItem.title}</h3>
                <p className="text-xs text-slate-500">{exportItem.itineraryCode} • {exportItem.destination}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setExportItem(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-xs">
                <div><span className="text-slate-400">Duration:</span> <strong>{exportItem.durationDays}D / {exportItem.durationNights}N</strong></div>
                <div><span className="text-slate-400">Target Pax:</span> <strong>{exportItem.targetPax} Passengers</strong></div>
                <div><span className="text-slate-400">Sell Price:</span> <strong>€{exportItem.estimatedSellPricePerPax} / pax</strong></div>
              </div>

              {exportItem.description && (
                <div className="text-xs text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                  {exportItem.description}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Daily Schedule</h4>
                {parseDays(exportItem.daysJson).map((d, i) => (
                  <div key={i} className="border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Day {d.DayNumber}: {d.Title}</span>
                      <span className="text-slate-400 font-normal">{d.City} • {d.OvernightCity ? `Overnight: ${d.OvernightCity}` : ''}</span>
                    </div>
                    {d.TransitLeg && (
                      <div className="text-[11px] text-blue-600 dark:text-blue-400">🚌 {d.TransitLeg}</div>
                    )}
                    <p className="text-slate-600 dark:text-slate-300">{d.Description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setExportItem(null)}
                className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
