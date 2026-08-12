import React from 'react';
import { TourCalendarEvent } from '../types';
import { AlertTriangle, Users, Bus, UserCircle } from 'lucide-react';

interface TourBlockProps {
  event: TourCalendarEvent;
  onClick?: (event: TourCalendarEvent) => void;
  isCompact?: boolean;
}

export function TourBlock({ event, onClick, isCompact = false }: TourBlockProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'Confirmed': return 'bg-green-100 border-green-300 text-green-800';
      case 'Completed': return 'bg-slate-100 border-slate-300 text-slate-800';
      case 'Cancelled': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const isFull = event.booked >= event.capacity;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(event);
      }}
      className={`relative rounded-md border p-2 mb-1 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${getStatusColor(event.status)}`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-semibold text-xs truncate mr-2" title={event.tourName}>
          {event.tourName}
        </span>
        {event.hasConflict && (
          <span title={event.conflictReason || 'Conflict'}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          </span>
        )}
      </div>
      
      {!isCompact && (
        <div className="flex flex-col gap-1 mt-1 text-[10px]">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1 ${isFull ? 'text-red-700 font-medium' : ''}`}>
              <Users className="w-3 h-3" />
              <span>{event.booked}/{event.capacity} Booked</span>
            </div>
            <span className="bg-white/50 px-1 rounded text-[9px] font-medium border border-white/40">
              {event.status}
            </span>
          </div>

          {(event.guides && event.guides.length > 0) && (
            <div className="flex items-center gap-1 text-slate-600 truncate" title={event.guides.join(', ')}>
              <UserCircle className="w-3 h-3" />
              <span className="truncate">{event.guides[0]} {event.guides.length > 1 ? `+${event.guides.length - 1}` : ''}</span>
            </div>
          )}
          
          {(event.vehicles && event.vehicles.length > 0) && (
            <div className="flex items-center gap-1 text-slate-600 truncate" title={event.vehicles.join(', ')}>
              <Bus className="w-3 h-3" />
              <span className="truncate">{event.vehicles[0]}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
