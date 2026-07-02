import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { History as HistoryIcon } from 'lucide-react';

export const History: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <h1 className="text-3xl font-bold text-white mb-2">Analysis History</h1>
              <p className="text-slate-400">View your past resume analyses and feedback.</p>
            </div>

            <div className="mt-8">
              <div className="text-center py-16 px-4 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <HistoryIcon className="w-10 h-10 text-slate-500" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">No history available</h4>
                <p className="text-slate-400 max-w-sm mx-auto">
                  You haven't analyzed any resumes yet. Upload a resume to get started.
                </p>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};
