import React from 'react';
import { TrendingUp, Award, GitCompare, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const FutureFeatures: React.FC = () => {
  const features = [
    { icon: <TrendingUp className="w-5 h-5" />, title: 'ATS Score Trend', desc: 'Track your resume improvements over time.' },
    { icon: <Award className="w-5 h-5" />, title: 'Skills Growth', desc: 'Analyze your skill progression across roles.' },
    { icon: <GitCompare className="w-5 h-5" />, title: 'Resume Comparison', desc: 'A/B test different resume variations.' },
    { icon: <MessageSquare className="w-5 h-5" />, title: 'Interview Readiness', desc: 'AI-generated interview questions based on your CV.' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-bold text-slate-100">Coming Soon to ResumeIQ</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-800/30 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
            
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                {feature.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-md">
                Coming Soon
              </span>
            </div>
            
            <div className="mt-1">
              <h4 className="text-sm font-bold text-slate-300 mb-1">{feature.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
