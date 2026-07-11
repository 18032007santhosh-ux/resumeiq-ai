import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getInterviewById } from '../services/interviewService';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'framer-motion';
import { Award, Target, HelpCircle, ChevronDown, ChevronUp, AlertCircle, ArrowLeft, RefreshCw, Star, Info, XCircle } from 'lucide-react';
import AtsScoreRing from '../components/dashboard/AtsScoreRing';

export const InterviewResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: number]: boolean }>({ 0: true });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (!id) return;
        const res = await getInterviewById(id);
        if (res.status === 'success') {
          setSession(res.data);
        } else {
          showToast('Failed to fetch result details', 'error');
        }
      } catch (err: any) {
        console.error(err);
        showToast('Error loading interview result data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#070913] text-slate-100 items-center justify-center space-x-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="font-semibold text-slate-300">Loading evaluation report...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen bg-[#070913] text-slate-100 flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h3 className="text-xl font-bold">Report Not Found</h3>
        <button
          onClick={() => navigate('/interview')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  const overall = session.overallFeedback || { score: session.score || 0, strengths: [], weaknesses: [], recommendedTopics: [] };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1100px] mx-auto space-y-8 pb-16">
            
            {/* Back Header */}
            <div>
              <button
                onClick={() => navigate('/interview/history')}
                className="flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-2 gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to History
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">Interview Evaluation Report</h1>
              <p className="text-slate-400">
                Detailed scoring, breakdown, strengths, weaknesses, and model answers from your AI evaluation.
              </p>
            </div>

            {/* Score Cards & Overall Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Overall Score */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold text-white mb-6">Overall Interview Score</h2>
                <AtsScoreRing score={overall.score} />
                <p className="text-center text-slate-400 text-xs mt-6 max-w-xs">
                  Your answers have been graded based on structure, completeness, accuracy, and technical competence.
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-indigo-400" />
                    Overall Feedback
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-400 mb-2">Strengths</h4>
                      <ul className="space-y-1.5">
                        {overall.strengths?.map((str: string, index: number) => (
                          <li key={index} className="text-sm text-slate-350 flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span> {str}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-rose-400 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1.5">
                        {overall.weaknesses?.map((weak: string, index: number) => (
                          <li key={index} className="text-sm text-slate-350 flex items-start gap-2">
                            <span className="text-rose-400 mt-1">•</span> {weak}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommended Topics */}
                {overall.recommendedTopics && overall.recommendedTopics.length > 0 && (
                  <div className="border-t border-slate-800/80 pt-4">
                    <h4 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-1.5">
                      <Target className="w-4 h-4" /> Recommended Topics to Study
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {overall.recommendedTopics.map((topic: string, index: number) => (
                        <span key={index} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Question-by-Question Review</h2>
              
              {session.questions.map((q: any, idx: number) => {
                const answerObj = session.userAnswers?.find((ua: any) => ua.questionIndex === idx) || { answer: '' };
                const fbObj = session.feedback?.find((fb: any) => fb.questionIndex === idx) || {
                  score: 0, strengths: [], weaknesses: [], suggestions: ''
                };
                const isOpen = expandedQuestions[idx];

                return (
                  <div key={idx} className="border border-slate-800 bg-slate-900/20 rounded-2xl overflow-hidden transition-colors">
                    {/* Header bar */}
                    <button
                      onClick={() => toggleQuestion(idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-850/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 border rounded-full uppercase tracking-wider ${getScoreColor(fbObj.score)}`}>
                          {fbObj.score}%
                        </span>
                        <div>
                          <span className="text-xs text-slate-500 uppercase tracking-widest block">{q.category}</span>
                          <h4 className="text-sm sm:text-base font-semibold text-white truncate max-w-[500px]">
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>

                    {/* Expandable contents */}
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 bg-slate-900/40 space-y-6">
                        
                        {/* User Answer vs Sample Answer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Submitted Answer</h5>
                            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-line min-h-[100px]">
                              {answerObj.answer || <span className="text-slate-600 italic">No answer submitted</span>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Correct Sample Answer</h5>
                            <div className="p-4 bg-indigo-950/20 rounded-xl border border-indigo-500/20 text-sm text-slate-350 leading-relaxed whitespace-pre-line min-h-[100px]">
                              {q.sampleAnswer}
                            </div>
                          </div>
                        </div>

                        {/* Tips & Common Mistakes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-sm space-y-1">
                            <span className="text-indigo-400 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                              <Info className="w-4 h-4 shrink-0" /> Interview Tip
                            </span>
                            <p className="text-slate-300">{q.tips}</p>
                          </div>

                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-sm space-y-1">
                            <span className="text-rose-400 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                              <XCircle className="w-4 h-4 shrink-0" /> Common Mistakes
                            </span>
                            <p className="text-slate-300">{q.commonMistakes}</p>
                          </div>
                        </div>

                        {/* Evaluated Strengths, Weaknesses, Suggestions */}
                        <div className="border-t border-slate-850/80 pt-4 space-y-4">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Response Evaluation Details</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h6 className="text-xs font-semibold text-emerald-400 mb-1.5">Answer Strengths</h6>
                              <ul className="space-y-1">
                                {fbObj.strengths?.map((str: string, index: number) => (
                                  <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5">
                                    <span className="text-emerald-400">•</span> {str}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h6 className="text-xs font-semibold text-rose-400 mb-1.5">Answer Weaknesses</h6>
                              <ul className="space-y-1">
                                {fbObj.weaknesses?.map((weak: string, index: number) => (
                                  <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5">
                                    <span className="text-rose-400">•</span> {weak}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {fbObj.suggestions && (
                            <div className="p-3.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-xs">
                              <span className="font-bold text-indigo-400">Improvement Suggestion:</span> {fbObj.suggestions}
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
