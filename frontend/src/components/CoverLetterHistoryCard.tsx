import React from 'react';
import { Calendar, Building2, Briefcase, FileText, Trash2, ArrowRight } from 'lucide-react';

interface CoverLetterHistoryCardProps {
  letter: {
    _id: string;
    company: string;
    position: string;
    tone: string;
    length: string;
    createdAt: string;
  };
  onView: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const CoverLetterHistoryCard: React.FC<CoverLetterHistoryCardProps> = ({
  letter,
  onView,
  onDelete,
}) => {
  const formattedDate = new Date(letter.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div 
      onClick={() => onView(letter._id)}
      className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 shadow-lg hover:border-slate-700/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {letter.position}
            </h4>
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="line-clamp-1">{letter.company}</span>
            </div>
          </div>
          <button
            onClick={(e) => onDelete(letter._id, e)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            title="Delete Cover Letter"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-950/60 text-slate-300 border border-slate-800/80 rounded-full flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-slate-500" />
            {letter.tone}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-950/60 text-slate-300 border border-slate-800/80 rounded-full flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-500" />
            {letter.length}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </div>
        <span className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
          View & Edit <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
