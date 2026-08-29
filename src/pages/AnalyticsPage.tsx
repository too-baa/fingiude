import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, BarChart2, Layers, TrendingDown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { FinancialSummary } from '../types';

interface AnalyticsPageProps {
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

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ summary }) => {
  const [chartView, setChartView] = useState<'donut' | 'bar'>('donut');
  const { categoryTotals, totalExpenses, essentialSpend, discretionarySpend, totalIncome, savingsRate, netSavings } = summary;

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
  const savingsPercent = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-12 py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-3 pb-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          <span>Expense Analytics & Outflow Allocation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Spending Breakdown & Outflow
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Comprehensive visualization of your expense footprint categorized by essential necessities vs discretionary lifestyle spending.
        </p>
      </div>

      {/* 50/30/20 Benchmark Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Needs Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover-card-lift space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Needs (Essentials)</span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Benchmark: ~50%
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            ₹{Math.round(essentialSpend).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Represents <strong>{essentialsPercent}%</strong> of total monthly income. Includes rent, groceries, and utilities.
          </p>
        </div>

        {/* Wants Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover-card-lift space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Wants (Discretionary)</span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              Benchmark: ~30%
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            ₹{Math.round(discretionarySpend).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Represents <strong>{discretionaryPercent}%</strong> of income. Includes dining out, subscriptions, and shopping.
          </p>
        </div>

        {/* Savings Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover-card-lift space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Savings & Surplus</span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Benchmark: ~20%
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900">
            ₹{Math.round(netSavings).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Represents <strong>{savingsRate.toFixed(1)}%</strong> retained capital available for compounding and goals.
          </p>
        </div>
      </div>

      {/* Main Chart Card with generous padding */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs hover-card-lift space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Category Distribution & Volume</h3>
            <p className="text-xs text-slate-500">Visual representation of expenses across {data.length} active categories</p>
          </div>

          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setChartView('donut')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                chartView === 'donut' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Donut View</span>
            </button>
            <button
              onClick={() => setChartView('bar')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                chartView === 'bar' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Bar Chart</span>
            </button>
          </div>
        </div>

        {/* High-Level 50/30/20 Visual Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Needs: ₹{Math.round(essentialSpend).toLocaleString('en-IN')} ({essentialsPercent}%)</span>
            <span>Wants: ₹{Math.round(discretionarySpend).toLocaleString('en-IN')} ({discretionaryPercent}%)</span>
            <span>Saved: ₹{Math.round(netSavings).toLocaleString('en-IN')} ({savingsRate.toFixed(1)}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full flex overflow-hidden">
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
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, parseFloat(savingsPercent)))}%` }}
              title="Savings"
            />
          </div>
        </div>

        {/* Interactive Charts Area */}
        <div className="h-80 w-full pt-4">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              No debit outflow recorded in statement.
            </div>
          ) : chartView === 'donut' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
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
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-white">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-amber-400 font-mono font-bold">₹{d.value.toLocaleString('en-IN')} ({d.percentage}%)</div>
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
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={130} tick={{ fill: '#334155', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-white">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-amber-400 font-mono font-bold">₹{d.value.toLocaleString('en-IN')} ({d.percentage}%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Detailed Category Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          {data.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center space-x-2.5 truncate mr-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-bold text-slate-800 truncate">{cat.name}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-slate-900 block">₹{cat.value.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500 font-mono">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
