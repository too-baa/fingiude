import { FinancialSummary, MicroAction } from '../types';

export const generateTodayMicroAction = (summary: FinancialSummary): MicroAction => {
  const diningSpend = summary.categoryTotals['Dining & Delivery'] || 0;
  const shoppingSpend = summary.categoryTotals['Shopping & Lifestyle'] || 0;
  const ottSpend = summary.categoryTotals['Entertainment & OTT'] || 0;

  if (diningSpend > 2500) {
    return {
      headline: "Today's Micro-Action: Cook 1 Meal / Skip Takeout",
      actionItem: 'Pack a home-cooked lunch or cook dinner tonight instead of ordering on Swiggy/Zomato.',
      estimatedInstantSaving: 350,
      triggerReason: `Dining & delivery accounts for ₹${diningSpend.toLocaleString('en-IN')} in your current statement.`,
      impactNote: 'Keeps ₹350 in your wallet today and speeds up your target timeline.',
      difficulty: 'Easy'
    };
  }

  if (ottSpend > 1200) {
    return {
      headline: "Today's Micro-Action: Audit & Pause 1 Streaming Service",
      actionItem: 'Open your phone subscription settings or bank UPI auto-debits and cancel 1 service you have not watched this past week.',
      estimatedInstantSaving: 499,
      triggerReason: `Multiple entertainment subscriptions totaled ₹${ottSpend.toLocaleString('en-IN')}.`,
      impactNote: 'Instantly locks in ₹499 in recurring monthly savings.',
      difficulty: 'Easy'
    };
  }

  if (shoppingSpend > 3000) {
    return {
      headline: "Today's Micro-Action: Unlink 1 Saved E-Commerce Card",
      actionItem: 'Remove your 1-click saved card from your most used shopping app to create a pause buffer for impulse buys.',
      estimatedInstantSaving: 1200,
      triggerReason: `Shopping & lifestyle spend reached ₹${shoppingSpend.toLocaleString('en-IN')} this period.`,
      impactNote: 'Cuts impulse 1-click checkouts by an estimated 40%.',
      difficulty: 'Medium'
    };
  }

  return {
    headline: "Today's Micro-Action: Transfer ₹250 to your Goal Stash",
    actionItem: 'Do a quick manual UPI transfer of ₹250 right now into a separate high-yield savings account or emergency jar.',
    estimatedInstantSaving: 250,
    triggerReason: 'Small daily micro-transfers build financial momentum faster than large monthly attempts.',
    impactNote: 'Directly moves your goal progress bar today.',
    difficulty: 'Easy'
  };
};
