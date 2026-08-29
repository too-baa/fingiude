import React, { useState } from 'react';
import { Target, FileText, Search, ArrowUpDown, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { FinancialGoal, Transaction, FinancialSummary } from '../types';
import { GoalInput } from '../components/GoalInput';
import { FileUploadZone } from '../components/FileUploadZone';
import { SampleDataset } from '../data/sampleStatements';

interface StatementPageProps {
  goal: FinancialGoal;
  onGoalChange: (goal: FinancialGoal) => void;
  onFileUpload: (csvContent: string, fileName: string) => void;
  onSelectSample: (sample: SampleDataset) => void;
  activeDatasetName: string;
  transactions: Transaction[];
  summary: FinancialSummary;
}

export const StatementPage: React.FC<StatementPageProps> = ({
  goal,
  onGoalChange,
  onFileUpload,
  onSelectSample,
  activeDatasetName,
  transactions,
  summary,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-12 py-4 max-w-6xl mx-auto">
      {/* Page Header with Generous Negative Space */}
      <div className="space-y-3 pb-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
          <FileText className="w-3.5 h-3.5 text-amber-700" />
          <span>Statement & Target Configuration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Financial Goal & Ingestion
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Calibrate your target goal milestone and ingest your bank or credit card transaction statements for instant client-side analysis.
        </p>
      </div>

      {/* Grid: Goal Input & File Upload with generous gap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 hover-card-lift">
          <GoalInput goal={goal} onChange={onGoalChange} />
        </div>
        <div className="lg:col-span-7 hover-card-lift">
          <FileUploadZone
            onFileUpload={onFileUpload}
            onSelectSample={onSelectSample}
            activeDatasetName={activeDatasetName}
          />
        </div>
      </div>

      {/* Transaction Explorer Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover-card-lift space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Parsed Transactions ({transactions.length})</h3>
            <p className="text-xs text-slate-500">Currently loaded dataset: <strong className="text-slate-800">{activeDatasetName}</strong></p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[380px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No transactions match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono text-slate-500">{tx.date}</td>
                    <td className="p-3 font-medium text-slate-900">{tx.description}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium text-[11px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tx.type === 'credit'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-3 text-right font-mono font-bold ${
                      tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
