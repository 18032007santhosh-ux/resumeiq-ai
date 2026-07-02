import React, { useState, useEffect } from 'react';
import { getResumes, deleteResume } from '../../../services/resumeService';
import { FileText, Trash2, Eye, Calendar, HardDrive, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';

interface ResumeListProps {
  refreshTrigger: number;
}

export const ResumeList: React.FC<ResumeListProps> = ({ refreshTrigger }) => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await getResumes();
      setResumes(res.data);
    } catch (error) {
      showToast('Failed to load resumes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id);
      showToast('Resume deleted successfully', 'success');
      setDeleteId(null);
      fetchResumes();
    } catch (error) {
      showToast('Failed to delete resume', 'error');
    }
  };

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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">My Uploaded Resumes</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-6">My Uploaded Resumes</h3>
      
      {resumes.length === 0 ? (
        <div className="text-center py-16 px-4 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
          <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-slate-500" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No resumes uploaded yet</h4>
          <p className="text-slate-400 max-w-sm mx-auto">
            Upload your first resume using the form above to start receiving AI-powered insights and feedback.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {resumes.map((resume) => (
            <div key={resume._id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg line-clamp-1">{resume.originalFileName}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(resume.uploadDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4" />
                      {formatFileSize(resume.fileSize)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {deleteId === resume._id ? (
                  <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                    <span className="text-sm text-slate-300 px-2">Confirm?</span>
                    <button 
                      onClick={() => handleDelete(resume._id)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-md text-sm hover:bg-red-500/30 font-medium"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => setDeleteId(null)}
                      className="px-3 py-1.5 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      to={`/dashboard/resumes/${resume._id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm font-medium border border-slate-700 hover:border-slate-600"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <button 
                      onClick={() => setDeleteId(resume._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
