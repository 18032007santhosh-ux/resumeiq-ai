import React from 'react';
import { FileText, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export const StatsCards: React.FC = () => {
  const stats = [
    { 
      title: 'Total Resumes', 
      value: '0', 
      desc: 'No documents uploaded',
      icon: <FileText className="w-6 h-6 text-indigo-400" />, 
      color: 'from-indigo-500/10 to-transparent border-indigo-500/20 hover:border-indigo-500/40' 
    },
    { 
      title: 'Average ATS Score', 
      value: '--', 
      desc: 'Awaiting first analysis',
      icon: <Target className="w-6 h-6 text-emerald-400" />, 
      color: 'from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/40' 
    },
    { 
      title: 'Matched Skills', 
      value: '--', 
      desc: 'Identify your strengths',
      icon: <CheckCircle className="w-6 h-6 text-blue-400" />, 
      color: 'from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40' 
    },
    { 
      title: 'Missing Skills', 
      value: '--', 
      desc: 'Find critical skill gaps',
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />, 
      color: 'from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/40' 
    },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
    >
      {stats.map((stat, idx) => (
        <motion.div 
          key={idx} 
          variants={item}
          className={`bg-gradient-to-br ${stat.color} bg-slate-900/40 backdrop-blur-xl border rounded-2xl p-6 flex flex-col transition-all duration-300 shadow-lg shadow-slate-950/20 group cursor-default`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-900/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-100 mb-1 tracking-tight">{stat.value}</div>
            <div className="text-sm font-semibold text-slate-300 mb-0.5">{stat.title}</div>
            <div className="text-xs text-slate-500">{stat.desc}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
