import React from "react";
import { Briefcase, MapPin, DollarSign, Activity } from "lucide-react";

export default function KPICards({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      
      {/* KPI 1: Tour Actuals */}
      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-blue-50 text-blue-600 rounded w-max">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Tours</p>
          </div>
          <h3 className="text-sm font-bold text-slate-800 leading-none mt-0.5">
            {data.tourActuals.preConfirmed + data.tourActuals.activeDone}
          </h3>
        </div>
        <div className="text-[9px] pt-2 border-t border-slate-100 flex flex-col gap-1">
          <div className="flex justify-between text-slate-600">
            <span>Pre:</span>
            <span className="font-medium">{data.tourActuals.preConfirmed}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Done:</span>
            <span className="font-medium text-emerald-600">{data.tourActuals.activeDone}</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Project Actuals */}
      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-indigo-50 text-indigo-600 rounded w-max">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Projects</p>
          </div>
          <h3 className="text-sm font-bold text-slate-800 leading-none mt-0.5">
            {data.projectActuals.activeCompleted + data.projectActuals.rest}
          </h3>
        </div>
        <div className="text-[9px] pt-2 border-t border-slate-100 flex flex-col gap-1">
          <div className="flex justify-between text-slate-600">
            <span>Active:</span>
            <span className="font-medium text-emerald-600">{data.projectActuals.activeCompleted}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Hold:</span>
            <span className="font-medium">{data.projectActuals.rest}</span>
          </div>
        </div>
      </div>

      {/* KPI 3: Project Volume */}
      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-purple-50 text-purple-600 rounded w-max">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Volume</p>
          </div>
          <h3 className="text-sm font-bold text-slate-800 leading-none mt-0.5 truncate" title={`€${data.projectVolume.estimatedBudget.toLocaleString()}`}>
            €{(data.projectVolume.estimatedBudget / 1000).toFixed(0)}k
          </h3>
        </div>
        <div className="text-[9px] pt-2 border-t border-slate-100 flex flex-col gap-1">
          <div className="flex justify-between text-slate-600">
            <span>Rev:</span>
            <span className="font-medium text-emerald-600">€{(data.projectVolume.revenue / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Exp:</span>
            <span className="font-medium text-red-500">€{(data.projectVolume.expense / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>

      {/* KPI 4: Tour Breakdown Overview */}
      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-amber-50 text-amber-600 rounded w-max">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Breakdown</p>
          </div>
        </div>
        <div className="text-[9px] pt-1 border-t border-slate-100 flex flex-col gap-1.5 overflow-auto max-h-32">
          {data.tourBreakdowns.map((tb: any) => (
            <div key={tb.statusId} className="flex flex-col border-b border-slate-50 pb-1">
              <span className="font-semibold text-slate-700">St. {tb.statusId} ({tb.count}):</span>
              <div className="flex justify-between mt-0.5">
                <span className="text-emerald-600 font-medium">R: €{(tb.revenue / 1000).toFixed(1)}k</span>
                <span className="text-red-500 font-medium">E: €{(tb.expense / 1000).toFixed(1)}k</span>
              </div>
            </div>
          ))}
          {data.tourBreakdowns.length === 0 && <p className="text-slate-400 italic">No data.</p>}
        </div>
      </div>

    </div>
  );
}
