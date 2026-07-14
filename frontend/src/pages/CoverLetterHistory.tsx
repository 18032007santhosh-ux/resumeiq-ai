import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { CoverLetterHistoryCard } from '../components/CoverLetterHistoryCard';
import { getCoverLettersHistory, deleteCoverLetter } from '../services/coverLetterService';
import { useToast } from '../contexts/ToastContext';
import { FileText, Sparkles, Plus, History, RefreshCw, AlertCircle } from 'lucide-react';

export const CoverLetterHistory: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Cover Letter History | ResumeIQ AI';
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getCoverLettersHistory();
      if (res.status === 'success') {
        setHistoryList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load cover letters history', err);
      showToast('Failed to load cover letter history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/cover-letter?id=${id}`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this cover letter?')) return;

    try {
      const res = await deleteCoverLetter(id);
      if (res.status === 'success') {
        showToast('Cover letter deleted successfully!', 'success');
        setHistoryList(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete cover letter', err);
      showToast('Failed to delete cover letter.', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full min-h-0 relative overflow-hidden bg-slate-950/50">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-slate-100 to-purple-200 bg-clip-text text-transparent flex items-center gap-2.5">
                  <History className="w-8 h-8 text-indigo-400" />
                  Cover Letter History
                </h1>
                <p className="text-slate-400 mt-1 text-sm md:text-base">
                  Revisit, edit, and re-download your previously generated cover letters.
                </p>
              </div>
              <button
                onClick={() => navigate('/cover-letter')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" />
                Generate New
              </button>
            </div>

            {/* List / Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-6 rounded-2xl border border-slate-850 bg-slate-900/10 animate-pulse h-48 space-y-4">
                    <div className="h-5 bg-slate-800/60 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-800/40 rounded w-1/2"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-slate-800/40 rounded-full w-16"></div>
                      <div className="h-6 bg-slate-800/40 rounded-full w-16"></div>
                    </div>
                    <div className="h-4 bg-slate-800/30 rounded w-full pt-4"></div>
                  </div>
                ))}
              </div>
            ) : historyList.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl border border-slate-850 bg-slate-900/25 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                <div className="p-4 bg-slate-950/60 rounded-full border border-slate-800 text-slate-500">
                  <FileText className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-200">No Cover Letters Saved</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  You haven't generated any cover letters yet. Click the button below to get started.
                </p>
                <button
                  onClick={() => navigate('/cover-letter')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Cover Letter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyList.map((letter) => (
                  <CoverLetterHistoryCard
                    key={letter._id}
                    letter={letter}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
