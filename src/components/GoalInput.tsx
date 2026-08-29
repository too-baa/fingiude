import React from 'react';
import { Target, Calendar, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FinancialGoal } from '../types';

interface GoalInputProps {
  goal: FinancialGoal;
  onChange: (updatedGoal: FinancialGoal) => void;
  onNavigateToGuidance?: () => void;
}

const PRESET_GOALS = [
  { title: 'Emergency Fund', targetAmount: 50000, targetMonths: 6 },
  { title: 'Vacation Trip', targetAmount: 35000, targetMonths: 4 },
  { title: 'Laptop Upgrade', targetAmount: 75000, targetMonths: 8 },
  { title: 'Down Payment Jar', targetAmount: 150000, targetMonths: 12 },
];

export const GoalInput: React.FC<GoalInputProps> = ({ goal, onChange, onNavigateToGuidance }) => {
  const requiredMonthlySavings = Math.round(
    (goal.targetAmount || 0) / Math.max(1, goal.targetMonths || 1)
  );

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm shadow-amber-400/20">
            <Target className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">1. Stated Financial Goal</h3>
            <p className="text-xs text-slate-500">Savings recommendations are calculated via exact arithmetic against this target</p>
          </div>
        </div>

        {/* Preset Quick Chips */}
        <div className="space-y-1.5 mb-5">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_GOALS.map((preset) => {
              const isSelected = goal.title === preset.title && goal.targetAmount === preset.targetAmount;
              return (
                <button
                  key={preset.title}
                  onClick={() => onChange(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 inline mr-1 text-amber-600" />
                  {preset.title} (₹{(preset.targetAmount / 1000).toFixed(0)}k/{preset.targetMonths}m)
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Purpose / Name</label>
            <input
              type="text"
              value={goal.title}
              onChange={(e) => onChange({ ...goal, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-medium"
              placeholder="e.g. Emergency Fund, New Car, Goa Vacation"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-semibold">₹</span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={goal.targetAmount || ''}
                  onChange={(e) => onChange({ ...goal, targetAmount: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Timeframe (Months)</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={goal.targetMonths || ''}
                  onChange={(e) => onChange({ ...goal, targetMonths: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Required Monthly Math Indicator */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between text-xs mb-5">
          <span className="text-slate-600 font-medium">Required Monthly Savings:</span>
          <span className="font-mono font-extrabold text-slate-950 text-sm">
            ₹{requiredMonthlySavings.toLocaleString('en-IN')}/mo
          </span>
        </div>
      </div>

      {/* Prominent Action Button to View Action Plan */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => {
            if (onNavigateToGuidance) {
              onNavigateToGuidance();
            }
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 group"
        >
          <span>Calculate & View Action Plan</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
