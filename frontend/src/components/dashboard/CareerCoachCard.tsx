import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ChevronRight, MessageSquare, Target, Lightbulb } from 'lucide-react';

export const CareerCoachCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/30 shadow-xl flex flex-col justify-between h-full min-h-[350px]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            AI Career Coach
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
            Personalized Guidance
          </span>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          Unlock personalized guidance based on your resume profile, ATS scores, and target job roles. Ask career questions, identify missing skills, and build your professional learning roadmap.
        </p>

        {/* Feature List */}
        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-850">
            <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Interactive Career Mentorship</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-850">
            <Target className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Missing Skill Gap Analysis</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-850">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Custom Roadmaps & Certifications</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/dashboard/career-coach')}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/10 transition flex items-center justify-center gap-1"
        >
          Consult Career Coach
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
