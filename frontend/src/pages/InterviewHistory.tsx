import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getInterviewHistory, deleteInterview } from '../services/interviewService';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'framer-motion';
import { Clock, Eye, Trash2, AlertCircle, RefreshCw, MessageSquare, Plus } from 'lucide-react';

export const InterviewHistory: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getInterviewHistory();
      if (res.status === 'success') {
        setHistory(res.data || []);
      }
    } catch (err: any) {
      showToast('Failed to load interview history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this interview record?')) return;
    try {
      const res = await deleteInterview(id);
      if (res.status === 'success') {
        showToast('Interview session deleted', 'success');
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err: any) {
      showToast('Failed to delete interview record', 'error');
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Intermediate':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'Advanced':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1200px] mx-auto space-y-8 pb-16">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="w-8 h-8 text-indigo-400" />
                  Mock Interview History
                </h1>
                <p className="text-slate-400">
                  Review your past mock interview sessions, questions, evaluations, and overall performance.
                </p>
              </div>

              <button
                onClick={() => navigate('/interview')}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Start Mock Interview
              </button>
            </div>

            {/* Content Table/List */}
            {loading ? (
              <div className="flex justify-center p-12">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="glass-card p-12 text-center border border-slate-800 bg-slate-900/10 rounded-3xl space-y-4">
                <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-350">No Mock Interviews Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  You haven't completed any mock interviews yet. Start your first session to receive AI-powered grading.
                </p>
                <button
                  onClick={() => navigate('/interview')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
                >
                  Start First Session
                </button>
              </div>
            ) : (
              <div className="glass-card overflow-hidden border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-xs uppercase tracking-widest font-semibold">
                        <th className="px-6 py-4">Resume Title</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4">Questions</th>
                        <th className="px-6 py-4">Score</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/50">
                      {history.map((session, idx) => (
                        <tr key={session._id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">
                            {session.resumeId?.resumeTitle || 'Deleted Resume'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-450">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 border rounded-full font-semibold uppercase tracking-wider ${getDifficultyColor(session.difficulty)}`}>
                              {session.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-350">
                            {session.questionCount} Questions
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {session.score !== null && session.score !== undefined ? (
                              <span className={`font-bold ${session.score >= 80 ? 'text-emerald-400' : session.score >= 60 ? 'text-indigo-400' : 'text-rose-400'}`}>
                                {session.score}%
                              </span>
                            ) : (
                              <span className="text-amber-400 font-medium">Incomplete / Processing</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => navigate(`/interview/result/${session._id}`)}
                              className="p-2 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-400 rounded-lg transition"
                              title="View Result"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(session._id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-lg transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
