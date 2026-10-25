"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { getApiUrl } from '@/lib/apiConfig';
import { getAuthHeaders } from '@/lib/auth';

const API = getApiUrl();

export interface ExcursionItem {
  id: number;
  name: string;
  code: string;
  type: string;
  price: number;
  salePrice: number;
  isSelected?: boolean;
  soldCount?: number;
}

export interface PassengerItem {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  room: string;
  roomNumber?: number;
  roomType?: string;
  paxType?: string;
  isChild?: boolean;
  isInfant?: boolean;
}

export const getPassengerExcursionPrice = (basePrice: number, pax?: PassengerItem): number => {
  if (!pax) return basePrice;
  const pType = (pax.paxType || '').toLowerCase();
  if (pax.isInfant || pType.includes('infant') || pType.includes('bebek') || pType === 'inf') {
    return 0;
  }
  if (pax.isChild || pType.includes('child') || pType.includes('chd') || pType.includes('çocuk') || pType.includes('cocuk')) {
    return Math.round((basePrice * 0.5) * 100) / 100;
  }
  return basePrice;
};

interface SaleRecord {
  passengerId: number;
  excursionId: number;
  unitPrice: number;
  paymentMethod: string;
}

interface GuideExcursionSalesPortalProps {
  tourId: number | string;
  projectId?: number | string;
  tour?: any;
  isStandaloneMobile?: boolean;
  onSettled?: () => void;
}

