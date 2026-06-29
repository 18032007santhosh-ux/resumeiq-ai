import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Sparkles, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ResumeIQ AI</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full uppercase">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-950/40 border border-white/5 rounded-full px-4 py-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-200">{user?.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
                Welcome back, {user?.name.split(' ')[0]} <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-sm mt-1">Configure your profile settings and resume analyzers</p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main User Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-4 border-b border-white/5 pb-2">Profile Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Full Name</span>
                  <span className="text-slate-200 text-sm font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Email Address</span>
                  <span className="text-slate-200 text-sm font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400 text-sm">Account Created</span>
                  <span className="text-slate-200 text-sm font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => showToast('Profile settings are disabled for the Phase 2 demo', 'info')}
                className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-semibold py-2 px-6 rounded-xl text-sm cursor-pointer"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => showToast('Security triggers are ready for Phase 3 MongoDB integration', 'info')}
                className="bg-slate-950/40 hover:bg-slate-950/80 transition-colors text-slate-300 border border-white/10 font-semibold py-2 px-6 rounded-xl text-sm cursor-pointer"
              >
                Security Settings
              </button>
            </div>
          </motion.div>

          {/* Quick Metrics Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-slate-200">Account Usage</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Monthly Scans</span>
                  <span className="text-slate-200 font-semibold">0 / 10 Free</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[0%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-200 text-sm">No resume uploaded yet</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  ATS score checkers and key rewriting recomendations will activate after document upload in Phase 3.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
