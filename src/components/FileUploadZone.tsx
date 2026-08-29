import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Download, Play, CheckCircle2 } from 'lucide-react';
import { SAMPLE_DATASETS, SampleDataset } from '../data/sampleStatements';

interface FileUploadZoneProps {
  onFileUpload: (csvContent: string, fileName: string) => void;
  onSelectSample: (sample: SampleDataset) => void;
  activeDatasetName?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  onSelectSample,
  activeDatasetName,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onFileUpload(text, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onFileUpload(text, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadTemplate = () => {
    const templateCSV = `date,description,category,amount,type
2026-08-01,Monthly Salary,Income,60000,credit
2026-08-02,House Rent,Housing,18000,debit
2026-08-03,Grocery Store,Food & Groceries,4500,debit
2026-08-05,Electricity Bill,Utilities & Bills,2100,debit
2026-08-10,Restaurant Dinner,Dining & Delivery,2800,debit
2026-08-15,Streaming Subs,Entertainment & OTT,999,debit`;
    const blob = new Blob([templateCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_statement_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
          <FileText className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">2. Ingest Transaction Statement</h3>
          <p className="text-xs text-slate-500">Upload your own CSV or test with one-click sample datasets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Upload Box */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center h-full min-h-[140px] ${
              isDragging
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-300 bg-slate-50/60 hover:border-amber-400 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,text/csv"
              className="hidden"
            />
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center mb-2 text-amber-700">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold">
              Drop your statement CSV or <span className="text-amber-600 underline underline-offset-2">browse</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Supports: date, description, category, amount, type</p>
          </div>

          <div className="mt-2 flex justify-end">
            <button
              onClick={downloadTemplate}
              className="text-xs text-slate-500 hover:text-amber-700 font-medium flex items-center gap-1 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
          </div>
        </div>

        {/* Right Side: Demo Statement Selectors */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Instant Demo Statements</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">Click to load</span>
          </div>

          <div className="space-y-1.5">
            {SAMPLE_DATASETS.map((dataset) => {
              const isActive = activeDatasetName === dataset.name;
              return (
                <button
                  key={dataset.id}
                  onClick={() => onSelectSample(dataset)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-50 border-amber-400 text-slate-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate mr-2">
                    <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      {dataset.name}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white border border-slate-200 text-slate-700 shrink-0">
                    {dataset.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
