import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedbackListProps {
  items: string[];
  type: 'strengths' | 'improvements' | 'issues';
}

const FeedbackList: React.FC<FeedbackListProps> = ({ items, type }) => {
  if (!items || items.length === 0) {
    return <p className="text-slate-400 text-sm italic">No items found.</p>;
  }

  const getIcon = () => {
    switch (type) {
      case 'strengths':
        return <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />;
      case 'improvements':
        return <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case 'issues':
        return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
    }
  };

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-start space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
        >
          <div className="mt-0.5">{getIcon()}</div>
          <span className="text-slate-300 text-sm">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
};

export default FeedbackList;
