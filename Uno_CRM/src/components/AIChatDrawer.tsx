"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  ArrowRight, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  BarChart3,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { getApiUrl } from '@/lib/apiConfig';

const API = getApiUrl();

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  links?: { label: string; path: string }[];
  pills?: string[];
}

export default function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Projects' | 'Tours' | 'Metadata' | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 **Hello! I am your UNO_ERP AI Copilot.**\n\nI can answer **how-to process questions**, guide you through ERP features, query live AppDB tour & master data, or explain Governance Rules (e.g. Rule 4: Separate Money Flows).",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pills: [
        "How to add a user?",
        "What is Rule 4?",
        "Summarize active tours",
        "How to configure role access?"
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend.trim(),
          role: currentUser?.role || 'Administrator'
        })
      });

      if (!res.ok) throw new Error('AI Assistant service error');
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer || 'I have processed your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: data.recommendedLinks,
        pills: data.suggestedPills
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I encountered an issue connecting to the AI Knowledge service. Please ensure `Uno_API` is running.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl shadow-xl shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 group font-bold text-sm"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span>AI Copilot ✨</span>
        </button>
      )}

      {/* Slide-over Chat Drawer */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            isExpanded ? 'w-[640px] h-[720px]' : 'w-[400px] h-[580px]'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between border-b border-purple-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  UNO_ERP AI Copilot
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-mono">LIVE</span>
                </div>
                <div className="text-[11px] text-purple-200/70">Process Flows • AppDB • Rules 1-5</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                title={isExpanded ? "Collapse view" : "Expand view"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-sm">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white font-medium rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.links.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.path}
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          {link.label || (link as any).Label} <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Suggestion Pills */}
                  {msg.pills && msg.pills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {msg.pills.map((pill, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(pill)}
                          className="px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-200 rounded-lg text-[11px] font-semibold transition-all hover:scale-[1.02]"
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 px-1">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Searching ERP Knowledge Base & AppDB...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Category Selector Toolbar */}
          <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex flex-col gap-1.5 text-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Category:</div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory(selectedCategory === 'Projects' ? null : 'Projects')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
                  selectedCategory === 'Projects' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                }`}
              >
                📁 Projects
              </button>

              <button
                onClick={() => setSelectedCategory(selectedCategory === 'Tours' ? null : 'Tours')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
                  selectedCategory === 'Tours' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                }`}
              >
                🚌 Tours
              </button>

              <button
                onClick={() => setSelectedCategory(selectedCategory === 'Metadata' ? null : 'Metadata')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
                  selectedCategory === 'Metadata' 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                }`}
              >
                ⚙️ Master Data / Metadata
              </button>
            </div>

            {/* Sub-Topic Selection Pills for Selected Category */}
            {selectedCategory === 'Tours' && (
              <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-semibold text-purple-700">Tours Sub-topics:</span>
                {[
                  { label: 'Services', query: 'How to manage tour services, base services and excursion lines?' },
                  { label: 'Hotels', query: 'How to set up hotel pricing basis (Pax vs Room) and calculate nightly rates?' },
                  { label: 'Guide', query: 'How to assign guides and calculate the strict 10% guide commission on excursion sales?' },
                  { label: 'Tax', query: 'How is City Tax and VAT applied to tours?' },
                  { label: 'Discount', query: 'How to apply agency discounts on gross tour fees?' },
                  { label: 'Financial Logic', query: 'Explain revenue vs base vs operational expenses vs net tour margin calculations.' },
                  { label: 'Excel Import', query: 'How can I import sales excel file and rooming lists?' },
                  { label: 'Rooming List', query: 'How to import passenger rooming lists, booking codes and pax types?' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(item.query)}
                    className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap hover:scale-105"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {selectedCategory === 'Projects' && (
              <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-semibold text-blue-700">Projects Sub-topics:</span>
                {[
                  { label: 'Overview & Purpose', query: 'Why are Projects needed in UNO ERP and what are the most important fields?' },
                  { label: 'Creating Projects', query: 'How to create a project manually or via Rooming List import?' },
                  { label: 'Project Statuses', query: 'How to manage project status and track linked tours?' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(item.query)}
                    className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap hover:scale-105"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {selectedCategory === 'Metadata' && (
              <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-semibold text-emerald-700">Master Data Sub-topics:</span>
                {[
                  { label: 'Hotels Master', query: 'How to manage Hotels master data, star ratings and pricing basis?' },
                  { label: 'Guides Master', query: 'How to manage Guides master data, languages and daily fee rates?' },
                  { label: 'Transport & Drivers', query: 'How to set up Transport companies and Drivers in master data?' },
                  { label: 'Excursions Master', query: 'How to create Excursions in master data with ticket costs and retail selling prices?' },
                  { label: 'Tour Status Checkpoints', query: 'What are the mandatory status checkpoints before moving to Confirmed or Completed?' },
                  { label: 'Role Permissions', query: 'What are the role permissions for Administrator, TourAdmin and Guides?' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(item.query)}
                    className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap hover:scale-105"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <form 
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input 
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask any how-to question or ERP data query..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
