"use client";

import React, { useState, useEffect } from 'react';
import { CalendarFilterSidebar } from './components/CalendarFilterSidebar';
import { CalendarGrid } from './components/CalendarGrid';
import { TourQuickViewModal } from './components/TourQuickViewModal';
import { fetchTourCalendarEvents } from './api';
import { TourCalendarEvent, TourCalendarFilters } from './types';

export function TourCalendarPage() {
  const [filters, setFilters] = useState<TourCalendarFilters>({
    dateRange: null,
    statuses: ['Planned', 'Confirmed', 'Completed'],
    projects: [],
    searchQuery: '',
    guideId: '',
  });

  const [events, setEvents] = useState<TourCalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TourCalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchTourCalendarEvents(filters).then(data => {
      if (isMounted) {
        setEvents(data);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [filters]);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] bg-white overflow-hidden">
      <CalendarFilterSidebar filters={filters} onChange={setFilters} />
      
      <div className="flex-1 flex flex-col relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <CalendarGrid events={events} onEventClick={setSelectedEvent} />
      </div>

      {selectedEvent && (
        <TourQuickViewModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}
