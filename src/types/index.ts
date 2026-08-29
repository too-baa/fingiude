export type TransactionType = 'debit' | 'credit';

export type Category = 
  | 'Income'
  | 'Housing'
  | 'Food & Groceries'
  | 'Dining & Delivery'
  | 'Utilities & Bills'
  | 'Transport'
  | 'Entertainment & OTT'
  | 'Shopping & Lifestyle'
  | 'Health & Medical'
  | 'Education'
  | 'Miscellaneous';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
  type: TransactionType;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage (-100 to 100)
  categoryTotals: Record<Category, number>;
  discretionarySpend: number;
  essentialSpend: number;
  transactionCount: number;
  hasIncome: boolean;
  startDate?: string;
  endDate?: string;
  isIncomplete: boolean;
  warnings: string[];
}

export interface HealthScoreComponent {
  name: string;
  score: number;
  maxScore: number;
  weight: string;
  description: string;
  details: string;
  status: 'good' | 'average' | 'poor';
}

export interface FinancialHealthScore {
  totalScore: number;
  grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' | 'Critical';
  color: string;
  components: {
    savingsRate: HealthScoreComponent;
    discretionaryDiscipline: HealthScoreComponent;
    essentialCushion: HealthScoreComponent;
  };
  explanationFormula: string;
  keyTakeaways: string[];
}

export interface FinancialGoal {
  title: string;
  targetAmount: number;
  targetMonths: number;
}

export interface GoalAnalysis {
  targetAmount: number;
  targetMonths: number;
  requiredMonthlySavings: number;
  currentMonthlySavings: number;
  monthlySurplusOrDeficit: number;
  isAchievableAtCurrentRate: boolean;
  projectedMonthsAtCurrentRate: number;
  gapAmount: number;
}

export interface Recommendation {
  id: string;
  category: Category | 'General';
  title: string;
  description: string;
  ruleTriggered: string; // Plain-language triggering rule
  currentSpend: number;
  suggestedSpend: number;
  potentialMonthlySavings: number;
  daysSavedOnGoal: number;
  priority: 'high' | 'medium' | 'low';
}

export interface MicroAction {
  headline: string;
  actionItem: string;
  estimatedInstantSaving: number;
  triggerReason: string;
  impactNote: string;
  difficulty: 'Easy' | 'Medium';
}

export interface ScoreHistoryRecord {
  id?: string;
  user_id?: string;
  month_label: string;
  score: number;
  grade: string;
  savings_rate: number;
  total_income: number;
  total_expenses: number;
  created_at?: string;
}

export interface UserAuthProfile {
  id: string;
  email: string;
  fullName?: string;
}
