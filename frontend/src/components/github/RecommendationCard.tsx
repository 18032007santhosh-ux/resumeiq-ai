import React from 'react';
import { Lightbulb, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface RecommendationCardProps {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  strengths,
  weaknesses,
  recommendations
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-indigo-400" />
        AI Portfolio Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <CheckCircle2 className="w-4 h-4" />
            Key Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((str, index) => (
              <li key={index} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
            {strengths.length === 0 && (
              <p className="text-slate-500 text-xs italic">No strengths analyzed yet.</p>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4" />
            Areas for Improvement
          </h4>
          <ul className="space-y-2">
            {weaknesses.map((weak, index) => (
              <li key={index} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{weak}</span>
              </li>
            ))}
            {weaknesses.length === 0 && (
              <p className="text-slate-500 text-xs italic">No weaknesses analyzed yet.</p>
            )}
          </ul>
        </div>

        {/* Action Items / Recommendations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <ArrowUpRight className="w-4 h-4" />
            Action Checklist
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed bg-slate-950/20 hover:bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/60 transition">
                <span className="text-indigo-400 font-bold shrink-0">#{index + 1}</span>
                <span>{rec}</span>
              </li>
            ))}
            {recommendations.length === 0 && (
              <p className="text-slate-500 text-xs italic">No recommendations provided yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
