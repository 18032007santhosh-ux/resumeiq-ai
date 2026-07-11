import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getResumes, getJobMatches } from '../services/resumeService';
import { generateInterview } from '../services/interviewService';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, RefreshCw, Clock, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

export const Interview: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  
  // Setup state
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedJobMatchId, setSelectedJobMatchId] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(10);
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Active session state
  const [session, setSession] = useState<any | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [resumesRes, matchesRes] = await Promise.all([getResumes(), getJobMatches()]);
        
        const parsedRes = resumesRes.data.filter((r: any) => r.parsingStatus === 'Parsed Successfully');
        setResumes(parsedRes);
        if (parsedRes.length > 0) {
          setSelectedResumeId(parsedRes[0]._id);
        }

        setJobMatches(matchesRes.data || []);
      } catch (err: any) {
        showToast('Failed to load initial data', 'error');
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const handleStartInterview = async () => {
    if (!selectedResumeId) {
      showToast('Please select a parsed resume first', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await generateInterview(
        selectedResumeId,
        selectedJobMatchId || null,
        difficulty,
        questionCount
      );

      if (res.status === 'success') {
        setSession(res.data);
        setAnswers({});
        setCurrentIdx(0);
        setElapsedTime(0);
        setTimerActive(true);
        showToast('Interview generated successfully!', 'success');
      } else {
        showToast(res.message || 'Failed to generate interview', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Error creating interview session', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: text,
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setTimerActive(false);
    try {
      setSubmitting(true);
      
      const formattedAnswers = session.questions.map((q: any, index: number) => ({
        questionIndex: index,
        answer: answers[index] || '',
      }));

      // Call submit API
      const res = await generateInterviewSubmit(session._id, formattedAnswers);
      if (res.status === 'success') {
        showToast('Answers submitted and evaluated!', 'success');
        navigate(`/interview/result/${session._id}`);
      } else {
        showToast(res.message || 'Submission failed', 'error');
        setTimerActive(true);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Error submitting interview answers', 'error');
      setTimerActive(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper import submission
  const generateInterviewSubmit = async (sessionId: string, userAnswers: any[]) => {
    const { submitInterview } = await import('../services/interviewService');
    return await submitInterview(sessionId, userAnswers);
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[900px] mx-auto space-y-8 pb-16">
            
            <AnimatePresence mode="wait">
              {!session ? (
                // Setup Form Screen
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                      AI Mock Interview Setup
                    </h1>
                    <p className="text-slate-400">
                      Configure your personalized mock interview. We'll use your resume data to generate realistic Questions.
                    </p>
                  </div>

                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Select Resume</label>
                      {dataLoading ? (
                        <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
                      ) : resumes.length === 0 ? (
                        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <p className="text-sm">
                            No parsed resumes found. Please upload and parse a resume first.
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
                              {r.resumeTitle} (ATS Score: {r.atsScore || 'N/A'})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Link Job Match Report (Optional)
                      </label>
                      {dataLoading ? (
                        <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
                      ) : (
                        <select
                          value={selectedJobMatchId}
                          onChange={(e) => setSelectedJobMatchId(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 transition-colors"
                        >
                          <option value="">-- No Specific Job Description Match --</option>
                          {jobMatches.map((m) => (
                            <option key={m._id} value={m._id}>
                              Match with Resume: {m.resumeId?.resumeTitle || 'Title'} (Match Score: {m.overallMatch}%)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Difficulty</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 transition-colors"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Number of Questions</label>
                        <select
                          value={questionCount}
                          onChange={(e) => setQuestionCount(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 transition-colors"
                        >
                          <option value={10}>10 Questions</option>
                          <option value={20}>20 Questions</option>
                          <option value={30}>30 Questions</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleStartInterview}
                      disabled={loading || resumes.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-850 disabled:to-slate-850 disabled:text-slate-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Generating AI Mock Interview Questions... (This takes a few seconds)
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate Interview
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Active Interview Screen
                <motion.div
                  key="session"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Active Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Session</p>
                        <h2 className="text-sm font-bold text-white">
                          Difficulty: <span className="text-indigo-400">{session.difficulty}</span>
                        </h2>
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-slate-800 rounded-xl text-slate-300 font-mono text-sm">
                      <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span>{formatTime(elapsedTime)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>
                        {currentIdx + 1} / {session.questions.length} Questions
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 border border-slate-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${((currentIdx + 1) / session.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/20 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full uppercase tracking-widest">
                        {session.questions[currentIdx].category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Question {currentIdx + 1} of {session.questions.length}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 leading-relaxed">
                      {session.questions[currentIdx].question}
                    </h3>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-300">Your Answer</label>
                      <textarea
                        rows={8}
                        value={answers[currentIdx] || ''}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-200 placeholder-slate-700 transition-colors resize-y font-sans leading-relaxed"
                      />
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-6">
                      <button
                        onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                        disabled={currentIdx === 0}
                        className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-slate-200 rounded-xl font-medium transition-colors flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </button>

                      {currentIdx < session.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentIdx((p) => Math.min(session.questions.length - 1, p + 1))}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Evaluating Answers...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Submit Interview
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
};
