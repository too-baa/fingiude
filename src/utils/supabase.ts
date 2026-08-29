import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  'https://hnihjogokhfzpdmritvj.supabase.co';

const supabaseKey = 
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_LjHiTrObvJp2iLDxyyRNLg_lrUMibbz';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
