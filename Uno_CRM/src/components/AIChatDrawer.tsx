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
  Minimize2,
  Paperclip,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  UploadCloud,
  Check,
  RefreshCw,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Database,
  Hotel
} from 'lucide-react';

import { getApiUrl } from '@/lib/apiConfig';

const API = getApiUrl();

export interface GroundedDatapoint {
  field: string;
  value: string;
  entity?: string;
  source: string;
  verified: boolean;
  confidence: number;
}

export interface ConfidenceReport {
  score: number;
  level: string;
  groundingType: string;
  verificationSummary?: string;
  datapoints: GroundedDatapoint[];
}

export interface ExcelInconsistency {
  id: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  suggestedFix: string;
  fixAction: string;
  fixValue: string;
  isResolved: boolean;
}

export interface ExcelInspectionResult {
  fileName: string;
  normalizedFileName: string;
  fileSize: string;
  isMetadataFile: boolean;
  detectedTourCode?: string;
  screenTourCode?: string;
  screenProjectCode?: string;
  matchedTourCode?: string;
  matchedProjectCode?: string;
  matchedTourId?: number;
  matchedProjectId?: number;
  hasIncompleteHotelBookings?: boolean;
  hotelBookingsCount?: number;
  hotelBookingPrompt?: string;
  requiresTourConfirmation: boolean;
  confirmationMessage?: string;
  paxDetected: number;
  paxDeclared: number;
  sheets: string[];
  inconsistencies: ExcelInconsistency[];
  canCommit: boolean;
  isCommitted?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  links?: { label: string; path: string }[];
  pills?: string[];
  sourceDocument?: string;
  category?: string;
  fileCard?: {
    name: string;
    size: string;
  };
  excelInspection?: ExcelInspectionResult;
  confidence?: ConfidenceReport;
}

function renderInlineContent(text: string): React.ReactNode[] {
  // Strip repeated asterisks (***, ****, *****, etc.)
  const cleaned = text.replace(/\*{3,}/g, '');
  const tokens: React.ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(cleaned.substring(lastIndex, match.index).replace(/\*/g, ''));
    }

    if (match[2] && match[3]) {
      const label = match[2];
      const url = match[3];
      tokens.push(
        <a 
          key={match.index} 
          href={url} 
          className="text-purple-600 hover:text-purple-800 underline font-semibold transition-colors"
        >
          {label}
        </a>
      );
    } else if (match[4]) {
      tokens.push(
        <code key={match.index} className="px-1.5 py-0.5 bg-slate-100 text-purple-700 rounded font-mono text-[11px] border border-slate-200">
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      tokens.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {match[5]}
        </strong>
      );
    } else if (match[6]) {
      tokens.push(
        <em key={match.index} className="italic text-slate-700">
          {match[6]}
        </em>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < cleaned.length) {
    tokens.push(cleaned.substring(lastIndex).replace(/\*/g, ''));
  }

  return tokens;
}

function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <div className="whitespace-pre-wrap">{text.replace(/\*{2,}/g, '')}</div>;
  }

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      elements.push(<div key={key++} className="h-1.5" />);
      continue;
    }

    // Horizontal divider: ━━━━━━━━, ---, ***
    if (/^[━─\-_*]{3,}$/.test(trimmed)) {
      elements.push(<hr key={key++} className="my-2 border-slate-200" />);
      continue;
    }

    // Markdown Headers: #, ##, ###, ####
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = headerMatch[2].replace(/\*/g, '');
      const headerClass = level <= 2 
        ? "font-bold text-slate-900 text-xs mt-2 mb-1 pb-0.5 border-b border-slate-100" 
        : "font-bold text-slate-900 text-xs mt-1.5 mb-0.5";
      elements.push(
        <div key={key++} className={headerClass}>
          {renderInlineContent(headerText)}
        </div>
      );
      continue;
    }

    // Bullet points: •, -, *, +
    const bulletMatch = trimmed.match(/^([•\-\*\+])\s+(.+)$/);
    if (bulletMatch) {
      const bulletContent = bulletMatch[2];
      elements.push(
        <div key={key++} className="flex items-start gap-1.5 my-0.5 pl-0.5">
          <span className="text-purple-600 font-bold shrink-0 mt-0.5 text-xs leading-none">•</span>
          <div className="flex-1 text-slate-700 leading-relaxed">
            {renderInlineContent(bulletContent)}
          </div>
        </div>
      );
      continue;
    }

    // Numbered list: 1. , 2. , etc.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const numContent = numberedMatch[2];
      elements.push(
        <div key={key++} className="flex items-start gap-1.5 my-0.5 pl-0.5">
          <span className="text-purple-700 font-bold shrink-0 text-[11px] min-w-[14px]">{num}.</span>
          <div className="flex-1 text-slate-700 leading-relaxed">
            {renderInlineContent(numContent)}
          </div>
        </div>
      );
      continue;
    }

    // Normal paragraph line
    elements.push(
      <p key={key++} className="text-slate-800 leading-relaxed my-0.5">
        {renderInlineContent(trimmed)}
      </p>
    );
  }

  return <div className="space-y-0.5 text-xs leading-relaxed">{elements}</div>;
}

