import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServerCrash, RefreshCw } from 'lucide-react';

export const ServerError: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 bg-[#070913] font-sans p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ServerCrash className="w-8 h-8 text-red-400" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-100">500</h1>
        <h2 className="text-xl font-bold text-slate-200 mt-2">Server Error</h2>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          Oops, something went wrong on our server. We are looking into this error and hope to resolve it shortly.
        </p>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={handleReload}
            className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer text-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          
          <Link 
            to="/"
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/20 cursor-pointer text-white"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
