"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, Database, ChevronLeft, ChevronRight, ChevronDown, Map, Settings, Layers, Folder, LayoutTemplate, LogOut, History, Users } from 'lucide-react';
import { getCurrentUser, logoutUser, UserSession } from '@/lib/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  const isProjectsActive = pathname?.startsWith('/projects') || pathname?.startsWith('/tours');
  const isToursActive = pathname?.startsWith('/tours');


  const topItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  const bottomItems = [
    { name: 'Master Data', href: '/master-data', icon: Database },
  ];

  return (
    <aside className={`print:hidden bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-50 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-16' : 'w-52'}`}>
      
      <button 
        suppressHydrationWarning
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-5 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-blue-600 shadow-sm z-50 hover:bg-slate-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`h-12 flex items-center border-b border-slate-200 shrink-0 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
        <img src="/logo.png" alt="UNO ERP Logo" className={`object-contain ${isCollapsed ? 'w-6 h-6 mr-0' : 'w-8 h-8 mr-2'}`} />
        {!isCollapsed && <span className="font-bold text-sm text-slate-800 tracking-tight whitespace-nowrap overflow-hidden">UNO ERP</span>}
      </div>
      
      <nav className={`flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-3' : 'px-4'}`}>
        {/* Dashboard */}
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);
          return (
              <Link 
              key={item.name} 
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center py-2 rounded-lg font-medium text-sm transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isCollapsed ? 'mr-0' : 'mr-2.5'} ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
            </Link>
          );
        })}

        {/* Projects with sub-menu */}
        <div>
          {isCollapsed ? (
            <Link
              href="/projects"
              title="Projection"
              className={`flex items-center justify-center py-2 rounded-lg font-medium text-sm transition-colors ${
                isProjectsActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Folder className={`w-4 h-4 ${isProjectsActive ? 'text-blue-600' : 'text-slate-400'}`} />
            </Link>
          ) : (
            <>
              <button
                suppressHydrationWarning
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className={`w-full flex items-center py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  isProjectsActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Folder className={`w-4 h-4 mr-2.5 ${isProjectsActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap overflow-hidden flex-1 text-left">Projection</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProjectsActive ? 'text-blue-400' : 'text-slate-400'} ${isProjectsOpen ? 'rotate-0' : '-rotate-90'}`} />
              </button>

              {/* Sub-items */}
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isProjectsOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Link
                  href="/projects"
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    pathname === '/projects' || (pathname?.startsWith('/projects/') && !pathname?.startsWith('/tours'))
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutTemplate className={`w-3.5 h-3.5 mr-2 ${pathname === '/projects' || (pathname?.startsWith('/projects/') && !pathname?.startsWith('/tours')) ? 'text-blue-500' : 'text-slate-400'}`} />
                  Projects
                </Link>
                <Link
                  href="/tours"
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    isToursActive
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className={`w-3.5 h-3.5 mr-2 ${isToursActive ? 'text-blue-500' : 'text-slate-400'}`} />
                  Tours
                </Link>
                <Link
                  href="/tour-calendar"
                  className={`flex items-center py-1.5 pl-10 pr-3 rounded-lg text-xs font-medium transition-colors mt-0.5 ${
                    pathname?.startsWith('/tour-calendar')
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Map className={`w-3.5 h-3.5 mr-2 ${pathname?.startsWith('/tour-calendar') ? 'text-blue-500' : 'text-slate-400'}`} />
                  Tour Calendar
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Master Data */}
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link 
              key={item.name} 
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center py-2 rounded-lg font-medium text-sm transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isCollapsed ? 'mr-0' : 'mr-2.5'} ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-slate-200 shrink-0 overflow-x-hidden ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <Link
          href="/audit-logs"
          title={isCollapsed ? 'Audit Logs' : undefined}
          className={`flex items-center py-2 rounded-lg font-medium text-sm transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
            pathname?.startsWith('/audit-logs')
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History className={`w-4 h-4 ${isCollapsed ? 'mr-0' : 'mr-2.5'} ${pathname?.startsWith('/audit-logs') ? 'text-blue-600' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Audit Logs</span>}
        </Link>

        <Link
          href="/settings"
          title={isCollapsed ? 'User Accounts' : undefined}
          className={`flex items-center py-2 rounded-lg font-medium text-sm transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
            pathname?.startsWith('/settings')
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className={`w-4 h-4 ${isCollapsed ? 'mr-0' : 'mr-2.5'} ${pathname?.startsWith('/settings') ? 'text-blue-600' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">User Accounts</span>}
        </Link>

        {/* Logged in User Profile & Logout */}
        {user && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
            {!isCollapsed ? (
              <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1.5">
                      <span>{user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                        user.role === 'Administrator' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'TourAdmin' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role || 'User'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1 shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                title={`Logged in as ${user.name}. Click to Log out`}
                className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