export default function AIChatDrawer() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Projects' | 'Tours' | 'Metadata' | null>(null);
  const [expandedConfidence, setExpandedConfidence] = useState<Record<string, boolean>>({});

  const toggleConfidenceInspector = (msgId: string) => {
    setExpandedConfidence(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 **Hello! I am your Uno Smart Assistant.**\n\nI can help you navigate UNO ERP features, check live Tour and Project statistics, guide you through Excel imports, and answer step-by-step operational how-to questions.",
      timestamp: '10:00',
      pills: [
        "How to advance from Draft to Confirmed?",
        "How to import Excel rooming list?",
        "Summarize active tours",
        "How is hotel cost calculated?"
      ]
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          role: currentUser?.role || 'Administrator',
          category: selectedCategory || undefined,
          contextUrl: typeof window !== 'undefined' ? window.location.pathname : undefined
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
        pills: data.suggestedPills,
        sourceDocument: data.sourceDocument,
        category: data.category,
        confidence: data.confidence
      };

      setMessages(prev => [...prev, aiMsg]);

      // Notify host page (e.g. Tour/Booking table) to refresh data if rooming, tours, or services were updated
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('uno-erp-data-updated', { detail: { category: data.category } }));
      }
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [committingId, setCommittingId] = useState<string | null>(null);

  // Process uploaded Excel file
  const processUploadedFile = async (file: File) => {
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.xlsx', '.xls', '.csv'].includes(ext)) {
      alert('Please upload an Excel workbook (.xlsx, .xls) or .csv manifest.');
      return;
    }

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: `Uploaded Excel file for review: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileCard: {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      }
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (typeof window !== 'undefined') {
        formData.append('contextUrl', window.location.pathname);
      }

      const res = await fetch(`${API}/ai/inspect-excel`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to inspect Excel file');
      }

      const inspection: ExcelInspectionResult = await res.json();
      const aiMsgId = (Date.now() + 1).toString();

      // Store file for commit
      setUploadedFiles(prev => ({ ...prev, [aiMsgId]: file }));

      let msgText = '';
      if (inspection.isMetadataFile) {
        msgText = `🔍 **Master Data Workbook Inspected**: Detected sheets: ${inspection.sheets.join(', ')}. Ready to commit to master records.`;
      } else if (inspection.hasIncompleteHotelBookings) {
        msgText = `🔍 **Manifesto İncelendi**: ${inspection.paxDetected} yolcu satırı tespit edildi.\n\n⚠️ **Otel Rezervasyonları Henüz Tamamlanmamış**: Tur **${inspection.matchedTourCode}** için sistemde henüz otel hizmet girişi veya sözleşmeli oda kaydı bulunmuyor (0 Sözleşmeli Oda).\n\nYolcuları otel sözleşmesine göre (Double, Twin, Single, İlave Yatak) birebir doğru eşleştirebilmemiz için, **önce otel rezervasyonlarını tamamlamak ister misiniz?**\n\n• [🏨 Otel Rezervasyonlarını Tamamla](/projects/${inspection.matchedProjectId || '1'}/tours/${inspection.matchedTourId || '1'})\n• Veya aşağıdaki **'Veritabanına Aktar ve Eşleştir'** butonuna tıklayarak standart akıllı oda eşleştirmesi ile devam edebilirsiniz.`;
      } else {
        msgText = `🔍 **Manifest Inspection Complete**: Found ${inspection.paxDetected} passenger rows across sheets: ${inspection.sheets.join(', ')}. ${
          inspection.inconsistencies.length > 0 
            ? `Detected **${inspection.inconsistencies.length} items requiring review** before database commit.` 
            : 'All validations passed cleanly! Ready to commit.'
        }`;
      }

      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: msgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        excelInspection: inspection
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Inspect Excel error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `❌ **Inspection Error**: Could not process the uploaded file. Please check the file format and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
  };

  // Reconcile/Confirm target Tour (User feedback rule)
  const confirmTourForInspection = (msgId: string, tourCode: string, projectCode?: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId || !m.excelInspection) return m;

      const updated = { ...m.excelInspection };
      updated.matchedTourCode = tourCode;
      if (projectCode) updated.matchedProjectCode = projectCode;
      updated.requiresTourConfirmation = false;
      const ext = updated.fileName.substring(updated.fileName.lastIndexOf('.'));
      updated.normalizedFileName = `${updated.matchedProjectCode || 'PRJ'}_${tourCode}_rooming${ext}`;
      
      // Mark tour discrepancy inconsistency as resolved
      updated.inconsistencies = updated.inconsistencies.map(inc => {
        if (inc.category === 'TourDiscrepancy') {
          return { ...inc, isResolved: true };
        }
        return inc;
      });

      return {
        ...m,
        excelInspection: updated
      };
    }));
  };

  // 1-Click Apply Fix for Inconsistency
  const applyFix = (msgId: string, incId: string, fixAction: string, fixValue: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId || !m.excelInspection) return m;

      const updated = { ...m.excelInspection };
      updated.inconsistencies = updated.inconsistencies.map(inc => {
        if (inc.id === incId) {
          return { ...inc, isResolved: true };
        }
        return inc;
      });

      if (fixAction === 'navigate_services') {
        window.location.href = fixValue;
        return m;
      }

      if (fixAction === 'adjust_pax') {
        const val = parseInt(fixValue);
        if (!isNaN(val)) updated.paxDeclared = val;
      } else if (fixAction === 'set_tour') {
        updated.matchedTourCode = fixValue;
        updated.requiresTourConfirmation = false;
        const ext = updated.fileName.substring(updated.fileName.lastIndexOf('.'));
        updated.normalizedFileName = `${updated.matchedProjectCode || 'PRJ'}_${fixValue}_rooming${ext}`;
      }

      return {
        ...m,
        excelInspection: updated
      };
    }));
  };

  // 1-Click Commit to Database
  const handleCommitImport = async (msgId: string, inspection: ExcelInspectionResult) => {
    const file = uploadedFiles[msgId];
    if (!file) {
      alert('Uploaded file reference not found. Please re-upload the workbook.');
      return;
    }

    setCommittingId(msgId);
    try {
      const formData = new FormData();
      if (inspection.isMetadataFile) {
        formData.append('masterdataFile', file);
      } else {
        formData.append('roomingFile', file);
      }
      if (inspection.matchedTourCode) {
        formData.append('targetTourCode', inspection.matchedTourCode);
      }
      if (inspection.matchedProjectCode) {
        formData.append('targetProjectCode', inspection.matchedProjectCode);
      }

      const res = await fetch(`${API}/tourimport/import`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || `HTTP ${res.status}`);
      }

      // Mark as committed in state
      setMessages(prev => prev.map(m => {
        if (m.id !== msgId || !m.excelInspection) return m;
        return {
          ...m,
          excelInspection: {
            ...m.excelInspection,
            isCommitted: true
          }
        };
      }));

      // Append Success message
      const successMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        text: `🎉 **Excel Import Committed Successfully**!\n\n• **File**: \`${inspection.normalizedFileName}\`\n• **Target Tour**: **${inspection.matchedTourCode}**\n• **Passenger Count**: **${inspection.paxDetected} Pax**\n• Manifest records and hotel allocations have been committed to the database.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: [
          { label: 'View Tour Manifest', path: '/tours' },
          { label: 'Executive KPI Cockpit', path: '/dashboard/executive' }
        ]
      };

      setMessages(prev => [...prev, successMsg]);
    } catch (err: any) {
      console.error('Commit import error:', err);
      alert('Import could not be completed. Please check your data and try again.');
    } finally {
      setCommittingId(null);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white rounded-2xl shadow-xl shadow-purple-500/30 border border-purple-400/30 transition-all hover:scale-105 active:scale-95 group font-bold text-sm"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-7 h-7 rounded-xl bg-white/20 p-1 flex items-center justify-center backdrop-blur-xs shadow-inner">
              <img src="/logo.png" alt="Uno" className="w-full h-full object-contain" />
            </div>
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300 absolute -top-1.5 -right-1.5 drop-shadow" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="tracking-wide">Uno Smart Agent ✨</span>
        </button>
      )}

      {/* Slide-over Chat Drawer */}
      {isOpen && (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processUploadedFile(file);
          }}
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5 relative ${
            isExpanded ? 'w-[680px] h-[740px]' : 'w-[420px] h-[600px]'
          }`}
        >
          {/* Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-purple-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white border-2 border-dashed border-purple-300 rounded-3xl animate-in fade-in">
              <UploadCloud className="w-12 h-12 text-purple-300 mb-2 animate-bounce" />
              <p className="text-base font-bold">Drop Excel Workbook Here</p>
              <p className="text-xs text-purple-200 mt-1">Automatic inspection, headcount cross-checking & tour association</p>
            </div>
          )}
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between border-b border-purple-900/50">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-purple-400/30 p-1.5 flex items-center justify-center shadow-inner">
                  <img src="/logo.png" alt="Uno" className="w-full h-full object-contain" />
                </div>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  Uno Smart Agent
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-mono">LIVE</span>
                  {typeof window !== 'undefined' && window.location.pathname.includes('/tours/') && (
                    <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30 font-medium">
                      Tour #{window.location.pathname.split('/tours/')[1]?.split('/')[0]}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-purple-200/70">Process Flows • How-To Guides</div>
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
                  <div className="w-8 h-8 rounded-xl bg-white border border-purple-200/80 flex items-center justify-center shrink-0 mt-1 p-1 shadow-xs">
                    <img src="/logo.png" alt="Uno" className="w-5 h-5 object-contain" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white font-medium rounded-tr-xs whitespace-pre-wrap'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    <FormattedMessage text={msg.text} isUser={msg.sender === 'user'} />
                  </div>

                  {/* LLM Grounding & Confidence Provenance Badge */}
                  {msg.sender === 'ai' && msg.confidence && (
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <div 
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                            msg.confidence.level === 'High'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : msg.confidence.level === 'Moderate'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            msg.confidence.level === 'High' ? 'bg-emerald-500 animate-pulse' :
                            msg.confidence.level === 'Moderate' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          <span>{Math.round(msg.confidence.score * 100)}% Confidence</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-normal text-[10px] text-slate-600 flex items-center gap-1">
                            <Database className="w-2.5 h-2.5 text-slate-400" />
                            {msg.confidence.groundingType}
                          </span>
                        </div>

                        {msg.confidence.datapoints && msg.confidence.datapoints.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleConfidenceInspector(msg.id)}
                            className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                            <span>{msg.confidence.datapoints.length} Datapoint{msg.confidence.datapoints.length > 1 ? 's' : ''} Tracked</span>
                            {expandedConfidence[msg.id] ? (
                              <ChevronUp className="w-3 h-3 text-purple-600" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-purple-600" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expandable Datapoints Provenance Inspector */}
                      {expandedConfidence[msg.id] && msg.confidence.datapoints && msg.confidence.datapoints.length > 0 && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 animate-in fade-in slide-in-from-top-1">
                          {msg.confidence.verificationSummary && (
                            <p className="text-[11px] text-slate-700 font-medium pb-1.5 border-b border-slate-200/80 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{msg.confidence.verificationSummary}</span>
                            </p>
                          )}
                          <div className="space-y-1">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Verified Live Datapoints & Tables
                            </div>
                            <div className="divide-y divide-slate-200/70 bg-white rounded-lg border border-slate-200 overflow-hidden">
                              {msg.confidence.datapoints.map((dp, idx) => (
                                <div key={idx} className="p-2 flex items-center justify-between text-[11px] hover:bg-slate-50 transition-colors">
                                  <div className="space-y-0.5 min-w-0 pr-2">
                                    <div className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                                      <span>{dp.field}</span>
                                      {dp.entity && (
                                        <span className="text-[10px] px-1.5 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 rounded font-mono truncate">
                                          {dp.entity}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono truncate">
                                      {dp.source}
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="font-bold text-slate-900 font-mono text-xs">{dp.value}</div>
                                    <div className="text-[9px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                                      <Check className="w-2.5 h-2.5" /> {Math.round(dp.confidence * 100)}% Live
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Uploaded File Card Badge */}
                  {msg.fileCard && (
                    <div className="flex items-center gap-2 bg-purple-700/80 p-2.5 rounded-xl border border-purple-400/40 text-white font-mono text-[11px] shadow-xs">
                      <FileSpreadsheet className="w-4 h-4 text-purple-200 shrink-0" />
                      <span className="truncate font-semibold">{msg.fileCard.name}</span>
                      <span className="text-[9px] text-purple-200 ml-auto shrink-0 bg-purple-900/80 px-1.5 py-0.5 rounded">
                        {msg.fileCard.size}
                      </span>
                    </div>
                  )}

                  {/* Interactive Excel Inconsistency Review Card */}
                  {msg.excelInspection && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3 shadow-xs text-xs">
                      {/* Stepper Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] font-bold">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>1. File Dropped</span>
                        </div>
                        <span className="text-slate-300">───</span>
                        <div className={`flex items-center gap-1.5 ${msg.excelInspection.isCommitted ? 'text-emerald-600' : 'text-purple-600'}`}>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${msg.excelInspection.isCommitted ? 'bg-emerald-600' : 'bg-purple-600'}`}>2</span>
                          <span>AI Review</span>
                        </div>
                        <span className="text-slate-300">───</span>
                        <div className={`flex items-center gap-1.5 ${msg.excelInspection.isCommitted ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${msg.excelInspection.isCommitted ? 'bg-emerald-600' : 'bg-slate-300'}`}>3</span>
                          <span>Commit</span>
                        </div>
                      </div>

                      {/* Manifest Target & Syntax Overview */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-500">Target Tour Association</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {msg.excelInspection.matchedTourCode || 'Not Set'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <strong>Standard File Syntax:</strong>{' '}
                          <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px] text-purple-700">
                            {msg.excelInspection.normalizedFileName}
                          </code>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                          <span>Pax Detected: <strong className="text-slate-800">{msg.excelInspection.paxDetected}</strong></span>
                          <span>Capacity: <strong className="text-slate-800">{msg.excelInspection.paxDeclared}</strong></span>
                          <span>Sheets: <strong className="text-slate-800">{msg.excelInspection.sheets.join(', ')}</strong></span>
                        </div>
                      </div>

                      {/* Tour Discrepancy Prompt (User Feedback Requirement) */}
                      {msg.excelInspection.requiresTourConfirmation && (
                        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-amber-900">
                                Target Tour Confirmation Required
                              </p>
                              <p className="text-[11px] text-amber-800 leading-snug">
                                {msg.excelInspection.confirmationMessage}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 pt-1">
                            {msg.excelInspection.screenTourCode && (
                              <button
                                type="button"
                                onClick={() => confirmTourForInspection(msg.id, msg.excelInspection!.screenTourCode!, msg.excelInspection!.screenProjectCode)}
                                className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Associate with Screen Tour '{msg.excelInspection.screenTourCode}'</span>
                              </button>
                            )}
                            {msg.excelInspection.detectedTourCode && msg.excelInspection.detectedTourCode !== msg.excelInspection.screenTourCode && (
                              <button
                                type="button"
                                onClick={() => confirmTourForInspection(msg.id, msg.excelInspection!.detectedTourCode!)}
                                className="px-2.5 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg transition cursor-pointer"
                              >
                                <span>Keep File Tour '{msg.excelInspection.detectedTourCode}'</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Hotel Bookings Incomplete Banner */}
                      {msg.excelInspection.hasIncompleteHotelBookings && (
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Otel Rezervasyonları Henüz Tamamlanmamış (0 Sözleşmeli Oda)</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-snug">
                            Yolcuları otel sözleşmesindeki oda tiplerine (Double, Twin, Single, İlave Yatak) göre birebir doğru eşleştirebilmek için önce otel rezervasyonlarını tamamlamak ister misiniz?
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <Link
                              href={`/projects/${msg.excelInspection.matchedProjectId || '1'}/tours/${msg.excelInspection.matchedTourId || '1'}`}
                              onClick={() => setIsOpen(false)}
                              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs flex items-center gap-1"
                            >
                              <Hotel className="w-3.5 h-3.5" /> Otel Rezervasyonlarını Tamamla
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* List of Detected Inconsistencies */}
                      {msg.excelInspection.inconsistencies.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                            <span>Detected Issues ({msg.excelInspection.inconsistencies.filter(i => !i.isResolved).length} open)</span>
                            <span className="text-[10px] text-slate-400 font-normal">Click fix to resolve</span>
                          </div>

                          {msg.excelInspection.inconsistencies.map((inc) => (
                            <div 
                              key={inc.id}
                              className={`p-2.5 rounded-xl border text-xs transition-all space-y-1.5 ${
                                inc.isResolved 
                                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-600' 
                                  : (inc.severity === 'High' 
                                      ? 'bg-rose-50/50 border-rose-200 text-slate-800' 
                                      : 'bg-amber-50/50 border-amber-200 text-slate-800')
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                  inc.isResolved 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : (inc.severity === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800')
                                }`}>
                                  {inc.category}
                                </span>
                                {inc.isResolved ? (
                                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Resolved
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400">
                                    {inc.severity} Priority
                                  </span>
                                )}
                              </div>

                              <p className="font-bold text-xs text-slate-900">{inc.title}</p>
                              <p className="text-[11px] text-slate-600 leading-snug">{inc.description}</p>

                              {!inc.isResolved && (
                                <div className="pt-1 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-500 italic">Action: {inc.suggestedFix}</span>
                                  <button
                                    type="button"
                                    onClick={() => applyFix(msg.id, inc.id, inc.fixAction, inc.fixValue)}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[10px] transition shadow-xs cursor-pointer flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" /> {inc.fixAction === 'navigate_services' ? 'Tamamla' : 'Apply Fix'}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 1-Click Commit Action */}
                      <div className="pt-1">
                        {msg.excelInspection.isCommitted ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 
                              Committed & Imported to Database!
                            </span>
                            <Link 
                              href="/tours" 
                              onClick={() => setIsOpen(false)}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                            >
                              View Manifest
                            </Link>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCommitImport(msg.id, msg.excelInspection!)}
                            disabled={committingId === msg.id}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {committingId === msg.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Committing to ERP Database...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-4 h-4" />
                                <span>Commit & Import to Database</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Source Document Citation Badge (Only for .pdf, .docx, .pptx - NEVER for .md) */}
                  {msg.sourceDocument && 
                   !msg.sourceDocument.endsWith('.md') && 
                   /\.(pdf|docx?|pptx)$/i.test(msg.sourceDocument) && (
                    <div className="pt-0.5">
                      <span className="text-[10px] text-purple-700 bg-purple-50/80 border border-purple-200/80 px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-mono">
                        📄 {msg.sourceDocument}
                      </span>
                    </div>
                  )}

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
                <div className="w-8 h-8 rounded-xl bg-white border border-purple-200/80 flex items-center justify-center shrink-0 p-1 shadow-xs">
                  <img src="/logo.png" alt="Uno" className="w-5 h-5 object-contain animate-pulse" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Searching Knowledge Base...
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
                ⚙️ Master Data
              </button>

            </div>

            {/* Sub-Topic Selection Pills for Selected Category */}
            {selectedCategory === 'Tours' && (
              <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-semibold text-purple-700">Tours Sub-topics:</span>
                {[
                  { label: 'Statuses & Gates', query: 'What are the mandatory tour status checkpoints and how to advance from Draft to Completed?' },
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
                  { label: 'Executive KPIs', query: 'What KPIs are available on the Executive Dashboard?' },
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
          <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
            <form 
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              {/* Hidden File Input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />

              {/* Paperclip Button for Excel Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                title="Upload Excel Manifest or Master Data (.xlsx, .xls, .csv)"
                className="p-2.5 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-xl transition-all cursor-pointer border border-slate-200 hover:border-purple-300 disabled:opacity-40 shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input 
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask ERP question, or upload Excel rooming list..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-40 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
              <span>Supports Excel (.xlsx, .xls) rooming lists & master data</span>
              <span>Drop file or click 📎</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
