import React from 'react';
import { TourCalendarEvent } from '../types';
import { X, Calendar, Users, MapPin, Bus, UserCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface TourQuickViewModalProps {
  event: TourCalendarEvent | null;
  onClose: () => void;
}

export function TourQuickViewModal({ event, onClose }: TourQuickViewModalProps) {
  if (!event) return null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start p-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="text-xs font-medium text-blue-600 mb-1">{event.projectName}</div>
            <h3 className="text-lg font-semibold text-slate-800">{event.tourName}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          {event.hasConflict && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Conflict Detected</p>
                <p>{event.conflictReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-slate-700">Dates</p>
                <p className="text-slate-600">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-slate-700">Capacity</p>
                <p className={`text-slate-600 ${event.booked >= event.capacity ? 'text-red-600 font-semibold' : ''}`}>
                  {event.booked} / {event.capacity} Booked
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <UserCircle className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-slate-700">Guides</p>
                <p className="text-slate-600">
                  {event.guides && event.guides.length > 0 ? event.guides.join(', ') : <span className="text-slate-400 italic">Unassigned</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Bus className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium text-slate-700">Vehicles</p>
                <p className="text-slate-600">
                  {event.vehicles && event.vehicles.length > 0 ? event.vehicles.join(', ') : <span className="text-slate-400 italic">Unassigned</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
            Close
          </button>
          <Link href={`/tours/${event.id}`} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
