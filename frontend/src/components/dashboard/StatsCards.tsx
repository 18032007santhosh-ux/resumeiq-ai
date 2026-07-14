import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Target, 
  Briefcase, 
  BrainCircuit, 
  Mail, 
  GitBranch,
  Loader2 
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import api from '../../services/api';

interface StatsData {
  totalResumes: number;
  latestAtsScore: number | null;
  totalJobMatches: number;
  totalInterviews: number;
  totalCoverLetters: number;
  totalGitHubAnalyses: number;
}

export const StatsCards: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatsData>({
    totalResumes: 0,
    latestAtsScore: null,
    totalJobMatches: 0,
    totalInterviews: 0,
    totalCoverLetters: 0,
    totalGitHubAnalyses: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data && res.data.status === 'success') {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { 
      title: 'Total Resumes', 
      value: loading ? null : data.totalResumes.toString(), 
      desc: 'Uploaded documents',
      icon: <FileText className="w-5 h-5 text-indigo-400" />, 
      color: 'from-indigo-500/10 to-transparent border-indigo-500/20 hover:border-indigo-500/40' 
    },
    { 
      title: 'Latest ATS Score', 
      value: loading ? null : (data.latestAtsScore !== null ? `${data.latestAtsScore}` : '--'), 
      desc: 'Top rating calculated',
      icon: <Target className="w-5 h-5 text-emerald-400" />, 
      color: 'from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/40' 
    },
    { 
      title: 'Job Matches', 
      value: loading ? null : data.totalJobMatches.toString(), 
      desc: 'Target match evaluations',
      icon: <Briefcase className="w-5 h-5 text-blue-400" />, 
      color: 'from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40' 
    },
    { 
      title: 'Interview Sessions', 
      value: loading ? null : data.totalInterviews.toString(), 
      desc: 'Simulator reviews',
      icon: <BrainCircuit className="w-5 h-5 text-purple-400" />, 
      color: 'from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40' 
    },
    { 
      title: 'Cover Letters', 
      value: loading ? null : data.totalCoverLetters.toString(), 
      desc: 'AI tailored letters',
      icon: <Mail className="w-5 h-5 text-pink-400" />, 
      color: 'from-pink-500/10 to-transparent border-pink-500/20 hover:border-pink-500/40' 
    },
    { 
      title: 'GitHub Analyses', 
      value: loading ? null : data.totalGitHubAnalyses.toString(), 
      desc: 'Code portfolio reviews',
      icon: <GitBranch className="w-5 h-5 text-amber-400" />, 
      color: 'from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/40' 
    },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 26 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8"
    >
      {stats.map((stat, idx) => (
        <motion.div 
          key={idx} 
          variants={item}
          className={`bg-gradient-to-br ${stat.color} bg-slate-900/40 backdrop-blur-xl border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-lg shadow-slate-950/20 group cursor-default`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-slate-900/60 shadow-inner group-hover:scale-105 transition-transform duration-300 border border-slate-850">
              {stat.icon}
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white mb-0.5 tracking-tight min-h-[32px] flex items-center">
              {stat.value === null ? (
                <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
              ) : (
                stat.value
              )}
            </div>
            <div className="text-xs font-bold text-slate-300 mb-0.5">{stat.title}</div>
            <div className="text-[10px] text-slate-500">{stat.desc}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
