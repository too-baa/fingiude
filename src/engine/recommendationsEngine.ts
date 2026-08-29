import { FinancialSummary, FinancialGoal, GoalAnalysis, Recommendation } from '../types';

export const analyzeGoal = (summary: FinancialSummary, goal: FinancialGoal): GoalAnalysis => {
  const { targetAmount, targetMonths } = goal;
  const requiredMonthlySavings = targetMonths > 0 ? targetAmount / targetMonths : targetAmount;
  const currentMonthlySavings = Math.max(0, summary.netSavings);
  const monthlySurplusOrDeficit = currentMonthlySavings - requiredMonthlySavings;
  const isAchievableAtCurrentRate = monthlySurplusOrDeficit >= 0;
  const projectedMonthsAtCurrentRate = currentMonthlySavings > 0 ? Math.ceil(targetAmount / currentMonthlySavings) : 999;
  const gapAmount = Math.max(0, requiredMonthlySavings - currentMonthlySavings);

  return {
    targetAmount,
    targetMonths,
    requiredMonthlySavings,
    currentMonthlySavings,
    monthlySurplusOrDeficit,
    isAchievableAtCurrentRate,
    projectedMonthsAtCurrentRate,
    gapAmount
  };
};

export const generateRecommendations = (summary: FinancialSummary, goalAnalysis: GoalAnalysis): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const { categoryTotals, totalIncome } = summary;
  const { gapAmount, targetMonths } = goalAnalysis;

  // Helper to compute how many days saved
  const calculateDaysSaved = (monthlySaving: number): number => {
    if (monthlySaving <= 0 || gapAmount <= 0) {
      return Math.min(30, Math.round((monthlySaving / (goalAnalysis.requiredMonthlySavings || 1)) * 30));
    }
    const currentDays = targetMonths * 30;
    const newMonthlySavings = goalAnalysis.currentMonthlySavings + monthlySaving;
    if (newMonthlySavings <= 0) return 0;
    const newMonths = goalAnalysis.targetAmount / newMonthlySavings;
    const newDays = newMonths * 30;
    return Math.max(1, Math.round(currentDays - newDays));
  };

  // Rule 1: High Dining & Delivery (Swiggy / Zomato / Restaurants)
  const diningSpend = categoryTotals['Dining & Delivery'] || 0;
  const diningPercent = totalIncome > 0 ? (diningSpend / totalIncome) * 100 : 0;
  if (diningSpend > 2500 && diningPercent > 8) {
    const suggestedSpend = Math.round(diningSpend * 0.65);
    const potentialSaving = diningSpend - suggestedSpend;
    recommendations.push({
      id: 'rec-dining',
      category: 'Dining & Delivery',
      title: 'Optimize Food Delivery & Dining Frequency',
      description: `Cap takeout & delivery orders to 2 days/week. Cooking batch meals saves ₹${potentialSaving.toLocaleString('en-IN')}/month without depriving yourself.`,
      ruleTriggered: `Triggered because Dining spend (₹${diningSpend.toLocaleString('en-IN')}) is ${diningPercent.toFixed(1)}% of income (Recommended threshold: <8%).`,
      currentSpend: diningSpend,
      suggestedSpend,
      potentialMonthlySavings: potentialSaving,
      daysSavedOnGoal: calculateDaysSaved(potentialSaving),
      priority: 'high'
    });
  }

  // Rule 2: Subscriptions & OTT Services
  const ottSpend = categoryTotals['Entertainment & OTT'] || 0;
  if (ottSpend > 1200) {
    const suggestedSpend = Math.round(ottSpend * 0.5);
    const potentialSaving = ottSpend - suggestedSpend;
    recommendations.push({
      id: 'rec-ott',
      category: 'Entertainment & OTT',
      title: 'Audit & Rotate Streaming Subscriptions',
      description: `Pause redundant video/music subscriptions. Keeping 1 active service at a time saves ₹${potentialSaving.toLocaleString('en-IN')}/month.`,
      ruleTriggered: `Triggered because OTT spend (₹${ottSpend.toLocaleString('en-IN')}) exceeds single-service baseline of ₹1,000/mo.`,
      currentSpend: ottSpend,
      suggestedSpend,
      potentialMonthlySavings: potentialSaving,
      daysSavedOnGoal: calculateDaysSaved(potentialSaving),
      priority: 'medium'
    });
  }

  // Rule 3: Online Shopping & Impulse Purchases
  const shoppingSpend = categoryTotals['Shopping & Lifestyle'] || 0;
  const shoppingPercent = totalIncome > 0 ? (shoppingSpend / totalIncome) * 100 : 0;
  if (shoppingSpend > 3000 && shoppingPercent > 10) {
    const suggestedSpend = Math.round(shoppingSpend * 0.7);
    const potentialSaving = shoppingSpend - suggestedSpend;
    recommendations.push({
      id: 'rec-shopping',
      category: 'Shopping & Lifestyle',
      title: 'Implement the 48-Hour Cart Rule',
      description: `Before buying non-essential items, wait 48 hours. This simple behavioral buffer cuts impulse spending by 30%.`,
      ruleTriggered: `Triggered because Shopping spend (₹${shoppingSpend.toLocaleString('en-IN')}) is ${shoppingPercent.toFixed(1)}% of income (Recommended threshold: <10%).`,
      currentSpend: shoppingSpend,
      suggestedSpend,
      potentialMonthlySavings: potentialSaving,
      daysSavedOnGoal: calculateDaysSaved(potentialSaving),
      priority: 'high'
    });
  }

  // Rule 4: Commute / Cab Optimization
  const transportSpend = categoryTotals['Transport'] || 0;
  const transportPercent = totalIncome > 0 ? (transportSpend / totalIncome) * 100 : 0;
  if (transportSpend > 3500 && transportPercent > 7) {
    const suggestedSpend = Math.round(transportSpend * 0.75);
    const potentialSaving = transportSpend - suggestedSpend;
    recommendations.push({
      id: 'rec-transport',
      category: 'Transport',
      title: 'Optimize Peak Cab Surges with Metro/Carpool',
      description: `Replacing 2-3 surge-priced cab rides weekly with public transit saves ₹${potentialSaving.toLocaleString('en-IN')}/month.`,
      ruleTriggered: `Triggered because Transport spend (₹${transportSpend.toLocaleString('en-IN')}) is ${transportPercent.toFixed(1)}% of income (Recommended threshold: <7%).`,
      currentSpend: transportSpend,
      suggestedSpend,
      potentialMonthlySavings: potentialSaving,
      daysSavedOnGoal: calculateDaysSaved(potentialSaving),
      priority: 'medium'
    });
  }

  // Rule 5: General Automated Goal Transfer
  if (summary.netSavings > 0) {
    const autoAmount = Math.min(summary.netSavings, goalAnalysis.requiredMonthlySavings);
    recommendations.push({
      id: 'rec-auto-save',
      category: 'General',
      title: 'Schedule Payday Auto-Transfer',
      description: `Automate a ₹${Math.round(autoAmount).toLocaleString('en-IN')} transfer to your dedicated savings account on the 2nd of every month right after salary credit.`,
      ruleTriggered: `Triggered based on positive cash flow of ₹${Math.round(summary.netSavings).toLocaleString('en-IN')}/mo to remove reliance on willpower.`,
      currentSpend: 0,
      suggestedSpend: 0,
      potentialMonthlySavings: Math.round(autoAmount),
      daysSavedOnGoal: calculateDaysSaved(Math.round(autoAmount)),
      priority: 'high'
    });
  }

  return recommendations;
};
