import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getResumes, matchJobDescription } from '../services/resumeService';
import { getHistoryItem } from '../services/historyService';
import { useToast } from '../contexts/ToastContext';
import AtsScoreRing from '../components/dashboard/AtsScoreRing';
import { Briefcase, AlertCircle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';

export const JobMatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [results, setResults] = useState<any | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setResumesLoading(true);
        const res = await getResumes();
        const parsedResumes = res.data.filter((r: any) => r.parsingStatus === 'Parsed Successfully');
        setResumes(parsedResumes);
        // Only default to first resume if we aren't loading a saved match
        if (parsedResumes.length > 0 && !id) {
          setSelectedResumeId(parsedResumes[0]._id);
        }
      } catch (err: any) {
        showToast('Failed to load resumes', 'error');
      } finally {
        setResumesLoading(false);
      }
    };
    fetchResumes();
  }, [id]);

  useEffect(() => {
    const fetchSavedMatch = async () => {
      if (!id) {
        setResults(null);
        setJobDescription('');
        return;
      }
      try {
        setLoading(true);
        const res = await getHistoryItem(id);
        if (res.status === 'success' && res.type === 'jobMatch') {
          setResults(res.data);
          if (res.data.resumeId) {
            setSelectedResumeId(res.data.resumeId._id || res.data.resumeId);
          }
          if (res.data.jobDescription) {
            setJobDescription(res.data.jobDescription);
          }
        } else {
          showToast('Failed to load job match details', 'error');
        }
      } catch (err: any) {
        console.error(err);
        showToast('Error loading job match details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedMatch();
  }, [id]);

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      showToast('Please select a resume first', 'error');
      return;
    }
    if (!jobDescription.trim()) {
      showToast('Please paste a job description', 'error');
      return;
    }

    try {
      setLoading(true);
      setResults(null);
      const res = await matchJobDescription(selectedResumeId, jobDescription);
      if (res.status === 'success') {
        setResults(res.data);
        showToast('Job match analysis complete!', 'success');
      } else {
        showToast(res.message || 'Analysis failed', 'error');
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error occurred while analyzing matching score';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
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
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Job Description Matching</h1>
              <p className="text-slate-400">Compare your resume against a job posting to check your compatibility score and keyword matches.</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/30">
              <div className="space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Select Resume</label>
                  {resumesLoading ? (
                    <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
                  ) : resumes.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm">
                        No parsed resumes found. Please upload and parse a resume first in the{' '}
                        <a href="/dashboard/resumes" className="underline font-semibold hover:text-amber-300">
                          Resume Manager
                        </a>.
                      </p>
                    </div>
                  ) : (
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 transition-colors"
                    >
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.resumeTitle} (Uploaded: {new Date(r.uploadDate).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Job Description</label>
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete Job Description here..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 placeholder-slate-600 transition-colors font-mono text-sm resize-y"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || resumes.length === 0}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing Match...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5" />
                      Analyze Match
                    </>
                  )}
                </button>
              </div>
            </div>

            {results && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/30 flex flex-col justify-center text-center">
                    <h3 className="text-xl font-bold text-white mb-6">Overall Match Score</h3>
                    <AtsScoreRing score={results.overallMatch} />
                    <p className="text-sm text-slate-400 mt-6 max-w-xs mx-auto">
                      This score represents the compatibility of your resume with the job requirements.
                    </p>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className={`p-6 rounded-2xl border flex flex-col justify-between ${getScoreColor(results.keywordMatch)}`}>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Keyword Match</span>
                        <h4 className="text-2xl font-extrabold mt-1">{results.keywordMatch}%</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-4">Matches general vocabulary and tech terminology.</p>
                    </div>

                    <div className={`p-6 rounded-2xl border flex flex-col justify-between ${getScoreColor(results.skillsMatch)}`}>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills Match</span>
                        <h4 className="text-2xl font-extrabold mt-1">{results.skillsMatch}%</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-4">Compares tech skills with listed job skills.</p>
                    </div>

                    <div className={`p-6 rounded-2xl border flex flex-col justify-between ${getScoreColor(results.experienceMatch)}`}>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience Match</span>
                        <h4 className="text-2xl font-extrabold mt-1">{results.experienceMatch}%</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-4">Assesses roles and relevance of past experience.</p>
                    </div>

                    <div className={`p-6 rounded-2xl border flex flex-col justify-between ${getScoreColor(results.educationMatch)}`}>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Education Match</span>
                        <h4 className="text-2xl font-extrabold mt-1">{results.educationMatch}%</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-4">Verifies degrees and academic background alignment.</p>
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Matched Keywords ({results.matchedKeywords.length})
                    </h3>
                    {results.matchedKeywords.length === 0 ? (
                      <p className="text-sm text-slate-500">No matched keywords found.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {results.matchedKeywords.map((kw: string) => (
                          <span key={kw} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-400" />
                      Missing Keywords ({results.missingKeywords.length})
                    </h3>
                    {results.missingKeywords.length === 0 ? (
                      <p className="text-sm text-slate-500">No missing keywords! Excellent.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {results.missingKeywords.map((kw: string) => (
                          <span key={kw} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-semibold">
                            ✗ {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/30">
                  <h3 className="text-xl font-bold text-white mb-6">AI Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-semibold shrink-0 text-sm">
                          {index + 1}
                        </div>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
