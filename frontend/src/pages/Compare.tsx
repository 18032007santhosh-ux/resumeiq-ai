import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getResumes } from '../services/resumeService';
import {
  compareResumes,
  getComparisons,
  getComparisonById,
  deleteComparison
} from '../services/comparisonService';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCompare,
  Sparkles,
  AlertCircle,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  FileText,
  BadgeAlert,
  ListChecks,
  Check
} from 'lucide-react';

export const Compare: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
  // Data States
  const [resumes, setResumes] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedV1, setSelectedV1] = useState<string>('');
  const [selectedV2, setSelectedV2] = useState<string>('');
  
  // Active comparison state
  const [comparison, setComparison] = useState<any>(null);
  
  // Loading & Error States
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch initial resumes list
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);
        const res = await getResumes();
        if (res.status === 'success') {
          // Only show parsed resumes for comparison
          const parsedResumes = (res.data || []).filter(
            (r: any) => r.parsingStatus === 'Parsed Successfully'
          );
          setResumes(parsedResumes);
        }
      } catch (err: any) {
        showToast('Failed to load resumes for comparison', 'error');
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  // Fetch comparison history
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await getComparisons();
      if (res.status === 'success') {
        setHistory(res.data || []);
      }
    } catch (err: any) {
      showToast('Failed to load comparison history', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  // Load detail comparison if ID parameter changes
  useEffect(() => {
    const loadDetail = async () => {
      if (!id) {
        setComparison(null);
        return;
      }
      try {
        setLoadingDetail(true);
        const res = await getComparisonById(id);
        if (res.status === 'success') {
          setComparison(res.data);
          setActiveTab('new'); // Switch to comparison view tab
        }
      } catch (err: any) {
        showToast('Failed to load comparison details', 'error');
        navigate('/compare');
      } finally {
        setLoadingDetail(false);
      }
    };

    loadDetail();
  }, [id]);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedV1 || !selectedV2) {
      showToast('Please select both resumes to compare', 'error');
      return;
    }
    if (selectedV1 === selectedV2) {
      showToast('Please select two different resumes to compare', 'error');
      return;
    }

    try {
      setComparing(true);
      const res = await compareResumes(selectedV1, selectedV2);
      if (res.status === 'success') {
        showToast('Comparison completed successfully!', 'success');
        setComparison(res.data);
        // Navigate to the ID route to save state / allow bookmarking
        navigate(`/compare/${res.data._id}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error occurred while comparing resumes', 'error');
    } finally {
      setComparing(false);
    }
  };

  const handleDeleteHistory = async (compId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this comparison record?')) return;

    try {
      const res = await deleteComparison(compId);
      if (res.status === 'success') {
        showToast('Comparison record deleted', 'success');
        setHistory(prev => prev.filter(c => c._id !== compId));
        if (comparison?._id === compId) {
          setComparison(null);
          navigate('/compare');
        }
      }
    } catch (err: any) {
      showToast('Failed to delete comparison record', 'error');
    }
  };

  // Helper to extract score or use default 0
  const getScore = (resumeObj: any) => {
    return resumeObj?.atsScore || 0;
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  <GitCompare className="w-8 h-8 text-indigo-400" />
                  Resume Comparison Engine
                </h1>
                <p className="text-slate-400">
                  Compare two versions of your resume, visualize core improvements, and get AI insights.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-900/60 border border-slate-800 p-1.5 rounded-2xl w-fit">
                <button
                  onClick={() => {
                    setActiveTab('new');
                    if (!comparison) navigate('/compare');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === 'new'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Comparison
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === 'history'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  History
                </button>
              </div>
            </div>

            {/* TAB: NEW COMPARISON */}
            {activeTab === 'new' && (
              <div className="space-y-8">
                
                {/* Selector Card (when not viewing a result) */}
                {!comparison && !loadingDetail && (
                  <div className="glass-card p-6 sm:p-8 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-indigo-400" />
                      Select Resumes to Compare
                    </h2>

                    {loadingResumes ? (
                      <div className="flex justify-center p-8">
                        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                      </div>
                    ) : resumes.length < 2 ? (
                      <div className="text-center py-6">
                        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <h4 className="text-lg font-bold text-slate-350">Insufficient Resumes Found</h4>
                        <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                          You need at least 2 parsed resumes to run a comparison. Please upload and analyze another resume first.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleCompare} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Resume 1 Selection */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Base Version (Version 1)</label>
                            <select
                              value={selectedV1}
                              onChange={(e) => setSelectedV1(e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                            >
                              <option value="">-- Choose Base Resume --</option>
                              {resumes.map((r) => (
                                <option key={r._id} value={r._id} disabled={r._id === selectedV2}>
                                  {r.resumeTitle} (ATS: {r.atsScore ? `${r.atsScore}%` : 'N/A'})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Resume 2 Selection */}
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Newer Version (Version 2)</label>
                            <select
                              value={selectedV2}
                              onChange={(e) => setSelectedV2(e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                            >
                              <option value="">-- Choose Revised Resume --</option>
                              {resumes.map((r) => (
                                <option key={r._id} value={r._id} disabled={r._id === selectedV1}>
                                  {r.resumeTitle} (ATS: {r.atsScore ? `${r.atsScore}%` : 'N/A'})
                                </option>
                              ))}
                            </select>
                          </div>

                        </div>

                        <button
                          type="submit"
                          disabled={comparing || !selectedV1 || !selectedV2}
                          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {comparing ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              Comparing Resumes & Generating AI Summary...
                            </>
                          ) : (
                            <>
                              <GitCompare className="w-5 h-5" />
                              Compare Resumes
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Loading state for loading detail */}
                {loadingDetail && (
                  <div className="flex justify-center py-20">
                    <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
                  </div>
                )}

                {/* Comparison Results Dashboard */}
                {comparison && !loadingDetail && (
                  <div className="space-y-8 animate-fadeIn">
                    
                    {/* Floating Back/New Button */}
                    <button
                      onClick={() => {
                        setComparison(null);
                        navigate('/compare');
                      }}
                      className="px-4 py-2 border border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 rounded-xl transition text-sm font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Start New Comparison
                    </button>

                    {/* Compare Titles Card */}
                    <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="p-3 bg-slate-800/50 rounded-2xl text-indigo-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block">Version 1 (Base)</span>
                          <h4 className="text-lg font-bold text-white">{comparison.resumeId1?.resumeTitle || 'Deleted Resume'}</h4>
                        </div>
                      </div>

                      <div className="p-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400">
                        <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto text-right md:text-left justify-end md:justify-start">
                        <div className="order-2 md:order-1 text-right">
                          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block">Version 2 (Revised)</span>
                          <h4 className="text-lg font-bold text-white">{comparison.resumeId2?.resumeTitle || 'Deleted Resume'}</h4>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-2xl text-purple-400 order-1 md:order-2">
                          <FileText className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Scores Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Overall ATS Score Card */}
                      <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl flex flex-col justify-between">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-indigo-400" />
                          ATS Score Progression
                        </h3>

                        <div className="flex items-center justify-around py-4">
                          <div className="text-center">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block">v1 Score</span>
                            <span className="text-3xl font-extrabold text-slate-400">{getScore(comparison.resumeId1)}%</span>
                          </div>
                          
                          <div className="text-center">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block">v2 Score</span>
                            <span className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">{getScore(comparison.resumeId2)}%</span>
                          </div>
                        </div>

                        <div className={`mt-4 p-3 rounded-xl border text-center font-bold text-sm ${
                          comparison.comparisonData.diffSummary.scoreDifference >= 0
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          Score Change: {comparison.comparisonData.diffSummary.scoreDifference >= 0 ? '+' : ''}{comparison.comparisonData.diffSummary.scoreDifference}%
                        </div>
                      </div>

                      {/* AI suggestions preview summary */}
                      <div className="glass-card lg:col-span-2 p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            AI Overall Summary
                          </h3>
                          <p className="text-slate-350 text-sm leading-relaxed">
                            {comparison.comparisonData.aiSummary?.overallSummary}
                          </p>
                        </div>

                        {/* Overview stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 text-center">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Skills Added</span>
                            <span className="text-lg font-bold text-emerald-400">+{comparison.comparisonData.diffSummary.skills.addedCount}</span>
                          </div>
                          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 text-center">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Skills Removed</span>
                            <span className="text-lg font-bold text-rose-400">-{comparison.comparisonData.diffSummary.skills.removedCount}</span>
                          </div>
                          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 text-center">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Keywords Added</span>
                            <span className="text-lg font-bold text-emerald-400">+{comparison.comparisonData.diffSummary.keywords.addedCount}</span>
                          </div>
                          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 text-center">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Keywords Removed</span>
                            <span className="text-lg font-bold text-rose-400">-{comparison.comparisonData.diffSummary.keywords.removedCount}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Deep AI Improvements & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Key Improvements */}
                      <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          Key Improvements Made
                        </h3>
                        <ul className="space-y-3">
                          {comparison.comparisonData.aiSummary?.improvements?.map((imp: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-300">
                              <span className="text-emerald-400 shrink-0 mt-0.5"><Check className="w-4 h-4" /></span>
                              {imp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Remaining Weaknesses */}
                      <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <BadgeAlert className="w-5 h-5 text-amber-400" />
                          Remaining Weaknesses
                        </h3>
                        <ul className="space-y-3">
                          {comparison.comparisonData.aiSummary?.weaknesses?.map((weak: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-300">
                              <span className="text-amber-400 shrink-0 mt-0.5"><AlertCircle className="w-4 h-4" /></span>
                              {weak}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Next Action Items */}
                    <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-indigo-400" />
                        AI-Recommended Action Items
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {comparison.comparisonData.aiSummary?.actionItems?.map((act: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950/40 border border-slate-850 rounded-2xl">
                            <input
                              type="checkbox"
                              className="mt-1 accent-indigo-500 rounded cursor-pointer"
                            />
                            <span className="text-sm text-slate-300 leading-relaxed">{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Diff Visual Component */}
                    <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl space-y-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <GitCompare className="w-5 h-5 text-indigo-400" />
                        Skills Comparison
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Added Skills */}
                        {comparison.comparisonData.skills.added?.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Added Skills</span>
                            <div className="flex flex-wrap gap-2">
                              {comparison.comparisonData.skills.added.map((s: string) => (
                                <span key={s} className="px-3 py-1 text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-full">
                                  +{s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Removed Skills */}
                        {comparison.comparisonData.skills.removed?.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest block">Removed Skills</span>
                            <div className="flex flex-wrap gap-2">
                              {comparison.comparisonData.skills.removed.map((s: string) => (
                                <span key={s} className="px-3 py-1 text-xs font-medium border border-rose-500/20 bg-rose-500/10 text-rose-450 rounded-full line-through">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Common Skills */}
                        {comparison.comparisonData.skills.common?.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Unchanged Skills</span>
                            <div className="flex flex-wrap gap-2">
                              {comparison.comparisonData.skills.common.map((s: string) => (
                                <span key={s} className="px-3 py-1 text-xs font-medium border border-slate-800 bg-slate-900/40 text-slate-400 rounded-full">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Keywords Diff Visual Component */}
                    <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl space-y-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Keywords Comparison
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Added Keywords */}
                        {comparison.comparisonData.keywords.added?.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">New Keywords Detected</span>
                            <div className="flex flex-wrap gap-2">
                              {comparison.comparisonData.keywords.added.map((k: string) => (
                                <span key={k} className="px-2.5 py-1 text-[11px] font-medium border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 rounded-lg">
                                  +{k}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Removed Keywords */}
                        {comparison.comparisonData.keywords.removed?.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest block">Missing Keywords</span>
                            <div className="flex flex-wrap gap-2">
                              {comparison.comparisonData.keywords.removed.map((k: string) => (
                                <span key={k} className="px-2.5 py-1 text-[11px] font-medium border border-rose-500/10 bg-rose-500/5 text-rose-450 rounded-lg line-through">
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Common Keywords */}
                        {comparison.comparisonData.keywords.common?.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Shared Keywords</span>
                            <div className="flex flex-wrap gap-2">
                              {comparison.comparisonData.keywords.common.map((k: string) => (
                                <span key={k} className="px-2.5 py-1 text-[11px] font-medium border border-slate-800 bg-slate-900/40 text-slate-400 rounded-lg">
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section Diff Details */}
                    <div className="glass-card p-6 border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl space-y-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        Detailed Section Analysis
                      </h3>
                      
                      <div className="divide-y divide-slate-850">
                        {/* Summary Section */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <span className="font-semibold text-white">Summary/Objective</span>
                            <p className="text-xs text-slate-500 mt-1">Overall resume intro/pitch</p>
                          </div>
                          <div className="text-sm text-slate-450">
                            Base: {comparison.comparisonData.sections.summary.v1Length} chars
                          </div>
                          <div className="text-sm font-semibold">
                            Revised: {comparison.comparisonData.sections.summary.v2Length} chars
                            <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${
                              comparison.comparisonData.sections.summary.changed
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                : 'bg-slate-900 border border-slate-800 text-slate-500'
                            }`}>
                              {comparison.comparisonData.sections.summary.changed ? 'Modified' : 'No Change'}
                            </span>
                          </div>
                        </div>

                        {/* Experience Section */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <span className="font-semibold text-white">Work Experience</span>
                            <p className="text-xs text-slate-500 mt-1">Employment entries parsed</p>
                          </div>
                          <div className="text-sm text-slate-450">
                            Base: {comparison.comparisonData.sections.experience.v1Count} roles
                          </div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            Revised: {comparison.comparisonData.sections.experience.v2Count} roles
                            {comparison.comparisonData.sections.experience.v2Count !== comparison.comparisonData.sections.experience.v1Count && (
                              <span className="text-xs font-normal text-indigo-400">
                                ({comparison.comparisonData.sections.experience.v2Count > comparison.comparisonData.sections.experience.v1Count ? '+' : ''}
                                {comparison.comparisonData.sections.experience.v2Count - comparison.comparisonData.sections.experience.v1Count})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Projects Section */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <span className="font-semibold text-white">Projects</span>
                            <p className="text-xs text-slate-500 mt-1">Project entries parsed</p>
                          </div>
                          <div className="text-sm text-slate-450">
                            Base: {comparison.comparisonData.sections.projects.v1Count} entries
                          </div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            Revised: {comparison.comparisonData.sections.projects.v2Count} entries
                            {comparison.comparisonData.sections.projects.v2Count !== comparison.comparisonData.sections.projects.v1Count && (
                              <span className="text-xs font-normal text-indigo-400">
                                ({comparison.comparisonData.sections.projects.v2Count > comparison.comparisonData.sections.projects.v1Count ? '+' : ''}
                                {comparison.comparisonData.sections.projects.v2Count - comparison.comparisonData.sections.projects.v1Count})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Education Section */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <span className="font-semibold text-white">Education</span>
                            <p className="text-xs text-slate-500 mt-1">Degrees/Schools parsed</p>
                          </div>
                          <div className="text-sm text-slate-450">
                            Base: {comparison.comparisonData.sections.education.v1Count} entries
                          </div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            Revised: {comparison.comparisonData.sections.education.v2Count} entries
                            {comparison.comparisonData.sections.education.v2Count !== comparison.comparisonData.sections.education.v1Count && (
                              <span className="text-xs font-normal text-indigo-400">
                                ({comparison.comparisonData.sections.education.v2Count > comparison.comparisonData.sections.education.v1Count ? '+' : ''}
                                {comparison.comparisonData.sections.education.v2Count - comparison.comparisonData.sections.education.v1Count})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Certifications Section */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <span className="font-semibold text-white">Certifications</span>
                            <p className="text-xs text-slate-500 mt-1">Certificates/Credentials parsed</p>
                          </div>
                          <div className="text-sm text-slate-450">
                            Base: {comparison.comparisonData.sections.certifications.v1Count} entries
                          </div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            Revised: {comparison.comparisonData.sections.certifications.v2Count} entries
                            {comparison.comparisonData.sections.certifications.v2Count !== comparison.comparisonData.sections.certifications.v1Count && (
                              <span className="text-xs font-normal text-indigo-400">
                                ({comparison.comparisonData.sections.certifications.v2Count > comparison.comparisonData.sections.certifications.v1Count ? '+' : ''}
                                {comparison.comparisonData.sections.certifications.v2Count - comparison.comparisonData.sections.certifications.v1Count})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB: COMPARISON HISTORY */}
            {activeTab === 'history' && (
              <div className="glass-card overflow-hidden border border-slate-800 bg-slate-900/10 rounded-3xl shadow-xl">
                {loadingHistory ? (
                  <div className="flex justify-center p-12">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-350">No Comparisons Found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      You haven't run any resume comparisons yet. Run your first comparison to see version improvements.
                    </p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
                    >
                      Compare First Resumes
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-xs uppercase tracking-widest font-semibold">
                          <th className="px-6 py-4">Base Resume (v1)</th>
                          <th className="px-6 py-4">Newer Resume (v2)</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Score Shift</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/50">
                        {history.map((comp) => {
                          const shift = comp.score2 - comp.score1;
                          return (
                            <tr
                              key={comp._id}
                              onClick={() => navigate(`/compare/${comp._id}`)}
                              className="hover:bg-slate-900/20 transition-colors cursor-pointer"
                            >
                              <td className="px-6 py-4 font-semibold text-white">
                                {comp.resumeId1?.resumeTitle || 'Deleted Resume'}
                                <span className="text-xs text-slate-500 block mt-0.5">Score: {comp.score1}%</span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-white">
                                {comp.resumeId2?.resumeTitle || 'Deleted Resume'}
                                <span className="text-xs text-slate-500 block mt-0.5">Score: {comp.score2}%</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-450">
                                {new Date(comp.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`font-bold px-2 py-0.5 rounded-full border text-xs ${
                                  shift >= 0
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-450'
                                }`}>
                                  {shift >= 0 ? '+' : ''}{shift}%
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/compare/${comp._id}`);
                                  }}
                                  className="p-2 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-400 rounded-lg transition"
                                  title="View Result"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteHistory(comp._id, e)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-lg transition"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
