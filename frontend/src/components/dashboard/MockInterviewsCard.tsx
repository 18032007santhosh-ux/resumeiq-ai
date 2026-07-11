import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviewHistory } from '../../services/interviewService';
import { Sparkles, MessageSquare, Award, TrendingUp, Calendar, ChevronRight, Activity } from 'lucide-react';

export const MockInterviewsCard: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getInterviewHistory();
        if (res.status === 'success') {
          setHistory(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load history on dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalInterviews = history.length;
  
  const completedInterviews = history.filter(h => h.score !== null && h.score !== undefined);
  
  const bestScore = completedInterviews.length > 0 
    ? Math.max(...completedInterviews.map(h => h.score)) 
    : 0;

  const averageScore = completedInterviews.length > 0 
    ? Math.round(completedInterviews.reduce((acc, h) => acc + h.score, 0) / completedInterviews.length) 
    : 0;

  const recentSession = history.length > 0 ? history[0] : null;

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/30 shadow-xl flex flex-col justify-between h-full min-h-[350px]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Mock Interviews
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
            Personalized Prep
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 text-center">
            <span className="text-xs text-slate-500 block mb-1">Total</span>
            <span className="text-xl font-extrabold text-white">{totalInterviews}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 text-center">
            <span className="text-xs text-slate-500 block mb-1">Best</span>
            <span className="text-xl font-extrabold text-emerald-400">{bestScore > 0 ? `${bestScore}%` : '--'}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 text-center">
            <span className="text-xs text-slate-500 block mb-1">Average</span>
            <span className="text-xl font-extrabold text-indigo-400">{averageScore > 0 ? `${averageScore}%` : '--'}</span>
          </div>
        </div>

        {/* Recent Session Info */}
        {recentSession ? (
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Recent Session
              </span>
              <span>{new Date(recentSession.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-200 truncate max-w-[180px]">
                {recentSession.resumeId?.resumeTitle || 'My Resume'}
              </span>
              <span className={`text-xs font-bold ${recentSession.score >= 80 ? 'text-emerald-400' : recentSession.score >= 60 ? 'text-indigo-400' : 'text-rose-400'}`}>
                Score: {recentSession.score !== null ? `${recentSession.score}%` : 'Incomplete'}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-955/20 border border-slate-850/60 p-4 rounded-2xl text-center">
            <p className="text-slate-500 text-xs">No interviews recorded. Start preparing today!</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate('/interview')}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/10 transition flex items-center justify-center gap-1"
        >
          Start Prep
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/interview/history')}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl font-semibold transition"
        >
          History
        </button>
      </div>
    </div>
  );
};
