"use client"
import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';

interface Checkpoint {
  id: number;
  checkpointKey: string;
  name: string;
  description: string;
  isMandatory: boolean;
  warningThresholdDays?: number;
  isSatisfied: boolean;
  reason: string;
}

interface EvaluationData {
  tourId: number;
  tourCode: string;
  currentStatusId: number;
  currentStatusName: string;
  targetStatusId: number;
  canAdvance: boolean;
  missingMandatoryCount: number;
  checkpoints: Checkpoint[];
}

export default function TourCheckpointWidget({ tourId, onStatusUpdated }: { tourId: number; onStatusUpdated?: () => void }) {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchCheckpoints = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tourstatuscheckpoints/evaluate/${tourId}`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckpoints();
  }, [tourId]);

  const handleAutoAdvance = async () => {
    if (!data || !data.canAdvance) return;
    try {
      setAdvancing(true);
      setMessage(null);
      const res = await fetch(`/api/tourstatuscheckpoints/advance-status/${tourId}`, { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setMessage({ text: json.message || 'Tour status successfully advanced!', type: 'success' });
        fetchCheckpoints();
        if (onStatusUpdated) onStatusUpdated();
      } else {
        setMessage({ text: json.message || 'Failed to advance status', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error advancing tour status', type: 'error' });
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-center text-xs text-slate-400 gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        Evaluating transition checkpoints...
      </div>
    );
  }

  if (!data) return null;

  const STATUS_NAMES: Record<number, string> = { 1: 'Draft', 2: 'Proposal', 3: 'Confirmed', 4: 'In Progress', 5: 'Completed' };
  const targetName = STATUS_NAMES[data.targetStatusId] || `Status #${data.targetStatusId}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {data.canAdvance ? (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Status Gate Readiness</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data.canAdvance ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'}`}>
                {data.canAdvance ? 'GATE READY' : `${data.missingMandatoryCount} BLOCKED`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Current: <strong className="text-slate-200">{data.currentStatusName}</strong> ➔ Target Gate: <strong className="text-blue-400">{targetName}</strong>
            </p>
          </div>
        </div>

        {data.currentStatusId < 5 && (
          <button
            onClick={handleAutoAdvance}
            disabled={!data.canAdvance || advancing}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              data.canAdvance
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {advancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            Advance to {targetName}
          </button>
        )}
      </div>

      {message && (
        <div className={`px-4 py-2 text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100' : 'bg-rose-50 text-rose-800 border-b border-rose-100'}`}>
          {message.text}
        </div>
      )}

      {/* Checkpoints Checklist */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.checkpoints.map(chk => (
          <div
            key={chk.id || chk.checkpointKey}
            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors ${
              chk.isSatisfied
                ? 'bg-emerald-50/50 border-emerald-200/60'
                : chk.isMandatory
                ? 'bg-rose-50/40 border-rose-200/60'
                : 'bg-amber-50/40 border-amber-200/60'
            }`}
          >
            {chk.isSatisfied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-xs font-bold truncate ${chk.isSatisfied ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {chk.name}
                </span>
                {chk.isMandatory && !chk.isSatisfied && (
                  <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">REQUIRED</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{chk.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
