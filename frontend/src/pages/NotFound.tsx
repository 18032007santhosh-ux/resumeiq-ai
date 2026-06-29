import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 bg-[#070913] font-sans p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-rose-400" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-100">404</h1>
        <h2 className="text-xl font-bold text-slate-200 mt-2">Page Not Found</h2>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link 
          to="/"
          className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group transition-all shadow-lg shadow-indigo-500/20 cursor-pointer text-white"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};
