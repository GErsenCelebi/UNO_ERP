import React, { useState } from 'react';
import { TourCalendarEvent } from '../types';
import { TourBlock } from './TourBlock';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  events: TourCalendarEvent[];
  onEventClick: (event: TourCalendarEvent) => void;
}

export function CalendarGrid({ events, onEventClick }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'year' | 'month' | 'week' | 'day'>('month');

  const nextPeriod = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === 'year') d.setFullYear(d.getFullYear() + 1);
      if (view === 'month') d.setMonth(d.getMonth() + 1);
      if (view === 'week') d.setDate(d.getDate() + 7);
      if (view === 'day') d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const prevPeriod = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === 'year') d.setFullYear(d.getFullYear() - 1);
      if (view === 'month') d.setMonth(d.getMonth() - 1);
      if (view === 'week') d.setDate(d.getDate() - 7);
      if (view === 'day') d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const today = () => setCurrentDate(new Date());

  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      const target = new Date(date);
      target.setHours(12,0,0,0);
      return target >= start && target <= end;
    });
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };

  const formatHeaderTitle = () => {
    if (view === 'year') {
      return currentDate.getFullYear().toString();
    }
    if (view === 'month') {
      return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    if (view === 'week') {
      const start = getStartOfWeek(currentDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Views rendering
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full p-2 overflow-y-auto custom-scrollbar">
        {months.map(month => {
          const firstDay = new Date(currentDate.getFullYear(), month, 1).getDay();
          const startOffset = firstDay === 0 ? 6 : firstDay - 1;
          const daysInMonth = new Date(currentDate.getFullYear(), month + 1, 0).getDate();
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
          const padding = Array.from({ length: startOffset }, (_, i) => i);

          return (
            <div key={month} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-h-[220px]">
              <h3 className="font-bold text-slate-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => {
                setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
                setView('month');
              }}>
                {new Date(currentDate.getFullYear(), month, 1).toLocaleString('default', { month: 'long' })}
              </h3>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-slate-400 font-medium mb-1">{d}</div>
                ))}
                {padding.map(i => <div key={`pad-${i}`} className="p-1"></div>)}
                {days.map(d => {
                  const date = new Date(currentDate.getFullYear(), month, d);
                  const dayEvents = getEventsForDate(date);
                  const hasEvents = dayEvents.length > 0;
                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                    <button 
                      key={d} 
                      onClick={() => {
                        setCurrentDate(date);
                        setView('day');
                      }}
                      className={`relative p-1 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors w-7 h-7 mx-auto ${isToday ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-700'}`}
                    >
                      <span>{d}</span>
                      {hasEvents && !isToday && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                      )}
                      {hasEvents && isToday && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: startOffset }, (_, i) => i);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[600px]">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-0">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {padding.map(i => (
            <div key={`pad-${i}`} className="border-r border-b border-slate-100 bg-slate-50/50 min-h-[120px]"></div>
          ))}
          {days.map(d => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            const dayEvents = getEventsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div 
                key={d} 
                className={`border-r border-b border-slate-200 min-h-[120px] p-1.5 transition-colors hover:bg-slate-50 cursor-pointer ${isToday ? 'bg-blue-50/20' : ''}`}
                onClick={() => {
                  setCurrentDate(date);
                  setView('day');
                }}
              >
                <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                  {d}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                  {dayEvents.map((event, idx) => (
                    <TourBlock 
                      key={`${event.id}-${idx}`} 
                      event={event} 
                      onClick={onEventClick}
                      isCompact={dayEvents.length > 2}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const start = getStartOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[600px]">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
          {days.map(d => {
            const isToday = new Date().toDateString() === d.toDateString();
            return (
              <div key={d.toISOString()} className={`py-3 text-center border-r border-slate-200 last:border-0 cursor-pointer hover:bg-slate-100 transition-colors ${isToday ? 'bg-blue-50/50 hover:bg-blue-50' : ''}`} onClick={() => {
                setCurrentDate(d);
                setView('day');
              }}>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{d.toLocaleDateString('default', { weekday: 'short' })}</div>
                <div className={`mt-1 text-lg font-bold flex items-center justify-center mx-auto w-8 h-8 rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-800'}`}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 flex-1">
          {days.map(d => {
            const dayEvents = getEventsForDate(d);
            const isToday = new Date().toDateString() === d.toDateString();
            return (
              <div key={d.toISOString()} className={`border-r border-slate-200 last:border-0 p-2 h-full overflow-y-auto custom-scrollbar ${isToday ? 'bg-blue-50/10' : ''}`}>
                <div className="space-y-2">
                  {dayEvents.map((event, idx) => (
                    <TourBlock 
                      key={`${event.id}-${idx}`} 
                      event={event} 
                      onClick={onEventClick}
                      isCompact={false}
                    />
                  ))}
                  {dayEvents.length === 0 && (
                    <div className="text-center text-sm text-slate-400 py-4">No tours</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Scheduled Tours ({dayEvents.length})</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 custom-scrollbar">
          {dayEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {dayEvents.map((event, idx) => (
                <div key={`${event.id}-${idx}`} onClick={() => onEventClick(event)} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-semibold text-blue-600 mb-1">{event.tourName}</div>
                      <div className="text-lg font-bold text-slate-800">{event.projectName}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      event.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      event.status === 'Completed' ? 'bg-slate-100 text-slate-700' :
                      event.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-slate-600 flex-1">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Dates:</span>
                      <span className="font-medium text-slate-800">
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Pax / Capacity:</span>
                      <span className="font-medium text-slate-800">{event.booked} / {event.capacity}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-slate-500">Guides:</span>
                      <span className="font-medium text-slate-800">{event.guides && event.guides.length > 0 ? event.guides.join(', ') : 'Unassigned'}</span>
                    </div>
                  </div>
                  
                  {event.hasConflict && (
                    <div className="mt-4 p-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {event.conflictReason || 'Schedule conflict detected'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
              <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-700 mb-1">No Tours Scheduled</h3>
              <p className="text-sm">There are no tours scheduled for this date.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 min-w-[200px]">
            {formatHeaderTitle()}
          </h1>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={prevPeriod} className="p-1 hover:bg-white rounded text-slate-600 shadow-sm transition-colors"><ChevronLeft className="w-5 h-5"/></button>
            <button onClick={today} className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-white rounded shadow-sm mx-1 transition-colors">Today</button>
            <button onClick={nextPeriod} className="p-1 hover:bg-white rounded text-slate-600 shadow-sm transition-colors"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['year', 'month', 'week', 'day'] as const).map((v) => (
            <button 
              key={v}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${view === v ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        {view === 'year' && renderYearView()}
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>
    </div>
  );
}
