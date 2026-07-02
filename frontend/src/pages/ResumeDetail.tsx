import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getResumeById } from '../services/resumeService';
import { FileText, ArrowLeft, Calendar, HardDrive, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const ResumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (!id) return;
        const res = await getResumeById(id);
        setResume(res.data);
      } catch (error) {
        showToast('Failed to load resume details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, showToast]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1000px] mx-auto space-y-8 pb-16">
            
            <div>
              <Link to="/dashboard/resumes" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Resumes
              </Link>
              <h1 className="text-3xl font-bold text-white mb-2">Resume Details</h1>
              <p className="text-slate-400">View information about your uploaded resume.</p>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-40 bg-slate-800/50 rounded-2xl"></div>
              </div>
            ) : resume ? (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 lg:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-1">{resume.originalFileName}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 text-slate-300">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Uploaded On</p>
                          <p className="font-medium">{formatDate(resume.uploadDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                        <HardDrive className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">File Size</p>
                          <p className="font-medium">{formatFileSize(resume.fileSize)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">File Type</p>
                          <p className="font-medium">{resume.fileType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-sm text-slate-500">Upload Status</p>
                          <p className="font-medium text-emerald-400">Uploaded Successfully</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300 mt-4 md:mt-0">
                        <Clock className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-sm text-slate-500">Analysis Status</p>
                          <p className="font-medium text-amber-400">Analysis Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">Resume not found.</p>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};
