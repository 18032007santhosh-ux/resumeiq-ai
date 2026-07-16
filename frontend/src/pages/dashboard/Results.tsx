import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Target } from 'lucide-react';
import { motion } from 'framer-motion';

import AtsScoreRing from '../../components/dashboard/AtsScoreRing';
import CategoryBreakdown from '../../components/dashboard/CategoryBreakdown';
import FeedbackList from '../../components/dashboard/FeedbackList';
import { AiSuggestionsSection } from '../../components/dashboard/AiSuggestionsSection';
import api from '../../services/api';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Navbar } from '../../components/dashboard/Navbar';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // We use POST here as it acts as an idempotent analyzer/fetcher
        const res = await api.post(`/resumes/analyze/${id}`, {});
        
        setAnalysis(res.data.data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to analyze resume.');
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id, navigate]);

  const handleExportPDF = () => {
    window.print();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <h3 className="text-xl font-medium text-slate-300 animate-pulse">Analyzing Resume...</h3>
          <p className="text-slate-500 text-sm">Our deterministic ATS engine is calculating your score</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="bg-red-500/10 p-4 rounded-full">
            <Target className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-medium text-red-400">Analysis Failed</h3>
          <p className="text-slate-400 text-sm">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    if (!analysis) return null;

    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in print-container pb-12 px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              ATS Compatibility Report
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Detailed breakdown of your resume's performance against Applicant Tracking Systems
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors w-full md:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Score and Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center">
              <h2 className="text-lg font-semibold text-white mb-6">Overall ATS Score</h2>
              <AtsScoreRing score={analysis.overallScore} />
              <p className="text-center text-slate-400 text-sm mt-6">
                This score represents how well your resume is formatted and optimized for standard ATS parsing.
              </p>
            </div>

            {/* Breakdown Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-6">Category Breakdown</h2>
              <CategoryBreakdown breakdown={analysis.breakdown} />
            </div>
          </div>

          {/* Right Column: Feedback Lists */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="bg-green-500/20 text-green-400 p-1.5 rounded-md mr-3">
                    <Target className="w-5 h-5" />
                  </span>
                  Strengths
                </h2>
                <FeedbackList items={analysis.strengths} type="strengths" />
              </div>

              {/* Improvements */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded-md mr-3">
                    <Target className="w-5 h-5" />
                  </span>
                  Areas for Improvement
                </h2>
                <FeedbackList items={analysis.improvements} type="improvements" />
              </div>
            </div>

            {/* Issues */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="bg-red-500/20 text-red-400 p-1.5 rounded-md mr-3">
                  <Target className="w-5 h-5" />
                </span>
                Detected Issues
              </h2>
              <FeedbackList items={analysis.issues} type="issues" />
              {(!analysis.issues || analysis.issues.length === 0) && (
                <p className="text-slate-400 text-sm">Great job! No major structural or data issues detected in your resume.</p>
              )}
            </div>

          </div>
        </div>

        {/* AI Resume Suggestions Section */}
        {id && (
          <div className="no-print pt-4 border-t border-slate-800/60">
            <AiSuggestionsSection resumeId={id} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar with mobile toggle state */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        
        {/* Subtle Ambient Background */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Results;
