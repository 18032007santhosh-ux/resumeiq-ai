import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { CoverLetterForm } from '../components/CoverLetterForm';
import { CoverLetterEditor } from '../components/CoverLetterEditor';
import { generateCoverLetter, updateCoverLetter, getCoverLetter, CoverLetterPayload } from '../services/coverLetterService';
import { getResumes } from '../services/resumeService';
import { useToast } from '../contexts/ToastContext';
import { FileText, Sparkles, AlertCircle, History, ArrowLeft, RefreshCw } from 'lucide-react';

export const CoverLetter: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverLetter, setCoverLetter] = useState<any | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  
  // Form persistence for regeneration
  const [lastFormValues, setLastFormValues] = useState<CoverLetterPayload | null>(null);

  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are loading an existing cover letter from history
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('id');

  useEffect(() => {
    document.title = 'AI Cover Letter Generator | ResumeIQ AI';
    fetchResumes();
    if (editId) {
      fetchExistingCoverLetter(editId);
    }
  }, [editId]);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const res = await getResumes();
      if (res.status === 'success') {
        setResumes(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load resumes', err);
      showToast('Failed to load resumes. Please upload one.', 'error');
    } finally {
      setLoadingResumes(false);
    }
  };

  const fetchExistingCoverLetter = async (id: string) => {
    try {
      setGenerating(true);
      const res = await getCoverLetter(id);
      if (res.status === 'success' && res.data) {
        setCoverLetter(res.data);
        setSelectedResumeId(res.data.resumeId?._id || res.data.resumeId || '');
        setLastFormValues({
          resumeId: res.data.resumeId?._id || res.data.resumeId || '',
          company: res.data.company,
          position: res.data.position,
          hiringManager: res.data.hiringManager,
          tone: res.data.tone,
          length: res.data.length,
          jobDescription: res.data.jobDescription,
        });
      }
    } catch (err) {
      console.error('Failed to load cover letter', err);
      showToast('Failed to load selected cover letter', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = async (formData: CoverLetterPayload) => {
    try {
      setGenerating(true);
      setLastFormValues(formData);
      const res = await generateCoverLetter(formData);
      if (res.status === 'success') {
        setCoverLetter(res.data);
        showToast('Cover letter generated successfully!', 'success');
      }
    } catch (err: any) {
      console.error('Failed to generate cover letter', err);
      showToast(err.response?.data?.message || 'Failed to generate cover letter. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (updatedText: string) => {
    if (!coverLetter?._id) return;
    try {
      setSaving(true);
      const res = await updateCoverLetter(coverLetter._id, updatedText);
      if (res.status === 'success') {
        setCoverLetter(res.data);
        showToast('Cover letter saved successfully!', 'success');
      }
    } catch (err: any) {
      console.error('Failed to save cover letter', err);
      showToast(err.response?.data?.message || 'Failed to save modifications.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = () => {
    if (lastFormValues) {
      handleGenerate(lastFormValues);
    } else {
      showToast('No form parameters found to regenerate.', 'error');
    }
  };

  const handleBackToHistory = () => {
    navigate('/cover-letter/history');
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full min-h-0 relative overflow-hidden bg-slate-950/50">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-slate-100 to-purple-200 bg-clip-text text-transparent flex items-center gap-2.5">
                  <FileText className="w-8 h-8 text-indigo-400" />
                  AI Cover Letter Generator
                </h1>
                <p className="text-slate-400 mt-1 text-sm md:text-base">
                  Generate hyper-personalized, ATS-compliant, and tailored cover letters matching your resume.
                </p>
              </div>
              <button
                onClick={handleBackToHistory}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-white text-sm font-semibold rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-lg"
              >
                <History className="w-4 h-4" />
                View History
              </button>
            </div>

            {/* Content layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form Input Side */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-card p-6 rounded-3xl border border-slate-850 bg-slate-900/25 backdrop-blur-xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Cover Letter Details
                  </h3>

                  {loadingResumes ? (
                    <div className="space-y-4 py-6">
                      <div className="h-4 bg-slate-800/50 rounded animate-pulse w-1/4"></div>
                      <div className="h-11 bg-slate-800/50 rounded-xl animate-pulse"></div>
                      <div className="h-4 bg-slate-800/50 rounded animate-pulse w-1/3"></div>
                      <div className="h-11 bg-slate-800/50 rounded-xl animate-pulse"></div>
                    </div>
                  ) : (
                    <CoverLetterForm
                      resumes={resumes}
                      onSubmit={handleGenerate}
                      loading={generating}
                      initialValues={lastFormValues || {}}
                    />
                  )}
                </div>
              </div>

              {/* Editor / Output Side */}
              <div className="lg:col-span-7">
                {generating ? (
                  <div className="glass-card p-12 rounded-3xl border border-slate-850 bg-slate-900/25 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin" />
                    <h3 className="text-xl font-bold text-slate-200">Writing Cover Letter...</h3>
                    <p className="text-sm text-slate-500 max-w-sm">
                      Gemini is tailoring your experiences, aligning key skills, and structuring an ATS-friendly layout.
                    </p>
                  </div>
                ) : coverLetter ? (
                  <div className="glass-card p-6 rounded-3xl border border-slate-850 bg-slate-900/25 backdrop-blur-xl shadow-xl">
                    {editId && (
                      <button
                        onClick={() => navigate('/cover-letter')}
                        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Start New Letter
                      </button>
                    )}
                    <CoverLetterEditor
                      initialText={coverLetter.generatedLetter}
                      onSave={handleSave}
                      onRegenerate={handleRegenerate}
                      saving={saving}
                      regenerating={generating}
                      companyName={coverLetter.company}
                      positionName={coverLetter.position}
                    />
                  </div>
                ) : (
                  <div className="glass-card p-12 rounded-3xl border border-slate-850 bg-slate-900/25 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/25 text-indigo-400">
                      <FileText className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200">No Cover Letter Generated Yet</h3>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Fill out the form on the left with your target company and position details to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
