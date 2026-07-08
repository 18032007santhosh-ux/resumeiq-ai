import React from 'react';
import { motion } from 'framer-motion';

interface CategoryBreakdownProps {
  breakdown: {
    contact: number;
    education: number;
    experience: number;
    skills: number;
    projects: number;
    certifications: number;
    completeness: number;
  };
}

const MAX_SCORES = {
  contact: 10,
  education: 15,
  experience: 20,
  skills: 20,
  projects: 15,
  certifications: 10,
  completeness: 10,
};

const LABELS: Record<string, string> = {
  contact: 'Contact Info',
  education: 'Education',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  completeness: 'Completeness',
};

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ breakdown }) => {
  return (
    <div className="space-y-4 w-full">
      {Object.entries(breakdown).map(([category, score], index) => {
        const maxScore = MAX_SCORES[category as keyof typeof MAX_SCORES] || 10;
        const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

        let barColor = 'bg-green-500';
        if (percentage < 60) barColor = 'bg-red-500';
        else if (percentage < 80) barColor = 'bg-orange-500';

        return (
          <div key={category} className="flex flex-col space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-300 capitalize">
                {LABELS[category] || category}
              </span>
              <span className="text-slate-400">
                {score} / {maxScore}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBreakdown;
