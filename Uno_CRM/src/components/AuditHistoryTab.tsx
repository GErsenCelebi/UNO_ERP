"use client";

import React, { useEffect, useState } from 'react';
import { History, User, Clock, Shield, Tag, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuditLogRecord {
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

interface AuditHistoryTabProps {
  entityName: string;
  entityId?: string | number;
}

import { getApiUrl } from '@/lib/apiConfig';

export default function AuditHistoryTab({ entityName, entityId }: AuditHistoryTabProps) {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditLogs() {
      setLoading(true);
      try {
        let url = `${getApiUrl()}/auditlogs?entityName=${encodeURIComponent(entityName)}`;
        if (entityId) {
          url += `&entityId=${encodeURIComponent(String(entityId))}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAuditLogs();
  }, [entityName, entityId]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-400 font-medium">Loading Audit History...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-900/40 border border-slate-800 rounded-xl">
        <History className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <h4 className="text-slate-300 font-semibold text-base">No Audit History Recorded</h4>
        <p className="text-slate-500 text-xs mt-1">Changes to this {entityName} will be automatically tracked here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          Audit & Modification Log ({logs.length})
        </h3>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
          Auto-Tracked Activity
        </span>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-6">
        {logs.map((log) => {
          const isCreate = log.action.toUpperCase() === 'CREATE';
          const isUpdate = log.action.toUpperCase() === 'UPDATE';
          const isDelete = log.action.toUpperCase() === 'DELETE';

          return (
            <div key={log.id} className="relative group">
              {/* Timeline Dot */}
              <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                isCreate ? 'bg-emerald-500' : isUpdate ? 'bg-amber-500' : 'bg-rose-500'
              }`} />

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition hover:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCreate ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isUpdate ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{log.entityName} #{log.entityId}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
                      {log.summary}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* User Footer Badge */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {log.userName ? log.userName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="font-medium text-slate-300">{log.userName || log.userEmail || 'System User'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({log.userEmail})</span>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/60">
                    {log.userRole || 'User'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
