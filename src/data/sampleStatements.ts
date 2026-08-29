export interface SampleDataset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  goal: { title: string; targetAmount: number; targetMonths: number };
  csvData: string;
}

export const BALANCED_BUDGET_CSV = `date,description,category,amount,type
2026-08-01,Tech Company Salary,Income,65000,credit
2026-08-02,House Rent,Housing,18000,debit
2026-08-03,Supermarket & Groceries,Food & Groceries,5500,debit
2026-08-05,Electricity & Water Bill,Utilities & Bills,2200,debit
2026-08-08,Metro & Fuel,Transport,2800,debit
2026-08-10,Weekend Dining & Zomato,Dining & Delivery,3200,debit
2026-08-14,Netflix & Spotify Subscriptions,Entertainment & OTT,999,debit
2026-08-18,Clothing & Essentials,Shopping & Lifestyle,3400,debit
2026-08-22,Pharmacy & Health Check,Health & Medical,1200,debit
2026-08-25,Internet & Mobile Recharge,Utilities & Bills,1400,debit
2026-08-28,Occasional Cafe & Coffee,Dining & Delivery,1100,debit`;

export const HIGH_SPENDER_CSV = `date,description,category,amount,type
2026-08-01,Consulting Salary,Income,60000,credit
2026-08-02,Apartment Rent,Housing,22000,debit
2026-08-03,Daily Swiggy & Dinner Takeouts,Dining & Delivery,9500,debit
2026-08-05,Weekend Pubs & Parties,Dining & Delivery,6800,debit
2026-08-08,Uber Premium Cabs,Transport,4600,debit
2026-08-11,Online Clothes & Shoes Sale,Shopping & Lifestyle,8200,debit
2026-08-15,Multiple Streaming & Gaming Subs,Entertainment & OTT,2499,debit
2026-08-18,Gadgets & Tech Accessories,Shopping & Lifestyle,4900,debit
2026-08-20,High Electricity (AC),Utilities & Bills,3800,debit
2026-08-24,Organic Market Groceries,Food & Groceries,4500,debit`;

export const INCOMPLETE_DATA_CSV = `date,description,category,amount,type
2026-08-02,House Rent,Housing,15000,debit
2026-08-04,Supermarket,Food & Groceries,4200,debit
2026-08-09,Food Delivery,Dining & Delivery,3100,debit
2026-08-15,Mobile & Electricity,Utilities & Bills,2100,debit
2026-08-20,Mall Shopping,Shopping & Lifestyle,3500,debit`;

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'balanced',
    name: '1. Balanced Budget (Healthy)',
    badge: 'Score ~84',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Disciplined spender with ~40% savings rate and minimal discretionary leaks. On track to reach goal.',
    goal: { title: 'Emergency Fund', targetAmount: 50000, targetMonths: 6 },
    csvData: BALANCED_BUDGET_CSV
  },
  {
    id: 'high_spender',
    name: '2. High Discretionary Leaks',
    badge: 'Score ~48',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Heavy Swiggy, Uber rides, and shopping eating up 94% of income. High potential for instant savings.',
    goal: { title: 'Goa Vacation & Gear', targetAmount: 40000, targetMonths: 4 },
    csvData: HIGH_SPENDER_CSV
  },
  {
    id: 'incomplete',
    name: '3. Incomplete (Missing Income)',
    badge: 'Graceful Degradation',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Statement without direct salary credit. Demonstrates graceful fallback estimates and user prompt.',
    goal: { title: 'New Laptop', targetAmount: 60000, targetMonths: 5 },
    csvData: INCOMPLETE_DATA_CSV
  }
];
