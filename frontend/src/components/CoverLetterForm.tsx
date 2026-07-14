import React, { useState } from 'react';
import { Sparkles, Building2, Briefcase, User, MessageSquare, FileText, FileSpreadsheet } from 'lucide-react';
import { CoverLetterPayload } from '../services/coverLetterService';

interface Resume {
  _id: string;
  resumeTitle: string;
  parsingStatus: string;
}

interface CoverLetterFormProps {
  resumes: Resume[];
  onSubmit: (data: CoverLetterPayload) => void;
  loading: boolean;
  initialValues?: Partial<CoverLetterPayload>;
}

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
  resumes,
  onSubmit,
  loading,
  initialValues = {},
}) => {
  const [resumeId, setResumeId] = useState(initialValues.resumeId || '');
  const [company, setCompany] = useState(initialValues.company || '');
  const [position, setPosition] = useState(initialValues.position || '');
  const [hiringManager, setHiringManager] = useState(initialValues.hiringManager || '');
  const [tone, setTone] = useState<CoverLetterPayload['tone']>(initialValues.tone || 'Professional');
  const [length, setLength] = useState<CoverLetterPayload['length']>(initialValues.length || 'Medium');
  const [jobDescription, setJobDescription] = useState(initialValues.jobDescription || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeId || !company || !position) return;
    
    onSubmit({
      resumeId,
      company,
      position,
      hiringManager,
      tone,
      length,
      jobDescription,
    });
  };

  // Only show parsed successfully resumes
  const parsedResumes = resumes.filter(r => r.parsingStatus === 'Parsed Successfully');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resume Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
          Select Resume <span className="text-rose-500">*</span>
        </label>
        <select
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          required
          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
        >
          <option value="" disabled className="bg-slate-900 text-slate-500">Choose a parsed resume...</option>
          {parsedResumes.map((r) => (
            <option key={r._id} value={r._id} className="bg-slate-900 text-slate-200">
              {r.resumeTitle}
            </option>
          ))}
        </select>
        {parsedResumes.length === 0 && (
          <p className="text-xs text-amber-400/90 mt-1.5">
            You need a successfully parsed resume to generate a cover letter. Please upload/parse one first.
          </p>
        )}
      </div>

      {/* Grid for Company & Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Company Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            placeholder="e.g. Google"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Position <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            placeholder="e.g. Senior Software Engineer"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      {/* Hiring Manager (Optional) */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <User className="w-4 h-4 text-indigo-400" />
          Hiring Manager <span className="text-slate-500 text-xs font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={hiringManager}
          onChange={(e) => setHiringManager(e.target.value)}
          placeholder="e.g. Jane Doe or Engineering Hiring Committee"
          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Grid for Tone & Length */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as CoverLetterPayload['tone'])}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="Professional" className="bg-slate-900">Professional</option>
            <option value="Formal" className="bg-slate-900">Formal</option>
            <option value="Friendly" className="bg-slate-900">Friendly</option>
            <option value="Confident" className="bg-slate-900">Confident</option>
            <option value="Enthusiastic" className="bg-slate-900">Enthusiastic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            Length
          </label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value as CoverLetterPayload['length'])}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="Short" className="bg-slate-900">Short (~150-250 words)</option>
            <option value="Medium" className="bg-slate-900">Medium (~250-400 words)</option>
            <option value="Long" className="bg-slate-900">Long (~400-600 words)</option>
          </select>
        </div>
      </div>

      {/* Job Description (Optional) */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-400" />
          Job Description <span className="text-slate-500 text-xs font-normal">(Optional, highly recommended for personalization)</span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to align your skills and highlights with the employer's specific requirements..."
          rows={5}
          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-y min-h-[120px]"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !resumeId || !company || !position}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 duration-150"
      >
        <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
        {loading ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
      </button>
    </form>
  );
};
