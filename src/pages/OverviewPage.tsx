import React from 'react';
import { Target, Award, ArrowRight, TrendingUp, Sparkles, HelpCircle, CheckCircle2, ChevronRight, Layers, FileText } from 'lucide-react';
import { FinancialHealthScore, FinancialSummary, FinancialGoal, MicroAction, GoalAnalysis } from '../types';
import { TodaysActionCard } from '../components/TodaysActionCard';
import { NavTab } from '../components/Navbar';

interface OverviewPageProps {
  score: FinancialHealthScore;
  summary: FinancialSummary;
  goal: FinancialGoal;
  goalAnalysis: GoalAnalysis;
  microAction: MicroAction;
  onNavigate: (tab: NavTab) => void;
  onOpenExplainer: () => void;
  onSnapshotScore: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  score,
  summary,
  goal,
  goalAnalysis,
  microAction,
  onNavigate,
  onOpenExplainer,
  onSnapshotScore,
}) => {
  const { totalScore, grade, components } = score;

  const getBadgeStyle = (val: number) => {
    if (val >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (val >= 65) return 'bg-amber-50 text-amber-900 border-amber-300';
    if (val >= 50) return 'bg-amber-50 text-amber-900 border-amber-300';
    return 'bg-rose-50 text-rose-800 border-rose-300';
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Hero Welcome Header with Generous White Space */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>AI Financial Health & Budgeting Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Financial Health Overview
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl leading-relaxed">
            Transparent, rule-based financial guidance designed to calibrate savings discipline and achieve your target milestones.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('statement')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-sm transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Manage Statement & Goal</span>
          </button>
          <button
            onClick={() => onNavigate('guidance')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition flex items-center gap-2"
          >
            <span>View Action Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Micro-Action (Clean White Card with Yellow Circle Badge) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Priority Action For Today
          </h2>
          <span className="text-xs text-slate-500 font-medium">Instant behavioral impact</span>
        </div>
        <TodaysActionCard action={microAction} />
      </section>

      {/* 3 Core Metric Cards in Clean Grid with Generous Padding */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Health Score Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <button
                onClick={onOpenExplainer}
                className="text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-slate-200 transition flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Formula</span>
              </button>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Health Rating</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-extrabold font-mono text-slate-900">{totalScore}</span>
                <span className="text-xs text-slate-400 font-bold uppercase">/ 100</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(totalScore)}`}>
                  {grade}
                </span>
              </div>
            </div>

            {/* Micro component mini bars */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {Object.values(components).map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs text-slate-600">
                  <span className="truncate mr-2">{c.name}</span>
                  <span className="font-mono font-bold text-slate-900">{c.score}/{c.maxScore}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={onSnapshotScore}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Snapshot Current Score</span>
            </button>
          </div>
        </div>

        {/* 2. Goal Feasibility Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <Target className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                goalAnalysis.isAchievableAtCurrentRate
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                {goalAnalysis.isAchievableAtCurrentRate ? 'On Track' : 'Adjustment Needed'}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Target: {goal.title}</span>
              <div className="text-2xl font-extrabold font-mono text-slate-900">
                ₹{goal.targetAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500">
                Timeframe: {goal.targetMonths} months (₹{Math.round(goalAnalysis.requiredMonthlySavings).toLocaleString('en-IN')}/mo required)
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Current Savings Rate:</span>
                <strong className="text-slate-900 font-mono">{summary.savingsRate.toFixed(1)}%</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Monthly Surplus:</span>
                <strong className="text-slate-900 font-mono">₹{Math.round(summary.netSavings).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('statement')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>Edit Goal Parameters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Monthly Spend Breakdown Summary */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                ₹{Math.round(summary.totalIncome).toLocaleString('en-IN')} Inflow
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Monthly Outflow</span>
              <div className="text-2xl font-extrabold font-mono text-slate-900">
                ₹{Math.round(summary.totalExpenses).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500">
                Needs: ₹{Math.round(summary.essentialSpend).toLocaleString('en-IN')} • Wants: ₹{Math.round(summary.discretionarySpend).toLocaleString('en-IN')}
              </p>
            </div>

            {/* 50/30/20 Mini Ratio Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Needs ({summary.totalIncome > 0 ? ((summary.essentialSpend / summary.totalIncome) * 100).toFixed(0) : 0}%)</span>
                <span>Wants ({summary.totalIncome > 0 ? ((summary.discretionarySpend / summary.totalIncome) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full flex overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${Math.min(100, summary.totalIncome > 0 ? (summary.essentialSpend / summary.totalIncome) * 100 : 0)}%` }}
                />
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${Math.min(100, summary.totalIncome > 0 ? (summary.discretionarySpend / summary.totalIncome) * 100 : 0)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('analytics')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>Explore Interactive Charts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Modular Section Navigation Cards */}
      <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-2 mb-6">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            Dedicated Views
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Access Dedicated Financial Workspaces
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Switch tabs seamlessly from the navigation header or select any module below:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('statement')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 font-bold">
              1
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
              Goal & Statement
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Upload statements and set target savings milestones.
            </p>
          </div>

          <div
            onClick={() => onNavigate('analytics')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 font-bold">
              2
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
              Spending Breakdown
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Interactive Donut & Bar charts of all outflow categories.
            </p>
          </div>

          <div
            onClick={() => onNavigate('guidance')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 font-bold">
              3
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
              Action Plan
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Prioritized advice with mathematical rule triggers.
            </p>
          </div>

          <div
            onClick={() => onNavigate('history')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition group hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 font-bold">
              4
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
              Score Trends
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Track multi-month score history synced to Supabase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
