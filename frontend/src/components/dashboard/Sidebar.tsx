import React from 'react';
import { LayoutDashboard, FileText, History, Settings, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CareerProgress } from './CareerProgress';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', path: '/dashboard/resumes', icon: FileText },
    { name: 'Analysis History', path: '/dashboard/history', icon: History },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 h-full z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            ResumeIQ AI
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors border ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium border-indigo-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}

          <div className="my-6 border-t border-slate-800/50 pt-2" />
          
          <CareerProgress />
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
