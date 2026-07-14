import React from 'react';
import { History, Trash2, Eye, RefreshCw, GitBranch } from 'lucide-react';

interface HistoryItem {
  _id: string;
  githubUsername: string;
  githubUrl: string;
  overallScore: number;
  createdAt: string;
  resumeId: string;
}

interface HistoryCardProps {
  history: HistoryItem[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onReanalyze: (resumeId: string, githubUrl: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  history,
  onOpen,
  onDelete,
  onReanalyze
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-indigo-400" />
        Analysis History
      </h3>

      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm italic">
          No previous analyses found. Complete your first analysis above!
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {history.map((item) => {
            const date = new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={item._id} className="py-4 flex items-center justify-between gap-4 group">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-slate-500 shrink-0" />
                    {item.githubUsername}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">{item.githubUrl}</p>
                  <p className="text-[10px] text-slate-600 mt-1">Analyzed on {date}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Score pill */}
                  <span className="text-xs font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                    {item.overallScore}%
                  </span>

                  <button
                    onClick={() => onOpen(item._id)}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-350 hover:text-white rounded-lg transition"
                    title="View Report"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onReanalyze(item.resumeId, item.githubUrl)}
                    className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-lg transition"
                    title="Reanalyze Profile"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(item._id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
