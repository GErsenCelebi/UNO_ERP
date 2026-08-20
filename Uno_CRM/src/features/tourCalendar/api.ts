import { getApiUrl } from '@/lib/apiConfig';
import { TourCalendarEvent, TourCalendarFilters } from './types';

export async function fetchTourCalendarEvents(filters: TourCalendarFilters): Promise<TourCalendarEvent[]> {
  try {
    const params = new URLSearchParams();
    if (filters.dateRange) {
      params.append('StartDate', filters.dateRange.start);
      params.append('EndDate', filters.dateRange.end);
    }
    
    if (filters.guideId) {
      params.append('GuideId', filters.guideId);
    }
    
    const API = getApiUrl();
    const response = await fetch(`${API}/TourCalendar?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch calendar events');
    const data = await response.json();
    
    return data.map((dto: any) => ({
      id: dto.tourId.toString(),
      projectId: 'unknown', 
      projectName: 'unknown',
      tourName: dto.destination,
      startDate: dto.arrivalDate,
      endDate: dto.endDate,
      status: dto.statusName,
      capacity: dto.pax,
      booked: dto.pax,
      hasConflict: dto.hasGuideConflict,
      conflictReason: dto.hasGuideConflict ? 'Guide schedule conflict' : undefined,
      guides: dto.assignedGuideNames,
      vehicles: []
    }));
  } catch (error) {
    console.error('Error fetching tour calendar events', error);
    return [];
  }
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const mockEvents: TourCalendarEvent[] = [
  {
    id: '1',
    projectId: 'p1',
    projectName: 'Europe Summer 2026',
    tourName: 'Paris Getaway',
    startDate: today.toISOString(),
    endDate: tomorrow.toISOString(),
    status: 'Confirmed',
    capacity: 20,
    booked: 18,
    hasConflict: false,
    guides: ['Ahmet Yılmaz'],
    vehicles: ['Bus A1']
  },
  {
    id: '2',
    projectId: 'p2',
    projectName: 'Balkan Tour',
    tourName: 'Sarajevo Weekend',
    startDate: today.toISOString(),
    endDate: today.toISOString(),
    status: 'Planned',
    capacity: 15,
    booked: 15,
    hasConflict: true,
    conflictReason: 'Missing guide assignment',
  },
  {
    id: '3',
    projectId: 'p1',
    projectName: 'Europe Summer 2026',
    tourName: 'Rome Expedition',
    startDate: tomorrow.toISOString(),
    endDate: new Date(today.getTime() + 86400000 * 3).toISOString(),
    status: 'Completed',
    capacity: 30,
    booked: 12,
    hasConflict: false,
    guides: ['Mehmet Demir']
  }
];

