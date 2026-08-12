"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, ArrowDownRight, CreditCard, PieChart, Loader2, MapPin, Package } from "lucide-react";

const API = '/api';

interface ServiceSummary {
  category: string;
  count: number;
  totalCost: number;
}

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tourServices, setTourServices] = useState<any[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all projects
      const projRes = await fetch(`${API}/projects`, { cache: 'no-store' });
      if (projRes.ok) {
        const projs = await projRes.json();
        setProjects(projs);
        setTotalBudget(projs.reduce((s: number, p: any) => s + (p.approxBudget || 0), 0));

        // Fetch tours for each project and their services
        const allServices: any[] = [];
        for (const proj of projs) {
          const tourRes = await fetch(`${API}/tours?projectId=${proj.id}`).catch(() => null);
          if (tourRes?.ok) {
            const tours = await tourRes.json();
            for (const tour of tours) {
              const svcRes = await fetch(`${API}/tourservices?tourId=${tour.id}`).catch(() => null);
              if (svcRes?.ok) {
                const svcs = await svcRes.json();
                allServices.push(...svcs.map((s: any) => ({
                  ...s,
                  tourCode: tour.tourCode,
                  destination: tour.destination,
                  projectCode: proj.projectCode,
                })));
              }
            }
          }
        }
        setTourServices(allServices);
        setTotalSpend(allServices.reduce((s: number, svc: any) => s + (svc.totalCost || svc.unitPrice * (svc.quantity || 1) || 0), 0));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate by category
  const categorySummary: ServiceSummary[] = [];
  const catMap = new Map<string, ServiceSummary>();
  tourServices.forEach(svc => {
    const cat = svc.serviceCategory?.name || svc.categoryName || 'Other';
    if (!catMap.has(cat)) catMap.set(cat, { category: cat, count: 0, totalCost: 0 });
    const entry = catMap.get(cat)!;
    entry.count++;
    entry.totalCost += svc.totalCost || svc.unitPrice * (svc.quantity || 1) || 0;
  });
  catMap.forEach(v => categorySummary.push(v));
  categorySummary.sort((a, b) => b.totalCost - a.totalCost);

  const remaining = totalBudget - totalSpend;
  const spendPct = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 shrink-0 sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Finance &amp; Budgeting</h1>
          <p className="text-xs text-slate-500">TourService aggregation across all projects</p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Total Budget</p>
                      <h3 className="text-3xl font-bold text-slate-800">€{totalBudget.toLocaleString()}</h3>
                    </div>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <PieChart className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">Across {projects.length} projects</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Total Service Spend</p>
                      <h3 className="text-3xl font-bold text-slate-800">€{totalSpend.toLocaleString()}</h3>
                    </div>
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                      <ArrowDownRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className={`h-2 rounded-full ${spendPct > 90 ? 'bg-red-500' : spendPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, spendPct)}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">{spendPct}% of budget consumed</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Remaining Budget</p>
                      <h3 className={`text-3xl font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>€{remaining.toLocaleString()}</h3>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{tourServices.length} total services</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spend by Category */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-800 mb-5">Spend by Category</h3>
                  <div className="space-y-4">
                    {categorySummary.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-8">No service data available yet</p>
                    ) : categorySummary.map(cat => {
                      const pct = totalSpend > 0 ? Math.round((cat.totalCost / totalSpend) * 100) : 0;
                      return (
                        <div key={cat.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700">{cat.category}</span>
                            <span className="text-slate-500">€{cat.totalCost.toLocaleString()} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Project Budget Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-5 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Project Budget Overview</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {projects.map(proj => {
                      const projServices = tourServices.filter(s => s.projectCode === proj.projectCode);
                      const projSpend = projServices.reduce((s: number, svc: any) => s + (svc.totalCost || svc.unitPrice * (svc.quantity || 1) || 0), 0);
                      const budget = proj.approxBudget || 0;
                      return (
                        <div key={proj.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="font-medium text-slate-800">{proj.projectCode}</p>
                            <p className="text-xs text-slate-500">{proj.client?.name || 'Client'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800">€{projSpend.toLocaleString()} / €{budget.toLocaleString()}</p>
                            <p className={`text-xs font-medium ${budget - projSpend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {budget > 0 ? `${Math.round((projSpend / budget) * 100)}% used` : 'No budget set'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* All Services Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">All Tour Services</h3>
                  <p className="text-sm text-slate-400">Complete service breakdown across all projects and tours</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3">Project</th>
                        <th className="px-6 py-3">Tour</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Qty</th>
                        <th className="px-6 py-3">Unit Price</th>
                        <th className="px-6 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tourServices.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No tour services recorded yet.</td></tr>
                      ) : tourServices.slice(0, 50).map((svc, i) => (
                        <tr key={svc.id || i} className="hover:bg-slate-50">
                          <td className="px-6 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{svc.projectCode}</span></td>
                          <td className="px-6 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{svc.tourCode}</span></td>
                          <td className="px-6 py-3 text-slate-500">{svc.serviceCategory?.name || 'Other'}</td>
                          <td className="px-6 py-3 font-medium text-slate-700">{svc.description || '-'}</td>
                          <td className="px-6 py-3">{svc.quantity || 1}</td>
                          <td className="px-6 py-3">€{Number(svc.unitPrice || 0).toFixed(2)}</td>
                          <td className="px-6 py-3 font-semibold text-slate-800">€{Number(svc.totalCost || svc.unitPrice * (svc.quantity || 1) || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

