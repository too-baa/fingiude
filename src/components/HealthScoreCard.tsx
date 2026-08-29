import React from 'react';
import { Award, HelpCircle, TrendingUp } from 'lucide-react';
import { FinancialHealthScore, FinancialSummary } from '../types';

interface HealthScoreCardProps {
  score: FinancialHealthScore;
  summary: FinancialSummary;
  onOpenExplainer: () => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  score,
  summary,
  onOpenExplainer,
}) => {
  const { totalScore, grade, components } = score;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600';
    if (val >= 65) return 'text-amber-500';
    if (val >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBadgeStyle = (val: number) => {
    if (val >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (val >= 65) return 'bg-amber-50 text-amber-900 border-amber-300';
    if (val >= 50) return 'bg-amber-50 text-amber-900 border-amber-300';
    return 'bg-rose-50 text-rose-800 border-rose-300';
  };

  const scoreColor = getScoreColor(totalScore);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Financial Health Score</h3>
              <p className="text-xs text-slate-500">Explainable 0–100 Behavioral Rating</p>
            </div>
          </div>

          <button
            onClick={onOpenExplainer}
            className="flex items-center space-x-1 text-xs text-slate-700 hover:text-slate-950 font-bold bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-300 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Formula</span>
          </button>
        </div>

        {/* Gauge & Metrics */}
        <div className="flex flex-col sm:flex-row items-center gap-5 my-3">
          {/* Radial SVG Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset={251 - (251 * totalScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold font-mono tracking-tight text-slate-900`}>{totalScore}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">/ 100</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Health Rating</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(totalScore)}`}>
                {grade}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 font-semibold block">Savings Rate</span>
                <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  {summary.savingsRate.toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 font-semibold block">Net Saved / mo</span>
                <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
                  ₹{Math.round(summary.netSavings).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Breakdown Bars */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Component Breakdown</span>
          <span className="text-[10px] text-slate-400 font-normal">Deterministic formula</span>
        </div>

        {Object.values(components).map((comp) => {
          const pct = (comp.score / comp.maxScore) * 100;
          return (
            <div key={comp.name} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">{comp.name}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  <strong className="text-slate-900">{comp.score}</strong> / {comp.maxScore} pts
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    comp.status === 'good' ? 'bg-emerald-500' : comp.status === 'average' ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${Math.max(5, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
