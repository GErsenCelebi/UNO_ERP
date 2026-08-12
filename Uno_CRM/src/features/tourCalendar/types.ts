export interface TourCalendarEvent {
  id: string;
  projectId: string;
  projectName: string;
  tourName: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
  status: 'Planned' | 'Confirmed' | 'Completed' | 'Cancelled';
  capacity: number;
  booked: number;
  hasConflict: boolean;
  conflictReason?: string;
  guides?: string[];
  vehicles?: string[];
}

export interface TourCalendarFilters {
  dateRange: { start: string; end: string } | null;
  statuses: string[];
  projects: string[];
  searchQuery: string;
  guideId: string;
}

export interface CalendarViewProps {
  currentDate: Date;
  events: TourCalendarEvent[];
  onEventClick: (event: TourCalendarEvent) => void;
}
