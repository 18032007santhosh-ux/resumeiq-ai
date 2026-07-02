import React from 'react';
import { UploadCloud, FileText, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const UploadCard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-500/40 transition-all cursor-pointer h-full relative overflow-hidden shadow-xl shadow-slate-950/30"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/10">
        <UploadCloud className="w-10 h-10" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-2">Upload Resume for Analysis</h3>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
        Drag and drop your resume file here or click to browse. Let our AI extract and analyze your career profile.
      </p>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-300">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          PDF
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-300">
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          DOCX
        </div>
        <div className="text-xs text-slate-500 font-medium ml-1">Max 5MB</div>
      </div>
      
      <button className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95">
        Choose File
      </button>

      <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-500">
        <Lock className="w-3.5 h-3.5" />
        Secure upload. Your data remains private.
      </div>
    </motion.div>
  );
};
