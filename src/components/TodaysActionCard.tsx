import React, { useState } from 'react';
import { Zap, Check, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MicroAction } from '../types';

interface TodaysActionCardProps {
  action: MicroAction;
}

export const TodaysActionCard: React.FC<TodaysActionCardProps> = ({ action }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#facc15', '#0f172a', '#3b82f6', '#10b981']
      });
    } else {
      setIsCompleted(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        {/* Left: Yellow Circular Icon + Text */}
        <div className="flex items-start sm:items-center space-x-4 flex-1">
          {/* Circular Yellow Badge (Matching photo) */}
          <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-6 h-6 fill-slate-950 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Today's Micro-Action
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                • {action.difficulty} Difficulty
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {action.headline}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {action.actionItem}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
              <span className="font-bold text-slate-900 font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Instant Impact: ₹{action.estimatedInstantSaving.toLocaleString('en-IN')}
              </span>
              <span>•</span>
              <span className="text-slate-500">{action.triggerReason}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleComplete}
          className={`shrink-0 flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs shadow-sm transition duration-200 ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 hover:scale-105'
          }`}
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Done for Today! 🎉</span>
            </>
          ) : (
            <>
              <span>Mark Done</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
