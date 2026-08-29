import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Clock, ArrowRight, ShieldCheck, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { Recommendation, GoalAnalysis, FinancialGoal } from '../types';

interface GuidancePageProps {
  recommendations: Recommendation[];
  goalAnalysis: GoalAnalysis;
  goal: FinancialGoal;
}

export const GuidancePage: React.FC<GuidancePageProps> = ({
  recommendations,
  goalAnalysis,
  goal,
}) => {
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(recommendations[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredRecs = recommendations.filter((r) => {
    if (filterPriority === 'all') return true;
    return r.priority === filterPriority;
  });

  const totalPotentialSavings = recommendations.reduce((sum, r) => sum + r.potentialMonthlySavings, 0);

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
          <span>Actionable Savings Strategy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Prioritized Action Plan & Guidance
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Concrete, rule-based recommendations tailored to your spending habits and your <strong>{goal.title}</strong> goal.
        </p>
      </div>

      {/* Goal Target Alignment Summary Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            Goal Acceleration Impact
          </span>
          <h3 className="text-xl font-bold text-white">
            Cumulative Optimization Potential: +₹{totalPotentialSavings.toLocaleString('en-IN')}/month
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            By enacting these {recommendations.length} behavior adjustments, you can bridge the monthly savings deficit and reach your <strong>₹{goal.targetAmount.toLocaleString('en-IN')}</strong> target comfortably ahead of schedule.
          </p>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shrink-0 space-y-1 text-right min-w-[200px]">
          <span className="text-[11px] text-slate-400 block font-medium">Target Milestone</span>
          <span className="text-lg font-bold font-mono text-amber-400 block">₹{goal.targetAmount.toLocaleString('en-IN')}</span>
          <span className="text-xs text-slate-300 block">Required: ₹{Math.round(goalAnalysis.requiredMonthlySavings).toLocaleString('en-IN')}/mo</span>
        </div>
      </div>

      {/* Filter and Recommendations Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Optimization Action Cards ({filteredRecs.length})</h3>
            <p className="text-xs text-slate-500">Every guidance item displays the exact mathematical trigger condition</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterPriority === 'all' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Priorities
            </button>
            <button
              onClick={() => setFilterPriority('high')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterPriority === 'high' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Priority
            </button>
          </div>
        </div>

        {/* Cards List */}
        <div className="space-y-4">
          {filteredRecs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
              No recommendations match the selected filter.
            </div>
          ) : (
            filteredRecs.map((rec) => {
              const isExpanded = expandedId === rec.id;
              return (
                <div
                  key={rec.id}
                  className={`rounded-2xl border transition duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-slate-50/90 border-amber-300 shadow-sm'
                      : 'bg-slate-50/40 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => toggleExpand(rec.id)}
                    className="p-5 cursor-pointer flex items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200 shadow-sm">
                          {rec.category}
                        </span>
                        {rec.priority === 'high' && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            High Priority
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 tracking-tight">
                        {rec.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-black font-mono text-slate-900 block">
                          +₹{rec.potentialMonthlySavings.toLocaleString('en-IN')}/mo
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-semibold flex items-center justify-end gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Saves ~{rec.daysSavedOnGoal} days
                        </span>
                      </div>

                      <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-200 space-y-4 text-xs">
                      <p className="text-slate-700 leading-relaxed font-normal text-sm">
                        {rec.description}
                      </p>

                      {/* Explicit Trigger Reason Banner (Problem Statement Constraint) */}
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-1">
                        <div className="flex items-center space-x-1.5 text-amber-950 font-bold text-xs">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Why This Specific Rule Was Triggered:</span>
                        </div>
                        <p className="text-slate-800 font-mono text-xs">
                          {rec.ruleTriggered}
                        </p>
                      </div>

                      {/* Spend Comparison */}
                      {rec.currentSpend > 0 && (
                        <div className="flex items-center justify-between text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 font-medium">
                          <span>Current Monthly Spend: <strong className="text-rose-600 font-mono">₹{rec.currentSpend.toLocaleString('en-IN')}</strong></span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span>Suggested Target Spend: <strong className="text-emerald-700 font-mono">₹{rec.suggestedSpend.toLocaleString('en-IN')}</strong></span>
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
    </div>
  );
};
