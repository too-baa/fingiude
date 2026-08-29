import { FinancialSummary, FinancialHealthScore } from '../types';

export const calculateHealthScore = (summary: FinancialSummary): FinancialHealthScore => {
  const { totalIncome, totalExpenses, savingsRate, discretionarySpend, essentialSpend, isIncomplete } = summary;

  // 1. Savings Rate Score (Max 40 points)
  let savingsScore = 0;
  let savingsStatus: 'good' | 'average' | 'poor' = 'poor';
  let savingsDetails = '';

  if (savingsRate >= 30) {
    savingsScore = 40;
    savingsStatus = 'good';
    savingsDetails = `Outstanding ${savingsRate.toFixed(1)}% savings rate (Benchmark: >30%)`;
  } else if (savingsRate >= 20) {
    savingsScore = 32 + ((savingsRate - 20) / 10) * 8;
    savingsStatus = 'good';
    savingsDetails = `Solid ${savingsRate.toFixed(1)}% savings rate (Benchmark: 20-30%)`;
  } else if (savingsRate >= 10) {
    savingsScore = 20 + ((savingsRate - 10) / 10) * 12;
    savingsStatus = 'average';
    savingsDetails = `Moderate ${savingsRate.toFixed(1)}% savings rate. Aim for 20%+ (Benchmark: 10-20%)`;
  } else if (savingsRate > 0) {
    savingsScore = (savingsRate / 10) * 20;
    savingsStatus = 'poor';
    savingsDetails = `Low ${savingsRate.toFixed(1)}% savings rate. Living very close to paycheck.`;
  } else {
    savingsScore = 0;
    savingsStatus = 'poor';
    savingsDetails = `Negative savings rate (${savingsRate.toFixed(1)}%). Spending exceeds income by ₹${Math.abs(totalIncome - totalExpenses).toLocaleString('en-IN')}.`;
  }

  // 2. Discretionary Discipline (Max 30 points) - Wants vs Income
  let discretionaryScore = 0;
  let discStatus: 'good' | 'average' | 'poor' = 'poor';
  let discDetails = '';
  const discPercent = totalIncome > 0 ? (discretionarySpend / totalIncome) * 100 : 50;

  if (discPercent <= 15) {
    discretionaryScore = 30;
    discStatus = 'good';
    discDetails = `Highly disciplined discretionary spending (${discPercent.toFixed(1)}% of income vs 30% standard ceiling)`;
  } else if (discPercent <= 30) {
    discretionaryScore = 20 + ((30 - discPercent) / 15) * 10;
    discStatus = 'good';
    discDetails = `Balanced lifestyle spending (${discPercent.toFixed(1)}% of income, within the 30% 50/30/20 guideline)`;
  } else if (discPercent <= 45) {
    discretionaryScore = 10 + ((45 - discPercent) / 15) * 10;
    discStatus = 'average';
    discDetails = `Elevated lifestyle spending (${discPercent.toFixed(1)}% of income). Dining, shopping & entertainment eating potential savings.`;
  } else {
    discretionaryScore = Math.max(0, 10 - ((discPercent - 45) / 15) * 10);
    discStatus = 'poor';
    discDetails = `Critical lifestyle spend (${discPercent.toFixed(1)}% of income). Excessive dining/shopping exceeds safe margins.`;
  }

  // 3. Essential Needs & Cushion (Max 30 points) - Fixed Obligations
  let cushionScore = 0;
  let cushionStatus: 'good' | 'average' | 'poor' = 'poor';
  let cushionDetails = '';
  const essentialPercent = totalIncome > 0 ? (essentialSpend / totalIncome) * 100 : 60;

  if (essentialPercent <= 45) {
    cushionScore = 30;
    cushionStatus = 'good';
    cushionDetails = `Exceptional fixed-cost cushion (${essentialPercent.toFixed(1)}% of income on rent, bills & essentials)`;
  } else if (essentialPercent <= 55) {
    cushionScore = 22 + ((55 - essentialPercent) / 10) * 8;
    cushionStatus = 'good';
    cushionDetails = `Comfortable essentials ratio (${essentialPercent.toFixed(1)}% vs 50% benchmark)`;
  } else if (essentialPercent <= 70) {
    cushionScore = 12 + ((70 - essentialPercent) / 15) * 10;
    cushionStatus = 'average';
    cushionDetails = `High fixed burden (${essentialPercent.toFixed(1)}% on rent & utilities). Leaves little margin for errors.`;
  } else {
    cushionScore = Math.max(0, 12 - ((essentialPercent - 70) / 20) * 12);
    cushionStatus = 'poor';
    cushionDetails = `Heavy fixed overhead (${essentialPercent.toFixed(1)}%). Fixed bills consume nearly all revenue.`;
  }

  const rawTotal = Math.round(savingsScore + discretionaryScore + cushionScore);
  const totalScore = Math.max(0, Math.min(100, rawTotal));

  let grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' | 'Critical' = 'Fair';
  let color = 'text-amber-400';

  if (totalScore >= 80) {
    grade = 'Excellent';
    color = 'text-emerald-400';
  } else if (totalScore >= 65) {
    grade = 'Good';
    color = 'text-teal-400';
  } else if (totalScore >= 50) {
    grade = 'Fair';
    color = 'text-amber-400';
  } else if (totalScore >= 35) {
    grade = 'Needs Attention';
    color = 'text-orange-400';
  } else {
    grade = 'Critical';
    color = 'text-rose-500';
  }

  const components = {
    savingsRate: {
      name: 'Net Savings Rate',
      score: Math.round(savingsScore),
      maxScore: 40,
      weight: '40%',
      description: 'Calculates the % of income saved after all outflows.',
      details: savingsDetails,
      status: savingsStatus
    },
    discretionaryDiscipline: {
      name: 'Discretionary Discipline',
      score: Math.round(discretionaryScore),
      maxScore: 30,
      weight: '30%',
      description: 'Evaluates dining, shopping, entertainment vs the 30% 50/30/20 benchmark.',
      details: discDetails,
      status: discStatus
    },
    essentialCushion: {
      name: 'Essential Needs Buffer',
      score: Math.round(cushionScore),
      maxScore: 30,
      weight: '30%',
      description: 'Evaluates fixed overheads (rent, bills, groceries) vs 50% guideline.',
      details: cushionDetails,
      status: cushionStatus
    }
  };

  const keyTakeaways: string[] = [];
  if (savingsRate >= 20) {
    keyTakeaways.push(`Saving ₹${Math.round(summary.netSavings).toLocaleString('en-IN')}/month places you in the top tier of consistent savers.`);
  } else {
    keyTakeaways.push(`Current monthly savings (₹${Math.round(summary.netSavings).toLocaleString('en-IN')}) has room to grow by cutting non-essential leaks.`);
  }

  if (discPercent > 30) {
    keyTakeaways.push(`Lifestyle spending is ₹${Math.round(discretionarySpend).toLocaleString('en-IN')} (${discPercent.toFixed(0)}% of income). Trimming 20% would redirect ₹${Math.round(discretionarySpend * 0.2).toLocaleString('en-IN')}/mo to your goal.`);
  }

  if (isIncomplete) {
    keyTakeaways.push('Notice: Missing income row in statement. Scores are calibrated with estimate values.');
  }

  return {
    totalScore,
    grade,
    color,
    components,
    explanationFormula: 'Financial Health Score = Savings Rate Score (40 pts) + Discretionary Discipline (30 pts) + Essential Cushion (30 pts)',
    keyTakeaways
  };
};
