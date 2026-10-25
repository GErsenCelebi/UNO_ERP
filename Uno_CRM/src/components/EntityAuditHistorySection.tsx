"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { History, User, Clock, ChevronDown, ChevronUp, RefreshCw, Shield, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { getApiUrl } from '@/lib/apiConfig';

export interface AuditLogRecord {
  id: number;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  entityName: string;
  entityId: string;
  summary: string;
  oldValuesJson?: string;
  newValuesJson?: string;
  timestamp: string;
}

interface EntityAuditHistorySectionProps {
  entityName: string; // e.g. "Project", "Tour", or "Hotel,Guide,Driver,TransportCompany,Excursion,Vendor,ServiceCategory"
  entityId?: string | number;
  title?: string;
  subtitle?: string;
  defaultExpanded?: boolean;
}

export default function EntityAuditHistorySection({
  entityName,
  entityId,
  title,
  subtitle,
  defaultExpanded = false,
}: EntityAuditHistorySectionProps) {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedLogIds, setExpandedLogIds] = useState<Record<number, boolean>>({});

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${getApiUrl()}/auditlogs?entityName=${encodeURIComponent(entityName)}`;
      if (entityId !== undefined && entityId !== null && entityId !== '') {
        url += `&entityId=${encodeURIComponent(String(entityId))}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [entityName, entityId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleDetails = (id: number) => {
    setExpandedLogIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getActionBadge = (action: string) => {
    const act = (action || '').toUpperCase();
    if (act === 'CREATE') {
      return (
        <span className="px-1 py-0 text-[8px] font-bold uppercase rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          Create
        </span>
      );
    }
    if (act === 'UPDATE') {
      return (
        <span className="px-1 py-0 text-[8px] font-bold uppercase rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0">
          Update
        </span>
      );
    }
    if (act === 'DELETE') {
      return (
        <span className="px-1 py-0 text-[8px] font-bold uppercase rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shrink-0">
          Delete
        </span>
      );
    }
    return (
      <span className="px-1 py-0 text-[8px] font-bold uppercase rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
        {action}
      </span>
    );
  };

  return (
    <div className="w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs overflow-hidden">
      {/* Section Header */}
      <div className="px-2.5 py-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800 shrink-0">
            <History className="w-2.5 h-2.5" />
          </div>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <div className="flex items-center gap-1">
              <h3 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-none">
                {title || 'Audit & Change History'}
              </h3>
              <span className="px-1 py-0 text-[8px] font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {logs.length}
              </span>
            </div>
            <p className="text-[9px] text-slate-400 dark:text-slate-400 leading-none">
              {subtitle || 'Full audit trail of created, updated, and deleted records'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={fetchLogs}
            disabled={loading}
            title="Refresh history"
            className="p-0.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors border border-transparent hover:border-blue-100 dark:hover:border-slate-700 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${loading ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-0.5 px-1.5 py-0 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded border border-slate-200/80 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-2.5 h-2.5 text-slate-400" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                <span>Expand ({logs.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-2 py-1">
          {loading && logs.length === 0 ? (
            <div className="py-2 text-center">
              <div className="inline-block w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">Loading change logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-2 text-center bg-slate-50/50 dark:bg-slate-800/40 rounded border border-dashed border-slate-200 dark:border-slate-700">
              <History className="w-3.5 h-3.5 mx-auto text-slate-400 mb-0.5 opacity-60" />
              <h4 className="text-slate-700 dark:text-slate-200 font-semibold text-[10px]">No Audit History Recorded</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[9px] mt-0.5 max-w-sm mx-auto">
                Actions and modifications made to this record will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="relative border-l border-slate-200 dark:border-slate-700 ml-1 pl-2.5 space-y-0.5">
              {logs.map((log) => {
                const isCreate = (log.action || '').toUpperCase() === 'CREATE';
                const isUpdate = (log.action || '').toUpperCase() === 'UPDATE';
                const hasDiff = !!(log.newValuesJson || log.oldValuesJson);
                const isDetailsOpen = expandedLogIds[log.id];

                return (
                  <div key={log.id} className="relative group">
                    {/* Dot on Timeline */}
                    <div
                      className={`absolute -left-[14px] top-1.5 w-1.5 h-1.5 rounded-full border border-white dark:border-slate-900 shadow-2xs ${
                        isCreate ? 'bg-emerald-500' : isUpdate ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />

                    {/* Compact Log Row */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 rounded px-2 py-0.5 transition-colors">
                      <div className="flex items-center justify-between gap-1.5">
                        {/* Left: Action + Entity + Summary */}
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          {getActionBadge(log.action)}
                          <span className="px-1 py-0 text-[8px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                            {log.entityName}
                          </span>
                          {log.entityId && (
                            <span className="text-[8px] font-mono text-slate-400 shrink-0">
                              #{log.entityId}
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-slate-800 dark:text-slate-200 truncate" title={log.summary || `${log.action} ${log.entityName}`}>
                            {log.summary || `${log.action} ${log.entityName}`}
                          </span>
                          {hasDiff && (
                            <button
                              type="button"
                              onClick={() => toggleDetails(log.id)}
                              className="inline-flex items-center gap-0.5 text-[9px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 shrink-0 ml-0.5 hover:underline cursor-pointer"
                            >
                              <FileText className="w-2 h-2" />
                              <span>{isDetailsOpen ? 'Hide' : 'Diff'}</span>
                            </button>
                          )}
                        </div>

                        {/* Right: User + Time in one horizontal line */}
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {log.userName || log.userEmail || 'System'}
                          </span>
                          {log.userRole && (
                            <span className="text-[8px] px-1 py-0 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              {log.userRole}
                            </span>
                          )}
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-slate-400 dark:text-slate-400 inline-flex items-center gap-0.5">
                            <Clock className="w-2 h-2" />
                            {formatDateTime(log.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Field Changes */}
                      {hasDiff && isDetailsOpen && (
                        <div className="mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[9px]">
                          {log.oldValuesJson && (
                            <div className="bg-rose-50/50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 rounded p-1">
                              <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5 text-[8px] uppercase tracking-wide">
                                Previous Values
                              </span>
                              <pre className="text-slate-700 dark:text-slate-300 overflow-x-auto text-[9px] font-mono whitespace-pre-wrap">
                                {JSON.stringify(JSON.parse(log.oldValuesJson), null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.newValuesJson && (
                            <div className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded p-1">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5 text-[8px] uppercase tracking-wide">
                                New Values
                              </span>
                              <pre className="text-slate-700 dark:text-slate-300 overflow-x-auto text-[9px] font-mono whitespace-pre-wrap">
                                {JSON.stringify(JSON.parse(log.newValuesJson), null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
