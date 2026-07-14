import React, { useState } from 'react';
import { GitBranch, Link2, FileText, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface GitHubInputProps {
  resumes: any[];
  onSubmit: (resumeId: string, githubUrl: string, linkedinUrl?: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const GitHubInput: React.FC<GitHubInputProps> = ({
  resumes,
  onSubmit,
  isLoading,
  error
}) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl || !selectedResumeId) return;
    onSubmit(selectedResumeId, githubUrl, linkedinUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <GitBranch className="w-6 h-6 text-indigo-400 animate-pulse" />
        GitHub Portfolio Analyzer
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Evaluate your GitHub profile and public repositories alongside your resume to generate ATS-style matching scores, highlight strengths, and identify portfolio improvements.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GitHub URL */}
        <div className="space-y-2">
          <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-300">
            GitHub Profile URL <span className="text-red-400">*</span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <GitBranch className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="url"
              name="githubUrl"
              id="githubUrl"
              required
              disabled={isLoading}
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-600 disabled:opacity-50 transition"
            />
          </div>
        </div>

        {/* LinkedIn URL (Optional) */}
        <div className="space-y-2">
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-300 flex items-center justify-between">
            <span>LinkedIn Profile URL <span className="text-slate-500 text-xs">(Optional)</span></span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Link2 className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="url"
              name="linkedinUrl"
              id="linkedinUrl"
              disabled={isLoading}
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-600 disabled:opacity-50 transition"
            />
          </div>
          <p className="text-slate-500 text-[11px] leading-normal">
            Note: LinkedIn scraping violates Terms of Service. This URL will be included in the reports and future integrations but will not be fetched or scraped.
          </p>
        </div>

        {/* Choose Resume */}
        <div className="space-y-2">
          <label htmlFor="resume" className="block text-sm font-medium text-slate-300">
            Select Resume <span className="text-red-400">*</span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <select
              id="resume"
              required
              disabled={isLoading}
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="block w-full pl-11 pr-10 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-slate-600 disabled:opacity-50 transition appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-400">-- Choose a resume --</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id} className="bg-slate-900 text-white">
                  {resume.resumeTitle} (ATS Score: {resume.atsScore || 'N/A'})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !githubUrl || !selectedResumeId}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-indigo-400/20 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Profile (GitHub API & AI)...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Portfolio
            </>
          )}
        </button>
      </form>
    </div>
  );
};
