import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, LogIn } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 bg-[#070913] font-sans p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-100">401</h1>
        <h2 className="text-xl font-bold text-slate-200 mt-2">Unauthorized Access</h2>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          You do not have permission to view this resource. Please sign in with an authorized account to access this page.
        </p>

        <Link 
          to="/login"
          className="w-full mt-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group transition-all shadow-lg shadow-amber-500/20 cursor-pointer text-white"
        >
          <LogIn className="w-4 h-4" />
          Login to Account
        </Link>
      </motion.div>
    </div>
  );
};
