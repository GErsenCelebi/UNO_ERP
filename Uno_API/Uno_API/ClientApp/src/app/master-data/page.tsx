"use client"
import React, { useEffect, useState, FormEvent, useRef, useCallback } from 'react';
import { Search, Bell, LayoutDashboard, Briefcase, Users, CalendarDays, LineChart, Settings, Plus, X, Trash2, Edit2, Database, MapPin, Star, Phone, FileText, Truck, Clock, DollarSign, BarChart3, TrendingUp, Target, Activity, ChevronRight, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Loader2, LayoutTemplate } from 'lucide-react';
import * as XLSX from 'xlsx';

const API = '/api';

type TabType = 'projectStatuses' | 'clients' | 'excelImport' | 'hotels' | 'guides' | 'transports' | 'drivers' | 'vendors' | 'excursions' | 'tourStatuses' | 'kpis';

interface GenericData {
  id: number;
  [key: string]: any;
}

const TAB_CONFIG: Record<string, { title: string; icon: any; endpoint: string; fields: { key: string; label: string; type: string; optionsEndpoint?: string; optionLabel?: string }[] }> = {
  projectStatuses: { title: 'Project Statuses', icon: Briefcase, endpoint: 'ProjectStatuses', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'orderIndex', label: 'Order Index', type: 'number' }] },
  clients: { title: 'Clients', icon: Users, endpoint: 'Clients', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'location', label: 'Location', type: 'text' }, { key: 'avatarUrl', label: 'Avatar URL', type: 'text' }] },
  hotels: { title: 'Hotels', icon: MapPin, endpoint: 'Hotels', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'location', label: 'Location', type: 'text' }, { key: 'starRating', label: 'Star Rating (1-5)', type: 'number' }, { key: 'contactInfo', label: 'Contact Info', type: 'text' }] },
  guides: { title: 'Guides', icon: Users, endpoint: 'Guides', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'language', label: 'Language', type: 'text' }, { key: 'phoneNumber', label: 'Phone Number', type: 'text' }, { key: 'dailyRate', label: 'Daily Rate ($)', type: 'number' }] },
  transports: { title: 'Transport', icon: Truck, endpoint: 'TransportCompanies', fields: [{ key: 'name', label: 'Company Name', type: 'text' }, { key: 'contactInfo', label: 'Contact Info', type: 'text' }, { key: 'fleetSize', label: 'Fleet Size', type: 'number' }] },
  drivers: { title: 'Drivers', icon: FileText, endpoint: 'Drivers', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'phoneNumber', label: 'Phone Number', type: 'text' }, { key: 'transportCompanyId', label: 'Transport Company', type: 'select', optionsEndpoint: 'TransportCompanies', optionLabel: 'name' }] },
  vendors: { title: 'Vendors', icon: Users, endpoint: 'Vendors', fields: [
    { key: 'name', label: 'Vendor Name', type: 'text' },
    { key: 'contact', label: 'Contact', type: 'text' },
    { key: 'serviceType', label: 'Service Type', type: 'text' }
  ] },
  excursions: { title: 'Excursions', icon: Clock, endpoint: 'Excursions', fields: [
    { key: 'name', label: 'Excursion Name', type: 'text' },
    { key: 'type', label: 'Type (e.g. Full Day)', type: 'text' },
    { key: 'price', label: 'Cost per Pax (€)', type: 'number' },
    { key: 'salePrice', label: 'Sale Price per Pax (€)', type: 'number' }
  ] },
  tourStatuses: { title: 'Tour Statuses', icon: Clock, endpoint: 'TourStatuses', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'orderIndex', label: 'Order Index', type: 'number' }] },
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
  { label: 'Tours Data', icon: Briefcase, gradient: 'from-emerald-500 to-teal-600', tabs: ['hotels', 'guides', 'transports', 'drivers', 'vendors', 'excursions', 'tourStatuses'] },
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
          const c = await apiPost('clients', { name: r.Name, location: r.Location || '', avatarUrl: '' });
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
          const h = await apiPost('hotels', { name: r.Name, location: r.Location || '', starRating: Number(r.StarRating) || 3, contactInfo: r.ContactInfo || '' });
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
          const t = await apiPost('transportcompanies', { name: r.Name, contactInfo: r.ContactInfo || '', fleetSize: Number(r.FleetSize) || 0 });
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
          const d = await apiPost('drivers', { name: r.Name, phoneNumber: r.PhoneNumber || '', transportCompanyId: tcId });
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
          const v = await apiPost('vendors', { name: r.Name, contact: r.Contact || '', serviceType: r.ServiceType || '' });
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
          const e = await apiPost('excursions', { name: r.Name, type: r.Type || '', price: Number(r.PricePerPax) || 0, salePrice: Number(r.SalePrice) || 0 });
          excMap[String(r.Name).toUpperCase()] = e.id;
          counts.Excursions = (counts.Excursions || 0) + 1;
          addLog(`  ✅ Excursion: ${r.Name}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Excursion ${r.Name}: ${(e as Error).message}`, 'err'); }
      }

      // ── 6.5. ExcursionVendors ──
      const evRows = sheetToRows(wb, 'ExcursionVendors');
      for (const r of evRows) {
        if (!r.ExcursionName || !r.VendorName) continue;
        const eId = excMap[String(r.ExcursionName).toUpperCase()];
        const vId = vendorMap[String(r.VendorName).toUpperCase()];
        if (!eId || !vId) { addLog(`  ⚠ ExcursionVendor mapping failed for ${r.ExcursionName} - ${r.VendorName}`, 'err'); continue; }
        try {
          await apiPost('excursionvendors', { excursionId: eId, vendorId: vId, cost: Number(r.Cost) || 0, notes: r.Notes || '' });
          addLog(`  ✅ Linked: ${r.ExcursionName} ↔ ${r.VendorName}`, 'ok');
        } catch (e: any) { addLog(`  ❌ ExcursionVendor link failed: ${e.message}`, 'err'); }
      }

      addLog(`\n🏗 Master data imported. Now importing projects & tours...`, 'info');

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
        const cId = clientMap[String(r.ClientName || '').toUpperCase()] || null;
        try {
          const p = await apiPost('projects', {
            projectCode: r.ProjectCode, description: r.Description || '', clientId: cId,
            startDate: excelDateToISO(r.StartDate), endDate: excelDateToISO(r.EndDate),
            approxBudget: Number(r.EstimatedBudget) || 0, projectStatusId: defaultPSId
          });
          projMap[String(r.ProjectCode).toUpperCase()] = p.id;
          counts.Projects = (counts.Projects || 0) + 1;
          addLog(`  ✅ Project: ${r.ProjectCode} — ${r.Description}`, 'ok');
        } catch (e: any) { addLog(`  ❌ Project ${r.ProjectCode}: ${e.message}`, 'err'); }
      }

      // ── 8. Tours ──
      const tourRows = sheetToRows(wb, 'Tours');
      const existingTS = await apiGet('tourstatuses');
      const defaultTSId = existingTS[0]?.id || 1;
      const tourMap: Record<string, number> = {};
      for (const r of tourRows) {
        if (!r.TourCode) continue;
        const pId = projMap[String(r.ProjectCode || '').toUpperCase()];
        if (!pId) { addLog(`  ⚠ Tour ${r.TourCode}: project ${r.ProjectCode} not found`, 'err'); continue; }
        try {
          const t = await apiPost('tours', {
            tourCode: r.TourCode, destination: r.Destination || '', projectId: pId,
            arrivalDate: excelDateToISO(r.ArrivalDate), endDate: excelDateToISO(r.EndDate),
            pax: Number(r.Pax) || 0, tourStatusId: defaultTSId,
            arrivalFlight: r.ArrivalFlight || '', departureFlight: r.DepartureFlight || ''
          });
          tourMap[String(r.TourCode).toUpperCase()] = t.id;
          counts.Tours = (counts.Tours || 0) + 1;
          addLog(`  ✅ Tour: ${r.TourCode} — ${r.Destination} (${r.Pax} pax)`, 'ok');
        } catch (e: any) { addLog(`  ❌ Tour ${r.TourCode}: ${e.message}`, 'err'); }
      }

      // ── 9. Tour Services ──
      const svcRows = sheetToRows(wb, 'TourServices');
      const svcCats = await apiGet('servicecategories');
      const catMap: Record<string, number> = {};
      svcCats.forEach((c: any) => { catMap[c.name.toUpperCase()] = c.id; });
      for (const r of svcRows) {
        if (!r.TourCode || !r.Category) continue;
        const tId = tourMap[String(r.TourCode).toUpperCase()];
        if (!tId) { addLog(`  ⚠ Service: tour ${r.TourCode} not found`, 'err'); continue; }
        const catId = catMap[String(r.Category).toUpperCase()];
        if (!catId) { addLog(`  ⚠ Service: category ${r.Category} not found`, 'err'); continue; }
        const qty = Number(r.Quantity) || 1;
        const price = Number(r.UnitPrice) || 0;
        const roomCount = Number(r.RoomCount) || 0;
        const total = r.Category?.toUpperCase() === 'HOTEL' ? price * qty * Math.max(roomCount, 1) :
                      r.Category?.toUpperCase() === 'EXCURSION' ? price * qty : price * qty;
        try {
          await apiPost('tourservices', {
            tourId: tId, serviceCategoryId: catId, description: r.Description || '',
            quantity: qty, unitPrice: price, totalAmount: total,
            roomType: r.RoomType || null, roomCount: roomCount || null,
            hotelId: hotelMap[String(r.HotelName || '').toUpperCase()] || null,
            guideId: guideMap[String(r.GuideName || '').toUpperCase()] || null,
            driverId: driverMap[String(r.DriverName || '').toUpperCase()] || null,
            transportCompanyId: tcMap[String(r.TransportCompany || '').toUpperCase()] || null,
            excursionId: excMap[String(r.ExcursionName || '').toUpperCase()] || null,
          });
          counts.Services = (counts.Services || 0) + 1;
        } catch (e: any) { addLog(`  ❌ Service ${r.TourCode}/${r.Category}: ${e.message}`, 'err'); }
      }
      addLog(`  ✅ ${counts.Services || 0} tour services imported`, 'ok');

      // ── 10. Bookings ──
      const bookRows = sheetToRows(wb, 'Bookings');
      for (const r of bookRows) {
        if (!r.TourCode) continue;
        const tId = tourMap[String(r.TourCode).toUpperCase()];
        const cId = clientMap[String(r.ClientName || '').toUpperCase()];
        if (!tId || !cId) continue;
        try {
          await apiPost('bookings', {
            tourId: tId, clientId: cId, bookingDate: excelDateToISO(r.BookingDate),
            status: r.Status || 'Confirmed', serviceType: r.ServiceType || 'Tour',
            totalAmount: Number(r.TotalAmount) || 0
          });
          counts.Bookings = (counts.Bookings || 0) + 1;
        } catch (e: any) { addLog(`  ❌ Booking: ${e.message}`, 'err'); }
      }
      if (counts.Bookings) addLog(`  ✅ ${counts.Bookings} bookings imported`, 'ok');

      addLog(`\n🎉 Import complete!`, 'ok');
      setSummary(counts);
    } catch (err: any) {
      addLog(`💥 Fatal error: ${err.message}`, 'err');
    }
    setImporting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Import Data from Excel</h3>
            <p className="text-sm text-slate-500">Upload a multi-tab Excel template to import projects, tours, hotels, and all master data at once.</p>
          </div>
          <a href="/templates/uno_import_template.xlsx" download className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors">
            <Download className="w-4 h-4" /> Download Template
          </a>
        </div>

        {/* Expected sheets */}
        <div className="mb-5 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs font-semibold text-blue-700 mb-1.5">Expected sheets in template:</p>
          <div className="flex flex-wrap gap-1.5">
            {['Clients','Hotels','Guides','TransportCompanies','Drivers','Excursions','Projects','Tours','TourServices','Bookings'].map(s => (
              <span key={s} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">{s}</span>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        <div
          onClick={() => !importing && fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${importing ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
        >
          {importing ? (
            <><Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" /><p className="text-sm font-bold text-blue-700">Importing {fileName}...</p></>
          ) : fileName ? (
            <><CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" /><p className="text-sm font-bold text-emerald-700">✓ {fileName} imported</p><p className="text-xs text-slate-400 mt-1">Drop another file to import again</p></>
          ) : (
            <><Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" /><h4 className="text-sm font-bold text-slate-700 mb-1">Drag & drop your Excel file here</h4><p className="text-xs text-slate-400 mb-3">or click to browse — supports .xlsx</p></>
          )}
        </div>

        {/* Summary badges */}
        {Object.keys(summary).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(summary).map(([k, v]) => (
              <span key={k} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                {k}: {v}
              </span>
            ))}
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div ref={logRef} className="mt-4 bg-slate-900 rounded-xl p-4 max-h-72 overflow-y-auto font-mono text-xs">
            {logs.map((l, i) => (
              <div key={i} className={l.type === 'ok' ? 'text-emerald-400' : l.type === 'err' ? 'text-red-400' : 'text-slate-300'}>{l.msg}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabType>('projectStatuses');
  const [data, setData] = useState<GenericData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState<Record<string, any[]>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericData | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchTabItems = async (tab: TabType) => {
    setLoading(true);
    try {
      const config = TAB_CONFIG[tab];
      const res = await fetch(`${API}/${config.endpoint}`, { cache: 'no-store' });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        setData([]);
      }

      // Fetch options for select fields
      const newSelectOptions: Record<string, any[]> = {};
      for (const field of config.fields) {
        if (field.type === 'select' && (field as any).optionsEndpoint) {
          const optRes = await fetch(`${API}/${(field as any).optionsEndpoint}`, { cache: 'no-store' });
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
      ? `${API}/${endpoint}/${editingItem.id}` 
      : `${API}/${endpoint}`;
    
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
      const res = await fetch(`${API}/${endpoint}/${id}`, { method: 'DELETE' });
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
      config.fields.forEach(f => initialData[f.key] = (f.type === 'number' || f.type === 'select') ? 0 : '');
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

          <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col relative z-0 mt-4">

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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                {data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                    <Database className="w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No {currentConfig.title} found</h3>
                    <p className="text-slate-500 max-w-md">There are currently no records available in this category. Click the 'Add' button to create your first record.</p>
                  </div>
                ) : (
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
                      {data.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                          {currentConfig.fields.map(f => (
                            <td key={f.key} className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">
                                {f.type === 'select' 
                                  ? (selectOptions[f.key]?.find(opt => opt.id === item[f.key])?.[(f as any).optionLabel || 'name'] || item[f.key]) 
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
                )}
              </div>
            )}
          </div>
        </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">{editingItem ? `Edit ${currentConfig.title}` : `Add New ${currentConfig.title}`}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {currentConfig.fields.map(f => (
                <div key={f.key}>
                  <label htmlFor={f.key} className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      id={f.key}
                      required
                      value={formData[f.key] || ''}
                      onChange={e => setFormData({...formData, [f.key]: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="" disabled hidden>Select an option</option>
                      {(selectOptions[f.key] || []).map(opt => (
                        <option key={opt.id} value={opt.id}>{opt[(f as any).optionLabel || 'name']}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      id={f.key}
                      required 
                      type={f.type === 'number' ? 'number' : 'text'} 
                      value={formData[f.key] || ''} 
                      onChange={e => setFormData({...formData, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value})} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    />
                  )}
                </div>
              ))}
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors">{editingItem ? 'Save Changes' : 'Create Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
