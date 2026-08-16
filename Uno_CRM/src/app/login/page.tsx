"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, User, Globe, Calendar, Layers, Database } from 'lucide-react';
import { authenticateUser, authenticateUserAsync, getCurrentUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (getCurrentUser()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authenticateUserAsync(email, password);
      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'Authentication failed');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleQuickLogin = (uEmail: string, uPass: string) => {
    setEmail(uEmail);
    setPassword(uPass);
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = authenticateUser(uEmail, uPass);
      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'Authentication failed');
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Dynamic Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
            <img src="/logo.png" alt="UNO ERP" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
              UNO ERP
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              DMC & Group Tours
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1 text-blue-400" /> Central Europe Operations</span>
          <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Enterprise Secure</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Hero Showcase */}
        <div className="flex-1 max-w-2xl text-left space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Gen Group Tour Operations Management</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-100">
            Destination Management <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Simplified & Automated
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 leading-relaxed font-normal max-w-xl">
            Streamline your DMC tour projects, hotel rooming allocations, licensed guide schedules, fleet logistics, master data management, and financial projections in one centralized platform.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-slate-700 transition-all">
              <div className="flex items-center text-blue-400 font-semibold text-xs">
                <Layers className="w-4 h-4 mr-1.5" /> Project Management
              </div>
              <p className="text-xs text-slate-400">Track multi-destination group itineraries, client proposals, and revenues.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-slate-700 transition-all">
              <div className="flex items-center text-indigo-400 font-semibold text-xs">
                <Calendar className="w-4 h-4 mr-1.5" /> Tour Calendar
              </div>
              <p className="text-xs text-slate-400">Interactive timeline with real-time guide double-booking conflict detection.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-slate-700 transition-all">
              <div className="flex items-center text-emerald-400 font-semibold text-xs">
                <Database className="w-4 h-4 mr-1.5" /> Master Data Catalog
              </div>
              <p className="text-xs text-slate-400">Centralized database for Hotels, Guides, Drivers, Transport & Excursions.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1.5 hover:border-slate-700 transition-all">
              <div className="flex items-center text-amber-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Automated Calculations
              </div>
              <p className="text-xs text-slate-400">Instant pax pricing, room rate multipliers, city taxes, and profit margins.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Modern Glassmorphism Login Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-blue-950/50 backdrop-blur-xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Sign In to UNO ERP</h2>
              <p className="text-xs text-slate-400">Enter your credentials to access your organization's portal</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center space-x-2 animate-shake">
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Username / Email
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="evren@uno-dmc.cz"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <Key className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} UNO ERP System. All rights reserved. Central Europe DMC.
        </div>
        <div className="flex items-center space-x-6 text-slate-400">
          <span>Prague • Vienna • Budapest</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">System Online v3.5</span>
        </div>
      </footer>
    </div>
  );
}
