import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CareerTip: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="col-span-1 lg:col-span-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 overflow-hidden relative shadow-lg shadow-indigo-900/10"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
        <Lightbulb className="w-8 h-8" />
      </div>
      
      <div className="flex-1 text-center sm:text-left z-10">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">Career Tip</h4>
        <p className="text-slate-200 font-medium text-lg max-w-2xl leading-snug">
          Tailor your resume to every job description by naturally integrating important keywords found in the job posting.
        </p>
      </div>
      
      <div className="shrink-0 z-10 w-full sm:w-auto mt-2 sm:mt-0">
        <button className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors backdrop-blur-md border border-white/10 flex items-center justify-center gap-2 group">
          Learn More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
