import Papa from 'papaparse';
import { Transaction, Category, FinancialSummary } from '../types';

const ESSENTIAL_CATEGORIES: Category[] = [
  'Housing',
  'Food & Groceries',
  'Utilities & Bills',
  'Transport',
  'Health & Medical',
  'Education'
];

const DISCRETIONARY_CATEGORIES: Category[] = [
  'Dining & Delivery',
  'Entertainment & OTT',
  'Shopping & Lifestyle',
  'Miscellaneous'
];

const inferCategory = (desc: string): Category => {
  const d = desc.toLowerCase();
  if (d.includes('salary') || d.includes('payroll') || d.includes('freelance') || d.includes('interest') || d.includes('credit')) return 'Income';
  if (d.includes('rent') || d.includes('society') || d.includes('maintenance') || d.includes('landlord')) return 'Housing';
  if (d.includes('grocery') || d.includes('supermarket') || d.includes('blinkit') || d.includes('zepto') || d.includes('instamart') || d.includes('dmart') || d.includes('vegetable')) return 'Food & Groceries';
  if (d.includes('swiggy') || d.includes('zomato') || d.includes('restaurant') || d.includes('cafe') || d.includes('mcdonald') || d.includes('starbucks') || d.includes('bar') || d.includes('pub') || d.includes('dining')) return 'Dining & Delivery';
  if (d.includes('electricity') || d.includes('water') || d.includes('bill') || d.includes('wifi') || d.includes('recharge') || d.includes('airtel') || d.includes('jio') || d.includes('gas') || d.includes('utility')) return 'Utilities & Bills';
  if (d.includes('uber') || d.includes('ola') || d.includes('fuel') || d.includes('petrol') || d.includes('metro') || d.includes('rapido') || d.includes('cab') || d.includes('auto')) return 'Transport';
  if (d.includes('netflix') || d.includes('spotify') || d.includes('prime') || d.includes('hotstar') || d.includes('youtube') || d.includes('movie') || d.includes('pvr') || d.includes('steam') || d.includes('game')) return 'Entertainment & OTT';
  if (d.includes('amazon') || d.includes('myntra') || d.includes('flipkart') || d.includes('zara') || d.includes('shopping') || d.includes('mall') || d.includes('h&m') || d.includes('clothes')) return 'Shopping & Lifestyle';
  if (d.includes('pharmacy') || d.includes('hospital') || d.includes('doctor') || d.includes('apollo') || d.includes('medplus') || d.includes('medicine') || d.includes('clinic')) return 'Health & Medical';
  if (d.includes('school') || d.includes('college') || d.includes('course') || d.includes('udemy') || d.includes('tuition') || d.includes('books')) return 'Education';
  return 'Miscellaneous';
};

export const parseCSVText = (csvString: string, estimatedMonthlyIncome?: number): { transactions: Transaction[]; summary: FinancialSummary } => {
  const result = Papa.parse(csvString.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const transactions: Transaction[] = [];
  const warnings: string[] = [];

  result.data.forEach((row: any, idx: number) => {
    const rawDate = row.date || row.Date || row.DATE || row['Transaction Date'] || new Date().toISOString().split('T')[0];
    const rawDesc = row.description || row.Description || row.DESC || row.Narration || row.Particulars || 'Transaction ' + (idx + 1);
    const rawAmountStr = String(row.amount || row.Amount || row.AMOUNT || row['Transaction Amount'] || '0').replace(/[^0-9.-]+/g, '');
    const amount = Math.abs(parseFloat(rawAmountStr) || 0);
    
    let rawType = String(row.type || row.Type || row.TYPE || '').toLowerCase().trim();
    let rawCategory = row.category || row.Category || '';

    if (!rawType) {
      if (rawDesc.toLowerCase().includes('salary') || rawDesc.toLowerCase().includes('deposit') || rawDesc.toLowerCase().includes('credit')) {
        rawType = 'credit';
      } else {
        rawType = 'debit';
      }
    }

    const type = rawType.includes('credit') || rawType.includes('cr') ? 'credit' : 'debit';
    const category: Category = (rawCategory && rawCategory.trim() !== '')
      ? (rawCategory as Category)
      : (type === 'credit' ? 'Income' : inferCategory(rawDesc));

    if (amount > 0) {
      transactions.push({
        id: 'tx-' + idx + '-' + Math.random().toString(36).substring(2, 6),
        date: rawDate,
        description: rawDesc,
        category,
        amount,
        type,
      });
    }
  });

  // Calculate totals
  let totalIncome = transactions
    .filter(t => t.type === 'credit' || t.category === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'debit' && t.category !== 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  let isIncomplete = false;
  if (totalIncome === 0) {
    isIncomplete = true;
    if (estimatedMonthlyIncome && estimatedMonthlyIncome > 0) {
      totalIncome = estimatedMonthlyIncome;
      warnings.push(`No income credit found. Using your estimated monthly income of ₹${estimatedMonthlyIncome.toLocaleString('en-IN')}.`);
    } else {
      totalIncome = Math.max(totalExpenses * 1.15, 30000);
      warnings.push(`No income credit detected in statement: Outputs marked as ESTIMATES using an imputed income baseline of ₹${Math.round(totalIncome).toLocaleString('en-IN')}.`);
    }
  }

  const categoryTotals: Record<Category, number> = {
    'Income': totalIncome,
    'Housing': 0,
    'Food & Groceries': 0,
    'Dining & Delivery': 0,
    'Utilities & Bills': 0,
    'Transport': 0,
    'Entertainment & OTT': 0,
    'Shopping & Lifestyle': 0,
    'Health & Medical': 0,
    'Education': 0,
    'Miscellaneous': 0,
  };

  transactions.filter(t => t.type === 'debit').forEach(t => {
    if (categoryTotals[t.category] !== undefined) {
      categoryTotals[t.category] += t.amount;
    } else {
      categoryTotals['Miscellaneous'] += t.amount;
    }
  });

  const discretionarySpend = DISCRETIONARY_CATEGORIES.reduce((acc, cat) => acc + (categoryTotals[cat] || 0), 0);
  const essentialSpend = ESSENTIAL_CATEGORIES.reduce((acc, cat) => acc + (categoryTotals[cat] || 0), 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const dates = transactions.map(t => t.date).filter(Boolean).sort();

  return {
    transactions,
    summary: {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      categoryTotals,
      discretionarySpend,
      essentialSpend,
      transactionCount: transactions.length,
      hasIncome: !isIncomplete,
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      isIncomplete,
      warnings
    }
  };
};
