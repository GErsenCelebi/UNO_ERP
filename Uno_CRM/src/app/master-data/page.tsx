"use client"
import React, { useEffect, useState, FormEvent, useRef, useCallback } from 'react';
import { Search, Bell, LayoutDashboard, Briefcase, Users, CalendarDays, LineChart, Settings, Plus, X, Trash2, Edit2, Database, MapPin, Star, Phone, FileText, Truck, Clock, DollarSign, BarChart3, TrendingUp, Target, Activity, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Loader2, LayoutTemplate, Sparkles, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';

const API = '/api';

type TabType = 'projectStatuses' | 'clients' | 'excelImport' | 'hotels' | 'guides' | 'transports' | 'drivers' | 'vendors' | 'excursions' | 'tourStatuses' | 'serviceCategories' | 'aiKnowledge' | 'kpis';

interface GenericData {
  id: number;
  [key: string]: any;
}

const TAB_CONFIG: Record<string, { title: string; icon: any; endpoint: string; fields: { key: string; label: string; type: string; optionsEndpoint?: string; optionLabel?: string; required?: boolean }[] }> = {
  projectStatuses: { title: 'Project Statuses', icon: Briefcase, endpoint: 'ProjectStatuses', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'orderIndex', label: 'Order Index', type: 'number' }] },
  clients: { title: 'Clients', icon: Users, endpoint: 'Clients', fields: [{ key: 'avatarUrl', label: 'Logo', type: 'image' }, { key: 'name', label: 'Name', type: 'text' }, { key: 'location', label: 'Location', type: 'text' }, { key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }] },
  hotels: { title: 'Hotels', icon: MapPin, endpoint: 'Hotels', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'location', label: 'Location', type: 'text' }, { key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'starRating', label: 'Star (1-5)', type: 'number' }, { key: 'singleRoomRate', label: 'Sgl Room (€)', type: 'number' }, { key: 'singlePaxRate', label: 'Sgl Pax (€)', type: 'number' }, { key: 'doubleRoomRate', label: 'Dbl Room (€)', type: 'number' }, { key: 'doublePaxRate', label: 'Dbl Pax (€)', type: 'number' }, { key: 'twinRoomRate', label: 'Twn Room (€)', type: 'number' }, { key: 'twinPaxRate', label: 'Twn Pax (€)', type: 'number' }, { key: 'tripleRoomRate', label: 'Trp Room (€)', type: 'number' }, { key: 'triplePaxRate', label: 'Trp Pax (€)', type: 'number' }, { key: 'pricingBasis', label: 'Basis (Pax/Room)', type: 'text' }] },
  guides: { title: 'Guides', icon: Users, endpoint: 'Guides', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'language', label: 'Language', type: 'text' }, { key: 'phoneNumber', label: 'Phone Number', type: 'text' }, { key: 'dailyRate', label: 'Daily Rate (€)', type: 'number' }] },
  transports: { title: 'Transport', icon: Truck, endpoint: 'TransportCompanies', fields: [{ key: 'name', label: 'Company Name', type: 'text' }, { key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'fleetSize', label: 'Fleet Size', type: 'number' }] },
  drivers: { title: 'Drivers', icon: FileText, endpoint: 'Drivers', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'phoneNumber', label: 'Phone Number', type: 'text' }, { key: 'transportCompanyId', label: 'Transport Company', type: 'select', optionsEndpoint: 'TransportCompanies', optionLabel: 'name' }] },
  vendors: { title: 'Vendors', icon: Users, endpoint: 'Vendors', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'contactName', label: 'Contact Name', type: 'text' }, { key: 'contactRole', label: 'Contact Role', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'serviceType', label: 'Service Type', type: 'text' }] },
  excursions: { title: 'Excursions', icon: Clock, endpoint: 'Excursions', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'type', label: 'Type', type: 'text' }, { key: 'price', label: 'Cost (€)', type: 'number' }, { key: 'salePrice', label: 'Sale (€)', type: 'number' }, { key: 'tourCode', label: 'Tour Code', type: 'text', required: false }, { key: 'vendorId', label: 'Vendor', type: 'select', optionsEndpoint: 'Vendors', optionLabel: 'name', required: false }] },
  tourStatuses: { title: 'Tour Statuses', icon: Clock, endpoint: 'TourStatuses', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'orderIndex', label: 'Order Index', type: 'number' }] },
  serviceCategories: { title: 'Service Categories', icon: Database, endpoint: 'ServiceCategories', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'classification', label: 'Classification', type: 'text' }, { key: 'isBase', label: 'Is Base', type: 'boolean' }, { key: 'isRevenue', label: 'Is Revenue', type: 'boolean' }, { key: 'isOperational', label: 'Is Operational', type: 'boolean' }, { key: 'isCost', label: 'Is Cost', type: 'boolean' }, { key: 'isExpandable', label: 'Is Expandable', type: 'boolean' }] },
  aiKnowledge: { title: 'AI Knowledge Base', icon: Sparkles, endpoint: 'AiKnowledgeItems', fields: [{ key: 'category', label: 'Category', type: 'text' }, { key: 'sourceFile', label: 'Source File', type: 'text' }, { key: 'questionPattern', label: 'Question Pattern', type: 'text' }, { key: 'keywords', label: 'Keywords', type: 'text' }, { key: 'answerMarkdown', label: 'Answer Markdown', type: 'text' }, { key: 'targetUrl', label: 'Target URL', type: 'text' }, { key: 'actionLabel', label: 'Action Label', type: 'text' }] },
  excelImport: { title: 'Excel Import', icon: FileSpreadsheet, endpoint: '', fields: [] },
  kpis: { title: 'KPIs', icon: BarChart3, endpoint: '', fields: [] },
};

