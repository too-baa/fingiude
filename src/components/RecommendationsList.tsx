import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Recommendation, GoalAnalysis } from '../types';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  goalAnalysis: GoalAnalysis;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(recommendations[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalPotentialSavings = recommendations.reduce((sum, r) => sum + r.potentialMonthlySavings, 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">4. Actionable Savings Guidance</h3>
            <p className="text-xs text-slate-500">Every guidance card displays the exact mathematical trigger</p>
          </div>
        </div>

        {/* Aggregate Optimization */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Total Optimization: +₹{totalPotentialSavings.toLocaleString('en-IN')}/mo</span>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            No optimization triggers hit. Your spending is exceptionally balanced!
          </div>
        ) : (
          recommendations.map((rec) => {
            const isExpanded = expandedId === rec.id;
            return (
              <div
                key={rec.id}
                className={`rounded-xl border transition duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-50/80 border-amber-300 shadow-sm'
                    : 'bg-slate-50/40 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(rec.id)}
                  className="p-4 cursor-pointer flex items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                        {rec.category}
                      </span>
                      {rec.priority === 'high' && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                          High Priority
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {rec.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-extrabold font-mono text-slate-900 block">
                        +₹{rec.potentialMonthlySavings.toLocaleString('en-IN')}/mo
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-semibold flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Saves ~{rec.daysSavedOnGoal} days
                      </span>
                    </div>

                    <button className="text-slate-400 hover:text-slate-900 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-200/80 space-y-3 text-xs">
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {rec.description}
                    </p>

                    {/* Trigger Pill (Constraint: must show WHY) */}
                    <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 space-y-1">
                      <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Why This Rule Was Triggered:</span>
                      </div>
                      <p className="text-slate-800 font-mono text-[11px]">
                        {rec.ruleTriggered}
                      </p>
                    </div>

                    {/* Spend Comparison Bar */}
                    {rec.currentSpend > 0 && (
                      <div className="flex items-center justify-between text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                        <span>Current Monthly Spend: <strong className="text-rose-600 font-mono">₹{rec.currentSpend.toLocaleString('en-IN')}</strong></span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>Target Optimized Spend: <strong className="text-emerald-700 font-mono">₹{rec.suggestedSpend.toLocaleString('en-IN')}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
