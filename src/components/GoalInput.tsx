import React from 'react';
import { Target, Calendar, Sparkles } from 'lucide-react';
import { FinancialGoal } from '../types';

interface GoalInputProps {
  goal: FinancialGoal;
  onChange: (updatedGoal: FinancialGoal) => void;
}

const PRESET_GOALS = [
  { title: 'Emergency Fund', targetAmount: 50000, targetMonths: 6 },
  { title: 'Vacation Trip', targetAmount: 35000, targetMonths: 4 },
  { title: 'Laptop Upgrade', targetAmount: 75000, targetMonths: 8 },
  { title: 'Down Payment Jar', targetAmount: 150000, targetMonths: 12 },
];

export const GoalInput: React.FC<GoalInputProps> = ({ goal, onChange }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
          <Target className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">1. Stated Financial Goal</h3>
          <p className="text-xs text-slate-500">Savings recommendations are calculated via exact arithmetic against this target</p>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_GOALS.map((preset) => {
          const isSelected = goal.title === preset.title && goal.targetAmount === preset.targetAmount;
          return (
            <button
              key={preset.title}
              onClick={() => onChange(preset)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 inline mr-1 text-amber-600" />
              {preset.title} (₹{(preset.targetAmount / 1000).toFixed(0)}k in {preset.targetMonths}m)
            </button>
          );
        })}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Goal Name</label>
          <input
            type="text"
            value={goal.title}
            onChange={(e) => onChange({ ...goal, title: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-medium"
            placeholder="e.g. Goa Vacation"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Target Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400 text-sm font-semibold">₹</span>
            <input
              type="number"
              min="1000"
              step="1000"
              value={goal.targetAmount || ''}
              onChange={(e) => onChange({ ...goal, targetAmount: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-mono font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Timeframe (Months)</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="number"
              min="1"
              max="60"
              value={goal.targetMonths || ''}
              onChange={(e) => onChange({ ...goal, targetMonths: Math.max(1, parseInt(e.target.value, 10) || 1) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-mono font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
