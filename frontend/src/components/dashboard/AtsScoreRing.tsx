import React from 'react';
import { motion } from 'framer-motion';

interface AtsScoreRingProps {
  score: number;
}

const AtsScoreRing: React.FC<AtsScoreRingProps> = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-green-500';
  if (score < 60) colorClass = 'text-red-500';
  else if (score < 75) colorClass = 'text-orange-500';
  else if (score < 90) colorClass = 'text-blue-500';

  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="stroke-current text-slate-800"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          className={`stroke-current ${colorClass}`}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold text-white">{score}</span>
        <span className="text-sm font-medium text-slate-400">/ 100</span>
      </div>
    </div>
  );
};

export default AtsScoreRing;
