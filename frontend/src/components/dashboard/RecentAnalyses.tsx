import React from 'react';
import { History, FileX } from 'lucide-react';
import { motion } from 'framer-motion';

export const RecentAnalyses: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl h-full flex flex-col overflow-hidden shadow-xl shadow-slate-950/30"
    >
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          Recent Analyses
        </h3>
      </div>
      
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 mb-4 border border-slate-700/50">
          <FileX className="w-8 h-8" />
        </div>
        <h4 className="text-base font-semibold text-slate-300 mb-1">No analyses available yet.</h4>
        <p className="text-sm text-slate-500 max-w-[250px] mb-6">
          Upload your resume to generate your first ATS insights report.
        </p>
        <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-700 hover:border-slate-600">
          Upload Your First Resume
        </button>
      </div>
    </motion.div>
  );
};
