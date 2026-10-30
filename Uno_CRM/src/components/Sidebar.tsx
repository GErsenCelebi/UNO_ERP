"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, Database, ChevronLeft, ChevronRight, ChevronDown, Map, Settings, Layers, Folder, LayoutTemplate, LogOut, History, Users, TrendingUp, Sun, Moon } from 'lucide-react';
import { getCurrentUser, logoutUser, UserSession } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  const isDashboardActive = pathname === '/dashboard' || pathname?.startsWith('/dashboard');
  const isExecutiveActive = pathname === '/dashboard/executive';
  const isOverviewActive = pathname === '/dashboard';
  const isDarkMode = isDark;

  const isProjectsActive = pathname?.startsWith('/projects') || pathname?.startsWith('/tours');
  const isToursActive = pathname?.startsWith('/tours');

  const bottomItems = [
    { name: 'Master Data', href: '/master-data', icon: Database },
  ];

  return (
    <aside className={`print:hidden ${isDarkMode ? 'bg-[#0B0F19] border-r border-slate-800' : 'bg-white border-r border-slate-200'} flex flex-col shrink-0 shadow-sm z-50 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-16' : 'w-52'}`}>
      
      <button 
        suppressHydrationWarning
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3.5 top-5 ${isDarkMode ? 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-cyan-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-slate-50'} border rounded-full p-1 shadow-sm z-50 transition-colors`}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`h-14 flex items-center ${isDarkMode ? 'border-b border-slate-800/90' : 'border-b border-slate-200'} shrink-0 ${isCollapsed ? 'justify-center px-0' : 'px-3 justify-between'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-700/80 shadow-inner' : ''} flex items-center justify-center shrink-0`}>
            <img src="/logo.png" alt="UNO ERP Logo" className={`object-contain ${isCollapsed ? 'w-6 h-6' : 'w-7 h-7'}`} />
          </div>
          {!isCollapsed && <span className={`font-extrabold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'} tracking-tight whitespace-nowrap overflow-hidden`}>ERP</span>}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-700 hover:text-amber-200' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Logged in User Profile & Logout (Above Dashboard) */}
      {user && (
        <div className={`${isDarkMode ? 'border-b border-slate-800/80' : 'border-b border-slate-200/80'} py-2.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {!isCollapsed ? (
            <div className={`flex items-center justify-between px-2 py-1.5 ${isDarkMode ? 'bg-[#111827] hover:bg-slate-800/80 border-slate-800' : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200/60'} rounded-xl border transition-colors`}>
              <div className="flex items-center space-x-2 truncate">
                <div className={`w-7 h-7 rounded-lg ${isDarkMode ? 'bg-gradient-to-tr from-cyan-600 to-blue-600' : 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                  {user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} truncate flex items-center gap-1.5`}>
                    <span>{user.name}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} truncate`}>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                      isDarkMode 
                        ? (user.role === 'Administrator' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                           user.role === 'TourAdmin' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                           user.role === 'Guide' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                           'bg-cyan-950 text-cyan-300 border border-cyan-800')
                        : (user.role === 'Administrator' ? 'bg-purple-100 text-purple-700' :
                           user.role === 'TourAdmin' ? 'bg-emerald-100 text-emerald-700' :
                           user.role === 'Guide' ? 'bg-amber-100 text-amber-800' :
                           'bg-blue-100 text-blue-700')
                    }`}>
                      {user.role || 'User'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className={`p-1 ${isDarkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/40' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'} rounded-lg transition-colors ml-1 shrink-0`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title={`Logged in as ${user.name}. Click to Log out`}
              className={`w-full flex items-center justify-center p-2 ${isDarkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'} rounded-lg transition-colors`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      
      <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-3' : 'px-4'}`}>
        {/* Dashboard with sub-menu (hidden for Guides) */}
        {user?.role !== 'Guide' && (
        <div>
          {isCollapsed ? (
            <Link
              href="/dashboard"
              prefetch={false}
              title="Dashboard"
              className={`flex items-center justify-center py-2 rounded-lg font-medium text-sm transition-colors ${
                isDashboardActive
                  ? (isDarkMode ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/40' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100')
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50')
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${isDashboardActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : 'text-slate-400'}`} />
            </Link>
          ) : (
            <>
              <button
                suppressHydrationWarning
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                className={`w-full flex items-center py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  isDashboardActive
                    ? (isDarkMode ? 'bg-cyan-500/15 text-cyan-400 shadow-sm border border-cyan-500/30' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100')
                    : (isDarkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50')
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 mr-2.5 ${isDashboardActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : 'text-slate-400'}`} />
                <span className="whitespace-nowrap overflow-hidden flex-1 text-left">Dashboard</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDashboardActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-400') : 'text-slate-400'} ${isDashboardOpen ? 'rotate-0' : '-rotate-90'}`} />
              </button>

              {/* Dashboard Sub-items */}
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isDashboardOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Link
                  href="/dashboard"
                  prefetch={false}
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    isOverviewActive
                      ? (isDarkMode ? 'text-cyan-400 bg-cyan-950/40 font-bold border-l-2 border-cyan-400' : 'text-blue-700 bg-blue-50/60 font-semibold')
                      : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')
                  }`}
                >
                  <LayoutTemplate className={`w-3.5 h-3.5 mr-2 ${isOverviewActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-500') : 'text-slate-400'}`} />
                  Overview
                </Link>
                <Link
                  href="/dashboard/executive"
                  prefetch={false}
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    isExecutiveActive
                      ? (isDarkMode ? 'text-cyan-400 bg-cyan-950/40 font-bold border-l-2 border-cyan-400' : 'text-blue-700 bg-blue-50/60 font-semibold')
                      : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')
                  }`}
                >
                  <TrendingUp className={`w-3.5 h-3.5 mr-2 ${isExecutiveActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-500') : 'text-slate-400'}`} />
                  Executive KPI Cockpit
                </Link>
              </div>
            </>
          )}
        </div>
        )}

        {/* If user is Guide, show only My Tours; otherwise show Projects accordion */}
        {user?.role === 'Guide' ? (
          <div>
            <Link
              href="/tours"
              prefetch={false}
              title={isCollapsed ? "My Tours" : undefined}
              className={`flex items-center py-2 rounded-lg font-medium text-sm transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
                isToursActive
                  ? (isDarkMode ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/40 font-bold' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100 font-bold')
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50')
              }`}
            >
              <Briefcase className={`w-4 h-4 ${isCollapsed ? 'mr-0' : 'mr-2.5'} ${isToursActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : 'text-slate-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">My Tours</span>}
            </Link>
          </div>
        ) : (
        /* Projects with sub-menu */
        <div>
          {isCollapsed ? (
            <Link
              href="/projects"
              prefetch={false}
              title="Projection"
              className={`flex items-center justify-center py-2 rounded-lg font-medium text-sm transition-colors ${
                isProjectsActive
                  ? (isDarkMode ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/40' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100')
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50')
              }`}
            >
              <Folder className={`w-4 h-4 ${isProjectsActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : 'text-slate-400'}`} />
            </Link>
          ) : (
            <>
              <button
                suppressHydrationWarning
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className={`w-full flex items-center py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  isProjectsActive
                    ? (isDarkMode ? 'bg-cyan-500/15 text-cyan-400 shadow-sm border border-cyan-500/30' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100')
                    : (isDarkMode ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50')
                }`}
              >
                <Folder className={`w-4 h-4 mr-2.5 ${isProjectsActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : 'text-slate-400'}`} />
                <span className="whitespace-nowrap overflow-hidden flex-1 text-left">Projection</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProjectsActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-400') : 'text-slate-400'} ${isProjectsOpen ? 'rotate-0' : '-rotate-90'}`} />
              </button>

              {/* Sub-items */}
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isProjectsOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Link
                  href="/projects"
                  prefetch={false}
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    pathname === '/projects' || (pathname?.startsWith('/projects/') && !pathname?.startsWith('/tours'))
                      ? (isDarkMode ? 'text-cyan-400 bg-cyan-950/40 font-bold' : 'text-blue-700 bg-blue-50/60')
                      : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')
                  }`}
                >
                  <LayoutTemplate className={`w-3.5 h-3.5 mr-2 ${pathname === '/projects' || (pathname?.startsWith('/projects/') && !pathname?.startsWith('/tours')) ? (isDarkMode ? 'text-cyan-400' : 'text-blue-500') : 'text-slate-400'}`} />
                  Projects
                </Link>
                <Link
                  href="/tours"
                  prefetch={false}
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    isToursActive
                      ? (isDarkMode ? 'text-cyan-400 bg-cyan-950/40 font-bold' : 'text-blue-700 bg-blue-50/60')
                      : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')
                  }`}
                >
                  <Briefcase className={`w-3.5 h-3.5 mr-2 ${isToursActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-500') : 'text-slate-400'}`} />
                  Tours
                </Link>
                <Link
                  href="/tour-calendar"
                  prefetch={false}
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    pathname?.startsWith('/tour-calendar')
                      ? (isDarkMode ? 'text-cyan-400 bg-cyan-950/40 font-bold' : 'text-blue-700 bg-blue-50/60')
                      : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')
                  }`}
                >
                  <Map className={`w-3.5 h-3.5 mr-2 ${pathname?.startsWith('/tour-calendar') ? (isDarkMode ? 'text-cyan-400' : 'text-blue-500') : 'text-slate-400'}`} />
                  Tour Calendar
                </Link>
              </div>
            </>
          )}
        </div>
        )}

        {/* Master Data (hidden for Guides) */}
        {user?.role !== 'Guide' && bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link 
              key={item.name} 
              href={item.href}
              prefetch={false}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center py-2 rounded-lg font-medium text-sm transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
                isActive 
                  ? (isDarkMode ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100') 
                  : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-50')
              }`}
            >
              <Icon className={`w-4 h-4 ${isCollapsed ? 'mr-0' : 'mr-2.5'} ${isActive ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : 'text-slate-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`p-3 ${isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-200'} shrink-0 overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-3'} space-y-1.5`}>
        <button
          type="button"
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          className={`w-full flex items-center py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : 'px-2.5 justify-between'
          } ${
            isDarkMode 
              ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-800' 
              : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-slate-600 shrink-0" />}
            {!isCollapsed && <span className="font-semibold">{isDarkMode ? 'Dark Theme' : 'Light Theme'}</span>}
          </div>
          {!isCollapsed && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isDarkMode ? 'bg-amber-400/15 text-amber-300' : 'bg-blue-100 text-blue-700'
            }`}>
              Toggle
            </span>
          )}
        </button>

        {user?.role !== 'Guide' && (
          <Link
            href="/settings"
            prefetch={false}
            title={isCollapsed ? 'User Accounts' : undefined}
            className={`flex items-center py-2 rounded-lg font-medium text-sm transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
              pathname?.startsWith('/settings')
                ? (isDarkMode ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100')
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-50')
            }`}
          >
            <Users className={`w-4 h-4 ${isCollapsed ? 'mr-0' : 'mr-2.5'} ${pathname?.startsWith('/settings') ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : 'text-slate-400'}`} />
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">User Accounts</span>}
          </Link>
        )}
      </div>
    </aside>
  );
}

