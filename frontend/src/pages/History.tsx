import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getHistoryTimeline, deleteHistoryItem } from '../services/historyService';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Briefcase, 
  BrainCircuit, 
  ArrowUpDown, 
  Calendar, 
  Award,
  Loader2
} from 'lucide-react';

export const History: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ats' | 'jobMatch' | 'interview'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestScore' | 'lowestScore'>('newest');

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getHistoryTimeline();
      if (res.status === 'success') {
        setHistoryItems(res.data);
      } else {
        showToast('Failed to load history list', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error loading analysis history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record? This will not delete the uploaded resume.')) {
      return;
    }

    try {
      const res = await deleteHistoryItem(id);
      if (res.status === 'success') {
        showToast('Record deleted successfully', 'success');
        setHistoryItems(prev => prev.filter(item => item.id !== id));
      } else {
        showToast('Failed to delete record', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error deleting record', 'error');
    }
  };

  const handleOpen = (item: any) => {
    if (item.type === 'ats') {
      // The ATS results page is registered at /dashboard/results/:id, expecting the resumeId
      navigate(`/dashboard/results/${item.resumeId}`);
    } else if (item.type === 'jobMatch') {
      navigate(`/job-match/${item.id}`);
    } else if (item.type === 'interview') {
      navigate(`/interview/result/${item.id}`);
    }
  };

  // Filter and Sort Logic
  const filteredItems = historyItems
    .filter(item => {
      // Filter by type
      if (filterType !== 'all' && item.type !== filterType) return false;
      
      // Search query (Resume Name or Job Title)
      const query = searchQuery.toLowerCase();
      const matchResume = item.resumeTitle?.toLowerCase().includes(query);
      const matchJob = item.jobTitle?.toLowerCase().includes(query);
      
      return matchResume || matchJob;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      // For score sort, use fallback for items without scores
      const scoreA = a.score !== undefined && a.score !== null ? a.score : -1;
      const scoreB = b.score !== undefined && b.score !== null ? b.score : -1;
      
      if (sortBy === 'highestScore') {
        return scoreB - scoreA;
      }
      if (sortBy === 'lowestScore') {
        // Exclude items without score from lowest score sort if possible, or put them last
        if (scoreA === -1) return 1;
        if (scoreB === -1) return -1;
        return scoreA - scoreB;
      }
      return 0;
    });

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'text-slate-400 border-slate-800 bg-slate-900/50';
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-8 pb-16">
            
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analysis History</h1>
              <p className="text-slate-400">Manage and review all ATS analyses, job matches, and mock interview reports.</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4 rounded-2xl border border-slate-800/80 bg-slate-900/25 backdrop-blur-xl">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by resume name or job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 placeholder-slate-500 transition-colors text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Type Filter Buttons */}
                <div className="flex bg-slate-950/60 p-1 border border-slate-800/80 rounded-xl">
                  {(['all', 'ats', 'jobMatch', 'interview'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                        filterType === type 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type === 'jobMatch' ? 'Job Match' : type}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative flex items-center bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-semibold focus:outline-none pr-6 cursor-pointer appearance-none text-slate-200"
                  >
                    <option value="newest" className="bg-slate-950 text-slate-200">Newest</option>
                    <option value="oldest" className="bg-slate-950 text-slate-200">Oldest</option>
                    <option value="highestScore" className="bg-slate-950 text-slate-200">Highest Score</option>
                    <option value="lowestScore" className="bg-slate-950 text-slate-200">Lowest Score</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List/Timeline */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-slate-400 text-sm animate-pulse">Loading analysis history...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 px-4 border border-slate-800/80 rounded-3xl bg-slate-900/10 backdrop-blur-md">
                <div className="w-16 h-16 mx-auto bg-slate-900/60 rounded-full flex items-center justify-center border border-slate-800 mb-4">
                  <HistoryIcon className="w-7 h-7 text-slate-600" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">No reports found</h4>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  {searchQuery || filterType !== 'all' 
                    ? 'Adjust your search filters to find existing logs.' 
                    : "You haven't conducted any analyses or matches yet."}
                </p>
              </div>
            ) : (
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card flex flex-col justify-between border border-slate-800 hover:border-slate-700/80 bg-slate-900/15 hover:bg-slate-900/25 p-6 rounded-2xl transition-all group relative overflow-hidden"
                    >
                      {/* Card Type Header Accent */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent group-hover:via-indigo-500/40 transition-all duration-300" />
                      
                      <div>
                        {/* Header Row: Icon & Tag */}
                        <div className="flex justify-between items-start mb-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            item.type === 'ats' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : item.type === 'jobMatch'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>
                            {item.type === 'ats' && <FileText className="w-3 h-3" />}
                            {item.type === 'jobMatch' && <Briefcase className="w-3 h-3" />}
                            {item.type === 'interview' && <BrainCircuit className="w-3 h-3" />}
                            {item.type === 'ats' && 'ATS Analysis'}
                            {item.type === 'jobMatch' && 'Job Match'}
                            {item.type === 'interview' && 'Mock Interview'}
                          </span>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-2 mb-6">
                          <h3 className="font-bold text-white text-lg leading-snug line-clamp-1 group-hover:text-indigo-300 transition-colors" title={item.resumeTitle}>
                            {item.resumeTitle}
                          </h3>
                          
                          {/* Type-Specific Info */}
                          {item.type === 'jobMatch' && (
                            <p className="text-slate-400 text-xs font-medium flex items-center gap-1 leading-relaxed">
                              <span className="text-slate-500">Job:</span>
                              <span className="line-clamp-1 text-slate-300 font-semibold" title={item.jobTitle}>
                                {item.jobTitle}
                              </span>
                            </p>
                          )}

                          {item.type === 'interview' && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 font-medium mt-1">
                              <span className="flex items-center gap-1">
                                <span className="text-slate-500">Difficulty:</span> 
                                <span className="text-indigo-400 font-semibold">{item.difficulty}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-slate-500">Questions:</span> 
                                <span className="text-slate-300 font-semibold">{item.questionCount}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Row: Score (left) & Actions (right) */}
                      <div className="flex justify-between items-center pt-4 border-t border-slate-800/60 mt-auto">
                        
                        {/* Score display */}
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">
                            {item.type === 'interview' ? 'Score' : 'Match Score'}
                          </span>
                          {item.score !== undefined && item.score !== null ? (
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-2xl font-extrabold text-white tracking-tight">
                                {item.score}
                              </span>
                              <span className="text-xs text-slate-500 font-bold">/100</span>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-slate-500 italic">
                              Pending
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpen(item)}
                            className="inline-flex items-center gap-1 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-2 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-500 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
                            title="Delete log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
