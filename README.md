# FinGuide — Personal Financial Health & Guidance Assistant 📊

> **DropHack'26 Fintech Track Submission**  
> An explainable, privacy-preserving AI assistant that ingests transaction statements, computes a deterministic 0–100 financial health score, and delivers goal-tailored budgeting guidance with clear mathematical rule triggers.

---

## 🌟 Key Highlights & Features

1. **Deterministic 3-Pillar Financial Health Score (0–100):**
   - **Savings Discipline (40 pts):** Evaluates baseline savings rate against 20%+ targets.
   - **Discretionary Control (30 pts):** Assesses non-essential wants vs. income ratio (30% benchmark).
   - **Essential Cushion (30 pts):** Benchmarks fixed commitments & emergency buffer (50% benchmark).
   - *100% Explainable & Transparent — Zero black-box ML.*

2. **Goal-Tailored Arithmetic Guidance:**
   - Evaluates progress against user targets (e.g. *Emergency Fund ₹50,000 in 6 months*).
   - Shows days shaved off the goal for every recommended behavior modification.
   - **Mandatory Trigger Explanations:** Every card displays the exact numerical trigger that activated it.

3. **Today's Standout Micro-Action:**
   - A single, high-leverage micro-step the user can take *literally today* (e.g., cancel unused OTT subscription, food delivery cap) with instant confetti celebration upon completion.

4. **100% Client-Side Privacy Architecture:**
   - Raw statement CSVs are parsed and analyzed entirely in the browser.
   - No raw transaction logs are ever transmitted to any third-party server.

5. **Supabase JWT Authentication & Score History:**
   - Authenticated with Supabase JWT Auth (Row-Level Security).
   - Only high-level aggregate score snapshots (`{ month_label, score, grade, savings_rate }`) are stored for longitudinal progress tracking.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Charts & Data Visualization:** Recharts, Lucide Icons, Canvas Confetti
- **Parsing:** PapaParse (in-browser CSV parsing with fuzzy column normalization)
- **Database & Auth:** Supabase (`@supabase/supabase-js`)

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/too-baa/paytm-drophack.git
cd paytm-drophack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://hnihjogokhfzpdmritvj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_LjHiTrObvJp2iLDxyyRNLg_lrUMibbz
VITE_SUPABASE_ANON_KEY=sb_publishable_LjHiTrObvJp2iLDxyyRNLg_lrUMibbz
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Supabase SQL Setup (Optional)
If running your own Supabase instance, run this query in your Supabase SQL editor:

```sql
CREATE TABLE IF NOT EXISTS health_score_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month_label TEXT NOT NULL,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  savings_rate NUMERIC NOT NULL,
  total_income NUMERIC NOT NULL,
  total_expenses NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE health_score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own score history"
ON health_score_history
FOR ALL
USING (auth.uid() = user_id);
```

---

## ⚖️ Regulatory Disclaimer
FinGuide is an educational financial literacy simulation and budgeting assistant. It does not provide certified investment advice, stock recommendations, or wealth management services.
