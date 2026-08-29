import React from 'react';
import { X, CheckCircle2, Calculator, Sparkles } from 'lucide-react';
import { FinancialHealthScore } from '../types';

interface ScoreExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: FinancialHealthScore;
}

export const ScoreExplainerModal: React.FC<ScoreExplainerModalProps> = ({
  isOpen,
  onClose,
  score,
}) => {
  if (!isOpen) return null;

  const { components, totalScore, grade } = score;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            <Calculator className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">How Your Health Score is Calculated</h2>
            <p className="text-xs text-slate-500">100% Explainable & Transparent Formula — Zero Black-Box ML</p>
          </div>
        </div>

        {/* Formula Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5 text-xs text-amber-900 font-medium">
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Standardized 3-Pillar Scoring Model:
          </div>
          <code className="font-mono text-slate-900 block font-bold mt-1">
            Score (0-100) = Savings Rate (40 pts) + Discretionary Discipline (30 pts) + Essential Cushion (30 pts)
          </code>
        </div>

        {/* Component Deep Dives */}
        <div className="space-y-3 mb-5">
          {Object.values(components).map((comp) => (
            <div key={comp.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Max: {comp.maxScore} pts ({comp.weight})
                  </span>
                </div>
                <div className="font-mono text-sm font-bold text-slate-900">
                  {comp.score} / {comp.maxScore} pts
                </div>
              </div>
              <p className="text-xs text-slate-600">{comp.description}</p>
              <div className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Trigger Rule & Math:</strong> {comp.details}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Score Summary */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white">
          <div>
            <span className="text-xs text-amber-400 block font-bold uppercase">Final Composite Score</span>
            <span className="text-xs text-slate-300">Sum of all 3 objective factors</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-amber-400">{totalScore} / 100</span>
            <span className="text-xs text-slate-300 block font-medium">Status: {grade}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
};
