import React from 'react';
import { History, Database, CloudOff, Plus, CheckCircle2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ScoreHistoryRecord, UserAuthProfile } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface HistoryPageProps {
  historyRecords: ScoreHistoryRecord[];
  user: UserAuthProfile | null;
  onSnapshotScore: () => void;
  onOpenAuth: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  historyRecords,
  user,
  onSnapshotScore,
  onOpenAuth,
}) => {
  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
            <History className="w-3.5 h-3.5 text-amber-700" />
            <span>Privacy-Preserving Longitudinal Tracking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial Score Trends
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Multi-month behavioral progression logs. Only aggregate score snapshots are stored — zero raw statement transactions.
          </p>
        </div>

        <button
          onClick={onSnapshotScore}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Save Current Month Snapshot</span>
        </button>
      </div>

      {/* Supabase Status Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isSupabaseConfigured && user ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
          }`}>
            {isSupabaseConfigured && user ? <Database className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {isSupabaseConfigured && user ? 'Supabase Cloud DB Active' : 'Local Storage Mode'}
              </h4>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                isSupabaseConfigured && user
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                {isSupabaseConfigured && user ? 'Synced' : 'Local Only'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSupabaseConfigured && user
                ? `Authenticated with JWT session for ${user.email}. Synchronized across devices.`
                : 'Score history is currently preserved exclusively in your local browser cache.'}
            </p>
          </div>
        </div>

        {!user && (
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
          >
            Sign In with Supabase
          </button>
        )}
      </div>

      {/* Main Score Trend Line Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Score Timeline (0–100)</h3>
            <p className="text-xs text-slate-500">Tracking financial discipline and savings consistency over time</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {historyRecords.length} Saved Snapshots
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyRecords} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month_label" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ScoreHistoryRecord;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-1 text-white">
                        <div className="font-bold">{data.month_label}</div>
                        <div className="text-amber-400 font-mono font-bold">Health Score: {data.score} / 100</div>
                        <div className="text-slate-300">Savings Rate: {data.savings_rate}%</div>
                        <div className="text-slate-300">Rating Grade: {data.grade}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#f59e0b"
                strokeWidth={3.5}
                dot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Snapshots Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Historical Snapshot Logs</h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Timeline Month</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Savings Rate</th>
                <th className="p-3">Monthly Inflow</th>
                <th className="p-3">Monthly Outflow</th>
                <th className="p-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {historyRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-semibold text-slate-900">{r.month_label}</td>
                  <td className="p-3 font-mono font-extrabold text-slate-900">{r.score} / 100</td>
                  <td className="p-3 font-mono">{r.savings_rate}%</td>
                  <td className="p-3 font-mono">₹{r.total_income.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-mono">₹{r.total_expenses.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-semibold">
                      {r.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
