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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#0f172a', '#3b82f6', '#10b981']
      });
    } else {
      setIsCompleted(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover-card-lift transition duration-300 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        {/* Left: Yellow Circular Icon + Text */}
        <div className="flex items-start sm:items-center space-x-5 flex-1">
          {/* Circular Yellow Badge with subtle aura */}
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-400/20 pulse-yellow">
            <Zap className="w-7 h-7 fill-slate-950 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Today's Micro-Action
              </span>
              <span className="text-xs font-bold text-slate-500">
                • {action.difficulty} Effort
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {action.headline}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
              {action.actionItem}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
              <span className="font-bold text-slate-900 font-mono flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Instant Impact: ₹{action.estimatedInstantSaving.toLocaleString('en-IN')}
              </span>
              <span>•</span>
              <span className="text-slate-500 italic">{action.triggerReason}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleComplete}
          className={`shrink-0 flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-xs shadow-sm transition-all duration-300 transform active:scale-95 ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-emerald-500/20 scale-105'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/25 hover:scale-105'
          }`}
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4 stroke-[3] animate-bounce" />
              <span>Completed! 🎉</span>
            </>
          ) : (
            <>
              <span>Mark Completed</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
