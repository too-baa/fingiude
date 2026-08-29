import React from 'react';
import { X, History, Database, CloudOff } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ScoreHistoryRecord, UserAuthProfile } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface ScoreHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyRecords: ScoreHistoryRecord[];
  user: UserAuthProfile | null;
}

export const ScoreHistoryModal: React.FC<ScoreHistoryModalProps> = ({
  isOpen,
  onClose,
  historyRecords,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            <History className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Historical Financial Score Trends</h2>
            <p className="text-xs text-slate-500">Privacy-Preserving Snapshot Logs (Zero Raw Transactions Persisted)</p>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-5 text-xs">
          <div className="flex items-center space-x-2">
            {isSupabaseConfigured && user ? (
              <>
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700">
                  Synced with Supabase Cloud DB for: <strong className="text-slate-900">{user.email}</strong>
                </span>
              </>
            ) : (
              <>
                <CloudOff className="w-4 h-4 text-amber-600" />
                <span className="text-slate-700">
                  Running in <strong>Local Storage Mode</strong> (Data remains exclusively on your device)
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            {historyRecords.length} Snapshots
          </span>
        </div>

        {/* History Line Chart */}
        <div className="h-60 w-full mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyRecords} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month_label" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ScoreHistoryRecord;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 text-white">
                        <div className="font-bold">{data.month_label}</div>
                        <div className="text-amber-400 font-mono font-bold">Health Score: {data.score} / 100</div>
                        <div className="text-slate-300">Savings Rate: {data.savings_rate}%</div>
                        <div className="text-slate-300">Rating: {data.grade}</div>
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
                strokeWidth={3}
                dot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Snapshots Table */}
        <div className="space-y-2 mb-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Past Score Records</h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Timeline</th>
                  <th className="p-2.5">Health Score</th>
                  <th className="p-2.5">Savings Rate</th>
                  <th className="p-2.5">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {historyRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 text-slate-700">
                    <td className="p-2.5 font-semibold text-slate-900">{r.month_label}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{r.score} / 100</td>
                    <td className="p-2.5 font-mono">{r.savings_rate}%</td>
                    <td className="p-2.5">
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

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
