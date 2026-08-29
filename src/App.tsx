import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { StatementPage } from './pages/StatementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GuidancePage } from './pages/GuidancePage';
import { HistoryPage } from './pages/HistoryPage';

import { ScoreExplainerModal } from './components/ScoreExplainerModal';
import { AuthModal } from './components/AuthModal';
import { DisclaimerFooter } from './components/DisclaimerFooter';
import { IncompleteDataBanner } from './components/IncompleteDataBanner';

import { BALANCED_BUDGET_CSV, SampleDataset } from './data/sampleStatements';
import { parseCSVText } from './engine/csvParser';
import { calculateHealthScore } from './engine/scoringEngine';
import { analyzeGoal, generateRecommendations } from './engine/recommendationsEngine';
import { generateTodayMicroAction } from './engine/microActionEngine';
import { supabase, getScoreHistory, saveScoreRecord, clearAllLocalData } from './lib/supabase';
import { FinancialGoal, UserAuthProfile, ScoreHistoryRecord } from './types';

const DEFAULT_GOAL: FinancialGoal = {
  title: 'Emergency Fund',
  targetAmount: 50000,
  targetMonths: 6,
};

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const hash = window.location.hash.replace('#', '') as NavTab;
    if (['overview', 'statement', 'analytics', 'guidance', 'history'].includes(hash)) {
      return hash;
    }
    return 'overview';
  });

  // Keep URL hash in sync for easy hyperlinking
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavTab;
      if (['overview', 'statement', 'analytics', 'guidance', 'history'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Goal and Statement State
  const [activeGoal, setActiveGoal] = useState<FinancialGoal>(() => {
    try {
      const saved = localStorage.getItem('finhealth_active_goal');
      return saved ? JSON.parse(saved) : DEFAULT_GOAL;
    } catch {
      return DEFAULT_GOAL;
    }
  });

  const [rawCSV, setRawCSV] = useState<string>(BALANCED_BUDGET_CSV);
  const [activeDatasetName, setActiveDatasetName] = useState<string>('1. Balanced Budget (Healthy)');
  const [estimatedIncomeOverride, setEstimatedIncomeOverride] = useState<number | undefined>(undefined);

  // User and History State
  const [user, setUser] = useState<UserAuthProfile | null>(null);
  const [historyRecords, setHistoryRecords] = useState<ScoreHistoryRecord[]>([]);

  // Modals
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Supabase Auth & History
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || 'user@finhealth.ai' });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || 'user@finhealth.ai' });
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    getScoreHistory(user?.id).then((records) => {
      setHistoryRecords(records);
    });
  }, [user]);

  const handleGoalChange = (newGoal: FinancialGoal) => {
    setActiveGoal(newGoal);
    localStorage.setItem('finhealth_active_goal', JSON.stringify(newGoal));
  };

  // Pipeline Computations
  const { transactions, summary } = useMemo(() => {
    const { transactions, summary } = parseCSVText(rawCSV, estimatedIncomeOverride);
    return { transactions, summary };
  }, [rawCSV, estimatedIncomeOverride]);

  const healthScore = useMemo(() => {
    return calculateHealthScore(summary);
  }, [summary]);

  const goalAnalysis = useMemo(() => {
    return analyzeGoal(summary, activeGoal);
  }, [summary, activeGoal]);

  const recommendations = useMemo(() => {
    return generateRecommendations(summary, goalAnalysis);
  }, [summary, goalAnalysis]);

  const todayMicroAction = useMemo(() => {
    return generateTodayMicroAction(summary);
  }, [summary]);

  const handleSaveToHistory = async () => {
    const currentMonthLabel = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const record: ScoreHistoryRecord = {
      month_label: currentMonthLabel,
      score: healthScore.totalScore,
      grade: healthScore.grade,
      savings_rate: Math.round(summary.savingsRate),
      total_income: Math.round(summary.totalIncome),
      total_expenses: Math.round(summary.totalExpenses),
    };
    await saveScoreRecord(record, user?.id);
    const updated = await getScoreHistory(user?.id);
    setHistoryRecords(updated);
    alert('Score snapshot saved to history!');
  };

  const handleCustomFileUpload = (csvContent: string, fileName: string) => {
    setRawCSV(csvContent);
    setActiveDatasetName(fileName);
    setEstimatedIncomeOverride(undefined);
  };

  const handleSelectSample = (sample: SampleDataset) => {
    setRawCSV(sample.csvData);
    setActiveDatasetName(sample.name);
    setActiveGoal(sample.goal);
    setEstimatedIncomeOverride(undefined);
  };

  const handleClearSession = () => {
    if (window.confirm('Clear all session data and reset demo?')) {
      clearAllLocalData();
      setRawCSV(BALANCED_BUDGET_CSV);
      setActiveDatasetName('1. Balanced Budget (Healthy)');
      setActiveGoal(DEFAULT_GOAL);
      setEstimatedIncomeOverride(undefined);
      setHistoryRecords([]);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Multi-Page Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onClearSession={handleClearSession}
      />

      {/* Main Content Area with Generous Spacing */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Incomplete / Graceful Fallback Banner */}
        <IncompleteDataBanner
          summary={summary}
          onSetEstimatedIncome={(val) => setEstimatedIncomeOverride(val)}
        />

        {/* Animated Tab Page Router */}
        <div key={activeTab} className="page-transition">
          {activeTab === 'overview' && (
            <OverviewPage
              score={healthScore}
              summary={summary}
              goal={activeGoal}
              goalAnalysis={goalAnalysis}
              microAction={todayMicroAction}
              onNavigate={handleSelectTab}
              onOpenExplainer={() => setIsExplainerOpen(true)}
              onSnapshotScore={handleSaveToHistory}
            />
          )}

          {activeTab === 'statement' && (
            <StatementPage
              goal={activeGoal}
              onGoalChange={handleGoalChange}
              onFileUpload={handleCustomFileUpload}
              onSelectSample={handleSelectSample}
              activeDatasetName={activeDatasetName}
              transactions={transactions}
              summary={summary}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage summary={summary} />
          )}

          {activeTab === 'guidance' && (
            <GuidancePage
              recommendations={recommendations}
              goalAnalysis={goalAnalysis}
              goal={activeGoal}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              historyRecords={historyRecords}
              user={user}
              onSnapshotScore={handleSaveToHistory}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <DisclaimerFooter />

      {/* Modals */}
      <ScoreExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        score={healthScore}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </div>
  );
}

export default App;
