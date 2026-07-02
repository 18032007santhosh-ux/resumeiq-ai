import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export const CareerProgress: React.FC = () => {
  const steps = [
    { title: 'Dashboard Ready', completed: true },
    { title: 'Resume Upload', completed: false },
    { title: 'ATS Analysis', completed: false },
    { title: 'AI Suggestions', completed: false },
    { title: 'Job Matching', completed: false },
    { title: 'Interview Preparation', completed: false },
  ];

  const progressPercentage = (steps.filter(s => s.completed).length / steps.length) * 100;

  return (
    <div className="mt-8">
      <div className="px-4 mb-3 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Career Progress</h4>
        <span className="text-xs font-semibold text-indigo-400">{Math.round(progressPercentage)}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="px-4 mb-4">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-indigo-500 rounded-full"
          />
        </div>
      </div>

      <ul className="space-y-1.5 px-2">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-800/30 transition-colors cursor-default">
            {step.completed ? (
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <span className={`text-sm ${step.completed ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
              {step.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
