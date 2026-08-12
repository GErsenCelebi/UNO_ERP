import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";

interface ProjectGanttChartProps {
  projects: any[];
  onDoubleClick: (id: number) => void;
  startDateFilter?: string;
  endDateFilter?: string;
  panOffsetMonths?: number;
}

const professionalColors = [
  '#0284c7', // Sky Blue
  '#0d9488', // Teal
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#0891b2', // Cyan
  '#475569', // Slate
  '#6366f1', // Violet-blue
];

export default function ProjectGanttChart({ projects, onDoubleClick, startDateFilter, endDateFilter, panOffsetMonths = 0 }: ProjectGanttChartProps) {
  
  if (!projects || projects.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">No projects to display.</div>;
  }

  // Sort by Estimated Budget Descending (Highest on top).
  const sortedProjects = [...projects].sort((a, b) => (b.approxBudget || 0) - (a.approxBudget || 0));

  const chartData = sortedProjects.map((p, i) => {
    return {
      id: p.id,
      name: p.projectCode || `Project ${p.id}`,
      dateRange: [new Date(p.startDate).getTime(), new Date(p.endDate).getTime()],
      budget: p.approxBudget,
      color: professionalColors[p.id % professionalColors.length]
    };
  });

  // Calculate Base Domain
  let minDate = Math.min(...chartData.map(d => d.dateRange[0]));
  let maxDate = Math.max(...chartData.map(d => d.dateRange[1]));

  if (startDateFilter) {
    minDate = new Date(startDateFilter).getTime();
    if (endDateFilter) {
      maxDate = new Date(endDateFilter).getTime();
    } else {
      // 1 year later
      const d = new Date(startDateFilter);
      d.setFullYear(d.getFullYear() + 1);
      maxDate = d.getTime();
    }
  }

  // Apply Panning
  if (panOffsetMonths !== 0) {
    const offsetMs = panOffsetMonths * 30.44 * 24 * 60 * 60 * 1000;
    minDate += offsetMs;
    maxDate += offsetMs;
  }

  const dateFormatter = (tickItem: number) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-300 shadow-lg rounded-sm min-w-[200px]">
          <p className="font-semibold text-slate-800 text-sm mb-1">{data.name}</p>
          <div className="text-xs text-slate-600 grid grid-cols-2 gap-x-2 gap-y-1">
            <span className="text-slate-400">Start:</span>
            <span>{new Date(data.dateRange[0]).toLocaleDateString()}</span>
            <span className="text-slate-400">Finish:</span>
            <span>{new Date(data.dateRange[1]).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-700">
              Budget: €{(data.budget || 0).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const minChartHeight = Math.max(400, chartData.length * 40 + 60);

  return (
    <div style={{ width: '100%', height: `${minChartHeight}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 80, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
          
          <XAxis 
            type="number" 
            domain={[minDate, maxDate]} 
            tickFormatter={dateFormatter}
            tick={{ fontSize: 11, fill: '#64748b' }}
            orientation="top"
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <XAxis 
            xAxisId="bottom"
            type="number" 
            domain={[minDate, maxDate]} 
            tickFormatter={dateFormatter}
            tick={{ fontSize: 11, fill: '#64748b' }}
            orientation="bottom"
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />

          <YAxis 
            dataKey="name" 
            type="category" 
            width={120}
            tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 500 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} />
          
          <Bar 
            dataKey="dateRange" 
            radius={[2, 2, 2, 2]} 
            maxBarSize={20}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="#0f172a"
                strokeOpacity={0.1}
                strokeWidth={1}
                cursor="pointer"
                className="hover:brightness-110 transition-all"
                onDoubleClick={() => onDoubleClick(entry.id)}
              />
            ))}
            <LabelList 
              dataKey="budget" 
              position="right" 
              fill="#64748b" 
              formatter={(val: any) => `€${Number(val || 0).toLocaleString()}`}
              style={{ fontSize: '11px', fontWeight: '500' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
