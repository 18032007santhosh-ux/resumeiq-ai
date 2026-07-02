import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Hero: React.FC = () => {
  const { user } = useAuth();
  
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <motion.section 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
            Welcome back, {firstName} <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_infinite]">👋</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl">
            Continue improving your resume with AI-powered ATS insights.
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 rounded-xl backdrop-blur-sm self-start md:self-end"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-indigo-300/70 font-semibold uppercase tracking-wider mb-0.5">Today's Goal</p>
            <p className="text-sm text-indigo-100 font-medium">Upload your first resume</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
