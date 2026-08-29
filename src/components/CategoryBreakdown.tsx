import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { PieChart as PieIcon, BarChart2, Layers } from 'lucide-react';
import { FinancialSummary } from '../types';

interface CategoryBreakdownProps {
  summary: FinancialSummary;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Housing': '#3b82f6',
  'Food & Groceries': '#10b981',
  'Dining & Delivery': '#f59e0b',
  'Utilities & Bills': '#6366f1',
  'Transport': '#ec4899',
  'Entertainment & OTT': '#8b5cf6',
  'Shopping & Lifestyle': '#ef4444',
  'Health & Medical': '#14b8a6',
  'Education': '#06b6d4',
  'Miscellaneous': '#64748b',
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ summary }) => {
  const [chartView, setChartView] = useState<'donut' | 'bar'>('donut');
  const { categoryTotals, totalExpenses, essentialSpend, discretionarySpend, totalIncome } = summary;

  const data = Object.entries(categoryTotals)
    .filter(([cat, amt]) => cat !== 'Income' && amt > 0)
    .map(([cat, amt]) => ({
      name: cat,
      value: amt,
      percentage: totalExpenses > 0 ? ((amt / totalExpenses) * 100).toFixed(1) : '0',
      color: CATEGORY_COLORS[cat] || '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value);

  const essentialsPercent = totalIncome > 0 ? ((essentialSpend / totalIncome) * 100).toFixed(1) : '0';
  const discretionaryPercent = totalIncome > 0 ? ((discretionarySpend / totalIncome) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">3. Monthly Spending Breakdown</h3>
              <p className="text-xs text-slate-500">Total Outflow: ₹{Math.round(totalExpenses).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setChartView('donut')}
              className={`p-1.5 rounded-lg transition ${
                chartView === 'donut' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Donut Chart"
            >
              <PieIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartView('bar')}
              className={`p-1.5 rounded-lg transition ${
                chartView === 'bar' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Bar Chart"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 50/30/20 High-level Split Bar */}
        <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-700">
              Needs (Essentials): <strong className="text-blue-600">₹{Math.round(essentialSpend).toLocaleString('en-IN')}</strong> ({essentialsPercent}%)
            </span>
            <span className="text-slate-700">
              Wants (Discretionary): <strong className="text-amber-600">₹{Math.round(discretionarySpend).toLocaleString('en-IN')}</strong> ({discretionaryPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full flex overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(100, parseFloat(essentialsPercent))}%` }}
              title="Needs"
            />
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min(100, parseFloat(discretionaryPercent))}%` }}
              title="Wants"
            />
          </div>
        </div>

        {/* Chart Visual */}
        <div className="h-52 w-full">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No debit expenses recorded in this statement.
            </div>
          ) : chartView === 'donut' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs text-white">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-amber-400 font-mono">₹{d.value.toLocaleString('en-IN')} ({d.percentage}%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs text-white">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-amber-400 font-mono">₹{d.value.toLocaleString('en-IN')} ({d.percentage}%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Mini Grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 max-h-36 overflow-y-auto">
        {data.map((cat) => (
          <div key={cat.name} className="flex items-center space-x-2 text-xs p-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
            <div className="truncate flex-1">
              <span className="text-slate-800 truncate block font-semibold">{cat.name}</span>
              <span className="text-slate-500 font-mono text-[11px]">₹{cat.value.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
