import React from 'react';
import { Star, GitFork, BookOpen, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

interface Repository {
  name: string;
  description: string;
  html_url: string;
  stars: number;
  forks: number;
  language: string;
  hasReadme: boolean;
  updatedAt: string;
}

interface RepositoryCardProps {
  repository: Repository;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  const formattedDate = new Date(repository.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/30 hover:bg-slate-900/60 transition duration-300 flex flex-col justify-between h-full relative group">
      <div>
        {/* Repo Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-white text-base truncate group-hover:text-indigo-400 transition">
            {repository.name}
          </h4>
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-white shrink-0 transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Primary Language Tag */}
        {repository.language && repository.language !== 'Unknown' && (
          <span className="inline-block text-[10px] bg-slate-850 text-indigo-300 font-medium px-2 py-0.5 rounded border border-slate-800 mb-3">
            {repository.language}
          </span>
        )}

        {/* Description */}
        <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-normal">
          {repository.description || (
            <span className="text-red-400/80 italic flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Missing repository description.
            </span>
          )}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="border-t border-slate-850/60 pt-4 mt-auto">
        <div className="flex items-center justify-between text-slate-500 text-[11px]">
          {/* Stars & Forks */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 hover:text-slate-300 transition">
              <Star className="w-3.5 h-3.5 text-yellow-500/70" />
              {repository.stars}
            </span>
            <span className="flex items-center gap-1 hover:text-slate-300 transition">
              <GitFork className="w-3.5 h-3.5 text-blue-500/70" />
              {repository.forks}
            </span>
          </div>

          {/* README Status */}
          <div className="flex items-center gap-1">
            {repository.hasReadme ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                README
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400/80 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                No README
              </span>
            )}
          </div>
        </div>

        {/* Date updated */}
        <div className="text-[9px] text-slate-650 mt-2 text-right">
          Updated: {formattedDate}
        </div>
      </div>
    </div>
  );
};
