import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Sparkles, BarChart3, Clock, AlertCircle, Menu, X, Trash2, Edit2, Plus, FileText, CheckCircle2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface ResumeData {
  _id: string;
  resumeTitle: string;
  originalFileName: string;
  fileType: string;
  uploadDate: string;
  atsScore: number | null;
  parsedData: any;
  aiSuggestions: string[];
  matchedJob: any;
}

interface AnalysisData {
  _id: string;
  resumeId: {
    _id: string;
    resumeTitle: string;
    originalFileName: string;
  };
  score: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [history, setHistory] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('pdf');

  const [editTitle, setEditTitle] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [editFileType, setEditFileType] = useState('pdf');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resumesRes, historyRes] = await Promise.all([
        api.get('/resume'),
        api.get('/history')
      ]);

      setResumes(resumesRes.data.data || []);
      setHistory(historyRes.data.data || []);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  // Create Resume Metadata
  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFileName.trim()) {
      showToast('Please fill in all fields', 'info');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/resume', {
        resumeTitle: newTitle,
        originalFileName: newFileName,
        fileType: newFileType
      });

      if (res.data.status === 'success') {
        showToast('Resume metadata created successfully!', 'success');
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewFileName('');
        setNewFileType('pdf');
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create resume metadata', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (resume: ResumeData) => {
    setSelectedResume(resume);
    setEditTitle(resume.resumeTitle);
    setEditFileName(resume.originalFileName);
    setEditFileType(resume.fileType || 'pdf');
    setIsEditModalOpen(true);
  };

  // Update Resume Metadata
  const handleUpdateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume) return;

    try {
      setIsSubmitting(true);
      const res = await api.put(`/resume/${selectedResume._id}`, {
        resumeTitle: editTitle,
        originalFileName: editFileName,
        fileType: editFileType
      });

      if (res.data.status === 'success') {
        showToast('Resume metadata updated successfully', 'success');
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update resume metadata', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Resume Metadata
  const handleDeleteResume = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      showToast('Resume deleted successfully', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete resume', 'error');
    }
  };

  // Delete History Record
  const handleDeleteHistory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this history record?')) return;
    try {
      await api.delete(`/history/${id}`);
      showToast('History record deleted', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete history record', 'error');
    }
  };

  // Calculate statistics
  const totalResumes = resumes.length;
  const latestUploadDate = resumes.length > 0
    ? (() => {
        const validResumes = resumes.filter(r => r.uploadDate);
        if (validResumes.length === 0) return 'N/A';
        const latest = validResumes.reduce((max, r) => 
          new Date(r.uploadDate) > new Date(max.uploadDate) ? r : max
        , validResumes[0]);
        try {
          const date = new Date(latest.uploadDate);
          return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
        } catch {
          return 'N/A';
        }
      })()
    : 'N/A';

  return (
    <div className="dashboard-page min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <header className="dashboard-header border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="dashboard-header-container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ResumeIQ AI</span>
          </Link>
          
          <nav className="dashboard-nav hidden md:flex items-center gap-6">
            <Link to="/" className="dashboard-nav-link text-slate-300 hover:text-white transition">Home</Link>
            <Link to="/dashboard" className="dashboard-nav-link active text-indigo-400 font-medium">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="dashboard-user-badge flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">{user?.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="dashboard-logout-btn flex items-center gap-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 px-3 py-1.5 rounded-full border border-red-900/30 transition text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button 
              className="dashboard-menu-toggle md:hidden p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="dashboard-mobile-nav md:hidden border-b border-slate-800 bg-slate-900 px-4 py-4 flex flex-col gap-4"
            >
              <Link to="/" className="text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/dashboard" className="text-indigo-400 font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-400"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-page-container max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2" style={{ fontSize: '1.85rem' }}>
                Welcome back, {user?.name?.split(' ')[0]} <Sparkles className="w-6 h-6 text-indigo-400" />
              </h1>
              <p className="text-slate-400 text-sm mt-1">Manage your resume documents and track your ATS scan database.</p>
            </div>
            <div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-900/30 transition-all border border-indigo-500/30"
              >
                <Plus className="w-4 h-4" />
                Upload Resume Metadata
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm animate-pulse">Loading real-time dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 flex items-start gap-4 mb-8">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-200">Error Loading Data</h4>
              <p className="text-sm text-slate-300 mt-1">{error}</p>
              <button 
                onClick={fetchData} 
                className="mt-3 text-xs bg-red-900/40 hover:bg-red-900/60 border border-red-900/50 text-red-200 px-3 py-1.5 rounded-lg transition"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* Stats & Quick Info */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Profile Card */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-base font-bold text-slate-200 mb-4 pb-2 border-b border-slate-800">Profile Database Profile</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Full Name</span>
                      <span className="text-slate-200 font-medium">{user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Email Address</span>
                      <span className="text-slate-200 font-medium truncate max-w-[180px]">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Account Created</span>
                      <span className="text-slate-200 font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Usage Card */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-bold text-slate-200 text-sm">Database Summary</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Total Resumes</span>
                      <span className="text-indigo-400 font-bold text-lg">{totalResumes}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Latest Upload</span>
                      <span className="text-slate-200 font-medium text-xs bg-slate-800 px-2.5 py-1 rounded-md">{latestUploadDate}</span>
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-5 flex gap-3.5 items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-amber-300 text-xs">Phase 3 MongoDB Mode</h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      In this portfolio phase, database integrations and CRUD endpoints are fully active. Actual resume uploads and calculations will be implemented in later stages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumes Lists */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Resumes Section */}
                <div>
                  <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Your Uploaded Resumes ({totalResumes})
                  </h2>

                  {resumes.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-200 text-base mb-1">No resumes found</h4>
                      <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed">
                        Upload your first resume. Creating metadata allows full CRUD verification with MongoDB database.
                      </p>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-900/30"
                      >
                        Upload your first resume.
                      </button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resumes.map((resume) => (
                        <motion.div 
                          key={resume._id}
                          layout
                          className="bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 relative group transition-all"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex gap-3 items-start">
                              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="font-bold text-slate-200 text-sm truncate" title={resume.resumeTitle}>
                                  {resume.resumeTitle}
                                </h4>
                                <p className="text-slate-400 text-[11px] truncate mt-0.5">
                                  File: {resume.originalFileName} (.{resume.fileType})
                                </p>
                                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
                              <button 
                                onClick={() => openEditModal(resume)}
                                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition"
                                title="Edit Metadata"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteResume(resume._id)}
                                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition"
                                title="Delete Metadata"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* History Section */}
                <div>
                  <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-400" />
                    Analysis History Log ({history.length})
                  </h2>

                  {history.length === 0 ? (
                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
                      No analysis logs currently stored in MongoDB.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((record) => (
                        <div 
                          key={record._id}
                          className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex justify-between items-center gap-4 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <h5 className="font-semibold text-slate-200 text-xs">
                                {record.resumeId?.resumeTitle || 'Deleted Resume'}
                              </h5>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Log ID: {record._id} • Score: {record.score !== null ? `${record.score}%` : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500">
                              {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                            <button
                              onClick={() => handleDeleteHistory(record._id)}
                              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal: Create Resume Metadata */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Upload Resume Metadata
              </h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Add metadata details below. This will create a real document in your MongoDB database collections.
              </p>

              <form onSubmit={handleCreateResume} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Resume Title</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Dev Resume"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Original File Name</label>
                  <input 
                    type="text" 
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g., resume-john-doe.pdf"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">File Type Extension</label>
                  <select 
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="txt">Text File (.txt)</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                  >
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Resume Metadata */}
      <AnimatePresence>
        {isEditModalOpen && selectedResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                Edit Resume Metadata
              </h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Update metadata records stored in MongoDB.
              </p>

              <form onSubmit={handleUpdateResume} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Resume Title</label>
                  <input 
                    type="text" 
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Original File Name</label>
                  <input 
                    type="text" 
                    required
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">File Type Extension</label>
                  <select 
                    value={editFileType}
                    onChange={(e) => setEditFileType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none transition"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="txt">Text File (.txt)</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
