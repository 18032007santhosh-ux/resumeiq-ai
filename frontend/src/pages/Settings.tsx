import React, { useState, useContext, useEffect } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import { 
  User as UserIcon, 
  Lock, 
  Trash2, 
  Palette, 
  Check, 
  Loader2, 
  ShieldAlert, 
  Smartphone, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { showToast } = useToast();

  if (!authContext) {
    return null;
  }

  const { user, updateUserProfile, deleteUserAccount } = authContext;

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Theme Preferences State
  const [selectedTheme, setSelectedTheme] = useState('glass-indigo');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    const savedTheme = localStorage.getItem('resumeiq-theme') || 'glass-indigo';
    setSelectedTheme(savedTheme);
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill in all profile fields', 'error');
      return;
    }

    try {
      setProfileLoading(true);
      const res = await updateUserProfile(name, email);
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Failed to update profile settings', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await api.put('/auth/password', { currentPassword, newPassword });
      if (res.data.status === 'success') {
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.data.message || 'Incorrect current password', 'error');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to change password';
      showToast(errMsg, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle Theme Selection
  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
    localStorage.setItem('resumeiq-theme', themeName);
    
    // Apply changes dynamically
    const bodyClass = document.body.classList;
    bodyClass.forEach(cls => {
      if (cls.startsWith('theme-')) {
        bodyClass.remove(cls);
      }
    });
    bodyClass.add(`theme-${themeName}`);
    showToast(`Theme changed to ${themeName.split('-').join(' ')}!`, 'success');
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    const verified = window.confirm(
      'WARNING: Are you absolutely sure you want to delete your account? This action is permanent and will cascade-delete all your resumes, ATS analyses, Cover Letters, Mock Interviews, and GitHub analysis reports.'
    );
    if (!verified) return;

    const secondConfirm = window.prompt(
      'Type "DELETE" to confirm your decision:'
    );
    if (secondConfirm !== 'DELETE') {
      showToast('Account deletion cancelled', 'info');
      return;
    }

    try {
      const res = await deleteUserAccount();
      if (res.success) {
        showToast('Your account has been deleted. Goodbye!', 'success');
        window.location.href = '/';
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('An error occurred during account deletion', 'error');
    }
  };

  const themes = [
    { id: 'glass-indigo', name: 'Indigo Aura (Default)', color: 'bg-indigo-600' },
    { id: 'glass-emerald', name: 'Emerald Forest', color: 'bg-emerald-600' },
    { id: 'glass-cyan', name: 'Cyber Neon', color: 'bg-cyan-500' },
    { id: 'dark-pure', name: 'Solid Slate Black', color: 'bg-slate-900 border border-slate-700' }
  ];

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1000px] mx-auto space-y-8 pb-16">
            
            {/* Header */}
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & App Settings</h1>
              <p className="text-slate-400 text-sm mt-1">Configure your personal information, security preferences, and dashboard styles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column Navigation Hints */}
              <div className="md:col-span-1 space-y-4">
                <div className="glass-card p-6 border border-slate-800/80 rounded-2xl bg-slate-900/10 backdrop-blur-xl">
                  <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    Responsive Center
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Settings updates will synchronize instantly across your desktop, tablet, and mobile dashboards.
                  </p>
                </div>

                <div className="glass-card p-6 border border-slate-850 bg-slate-900/10 backdrop-blur-xl">
                  <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-400" />
                    Theme Control
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select dynamic glassmorphism layers or native solid slate theme configurations optimized for low-light environments.
                  </p>
                </div>
              </div>

              {/* Right Column Main Forms */}
              <div className="md:col-span-2 space-y-8">
                
                {/* 1. Edit Profile Form */}
                <div className="glass-card p-6 sm:p-8 border border-slate-800/80 bg-slate-900/15 backdrop-blur-xl rounded-3xl shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                    <UserIcon className="w-5 h-5 text-indigo-400" />
                    Edit Profile Details
                  </h2>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                    >
                      {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </button>
                  </form>
                </div>

                {/* 2. Change Password Form */}
                <div className="glass-card p-6 sm:p-8 border border-slate-800/80 bg-slate-900/15 backdrop-blur-xl rounded-3xl shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    Security Settings
                  </h2>
                  
                  <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                    >
                      {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Change Password'}
                    </button>
                  </form>
                </div>

                {/* 3. Theme Customization */}
                <div className="glass-card p-6 sm:p-8 border border-slate-800/80 bg-slate-900/15 backdrop-blur-xl rounded-3xl shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2.5">
                    <Palette className="w-5 h-5 text-indigo-400" />
                    Interface Themes
                  </h2>
                  <p className="text-slate-400 text-xs mb-6">Choose a color aesthetic or pure darkness setup that matches your professional layout preferences.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                          selectedTheme === theme.id 
                            ? 'bg-slate-900/50 border-indigo-500/80 shadow-md shadow-indigo-500/5' 
                            : 'bg-slate-950/30 border-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-4 h-4 rounded-full ${theme.color}`} />
                          <span className="text-xs font-semibold text-slate-200">{theme.name}</span>
                        </div>
                        {selectedTheme === theme.id && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Danger Zone */}
                <div className="glass-card p-6 sm:p-8 border border-rose-900/20 bg-rose-950/5 backdrop-blur-xl rounded-3xl shadow-xl">
                  <h2 className="text-xl font-bold text-rose-450 mb-3 flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    Danger Zone
                  </h2>
                  <p className="text-slate-400 text-xs mb-6">
                    Deleting your account is permanent. Once deleted, all uploaded resumes, generated cover letters, and analytical stats will be purged immediately.
                  </p>

                  <button
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete My Account
                  </button>
                </div>

              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};
