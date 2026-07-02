import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { ResumeUploadCard } from '../components/dashboard/resumes/ResumeUploadCard';
import { ResumeList } from '../components/dashboard/resumes/ResumeList';

export const Resumes: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-8 pb-16">
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Resume Manager</h1>
              <p className="text-slate-400">Upload and manage your resumes for AI analysis.</p>
            </div>

            <ResumeUploadCard onUploadSuccess={handleUploadSuccess} />
            <ResumeList refreshTrigger={refreshTrigger} />
            
          </div>
        </main>
      </div>
    </div>
  );
};
