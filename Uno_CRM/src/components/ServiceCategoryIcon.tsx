"use client";

import React from 'react';
import { 
  Bed, 
  Building2, 
  Bus, 
  Plane, 
  Compass, 
  Ship, 
  UserCheck, 
  Car, 
  Utensils, 
  Ticket, 
  ShieldCheck, 
  Tag, 
  Layers 
} from 'lucide-react';

interface ServiceCategoryIconProps {
  categoryName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ServiceCategoryIcon({ categoryName = '', className = '', size = 'md' }: ServiceCategoryIconProps) {
  const norm = (categoryName || '').toLowerCase().trim();

  let IconComponent = Layers;
  let bgLight = 'bg-slate-100 text-slate-600 border-slate-200';
  let bgDark = 'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (norm.includes('hotel') || norm.includes('accommodation') || norm.includes('stay') || norm.includes('room')) {
    IconComponent = Bed;
    bgLight = 'bg-blue-50 text-blue-600 border-blue-200';
    bgDark = 'dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60';
  } else if (norm.includes('transport') || norm.includes('bus') || norm.includes('coach') || norm.includes('transfer')) {
    IconComponent = Bus;
    bgLight = 'bg-amber-50 text-amber-600 border-amber-200';
    bgDark = 'dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60';
  } else if (norm.includes('flight') || norm.includes('plane') || norm.includes('air')) {
    IconComponent = Plane;
    bgLight = 'bg-sky-50 text-sky-600 border-sky-200';
    bgDark = 'dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800/60';
  } else if (norm.includes('cruise') || norm.includes('boat') || norm.includes('ship')) {
    IconComponent = Ship;
    bgLight = 'bg-cyan-50 text-cyan-600 border-cyan-200';
    bgDark = 'dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/60';
  } else if (norm.includes('excursion') || norm.includes('tour') || norm.includes('activity') || norm.includes('sightseeing')) {
    IconComponent = Compass;
    bgLight = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    bgDark = 'dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60';
  } else if (norm.includes('guide')) {
    IconComponent = UserCheck;
    bgLight = 'bg-purple-50 text-purple-600 border-purple-200';
    bgDark = 'dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800/60';
  } else if (norm.includes('driver')) {
    IconComponent = Car;
    bgLight = 'bg-indigo-50 text-indigo-600 border-indigo-200';
    bgDark = 'dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/60';
  } else if (norm.includes('meal') || norm.includes('restaurant') || norm.includes('food') || norm.includes('dinner') || norm.includes('lunch')) {
    IconComponent = Utensils;
    bgLight = 'bg-orange-50 text-orange-600 border-orange-200';
    bgDark = 'dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-800/60';
  } else if (norm.includes('ticket') || norm.includes('entrance') || norm.includes('fee')) {
    IconComponent = Ticket;
    bgLight = 'bg-teal-50 text-teal-600 border-teal-200';
    bgDark = 'dark:bg-teal-950/60 dark:text-teal-400 dark:border-teal-800/60';
  } else if (norm.includes('insurance') || norm.includes('visa')) {
    IconComponent = ShieldCheck;
    bgLight = 'bg-rose-50 text-rose-600 border-rose-200';
    bgDark = 'dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60';
  }

  const sizeBox = size === 'sm' ? 'w-5 h-5 rounded' : size === 'lg' ? 'w-8 h-8 rounded-xl' : 'w-7 h-7 rounded-lg';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5';

  return (
    <div className={`${sizeBox} border flex items-center justify-center shrink-0 shadow-2xs transition-colors ${bgLight} ${bgDark} ${className}`} title={categoryName}>
      <IconComponent className={iconSize} />
    </div>
  );
}
