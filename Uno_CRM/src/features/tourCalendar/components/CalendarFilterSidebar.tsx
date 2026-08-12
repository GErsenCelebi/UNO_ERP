import React, { useState, useEffect } from 'react';
import { TourCalendarFilters } from '../types';
import { Search, Filter, Calendar as CalendarIcon, Check } from 'lucide-react';

interface CalendarFilterSidebarProps {
  filters: TourCalendarFilters;
  onChange: (filters: TourCalendarFilters) => void;
}

const STATUS_OPTIONS = ['Planned', 'Confirmed', 'Completed', 'Cancelled'];

export function CalendarFilterSidebar({ filters, onChange }: CalendarFilterSidebarProps) {
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.searchQuery) {
        onChange({ ...filters, searchQuery: localSearch });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters, onChange]);

  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses: newStatuses });
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          Filters
        </h2>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Search Tours</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Paris Getaway"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <div className="space-y-1.5">
            {STATUS_OPTIONS.map(status => {
              const isSelected = filters.statuses.includes(status);
              return (
                <label key={status} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-slate-700">{status}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Mock Projects Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Projects</label>
          <p className="text-xs text-slate-500">Coming soon (API dependent)</p>
        </div>

        {/* Guide Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="guideIdFilter">Guide ID</label>
          <input
            id="guideIdFilter"
            type="text"
            placeholder="Enter Guide ID"
            value={filters.guideId || ''}
            onChange={(e) => onChange({ ...filters, guideId: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
