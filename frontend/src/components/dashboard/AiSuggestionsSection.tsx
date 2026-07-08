import React, { useState, useEffect } from 'react';
import { getAiSuggestions } from '../../services/resumeService';
import { 
  Sparkles, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, 
  Copy, Check, Loader2, ListTodo, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiSuggestionsSectionProps {
  resumeId: string;
}

interface SuggestionsData {
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  sectionSuggestions: {
    summary: string;
    skills: string;
    experience: string;
    projects: string;
    education: string;
    certifications: string;
  };
  missingKeywords: string[];
  actionItems: string[];
}

const loadingMessages = [
  "Analyzing Resume...",
  "Improving ATS...",
  "Finding Missing Keywords...",
  "Generating Suggestions...",
  "Almost Ready..."
];

export const AiSuggestionsSection: React.FC<AiSuggestionsSectionProps> = ({ resumeId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionsData | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<{ [key: number]: boolean }>({});
  
  // For section accordion
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getAiSuggestions(resumeId);
      if (res.success !== false && res.data) {
        setSuggestions(res.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [resumeId]);

  // Loading message rotation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const toggleActionItem = (index: number) => {
    setCompletedActions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center space-y-6 min-h-[400px] backdrop-blur-xl">
        <div className="relative w-16 h-16">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin absolute" />
          <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center absolute top-3 left-3">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.h4
              key={loadingMsgIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-slate-200"
            >
              {loadingMessages[loadingMsgIndex]}
            </motion.h4>
          </AnimatePresence>
          <p className="text-sm text-slate-500">Gemini AI is crafting personalized tips...</p>
        </div>

        {/* Skeleton Card Loader */}
        <div className="w-full max-w-2xl space-y-4 animate-pulse pt-6">
          <div className="h-24 bg-slate-800/40 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-800/40 rounded-xl"></div>
            <div className="h-32 bg-slate-800/40 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !suggestions) {
    return (
      <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 text-center backdrop-blur-xl">
        <div className="p-3 bg-red-500/10 rounded-full text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Unable to generate AI suggestions</h3>
          <p className="text-sm text-slate-400">There was a temporary issue fetching your resume recommendations.</p>
        </div>
        <button
          onClick={fetchSuggestions}
          className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-white rounded-xl transition-all border border-slate-800 hover:border-slate-700 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-sans">AI Resume Suggestions</h2>
          <p className="text-slate-400 text-sm">Actionable advice powered by Gemini AI to optimize your score</p>
        </div>
      </div>

      {/* Overall Feedback Premium Card */}
      <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Overall AI Analysis
        </h3>
        <p className="text-slate-200 leading-relaxed text-base font-light">
          {suggestions.overallFeedback}
        </p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Key Strengths
          </h3>
          <div className="space-y-3">
            {suggestions.strengths.map((str, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <span className="text-emerald-400 font-medium mt-0.5">✓</span>
                <span className="text-slate-300 text-sm leading-relaxed">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Areas to Fix
          </h3>
          <div className="space-y-3">
            {suggestions.improvements.map((imp, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <span className="text-amber-400 font-medium mt-0.5">⚠</span>
                <span className="text-slate-300 text-sm leading-relaxed">{imp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section-by-Section suggestions (Accordion) */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Section-by-Section Recommendations</h3>
        
        <div className="space-y-3">
          {Object.entries(suggestions.sectionSuggestions).map(([sectionKey, recommendation]) => {
            const isOpen = openSection === sectionKey;
            const label = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            
            return (
              <div 
                key={sectionKey}
                className={`border rounded-xl transition-all duration-300 ${
                  isOpen ? 'bg-slate-850/60 border-slate-700' : 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-200"
                >
                  <span>{label}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {recommendation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing Keywords & Action Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Missing Keywords */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col">
          <h3 className="text-base font-semibold text-indigo-400 mb-2 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Recommended Keywords
          </h3>
          <p className="text-slate-400 text-xs mb-4">Click to copy words and integrate them naturally into your sections</p>
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[220px] custom-scrollbar">
            {suggestions.missingKeywords.map((keyword, idx) => (
              <button
                key={idx}
                onClick={() => handleCopyKeyword(keyword)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-indigo-600/20 text-xs border border-slate-850 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-350 transition-all font-medium"
              >
                <span>{keyword}</span>
                {copiedKeyword === keyword ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Checklist */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-purple-400 mb-4 flex items-center gap-2">
            <ListTodo className="w-5 h-5" />
            AI Action Items
          </h3>
          <div className="space-y-3">
            {suggestions.actionItems.map((item, idx) => {
              const isDone = !!completedActions[idx];
              return (
                <button
                  key={idx}
                  onClick={() => toggleActionItem(idx)}
                  className="w-full flex items-start gap-3 text-left p-3 hover:bg-slate-850/50 rounded-xl transition-all border border-transparent hover:border-slate-800"
                >
                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    isDone ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {isDone && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-sm leading-relaxed transition-all ${
                    isDone ? 'text-slate-500 line-through' : 'text-slate-300'
                  }`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
