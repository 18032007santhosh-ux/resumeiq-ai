import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Search, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-[72px] border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar (UI Only) */}
        <div className="hidden md:flex items-center relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-4" />
          <input 
            type="text" 
            placeholder="Search resumes, skills, or analyses..." 
            className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-semibold text-slate-200">{user?.name || 'User Name'}</div>
          <div className="text-xs text-slate-400 mt-0.5">{user?.email || 'user@example.com'}</div>
        </div>
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {getInitials(user?.name)}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};
