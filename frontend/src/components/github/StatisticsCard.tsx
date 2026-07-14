import React from 'react';
import { Star, GitFork, BookOpen, Clock, FileText, BarChart3 } from 'lucide-react';

interface Statistics {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  accountAgeMonths: number;
  lastActivityDays: number;
}

interface StatisticsCardProps {
  statistics: Statistics;
  repositories: any[];
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics, repositories }) => {
  // Compute documentation quality metrics
  const total = repositories.length;
  const withReadme = repositories.filter(r => r.hasReadme).length;
  const withDesc = repositories.filter(r => r.description).length;

  const readmePercent = total > 0 ? Math.round((withReadme / total) * 100) : 0;
  const descPercent = total > 0 ? Math.round((withDesc / total) * 100) : 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background radial lighting */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        Repository Statistics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quality Metric: README Coverage */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-slate-400">
            <span>README Coverage</span>
            <span className="text-white font-bold">{readmePercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${readmePercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {withReadme} out of {total} repositories have a README file.
          </p>
        </div>

        {/* Quality Metric: Description Coverage */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-slate-400">
            <span>Description Coverage</span>
            <span className="text-white font-bold">{descPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-400 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${descPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {withDesc} out of {total} repositories have a project description.
          </p>
        </div>

        {/* Metric: Repository Inactivity / Recency */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-550 text-[10px] uppercase font-bold tracking-wider">Last Activity</div>
              <div className="text-white font-bold text-lg mt-0.5">
                {statistics.lastActivityDays === 0 ? 'Today' : `${statistics.lastActivityDays} days ago`}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal mt-4">
            Profile has been active for approximately {Math.round(statistics.accountAgeMonths)} months on GitHub.
          </p>
        </div>
      </div>
    </div>
  );
};
