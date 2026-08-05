import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { useToast } from '../contexts/ToastContext';
import { getResumes } from '../services/resumeService';
import {
  analyzeGitHub,
  getGitHubHistory,
  deleteGitHubAnalysis,
  getGitHubAnalysis
} from '../services/githubService';

// Import newly created components
import { GitHubInput } from '../components/github/GitHubInput';
import { GitHubSummary } from '../components/github/GitHubSummary';
import { RepositoryCard } from '../components/github/RepositoryCard';
import { StatisticsCard } from '../components/github/StatisticsCard';
import { LanguageChart } from '../components/github/LanguageChart';
import { ConsistencyCard } from '../components/github/ConsistencyCard';
import { RecommendationCard } from '../components/github/RecommendationCard';
import { HistoryCard } from '../components/github/HistoryCard';

import {
  Loader2,
  Sparkles,
  ArrowLeft,
  Download,
  Copy,
  CheckCircle2,
  RefreshCw,
  GitBranch,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const GitHubAnalyzer: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'GitHub Portfolio Analyzer | ResumeIQ AI';
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([fetchResumes(), fetchHistory()]);
  };

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const res = await getResumes();
      if (res.status === 'success') {
        setResumes(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load resumes', err);
      showToast('Failed to load resumes. Please upload one first.', 'error');
    } finally {
      setLoadingResumes(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await getGitHubHistory();
      if (res.status === 'success') {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (resumeId: string, url: string, optionalLinkedinUrl?: string) => {
    try {
      setAnalyzing(true);
      setError(null);
      setGithubUrl(url);
      if (optionalLinkedinUrl) {
        setLinkedinUrl(optionalLinkedinUrl);
      }

      const res = await analyzeGitHub({ resumeId, githubUrl: url });
      if (res.status === 'success' && res.data) {
        setAnalysisResult(res.data);
        showToast('GitHub analysis completed successfully!', 'success');
        // Refresh history list
        fetchHistory();
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'An error occurred during analysis';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOpenReport = async (id: string) => {
    try {
      setAnalyzing(true);
      setError(null);
      const res = await getGitHubAnalysis(id);
      if (res.status === 'success' && res.data) {
        setAnalysisResult(res.data);
        setGithubUrl(res.data.githubUrl);
        showToast('Report loaded successfully!', 'success');
      }
    } catch (err: any) {
      console.error('Failed to open report:', err);
      showToast('Failed to retrieve analysis details.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;

    try {
      const res = await deleteGitHubAnalysis(id);
      if (res.status === 'success') {
        showToast('Analysis report deleted successfully', 'success');
        // If we are currently viewing the deleted report, clear it
        if (analysisResult && analysisResult._id === id) {
          setAnalysisResult(null);
        }
        fetchHistory();
      }
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete report', 'error');
    }
  };

  const handleReanalyze = (resumeId: string, url: string) => {
    // Scroll to top and execute analysis
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleAnalyze(resumeId, url);
  };

  const copyReportToClipboard = () => {
    if (!analysisResult) return;
    const { profile, statistics, analysis } = analysisResult;
    const text = `
# GitHub Portfolio Analysis - ${profile.username}
Date: ${new Date().toLocaleDateString()}
GitHub Profile: ${githubUrl}
${linkedinUrl ? `LinkedIn Profile: ${linkedinUrl}\n` : ''}

## Scores
- Overall Score: ${analysis.overallScore}%
- GitHub Score: ${analysis.githubScore}%
- Resume Consistency: ${analysis.resumeConsistency}%

## Repository Statistics
- Public Repos: ${statistics.totalRepos}
- Stars: ${statistics.totalStars}
- Forks: ${statistics.totalForks}
- Account Age: ${statistics.accountAgeMonths} months
- Last Activity: ${statistics.lastActivityDays} days ago

## Key Strengths
${analysis.strengths.map((s: string) => `- ${s}`).join('\n')}

## Areas for Improvement
${analysis.weaknesses.map((w: string) => `- ${w}`).join('\n')}

## Recommendations & Action Items
${analysis.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

## Missing Projects
${analysis.missingProjects.map((p: string) => `- ${p}`).join('\n')}

## Missing Skills
${analysis.missingSkills.map((s: string) => `- ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    showToast('Report copied to clipboard in Markdown format!', 'success');
  };

  const downloadReport = (format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      window.print();
      return;
    }
    
    if (!analysisResult) return;
    const { profile, statistics, analysis } = analysisResult;
    const content = `
RESUMEIQ AI - GITHUB PORTFOLIO ANALYSIS REPORT
=============================================
Date: ${new Date().toLocaleDateString()}
Candidate GitHub: ${githubUrl}
${linkedinUrl ? `Candidate LinkedIn: ${linkedinUrl}\n` : ''}

PORTFOLIO SCORES
----------------
- Overall Portfolio Score: ${analysis.overallScore}/100
- GitHub Content Quality Score: ${analysis.githubScore}/100
- Resume Consistency Score: ${analysis.resumeConsistency}/100

REPOSITORY METRICS
------------------
- Public Repositories: ${statistics.totalRepos}
- Total Stars: ${statistics.totalStars}
- Total Forks: ${statistics.totalForks}
- Account Age: ${statistics.accountAgeMonths} months
- Last Activity: ${statistics.lastActivityDays} days ago

PORTFOLIO STRENGTHS
-------------------
${analysis.strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

PORTFOLIO AREAS FOR IMPROVEMENT
-------------------------------
${analysis.weaknesses.map((w: string, i: number) => `${i + 1}. ${w}`).join('\n')}

RECOMMENDED IMPROVEMENT CHECKLIST
---------------------------------
${analysis.recommendations.map((r: string) => `[ ] ${r}`).join('\n')}

CONSISTENCY GAPS DETECTED
-------------------------
Missing Projects:
${analysis.missingProjects.map((p: string) => `- ${p}`).join('\n') || 'None'}

Missing Skills:
${analysis.missingSkills.map((s: string) => `- ${s}`).join('\n') || 'None'}
    `;

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.username}_GitHub_Analysis_Report.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('DOCX report download started!', 'success');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 print:p-0">
          
          {/* Header Action Row (Only visible when showing results, hidden in print) */}
          {analysisResult && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-slate-900 pb-6">
              <div>
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Analyze another profile
                </button>
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Analysis Results
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={copyReportToClipboard}
                  className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-medium transition"
                >
                  <Copy className="w-4 h-4 text-indigo-400" />
                  <span>Copy Report</span>
                </button>
                <button
                  onClick={() => downloadReport('docx')}
                  className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-medium transition"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>DOCX</span>
                </button>
                <button
                  onClick={() => downloadReport('pdf')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 border border-indigo-500/20 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Core Screen Logic */}
          {analyzing ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <h3 className="text-xl font-medium text-slate-350 animate-pulse">Running Portfolio Diagnostics...</h3>
              <p className="text-slate-500 text-sm">Evaluating repositories, languages, README coverages, and comparing with resume...</p>
            </div>
          ) : !analysisResult ? (
            /* INPUT SCREEN */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <GitHubInput
                  resumes={resumes}
                  onSubmit={handleAnalyze}
                  isLoading={analyzing}
                  error={error}
                />
              </div>

              <div className="lg:col-span-1 space-y-6">
                <HistoryCard
                  history={history}
                  onOpen={handleOpenReport}
                  onDelete={handleDeleteReport}
                  onReanalyze={handleReanalyze}
                />
              </div>
            </div>
          ) : (
            /* RESULTS PAGE */
            <div className="space-y-8">
              
              {/* Profile Bio summary */}
              <GitHubSummary
                profile={analysisResult.profile}
                githubUrl={githubUrl}
                linkedinUrl={linkedinUrl || undefined}
              />

              {/* Score Rings Container */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Score */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center">
                  <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-4">Overall Score</h3>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        stroke="#818cf8"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * analysisResult.overallScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-3xl font-black text-white">{analysisResult.overallScore}</div>
                  </div>
                  <p className="text-slate-500 text-xs mt-4">Weighted combination of GitHub quality and resume consistency.</p>
                </div>

                {/* GitHub Score */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center">
                  <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-4">GitHub Portfolio Score</h3>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        stroke="#c084fc"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * analysisResult.analysis.githubScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-3xl font-black text-white">{analysisResult.analysis.githubScore}</div>
                  </div>
                  <p className="text-slate-500 text-xs mt-4">Measures documentation completeness, stargazers, forks, and codebase activity.</p>
                </div>

                {/* Consistency Score */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center">
                  <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-4">Resume Consistency</h3>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        stroke="#34d399"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * analysisResult.analysis.resumeConsistency) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-3xl font-black text-white">{analysisResult.analysis.resumeConsistency}</div>
                  </div>
                  <p className="text-slate-500 text-xs mt-4">Validates consistency of skills/projects between resume and codebases.</p>
                </div>
              </div>

              {/* Statistics & Language row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <StatisticsCard
                    statistics={analysisResult.statistics}
                    repositories={analysisResult.repositories}
                  />
                </div>
                <div className="lg:col-span-1">
                  <LanguageChart languages={analysisResult.languages} />
                </div>
              </div>

              {/* Consistency & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConsistencyCard
                  consistencyScore={analysisResult.analysis.resumeConsistency}
                  missingProjects={analysisResult.analysis.missingProjects}
                  missingSkills={analysisResult.analysis.missingSkills}
                />
                <RecommendationCard
                  strengths={analysisResult.analysis?.strengths || analysisResult.strengths || []}
                  weaknesses={analysisResult.analysis?.weaknesses || analysisResult.weaknesses || []}
                  recommendations={analysisResult.analysis?.recommendations || analysisResult.recommendations || []}
                />
              </div>

              {/* Pinned / Top Projects Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-indigo-400" />
                  Top Repositories & Diagnostics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisResult.repositories.slice(0, 6).map((repo: any, index: number) => (
                    <RepositoryCard key={index} repository={repo} />
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};