export default function GuideExcursionSalesPortal({
  tourId,
  projectId,
  tour: initialTour,
  isStandaloneMobile = false,
  onSettled
}: GuideExcursionSalesPortalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tourData, setTourData] = useState<any>(null);
  
  // All excursions from catalog
  const [allExcursions, setAllExcursions] = useState<ExcursionItem[]>([]);
  // IDs of excursions currently selected to appear in the matrix columns
  const [selectedExcursionIds, setSelectedExcursionIds] = useState<number[]>([]);
  const [isExcursionSelectorOpen, setIsExcursionSelectorOpen] = useState(false);
  const [excursionSearchQuery, setExcursionSearchQuery] = useState('');

  // Passengers
  const [passengers, setPassengers] = useState<PassengerItem[]>([]);
  const [paxSearch, setPaxSearch] = useState('');

  // Sales map: `${passengerId}-${excursionId}` -> { unitPrice, paymentMethod }
  const [salesMap, setSalesMap] = useState<Record<string, { unitPrice: number; paymentMethod: string }>>({});
  // Global & Passenger payment methods
  const [globalPaymentMode, setGlobalPaymentMode] = useState<string>('Cash EUR');
  const [paxPayments, setPaxPayments] = useState<Record<number, string>>({});

  // Settlement status
  const [isSettled, setIsSettled] = useState(false);
  const [settledAt, setSettledAt] = useState<string | null>(null);
  const [settledBy, setSettledBy] = useState<string | null>(null);
  const [voucherNumber, setVoucherNumber] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/tours/${tourId}/excursion-sales`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTourData(data);

      const excList: ExcursionItem[] = data.excursions || [];
      setAllExcursions(excList);

      // Pre-select excursions that either have existing sales or were flagged as selected by the API
      const defaultSelectedIds = excList
        .filter(e => e.isSelected || (e.soldCount && e.soldCount > 0))
        .map(e => e.id);
      
      // If none selected, default to top 4
      if (defaultSelectedIds.length === 0 && excList.length > 0) {
        setSelectedExcursionIds(excList.slice(0, 4).map(e => e.id));
      } else {
        setSelectedExcursionIds(defaultSelectedIds);
      }

      setPassengers(data.passengers || []);

      // Build initial salesMap & paxPayments
      const newSalesMap: Record<string, { unitPrice: number; paymentMethod: string }> = {};
      const newPaxPayments: Record<number, string> = {};
      const paxLookup = new Map<number, PassengerItem>((data.passengers || []).map((p: any) => [p.id, p]));
      const excLookup = new Map<number, ExcursionItem>(excList.map(e => [e.id, e]));

      (data.sales || []).forEach((s: any) => {
        const key = `${s.passengerId}-${s.excursionId}`;
        const pax = paxLookup.get(s.passengerId);
        const exc = excLookup.get(s.excursionId);
        const basePrice = exc ? (exc.salePrice || exc.price || 35.0) : s.unitPrice;
        let finalPrice = s.unitPrice;
        if (pax) {
          const rulePrice = getPassengerExcursionPrice(basePrice, pax);
          if (pax.isInfant) {
            finalPrice = 0;
          } else if (pax.isChild && finalPrice > rulePrice) {
            finalPrice = rulePrice;
          } else if (finalPrice === undefined || finalPrice === null) {
            finalPrice = rulePrice;
          }
        }
        newSalesMap[key] = {
          unitPrice: finalPrice,
          paymentMethod: s.paymentMethod || 'Cash EUR'
        };
        if (!newPaxPayments[s.passengerId]) {
          newPaxPayments[s.passengerId] = s.paymentMethod || 'Cash EUR';
        }
      });

      if (data.sales && data.sales.length > 0 && data.sales[0].paymentMethod) {
        setGlobalPaymentMode(data.sales[0].paymentMethod);
      }

      // Set default payment mode for passengers
      (data.passengers || []).forEach((p: any) => {
        if (!newPaxPayments[p.id]) {
          newPaxPayments[p.id] = 'Cash EUR';
        }
      });

      setSalesMap(newSalesMap);
      setPaxPayments(newPaxPayments);
      setIsSettled(!!data.isSettled);
      setSettledAt(data.settledAt || null);
      setSettledBy(data.settledBy || null);
    } catch (err) {
      console.error('Failed to load excursion sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourId) {
      fetchData();
    }
  }, [tourId]);

  // Excursions currently displayed in the matrix
  const activeExcursions = useMemo(() => {
    return allExcursions.filter(e => selectedExcursionIds.includes(e.id));
  }, [allExcursions, selectedExcursionIds]);

  // Filtered excursions inside selector drawer
  const filteredCatalogExcursions = useMemo(() => {
    if (!excursionSearchQuery.trim()) return allExcursions;
    const q = excursionSearchQuery.toLowerCase();
    return allExcursions.filter(e => 
      e.name.toLowerCase().includes(q) || 
      (e.code && e.code.toLowerCase().includes(q)) ||
      (e.type && e.type.toLowerCase().includes(q))
    );
  }, [allExcursions, excursionSearchQuery]);

  // Toggle an excursion in/out of the matrix
  const toggleExcursionSelection = (excursionId: number) => {
    setSelectedExcursionIds(prev => {
      if (prev.includes(excursionId)) {
        return prev.filter(id => id !== excursionId);
      } else {
        return [...prev, excursionId];
      }
    });
  };

  const selectTop4Excursions = () => {
    const top4 = allExcursions.filter(e => 
      e.code === 'BDP-Boat' || e.code === 'PRG-KV' || e.code === 'VN-Hallst' || e.code === 'PRG-Folk' ||
      e.name.toLowerCase().includes('danube') || e.name.toLowerCase().includes('karlovy') ||
      e.name.toLowerCase().includes('hallstatt') || e.name.toLowerCase().includes('folklore')
    ).map(e => e.id);

    if (top4.length > 0) {
      setSelectedExcursionIds(top4);
    } else {
      setSelectedExcursionIds(allExcursions.slice(0, 4).map(e => e.id));
    }
  };

  const selectAllExcursions = () => {
    setSelectedExcursionIds(allExcursions.map(e => e.id));
  };

  const clearSelectedExcursions = () => {
    setSelectedExcursionIds([]);
  };

  // Toggle sale for a specific passenger & excursion
  const toggleSale = (pax: PassengerItem, excId: number, basePrice: number) => {
    const key = `${pax.id}-${excId}`;
    setSalesMap(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        const payment = paxPayments[pax.id] || globalPaymentMode;
        const price = getPassengerExcursionPrice(basePrice, pax);
        next[key] = {
          unitPrice: price,
          paymentMethod: payment
        };
      }
      return next;
    });
  };

  // Change payment mode across the tour and all passengers
  const handlePaymentModeChange = (mode: string) => {
    setGlobalPaymentMode(mode);
    setPaxPayments(prev => {
      const next = { ...prev };
      passengers.forEach(p => {
        next[p.id] = mode;
      });
      return next;
    });
    // Update all existing sales to this payment mode
    setSalesMap(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        next[k] = { ...next[k], paymentMethod: mode };
      });
      return next;
    });
  };

  // Update single passenger payment method (fallback)
  const updatePassengerPayment = (paxId: number, payment: string) => {
    setPaxPayments(prev => ({ ...prev, [paxId]: payment }));
    setSalesMap(prev => {
      const next = { ...prev };
      activeExcursions.forEach(exc => {
        const key = `${paxId}-${exc.id}`;
        if (next[key]) {
          next[key] = { ...next[key], paymentMethod: payment };
        }
      });
      return next;
    });
  };

  // Quick select all active excursions for all passengers
  const quickSelectAll = (sold: boolean) => {
    setSalesMap(prev => {
      const next = { ...prev };
      passengers.forEach(p => {
        const payment = paxPayments[p.id] || globalPaymentMode;
        activeExcursions.forEach(exc => {
          const key = `${p.id}-${exc.id}`;
          if (sold) {
            const basePrice = exc.salePrice || exc.price || 35.0;
            const unitPrice = getPassengerExcursionPrice(basePrice, p);
            next[key] = {
              unitPrice: unitPrice,
              paymentMethod: payment
            };
          } else {
            delete next[key];
          }
        });
      });
      return next;
    });
  };

  // Calculate totals
  const { totalTickets, adultTickets, childTickets, infantTickets, grossRevenue, guideCommission, netCompanyAmount } = useMemo(() => {
    let tickets = 0;
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;
    let gross = 0;

    passengers.forEach(p => {
      activeExcursions.forEach(exc => {
        const key = `${p.id}-${exc.id}`;
        if (salesMap[key]) {
          tickets += 1;
          gross += salesMap[key].unitPrice;
          const pType = (p.paxType || '').toLowerCase();
          if (p.isInfant || pType.includes('infant') || pType.includes('bebek') || pType === 'inf') {
            infantCount += 1;
          } else if (p.isChild || pType.includes('child') || pType.includes('chd') || pType.includes('çocuk') || pType.includes('cocuk')) {
            childCount += 1;
          } else {
            adultCount += 1;
          }
        }
      });
    });

    const commRate = (tourData?.guideCommissionRate || 10.0) / 100;
    const comm = Math.round(gross * commRate * 100) / 100;
    const net = Math.round((gross - comm) * 100) / 100;

    return {
      totalTickets: tickets,
      adultTickets: adultCount,
      childTickets: childCount,
      infantTickets: infantCount,
      grossRevenue: Math.round(gross * 100) / 100,
      guideCommission: comm,
      netCompanyAmount: net
    };
  }, [passengers, activeExcursions, salesMap, tourData]);

  // Submit settlement
  const handleSubmitSettlement = async () => {
    try {
      setSubmitting(true);
      const salesPayload: SaleRecord[] = [];

      passengers.forEach(p => {
        activeExcursions.forEach(exc => {
          const key = `${p.id}-${exc.id}`;
          if (salesMap[key]) {
            salesPayload.push({
              passengerId: p.id,
              excursionId: exc.id,
              unitPrice: salesMap[key].unitPrice,
              paymentMethod: salesMap[key].paymentMethod || paxPayments[p.id] || 'Cash EUR'
            });
          }
        });
      });

      const body = {
        settledBy: tourData?.guideName || 'Guide',
        sales: salesPayload,
        selectedExcursionIds: activeExcursions.map(e => e.id),
        totalGross: grossRevenue,
        guideCommission: guideCommission,
        netCashHandover: netCompanyAmount
      };

      const res = await fetch(`${API}/tours/${tourId}/excursion-sales/bulk-settlement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const resData = await res.json();
      setIsSettled(true);
      setSettledAt(resData.settledAt || new Date().toISOString());
      setSettledBy(resData.settledBy || tourData?.guideName || 'Guide');
      setVoucherNumber(resData.voucherNo);
      setToastMessage(resData.message || `Settlement submitted successfully! Accounting voucher #${resData.voucherNo} generated.`);
      setShowToast(true);

      if (onSettled) {
        onSettled();
      }

      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    } catch (err: any) {
      alert(`Failed to submit settlement: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter passengers
  const filteredPassengers = useMemo(() => {
    if (!paxSearch.trim()) return passengers;
    const q = paxSearch.toLowerCase();
    return passengers.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.room && p.room.toLowerCase().includes(q))
    );
  }, [passengers, paxSearch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading guide excursion sales matrix...</p>
      </div>
    );
  }

  const destinationTitle = tourData?.tourCode 
    ? `${tourData.tourCode} — ${tourData.destination || 'Destination'}`
    : 'Guide Excursion Sales & Settlement';

  return (
    <div className={`w-full ${isStandaloneMobile ? 'p-2 sm:p-4 min-h-screen bg-slate-900/5' : ''}`}>
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">

        {/* ──── 1. HEADER: TOUR & GUIDE CONTEXT (50% SLIMMER) ──── */}
        <div className="bg-slate-900 text-white py-2 px-3 sm:px-4 flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
              🧭
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                  {isSettled ? 'SETTLED TOUR' : 'ACTIVE TOUR'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {tourData?.projectCode || `Project #${projectId}`} / Tour #{tourId}
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white truncate">
                  {destinationTitle}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                Guide: <strong className="text-white">{tourData?.guideName || 'Unassigned'}</strong> • {tourData?.paxCount || passengers.length} Pax • Base Comm: <strong className="text-amber-300">{(tourData?.guideCommissionRate || 10).toFixed(1)}%</strong>
              </p>
            </div>
          </div>

          {/* Settlement Status / Live Auto-Sync */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] shrink-0">
            {isSettled ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Settled</span>
                {voucherNumber && <span className="text-slate-400 text-[9px]">({voucherNumber})</span>}
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300">Live Auto-Sync</span>
              </>
            )}
          </div>
        </div>

        {/* ──── 2. EXCURSION MULTI-SELECTOR DRAWER (USER REQUIREMENT) ──── */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Excursions in Scope ({activeExcursions.length} Selected):</span>
              <span className="text-[11px] text-slate-500 hidden md:inline">Select excursions to include as columns in the passenger matrix</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={selectTop4Excursions}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                title="Select 4 standard destination excursions"
              >
                Top 4 Standard
              </button>
              <button 
                onClick={selectAllExcursions}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
              >
                Select All ({allExcursions.length})
              </button>
              <button 
                onClick={clearSelectedExcursions}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsExcursionSelectorOpen(!isExcursionSelectorOpen)}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
              >
                <span>Browse Catalog</span>
                {isExcursionSelectorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Active Excursion Quick Tags / Chips */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            {activeExcursions.length === 0 ? (
              <span className="text-xs text-amber-600 dark:text-amber-400 italic">
                ⚠️ No excursions selected. Click "Browse Catalog" or "Top 4 Standard" to add columns to the matrix.
              </span>
            ) : (
              activeExcursions.map(exc => (
                <span 
                  key={exc.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100/70 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                >
                  <span>{exc.name}</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">€{(exc.salePrice || exc.price).toFixed(2)}</span>
                  <button 
                    onClick={() => toggleExcursionSelection(exc.id)}
                    className="hover:text-rose-600 transition-colors ml-0.5"
                    title={`Remove ${exc.name} from matrix`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Dropdown Catalog Multi-Select Box */}
          {isExcursionSelectorOpen && (
            <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={excursionSearchQuery}
                    onChange={e => setExcursionSearchQuery(e.target.value)}
                    placeholder="Search excursions by name, code or type..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  Showing {filteredCatalogExcursions.length} of {allExcursions.length}
                </span>
              </div>

              {/* Grid of Checkbox Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredCatalogExcursions.map(exc => {
                  const isChecked = selectedExcursionIds.includes(exc.id);
                  const price = exc.salePrice || exc.price || 0;
                  return (
                    <label 
                      key={exc.id} 
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                        isChecked 
                          ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-blue-100 font-medium' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleExcursionSelection(exc.id)}
                          className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <div className="truncate">
                          <p className="truncate font-semibold">{exc.name}</p>
                          <p className="text-[10px] text-slate-400">{exc.code || exc.type}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">€{price.toFixed(2)}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ──── 3. SUB-HEADER & ACTION BAR ──── */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-500 dark:text-slate-400">Tap passenger cells to toggle excursion sales:</span>
            <button 
              onClick={() => quickSelectAll(true)} 
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs shadow-2xs transition-colors"
            >
              All On
            </button>
            <button 
              onClick={() => quickSelectAll(false)} 
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs shadow-2xs transition-colors"
            >
              Reset
            </button>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800 ml-1">
              <Check className="w-3 h-3" /> Sold
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium border border-slate-200 dark:border-slate-700">
              ☐ Not Taken
            </span>

            {/* Pricing Discount Policy Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
              <Tag className="w-3 h-3 text-indigo-500" />
              <span>Children: 50% Off • Infants: Free</span>
            </span>

            {/* Payment Mode Selector in the Action Bar */}
            <div className="flex items-center gap-1.5 ml-1 sm:ml-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-600 dark:text-slate-300 text-xs">Payment Mode:</span>
              <select
                value={globalPaymentMode}
                onChange={e => handlePaymentModeChange(e.target.value)}
                className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="Cash EUR">Cash EUR</option>
                <option value="Credit Card">Card POS</option>
                <option value="Agency Office">Pre-paid</option>
              </select>
            </div>
          </div>

          {/* Filter / Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={paxSearch}
                onChange={e => setPaxSearch(e.target.value)}
                placeholder="Filter passenger or room..."
                className="pl-7 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* ──── 4. PASSENGER × EXCURSION MATRIX TABLE ──── */}
        <div className="overflow-x-auto max-h-[520px] relative divide-y divide-slate-200 dark:divide-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-20 shadow-xs border-b border-slate-200 dark:border-slate-800">
              <tr className="divide-x divide-slate-200 dark:divide-slate-800">
                <th className="py-2.5 px-2.5 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-30 min-w-[135px] sm:min-w-[145px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Passenger Name & Room
                </th>

                {activeExcursions.map(exc => (
                  <th key={exc.id} className="py-2 px-1.5 font-semibold text-slate-800 dark:text-slate-200 text-center min-w-[76px] sm:min-w-[84px]">
                    <div className="truncate font-bold max-w-full text-[11px]" title={exc.name}>{exc.name}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      €{(exc.salePrice || exc.price).toFixed(2)}
                    </div>
                    <div className="text-[9px] text-slate-400 font-normal truncate max-w-full">{exc.code}</div>
                  </th>
                ))}

                <th className="py-2 px-1.5 font-semibold text-slate-800 dark:text-slate-200 text-center min-w-[72px] sm:min-w-[80px] bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="text-[11px]">Pax Total</div>
                  <div className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">Per Person</div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={activeExcursions.length + 2} className="py-8 text-center text-slate-400">
                    {paxSearch ? `No passengers matched "${paxSearch}".` : 'No passengers found for this tour.'}
                  </td>
                </tr>
              ) : (
                filteredPassengers.map((p) => {
                  let paxTotal = 0;
                  activeExcursions.forEach(exc => {
                    const key = `${p.id}-${exc.id}`;
                    if (salesMap[key]) {
                      paxTotal += salesMap[key].unitPrice;
                    }
                  });

                  return (
                    <tr 
                      key={p.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors divide-x divide-slate-200 dark:divide-slate-800"
                    >
                      {/* Passenger Name & Room */}
                      <td className="py-1.5 px-2.5 sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <div className={`font-medium leading-tight ${
                          p.isInfant ? 'text-purple-600 dark:text-purple-400 font-semibold' :
                          p.isChild ? 'text-rose-600 dark:text-rose-400 font-semibold' : 
                          'text-slate-900 dark:text-slate-100'
                        }`}>
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{p.room}</span>
                          {p.isInfant ? (
                            <span className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">
                              INF (FREE)
                            </span>
                          ) : p.isChild ? (
                            <span className="text-[9px] bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">
                              CHD (-50%)
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Excursion Toggle Cells */}
                      {activeExcursions.map(exc => {
                        const key = `${p.id}-${exc.id}`;
                        const isSold = !!salesMap[key];
                        const basePrice = exc.salePrice || exc.price || 35.0;
                        const effectivePrice = getPassengerExcursionPrice(basePrice, p);

                        return (
                          <td 
                            key={exc.id} 
                            className="py-1 px-1 text-center cursor-pointer select-none"
                            onClick={() => toggleSale(p, exc.id, basePrice)}
                            title={`${p.name} - ${exc.name}: €${effectivePrice.toFixed(2)}${
                              p.isInfant ? ' (Infant Free)' : p.isChild ? ' (50% Child Discount)' : ''
                            }`}
                          >
                            <button
                              type="button"
                              className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all ${
                                isSold 
                                  ? (p.isInfant ? 'bg-purple-600 text-white shadow-xs scale-105' :
                                     p.isChild ? 'bg-rose-600 text-white shadow-xs scale-105' :
                                     'bg-blue-600 text-white shadow-xs scale-105') 
                                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-transparent hover:border-slate-400'
                              }`}
                            >
                              <Check className={`w-3.5 h-3.5 stroke-[2.5] ${isSold ? 'opacity-100 text-white' : 'opacity-0'}`} />
                            </button>
                            {isSold && (
                              <div className="text-[9px] font-bold mt-0.5 leading-none text-slate-500 dark:text-slate-400">
                                {p.isInfant ? '€0' : `€${effectivePrice.toFixed(effectivePrice % 1 === 0 ? 0 : 2)}`}
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {/* Pax Total */}
                      <td className="py-1 px-1.5 text-center font-bold text-amber-600 dark:text-amber-400 bg-amber-50/20 dark:bg-amber-950/10">
                        €{paxTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ──── 5. REAL-TIME FINANCIAL SETTLEMENT SUMMARY BAR ──── */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Key Metric KPI Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Excursions Sold</div>
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 flex items-baseline gap-1">
                <span>{totalTickets}</span> 
                <span className="text-[10px] text-slate-400 font-normal">tickets</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                {adultTickets} Ad • {childTickets} Chd • {infantTickets} Inf
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Gross Revenue</div>
              <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                €{grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20 shadow-2xs">
              <div className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
                Guide Commission ({(tourData?.guideCommissionRate || 10).toFixed(0)}%)
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                €{guideCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20 shadow-2xs">
              <div className="text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-400 font-semibold">Net Cash to Office</div>
              <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                €{netCompanyAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={handleSubmitSettlement}
              disabled={submitting}
              className={`px-5 py-3 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${
                isSettled 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
              }`}
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing Settlement...</span>
                </>
              ) : isSettled ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Re-Submit / Update Settlement</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Guide Settlement</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* ──── 6. NOTIFICATION TOAST ──── */}
        {showToast && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-medium text-center flex items-center justify-center gap-2 transition-all shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}
