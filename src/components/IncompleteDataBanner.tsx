import React, { useState } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { FinancialSummary } from '../types';

interface IncompleteDataBannerProps {
  summary: FinancialSummary;
  onSetEstimatedIncome: (income: number) => void;
}

export const IncompleteDataBanner: React.FC<IncompleteDataBannerProps> = ({
  summary,
  onSetEstimatedIncome,
}) => {
  if (!summary.isIncomplete && summary.warnings.length === 0) return null;

  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputVal);
    if (val > 0) {
      onSetEstimatedIncome(val);
      setInputVal('');
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-3 shadow-sm">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 flex-1">
          <div className="font-bold text-slate-900 text-sm">Notice: Incomplete Statement (Graceful Fallback Mode)</div>
          {summary.warnings.map((w, idx) => (
            <p key={idx} className="text-slate-700 text-xs leading-relaxed">{w}</p>
          ))}
        </div>
      </div>

      {/* Inline Input to fix estimate */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200">
        <span className="text-slate-700 font-semibold">Enter your monthly take-home salary to calibrate score:</span>
        <div className="relative flex-1 min-w-[140px] max-w-[220px]">
          <span className="absolute left-2.5 top-1.5 text-slate-400 font-semibold">₹</span>
          <input
            type="number"
            min="1000"
            step="1000"
            placeholder="e.g. 60000"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono font-semibold"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition flex items-center gap-1 shadow-sm"
        >
          <span>Update Baseline</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
