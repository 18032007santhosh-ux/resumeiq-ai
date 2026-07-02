import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { Hero } from '../components/dashboard/Hero';
import { StatsCards } from '../components/dashboard/StatsCards';
import { UploadCard } from '../components/dashboard/UploadCard';
import { RecentAnalyses } from '../components/dashboard/RecentAnalyses';
import { CareerTip } from '../components/dashboard/CareerTip';
import { FutureFeatures } from '../components/dashboard/FutureFeatures';

export const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar with mobile toggle state */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        
        {/* Subtle Ambient Background */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-8 pb-16">
            
            <Hero />
            
            <StatsCards />
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UploadCard />
              <RecentAnalyses />
              
              {/* Career Tip spans both columns on large screens */}
              <CareerTip />
            </div>

            <FutureFeatures />
            
          </div>
        </main>
      </div>
    </div>
  );
};
