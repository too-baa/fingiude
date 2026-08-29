import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ScoreHistoryRecord } from '../types';

// Read from environment or local storage
const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  localStorage.getItem('supabase_url') || 
  'https://hnihjogokhfzpdmritvj.supabase.co';

const SUPABASE_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  localStorage.getItem('supabase_anon_key') || 
  'sb_publishable_LjHiTrObvJp2iLDxyyRNLg_lrUMibbz';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Local fallback for score history records (Zero cloud footprint)
const LOCAL_STORAGE_HISTORY_KEY = 'finhealth_score_history';

export const getScoreHistory = async (userId?: string): Promise<ScoreHistoryRecord[]> => {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('health_score_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as ScoreHistoryRecord[];
      }
    } catch (e) {
      console.warn('Supabase query fallback to local state', e);
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading localStorage history', e);
  }

  // Default seed history for demonstration
  return [
    { month_label: '2 Months Ago', score: 58, grade: 'Fair', savings_rate: 8, total_income: 50000, total_expenses: 46000 },
    { month_label: 'Last Month', score: 68, grade: 'Good', savings_rate: 16, total_income: 52000, total_expenses: 43680 },
  ];
};

export const saveScoreRecord = async (record: ScoreHistoryRecord, userId?: string): Promise<void> => {
  if (supabase && userId) {
    try {
      await supabase.from('health_score_history').insert([
        { ...record, user_id: userId }
      ]);
      return;
    } catch (e) {
      console.warn('Supabase insert failed, saving locally', e);
    }
  }

  // Fallback to localStorage
  try {
    const existing = await getScoreHistory();
    // Avoid duplicate month labels
    const filtered = existing.filter(r => r.month_label !== record.month_label);
    const updated = [...filtered, record];
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
};

export const clearAllLocalData = () => {
  localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  localStorage.removeItem('finhealth_active_goal');
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_anon_key');
};
