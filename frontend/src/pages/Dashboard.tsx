import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Sparkles, BarChart3, Clock, AlertCircle, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ResumeIQ AI</span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="dashboard-nav">
            <Link to="/" className="dashboard-nav-link">Home</Link>
            <Link to="/dashboard" className="dashboard-nav-link active">Dashboard</Link>
            <button 
              type="button"
              onClick={() => showToast('Profile settings page is under construction for Phase 3', 'info')}
              className="dashboard-nav-link"
            >
              Profile
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="dashboard-user-badge" style={{ display: 'flex' }}>
              <User className="w-4 h-4 text-indigo-400" />
              <span>{user?.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="dashboard-logout-btn"
              style={{ display: 'flex' }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="dashboard-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`dashboard-mobile-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="dashboard-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/dashboard" className="dashboard-nav-link active" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <button 
            type="button"
            onClick={() => {
              setMenuOpen(false);
              showToast('Profile settings page is under construction for Phase 3', 'info');
            }}
            className="dashboard-nav-link"
            style={{ textAlign: 'left', width: '100%' }}
          >
            Profile
          </button>
          <button 
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="dashboard-nav-link"
            style={{ textAlign: 'left', width: '100%', color: '#f87171' }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-page-container">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2" style={{ fontSize: '1.85rem' }}>
                Welcome back, {user?.name.split(' ')[0]} <Sparkles className="w-6 h-6 text-indigo-400" />
              </h1>
              <p className="text-slate-400 text-sm mt-1">Configure your profile settings and resume analyzers</p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Main User Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dashboard-card"
          >
            <div style={{ flexGrow: 1 }}>
              <h3 className="text-lg font-bold text-slate-200 mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Profile Details</h3>
              <div>
                <div className="dashboard-profile-row">
                  <span className="text-slate-400 text-sm">Full Name</span>
                  <span className="text-slate-200 text-sm font-medium">{user?.name}</span>
                </div>
                <div className="dashboard-profile-row">
                  <span className="text-slate-400 text-sm">Email Address</span>
                  <span className="text-slate-200 text-sm font-medium">{user?.email}</span>
                </div>
                <div className="dashboard-profile-row">
                  <span className="text-slate-400 text-sm">Account Created</span>
                  <span className="text-slate-200 text-sm font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-btn-group">
              <button 
                onClick={() => showToast('Profile settings are disabled for the Phase 2 demo', 'info')}
                className="dashboard-btn-primary"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => showToast('Security triggers are ready for Phase 3 MongoDB integration', 'info')}
                className="dashboard-btn-secondary"
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
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div className="dashboard-card">
              <div className="flex items-center gap-3 mb-4" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-slate-200">Account Usage</h4>
              </div>
              <div>
                <div className="flex justify-between text-sm" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="text-slate-400">Monthly Scans</span>
                  <span className="text-slate-200 font-semibold">0 / 10 Free</span>
                </div>
                <div className="dashboard-progress-bar">
                  <div className="dashboard-progress-fill"></div>
                </div>
              </div>
            </div>

            <div className="dashboard-card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '1rem' }}>
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" style={{ minWidth: '24px' }} />
              <div>
                <h4 className="font-bold text-slate-200 text-sm">No resume uploaded yet</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed" style={{ fontSize: '0.75rem' }}>
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
