import React from 'react';
import { AlertCircle, Lock } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Important Regulatory & Security Disclaimer (Hackathon Constraint) */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 block">Regulatory & Financial Advisory Notice</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              FinHealthAI is an educational financial literacy simulator and budgeting tool. This platform <strong>does not provide certified investment advice</strong>, stock recommendations, or wealth management services. All calculations are rule-based arithmetic models tailored for personal budgeting discipline.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Built for DropHack'26 • 100% Client-Side Privacy Architecture</span>
          </div>
          <div className="mt-1 sm:mt-0 flex items-center space-x-4 font-medium">
            <span>Synthetic Data Only</span>
            <span>Zero Persistent Raw Statement Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