interface SectionDef {
  label: string;
  icon: any;
  gradient: string;
  tabs: TabType[];
}

const SECTIONS: SectionDef[] = [
  { label: 'Project Data', icon: LayoutTemplate, gradient: 'from-blue-500 to-indigo-600', tabs: ['projectStatuses', 'clients', 'excelImport'] },
  { label: 'Tours Data', icon: Briefcase, gradient: 'from-emerald-500 to-teal-600', tabs: ['hotels', 'guides', 'transports', 'drivers', 'vendors', 'excursions', 'tourStatuses', 'serviceCategories'] },
  { label: 'AI Knowledge & SOPs', icon: Sparkles, gradient: 'from-amber-500 to-orange-600', tabs: ['aiKnowledge'] },
  { label: 'Reports & KPIs', icon: BarChart3, gradient: 'from-violet-500 to-purple-600', tabs: ['kpis'] },
];

/* ─── Helper: parse sheet to array of objects ─── */
function sheetToRows(wb: XLSX.WorkBook, name: string): Record<string, any>[] {
  const ws = wb.Sheets[name];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json(ws, { defval: '' });
}

async function apiGet(ep: string) {
  const r = await fetch(`${API}/${ep}`); if (!r.ok) return [];
  const j = await r.json(); return Array.isArray(j) ? j : j.value || j.$values || [];
}
async function apiPost(ep: string, body: any) {
  const r = await fetch(`${API}/${ep}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

function excelDateToISO(v: any): string {
  if (!v) return '';
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
  }
  const s = String(v);
  if (s.includes('-')) return s.slice(0, 10);
  if (s.includes('/')) { const p = s.split('/'); return `${p[2]}-${p[0].padStart(2,'0')}-${p[1].padStart(2,'0')}`; }
  return s;
}

/* ─── ExcelImportPanel Component ─── */
function ExcelImportPanel() {
  const [logs, setLogs] = useState<{ msg: string; type: 'info' | 'ok' | 'err' }[]>([]);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState<Record<string, number>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const log = useCallback((msg: string, type: 'info' | 'ok' | 'err' = 'info') => {
    setLogs(prev => [...prev, { msg, type }]);
  }, []);

  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [logs]);

  const handleFile = async (file: File) => {
    setLogs([]); setSummary({}); setImporting(true); setFileName(file.name);
    const addLog = (msg: string, type: 'info' | 'ok' | 'err' = 'info') => {
      setLogs(prev => [...prev, { msg, type }]);
    };
    const counts: Record<string, number> = {};
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array', cellDates: true });
      addLog(`📄 File loaded: ${file.name} — Sheets: ${wb.SheetNames.join(', ')}`, 'info');

      // ── 1. Clients ──
      const clientRows = sheetToRows(wb, 'Clients');
      const existingClients = await apiGet('clients');
      const clientMap: Record<string, number> = {};
      existingClients.forEach((c: any) => { clientMap[c.name.toUpperCase()] = c.id; });
      for (const r of clientRows) {
        if (!r.Name) continue;
        if (clientMap[String(r.Name).toUpperCase()]) { addLog(`  ⏭ Client exists: ${r.Name}`, 'info'); continue; }
        try {
          const c = await apiPost('clients', { name: r.Name, location: r.Location || '', avatarUrl: '', contactName: r.ContactName || '', contactRole: r.ContactRole || '', email: r.Email || '', phone: r.Phone || '' });
          clientMap[String(r.Name).toUpperCase()] = c.id;
          counts.Clients = (counts.Clients || 0) + 1;
          addLog(`  ✅ Client: ${r.Name}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Client ${r.Name}: ${e.message}`, 'err'); }
      }

      // ── 2. Hotels ──
      const hotelRows = sheetToRows(wb, 'Hotels');
      const existingHotels = await apiGet('hotels');
      const hotelMap: Record<string, number> = {};
      existingHotels.forEach((h: any) => { hotelMap[h.name.toUpperCase()] = h.id; });
      for (const r of hotelRows) {
        if (!r.Name) continue;
        if (hotelMap[String(r.Name).toUpperCase()]) { addLog(`  ⏭ Hotel exists: ${r.Name}`, 'info'); continue; }
        try {
          const h = await apiPost('hotels', { name: r.Name, location: r.Location || '', starRating: Number(r.StarRating) || 3, contactName: r.ContactName || '', contactRole: r.ContactRole || '', email: r.Email || '', phone: r.Phone || '', singleRate: Number(r.SingleRate) || 0, doubleRate: Number(r.DoubleRate) || 0, twinRate: Number(r.TwinRate) || 0, tripleRate: Number(r.TripleRate) || 0 });
          hotelMap[String(r.Name).toUpperCase()] = h.id;
          counts.Hotels = (counts.Hotels || 0) + 1;
          addLog(`  ✅ Hotel: ${r.Name} (${r.Location})`, 'ok');
        } catch (e: any) { addLog(`  ❌ Hotel ${r.Name}: ${e.message}`, 'err'); }
      }

      // ── 3. Guides ──
      const guideRows = sheetToRows(wb, 'Guides');
      const existingGuides = await apiGet('guides');
      const guideMap: Record<string, number> = {};
      existingGuides.forEach((g: any) => { guideMap[g.name.toUpperCase()] = g.id; });
      for (const r of guideRows) {
        if (!r.Name) continue;
        if (guideMap[String(r.Name).toUpperCase()]) { addLog(`  ⏭ Guide exists: ${r.Name}`, 'info'); continue; }
        try {
          const g = await apiPost('guides', { name: r.Name, language: r.Language || '', phoneNumber: r.PhoneNumber || '', dailyRate: Number(r.DailyRate) || 0 });
          guideMap[String(r.Name).toUpperCase()] = g.id;
          counts.Guides = (counts.Guides || 0) + 1;
          addLog(`  ✅ Guide: ${r.Name}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Guide ${r.Name}: ${e.message}`, 'err'); }
      }

      // ── 4. Transport Companies ──
      const tcRows = sheetToRows(wb, 'TransportCompanies');
      const existingTC = await apiGet('transportcompanies');
      const tcMap: Record<string, number> = {};
      existingTC.forEach((t: any) => { tcMap[t.name.toUpperCase()] = t.id; });
      for (const r of tcRows) {
        if (!r.Name) continue;
        if (tcMap[String(r.Name).toUpperCase()]) { addLog(`  ⏭ Transport exists: ${r.Name}`, 'info'); continue; }
        try {
          const t = await apiPost('transportcompanies', { name: r.Name, contactName: r.ContactName || '', contactRole: r.ContactRole || '', email: r.Email || '', phone: r.Phone || '', fleetSize: Number(r.FleetSize) || 0, dailyRate: Number(r.DailyRate) || 0 });
          tcMap[String(r.Name).toUpperCase()] = t.id;
          counts.Transport = (counts.Transport || 0) + 1;
          addLog(`  ✅ Transport: ${r.Name}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Transport ${r.Name}: ${e.message}`, 'err'); }
      }

      // ── 5. Drivers ──
      const driverRows = sheetToRows(wb, 'Drivers');
      const existingDrivers = await apiGet('drivers');
      const driverMap: Record<string, number> = {};
      existingDrivers.forEach((d: any) => { driverMap[d.name.toUpperCase()] = d.id; });
      for (const r of driverRows) {
        if (!r.Name) continue;
        if (driverMap[String(r.Name).toUpperCase()]) { addLog(`  ⏭ Driver exists: ${r.Name}`, 'info'); continue; }
        const tcId = tcMap[String(r.TransportCompany || '').toUpperCase()] || null;
        try {
          const d = await apiPost('drivers', { name: r.Name, phoneNumber: r.PhoneNumber || '', dailyRate: Number(r.DailyRate) || 0, transportCompanyId: tcId });
          driverMap[String(r.Name).toUpperCase()] = d.id;
          counts.Drivers = (counts.Drivers || 0) + 1;
          addLog(`  ✅ Driver: ${r.Name}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Driver ${r.Name}: ${e.message}`, 'err'); }
      }

      // ── 5.5. Vendors ──
      const vendorRows = sheetToRows(wb, 'Vendors');
      const existingVendors = await apiGet('vendors');
      const vendorMap: Record<string, number> = {};
      existingVendors.forEach((v: any) => { vendorMap[v.name.toUpperCase()] = v.id; });
      for (const r of vendorRows) {
        if (!r.Name) continue;
        if (vendorMap[String(r.Name).toUpperCase()]) { addLog(`  ⏭ Vendor exists: ${r.Name}`, 'info'); continue; }
        try {
          const v = await apiPost('vendors', { name: r.Name, contactName: r.ContactName || '', contactRole: r.ContactRole || '', email: r.Email || '', phone: r.Phone || '', serviceType: r.ServiceType || '' });
          vendorMap[String(r.Name).toUpperCase()] = v.id;
          counts.Vendors = (counts.Vendors || 0) + 1;
          addLog(`  ✅ Vendor: ${r.Name}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Vendor ${r.Name}: ${e.message}`, 'err'); }
      }

      // ── 6. Excursions ──
      const excRows = sheetToRows(wb, 'Excursions');
      const existingExc = await apiGet('excursions');
      const excMap: Record<string, number> = {};
      existingExc.forEach((e: any) => { excMap[e.name.toUpperCase()] = e.id; });
      for (const r of excRows) {
        if (!r.Name) continue;
        if (excMap[String(r.Name).toUpperCase()]) { addLog(`  ⏭ Excursion exists: ${r.Name}`, 'info'); continue; }
        try {
          const e = await apiPost('excursions', { name: r.Name, type: r.Type || '', price: Number(r.Price) || 0, salePrice: Number(r.SalePrice) || 0, vendorId: vendorMap[String(r.VendorName || '').toUpperCase()] || null });
          excMap[String(r.Name).toUpperCase()] = e.id;
          counts.Excursions = (counts.Excursions || 0) + 1;
          addLog(`  ✅ Excursion: ${r.Name}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Excursion ${r.Name}: ${(e as Error).message}`, 'err'); }
      }

      // ── 7. Projects ──
      const projRows = sheetToRows(wb, 'Projects');
      const existingPS = await apiGet('projectstatuses');
      const defaultPSId = existingPS[0]?.id || 1;
      const existingProjects = await apiGet('projects');
      const projMap: Record<string, number> = {};
      existingProjects.forEach((p: any) => { projMap[p.projectCode?.toUpperCase()] = p.id; });
      for (const r of projRows) {
        if (!r.ProjectCode) continue;
        if (projMap[String(r.ProjectCode).toUpperCase()]) { addLog(`  ⏭ Project exists: ${r.ProjectCode}`, 'info'); continue; }
        const cId = clientMap[String(r.Client || '').toUpperCase()] || null;
        try {
          const p = await apiPost('projects', {
            projectCode: r.ProjectCode, description: r.Description || '', clientId: cId,
            startDate: excelDateToISO(r.StartDate), endDate: excelDateToISO(r.EndDate),
            approxBudget: Number(r.ApproxBudget) || 0, projectStatusId: defaultPSId
          });
          projMap[String(r.ProjectCode).toUpperCase()] = p.id;
          counts.Projects = (counts.Projects || 0) + 1;
          addLog(`  ✅ Project: ${r.ProjectCode} — ${r.Description}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Project ${r.ProjectCode}: ${e.message}`, 'err'); }
      }

      

      addLog(`\n🎉 Import complete!`, 'ok');
      setSummary(counts);
    } catch (err: any) {
      addLog(`💥 Fatal error: ${err.message}`, 'err');
    }
    setImporting(false);
  };

  const handleTourRoomingFile = async (file: File) => {
    setImporting(true);
    setFileName(`[Rooming] ${file.name}`);
    setLogs([{ msg: `🚀 Uploading Tour & Rooming file: ${file.name}...`, type: 'info' }]);
    const formData = new FormData();
    formData.append('roomingFile', file);
    try {
      const res = await fetch('/api/tourimport/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setSummary({ TourId: data.tourId, TourCode: data.tourCode, Pax: data.pax });
        setLogs(prev => [...prev, { msg: `🎉 Rooming Import Successful! Tour Code: ${data.tourCode} (Pax: ${data.pax})`, type: 'ok' }]);
      } else {
        setLogs(prev => [...prev, { msg: `❌ Rooming Import Failed: ${data || 'Error'}`, type: 'err' }]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, { msg: `💥 Error: ${err.message}`, type: 'err' }]);
    }
    setImporting(false);
  };

  const handleTourSalesFile = async (file: File) => {
    setImporting(true);
    setFileName(`[Sales] ${file.name}`);
    setLogs([{ msg: `🚀 Uploading Tour Sales & Base Services file: ${file.name}...`, type: 'info' }]);
    const formData = new FormData();
    formData.append('salesFile', file);
    try {
      const res = await fetch('/api/tourimport/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setSummary({ TourId: data.tourId, TourCode: data.tourCode, Pax: data.pax });
        setLogs(prev => [...prev, { msg: `🎉 Sales Import Successful! Tour Code: ${data.tourCode} (Pax: ${data.pax})`, type: 'ok' }]);
      } else {
        setLogs(prev => [...prev, { msg: `❌ Sales Import Failed: ${data || 'Error'}`, type: 'err' }]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, { msg: `💥 Error: ${err.message}`, type: 'err' }]);
    }
    setImporting(false);
  };

  const roomingRef = useRef<HTMLInputElement>(null);
  const salesRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Excel Import Hub</h3>
          <p className="text-sm text-slate-500">Select the dedicated import section based on your Excel template type.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: MASTER DATA */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs uppercase tracking-wider">1. Master Catalogs</span>
              <a href="/templates/MasterData_Import_Template.xlsx" download className="p-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-1 border border-emerald-200">
                <Download className="w-3.5 h-3.5" /> Template
              </a>
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">Master Data Import</h4>
            <p className="text-xs text-slate-500 mb-4">Import Clients, Hotels, Guides, Transport Companies, Drivers, Excursions, and Projects.</p>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>
          <div
            onClick={() => !importing && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={e => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${importing ? 'border-emerald-300 bg-emerald-50/20' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
          >
            <Upload className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-700 block">Drop Master Excel</span>
            <span className="text-[10px] text-slate-400">or click to browse</span>
          </div>
        </div>

        {/* CARD 2: TOUR & ROOMING */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-wider">2. Tour & Rooming</span>
              <a href="/api/tourtemplates/tour-import" download className="p-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg flex items-center gap-1 border border-indigo-200">
                <Download className="w-3.5 h-3.5" /> Template
              </a>
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">Tour & Rooming Import</h4>
            <p className="text-xs text-slate-500 mb-4">Import Flights, Passenger Rooming Lists, and Hotel Allocations.</p>
            <input ref={roomingRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e => { if (e.target.files?.[0]) handleTourRoomingFile(e.target.files[0]); }} />
          </div>
          <div
            onClick={() => !importing && roomingRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={e => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleTourRoomingFile(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${importing ? 'border-indigo-300 bg-indigo-50/20' : 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
          >
            <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-700 block">Drop Rooming List Excel</span>
            <span className="text-[10px] text-slate-400">or click to browse</span>
          </div>
        </div>

        {/* CARD 3: TOUR SALES & BASE SERVICES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl font-bold text-xs uppercase tracking-wider">3. Tour Sales & Fees</span>
              <a href="/api/tourtemplates/sales-import" download className="p-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-1 border border-amber-200">
                <Download className="w-3.5 h-3.5" /> Template (v2)
              </a>
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">Tour Sales & Base Fees</h4>
            <p className="text-xs text-slate-500 mb-4">Import Excursion Sales Grid (Checkboxes) & Base Invoicing Fees.</p>
            <input ref={salesRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e => { if (e.target.files?.[0]) handleTourSalesFile(e.target.files[0]); }} />
          </div>
          <div
            onClick={() => !importing && salesRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={e => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleTourSalesFile(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${importing ? 'border-amber-300 bg-amber-50/20' : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/30'}`}
          >
            <Upload className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-700 block">Drop Excursion Sales Excel</span>
            <span className="text-[10px] text-slate-400">or click to browse</span>
          </div>
        </div>
      </div>

      {/* STATUS DISPLAY */}
      {importing && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-sm font-bold text-blue-700">Uploading and processing {fileName}...</span>
        </div>
      )}

      {/* Summary badges */}
      {Object.keys(summary).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary).map(([k, v]) => (
            <span key={k} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              {k}: {v}
            </span>
          ))}
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div ref={logRef} className="bg-slate-900 rounded-xl p-4 max-h-72 overflow-y-auto font-mono text-xs">
          {logs.map((l, i) => (
            <div key={i} className={l.type === 'ok' ? 'text-emerald-400 font-bold' : l.type === 'err' ? 'text-rose-400 font-bold' : 'text-slate-300'}>{l.msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabType>('projectStatuses');
  const [data, setData] = useState<GenericData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState<Record<string, any[]>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericData | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchTabItems = async (tab: TabType) => {
    setLoading(true);
    setCurrentPage(1);
    setSearchQuery('');
    try {
      const config = TAB_CONFIG[tab];
      if (config.endpoint) {
        const res = await fetch(`/api/${config.endpoint}`, { cache: 'no-store' });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          setData([]);
        }
      } else {
        setData([]);
      }

      // Fetch options for select fields
      const newSelectOptions: Record<string, any[]> = {};
      for (const field of config.fields) {
        if (field.type === 'select' && (field as any).optionsEndpoint) {
          const optRes = await fetch(`/api/${(field as any).optionsEndpoint}`, { cache: 'no-store' });
          if (optRes.ok) {
            newSelectOptions[field.key] = await optRes.json();
          }
        }
      }
      setSelectOptions(newSelectOptions);

    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabItems(activeTab);
  }, [activeTab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const endpoint = TAB_CONFIG[activeTab].endpoint;
    const url = editingItem 
      ? `/api/${endpoint}/${editingItem.id}` 
      : `/api/${endpoint}`;
    
    const method = editingItem ? 'PUT' : 'POST';
    const body = editingItem ? { ...formData, id: editingItem.id } : formData;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTabItems(activeTab);
      } else {
        console.error("API error");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const endpoint = TAB_CONFIG[activeTab].endpoint;
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTabItems(activeTab);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (item?: GenericData) => {
    const config = TAB_CONFIG[activeTab];
    if (item) {
      setEditingItem(item);
      const initialData: Record<string, any> = {};
      config.fields.forEach(f => initialData[f.key] = item[f.key]);
      setFormData(initialData);
    } else {
      setEditingItem(null);
      const initialData: Record<string, any> = {};
      config.fields.forEach(f => {
        if (f.type === 'select') initialData[f.key] = null;
        else if (f.type === 'number') initialData[f.key] = 0;
        else if (f.type === 'boolean') initialData[f.key] = false;
        else initialData[f.key] = '';
      });
      setFormData(initialData);
    }
    setIsModalOpen(true);
  };

  const currentConfig = TAB_CONFIG[activeTab];

  return (
    <>
        <header className="h-10 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            {activeTab !== 'kpis' && activeTab !== 'excelImport' && (
              <button onClick={() => openModal()} className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all hover:-translate-y-0.5 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add {currentConfig.title}
              </button>
            )}

            {/* Page Title */}
            <div className="flex items-center">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <div className="p-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded shadow-sm">
                  <Database className="w-3 h-3 text-white" />
                </div>
                Master Data
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button suppressHydrationWarning className="relative p-1.5 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-full hover:bg-blue-50">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-4 cursor-pointer group">
              <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-7 h-7 rounded-full ring-1 ring-slate-100 group-hover:ring-blue-200 transition-all" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">Sarah J.</span>
                <span className="text-[10px] text-slate-500">Travel Manager</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 flex flex-col bg-slate-50/50 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

          <div className="w-full px-4 md:px-8 mx-auto flex-1 flex flex-col relative z-0 mt-4">

            {/* Section Headers - horizontal top bar */}
            <div className="mb-4 shrink-0">
              <div className="flex gap-2">
                {SECTIONS.map((section) => {
                  const SectionIcon = section.icon;
                  const hasActiveTab = section.tabs.includes(activeTab);
                  return (
                    <button
                      key={section.label}
                      onClick={() => {
                        if (!hasActiveTab) setActiveTab(section.tabs[0]);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        hasActiveTab
                          ? 'bg-white shadow-sm ring-1 ring-slate-200'
                          : 'bg-white/40 hover:bg-white/70 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <div className={`p-1 bg-gradient-to-br ${section.gradient} rounded ${hasActiveTab ? 'shadow-sm' : 'opacity-60'}`}>
                        <SectionIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-xs font-bold tracking-wide ${hasActiveTab ? 'text-slate-800' : 'text-slate-400'}`}>
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active section tabs */}
              {SECTIONS.filter(s => s.tabs.includes(activeTab)).map(section => (
                <div key={section.label} className="flex flex-wrap gap-1.5 mt-3 pl-1">
                  {section.tabs.map((key) => {
                    const isActive = activeTab === key;
                    const config = TAB_CONFIG[key];
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center px-3 py-1.5 font-medium text-xs rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-blue-700 shadow-sm shadow-blue-500/10 ring-1 ring-blue-200'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mr-1.5" />
                        {config.title}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {activeTab === 'excelImport' ? (
              <ExcelImportPanel />
            ) : activeTab === 'kpis' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* KPI Cards */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-xl">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">Active Projects</span>
                      </div>
                      <p className="text-3xl font-extrabold text-slate-900">—</p>
                      <p className="text-xs text-slate-500 mt-1">Total active projects</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-500 rounded-xl">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">Total Revenue</span>
                      </div>
                      <p className="text-3xl font-extrabold text-slate-900">—</p>
                      <p className="text-xs text-slate-500 mt-1">Across all confirmed tours</p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-violet-500 rounded-xl">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">Conversion Rate</span>
                      </div>
                      <p className="text-3xl font-extrabold text-slate-900">—</p>
                      <p className="text-xs text-slate-500 mt-1">Proposals → Confirmed</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-500 rounded-xl">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">Tours In Progress</span>
                      </div>
                      <p className="text-3xl font-extrabold text-slate-900">—</p>
                      <p className="text-xs text-slate-500 mt-1">Currently running tours</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-rose-500 rounded-xl">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">Avg. Service Cost</span>
                      </div>
                      <p className="text-3xl font-extrabold text-slate-900">—</p>
                      <p className="text-xs text-slate-500 mt-1">Per tour average</p>
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
                    <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-600 mb-1">Detailed Reports Coming Soon</h3>
                    <p className="text-xs text-slate-400">Revenue breakdowns, occupancy rates, service utilization charts, and more will be available here.</p>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col justify-between">
                {/* Search & Action Bar */}
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Search ${currentConfig.title} by any field...`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-slate-800"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {activeTab === 'aiKnowledge' && (
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const res = await fetch(`${getApiUrl()}/aiknowledgeitems/sync-repository`, { method: 'POST' });
                            if (res.ok) {
                              const resultData = await res.json();
                              alert(`Successfully synced Documentation Repository!\nProcessed ${resultData.totalFilesProcessed} markdown files and ingested ${resultData.totalKnowledgeItemsIngested} knowledge items into AppDB.`);
                              fetchTabItems('aiKnowledge');
                            }
                          } catch (err) {
                            alert('Failed to sync documentation repository.');
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="flex items-center px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-sm transition-all text-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync Documentation Repository
                      </button>
                    )}
                    <button onClick={() => openModal()} className="flex items-center px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all text-xs">
                      <Plus className="w-4 h-4 mr-1.5" /> Add {currentConfig.title}
                    </button>
                  </div>
                </div>

                {(() => {
                  const filteredData = data.filter(item => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return currentConfig.fields.some(f => {
                      const val = item[f.key];
                      if (val === null || val === undefined) return false;
                      if (f.type === 'select') {
                        const optLabel = selectOptions[f.key]?.find(opt => opt.id === val)?.[(f as any).optionLabel || 'name'];
                        return String(optLabel || val).toLowerCase().includes(q);
                      }
                      return String(val).toLowerCase().includes(q);
                    });
                  });

                  if (filteredData.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                        <Database className="w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No matching {currentConfig.title} found</h3>
                        <p className="text-slate-500 max-w-md">
                          {searchQuery ? `No records matched "${searchQuery}". Try clearing your search query.` : `There are currently no records available in this category.`}
                        </p>
                      </div>
                    );
                  }

                  const totalRecords = filteredData.length;
                  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
                  const startIndex = (currentPage - 1) * pageSize;
                  const endIndex = Math.min(startIndex + pageSize, totalRecords);
                  const paginatedData = filteredData.slice(startIndex, endIndex);

                  return (
                    <>
                      <div className="overflow-x-auto flex-1">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                              <tr>
                                {currentConfig.fields.map(f => (
                                  <th key={f.key} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{f.label}</th>
                                ))}
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                              {paginatedData.map((item, idx) => (
                                <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                  {currentConfig.fields.map(f => (
                                    <td key={f.key} className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-slate-900">
                                        {f.type === 'select' 
                                          ? (selectOptions[f.key]?.find(opt => opt.id === item[f.key])?.[(f as any).optionLabel || 'name'] || item[f.key]) 
                                          : f.type === 'image' && item[f.key]
                                            ? <img src={`/${item[f.key]}`} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-slate-200" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40?text=No+Logo'; }} />
                                            : f.type === 'boolean'
                                              ? (item[f.key] ? 'Yes' : 'No')
                                              : (item[f.key] || '-')}
                                      </div>
                                    </td>
                                  ))}
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4 p-1 rounded hover:bg-blue-50">
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            </table>
                          </div>

                          {/* PAGINATION FOOTER */}
                          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                            <div className="text-xs text-slate-500 font-medium">
                              Showing <span className="font-bold text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-slate-800">{endIndex}</span> of <span className="font-bold text-slate-800">{totalRecords}</span> records
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-600">Rows per page:</span>
                                <select
                                  value={pageSize}
                                  onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                  }}
                                  className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm cursor-pointer"
                                >
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                  <option value={100}>100</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setCurrentPage(1)}
                                  disabled={currentPage === 1}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="First Page"
                                >
                                  <ChevronsLeft className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                  disabled={currentPage === 1}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="Previous Page"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>

                                <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm">
                                  Page {currentPage} of {totalPages}
                                </span>

                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                  disabled={currentPage >= totalPages}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="Next Page"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setCurrentPage(totalPages)}
                                  disabled={currentPage >= totalPages}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="Last Page"
                                >
                                  <ChevronsRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
              </div>
            )}
          </div>
        </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-2xl shadow-2xl w-full ${currentConfig.fields.length > 4 ? 'max-w-3xl' : 'max-w-md'} max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  {React.createElement(currentConfig.icon, { className: "w-5 h-5" })}
                </div>
                <h2 className="text-lg font-bold text-slate-800">{editingItem ? `Edit ${currentConfig.title}` : `Add New ${currentConfig.title}`}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="master-data-modal-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'hotels' ? (
                <>
                  {/* Hotel General Information */}
                  <div>
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-blue-50 pb-1">
                      <MapPin className="w-3.5 h-3.5" /> General Hotel Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">Hotel Name *</label>
                        <input id="name" required type="text" value={formData['name'] || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800" placeholder="e.g. Grand Hotel Prague" />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-xs font-semibold text-slate-700 mb-1">Location / City *</label>
                        <input id="location" required type="text" value={formData['location'] || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Prague" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="starRating" className="block text-xs font-semibold text-slate-700 mb-1">Star Rating</label>
                          <input id="starRating" type="number" min="1" max="5" value={formData['starRating'] || ''} onChange={e => setFormData({...formData, starRating: Number(e.target.value)})} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" placeholder="4" />
                        </div>
                        <div>
                          <label htmlFor="pricingBasis" className="block text-xs font-semibold text-slate-700 mb-1">Pricing Basis</label>
                          <select id="pricingBasis" value={formData['pricingBasis'] || 'Pax'} onChange={e => setFormData({...formData, pricingBasis: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                            <option value="Pax">Per Pax</option>
                            <option value="Room">Per Room</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Person Details */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1">
                      <Phone className="w-3.5 h-3.5" /> Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactName" className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
                        <input id="contactName" type="text" value={formData['contactName'] || ''} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. John Smith" />
                      </div>
                      <div>
                        <label htmlFor="contactRole" className="block text-xs font-semibold text-slate-700 mb-1">Contact Role</label>
                        <input id="contactRole" type="text" value={formData['contactRole'] || ''} onChange={e => setFormData({...formData, contactRole: e.target.value})} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Contracting Manager" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                        <input id="phone" type="text" value={formData['phone'] || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" placeholder="+420 123 456 789" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                        <input id="email" type="email" value={formData['email'] || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" placeholder="reservations@hotel.com" />
                      </div>
                    </div>
                  </div>

                  {/* Room & Pax Rates */}
                  <div>
                    <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-emerald-50 pb-1">
                      <DollarSign className="w-3.5 h-3.5" /> Room & Pax Nightly Rates (€)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/60">
                      {/* Single */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-2">
                        <span className="text-xs font-bold text-slate-800">Single Room</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Room (€)</label>
                            <input type="number" step="0.01" value={formData['singleRoomRate'] || ''} onChange={e => setFormData({...formData, singleRoomRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="100" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Pax (€)</label>
                            <input type="number" step="0.01" value={formData['singlePaxRate'] || ''} onChange={e => setFormData({...formData, singlePaxRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="100" />
                          </div>
                        </div>
                      </div>

                      {/* Double */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-2">
                        <span className="text-xs font-bold text-slate-800">Double Room</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Room (€)</label>
                            <input type="number" step="0.01" value={formData['doubleRoomRate'] || ''} onChange={e => setFormData({...formData, doubleRoomRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="140" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Pax (€)</label>
                            <input type="number" step="0.01" value={formData['doublePaxRate'] || ''} onChange={e => setFormData({...formData, doublePaxRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="70" />
                          </div>
                        </div>
                      </div>

                      {/* Twin */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-2">
                        <span className="text-xs font-bold text-slate-800">Twin Room</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Room (€)</label>
                            <input type="number" step="0.01" value={formData['twinRoomRate'] || ''} onChange={e => setFormData({...formData, twinRoomRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="140" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Pax (€)</label>
                            <input type="number" step="0.01" value={formData['twinPaxRate'] || ''} onChange={e => setFormData({...formData, twinPaxRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="70" />
                          </div>
                        </div>
                      </div>

                      {/* Triple */}
                      <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-2">
                        <span className="text-xs font-bold text-slate-800">Triple Room</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Room (€)</label>
                            <input type="number" step="0.01" value={formData['tripleRoomRate'] || ''} onChange={e => setFormData({...formData, tripleRoomRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="180" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Pax (€)</label>
                            <input type="number" step="0.01" value={formData['triplePaxRate'] || ''} onChange={e => setFormData({...formData, triplePaxRate: Number(e.target.value)})} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" placeholder="60" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Dynamic Multi-column Grid for Generic Master Data Forms */
                <div className={`grid grid-cols-1 ${currentConfig.fields.length > 4 ? 'md:grid-cols-2 gap-x-6 gap-y-4' : 'gap-4'}`}>
                  {currentConfig.fields.map(f => (
                    <div key={f.key} className={f.key === 'name' || f.key === 'avatarUrl' ? 'md:col-span-2' : ''}>
                      <label htmlFor={f.key} className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                      {f.type === 'select' ? (
                        <select
                          id={f.key}
                          required={(f as any).required !== false}
                          value={formData[f.key] === null || formData[f.key] === undefined ? '' : formData[f.key]}
                          onChange={e => setFormData({...formData, [f.key]: e.target.value === "" ? null : Number(e.target.value)})}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="" disabled={(f as any).required !== false} hidden={(f as any).required !== false}>
                            {(f as any).required === false ? 'None' : 'Select an option'}
                          </option>
                          {(selectOptions[f.key] || []).map(opt => (
                            <option key={opt.id} value={opt.id}>{opt[(f as any).optionLabel || 'name']}</option>
                          ))}
                        </select>
                      ) : f.type === 'boolean' ? (
                        <div className="flex items-center gap-2 pt-2">
                          <input 
                            id={f.key}
                            type="checkbox"
                            checked={!!formData[f.key]}
                            onChange={e => setFormData({...formData, [f.key]: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-600 font-medium">Enable {f.label}</span>
                        </div>
                      ) : (
                        <input 
                          id={f.key}
                          required={f.type !== 'image' && (f as any).required !== false} 
                          type={f.type === 'number' ? 'number' : 'text'} 
                          value={formData[f.key] || ''} 
                          onChange={e => setFormData({...formData, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value})} 
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Sticky Action Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end space-x-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-slate-600 font-semibold text-xs hover:bg-slate-200/60 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="master-data-modal-form" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all">{editingItem ? 'Save Changes' : 'Create Record'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

