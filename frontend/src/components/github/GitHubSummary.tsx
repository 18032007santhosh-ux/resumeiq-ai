import React from 'react';
import { Users, BookOpen, Star, GitFork, Calendar, Globe } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.5-3.4.1-.3.6-1.6-.1-3.3 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C6.1 2.7 4.9 3.1 4.9 3.1c-.7 1.7-.2 3 .1 3.3-1 1-1.5 2-1.5 3.4 0 5 3 6.2 6 6.5-.4.4-.7 1-.8 2.1-.5.2-1.8.8-3-1-1.2-2-2-2.1-2-2.1-1.1-.1-.1.1-.1.1.8.1 1.2 1.3 1.2 1.3 1 1.7 2.6 1.1 3.2.8.1-1 .5-1.7 1-2.1-3-.3-6-1.5-6-6.5 0-1.4.5-2.5 1.5-3.4-.1-.3-.6-1.6.1-3.3 0 0 1.2.4 3.9-1.4a12.3 12.3 0 0 1 7 0c2.7-1.8 3.9-1.4 3.9-1.4.7 1.7.2 3-.1 3.3 1 .9 1.5 2 1.5 3.4 0 5-3 6.2-6 6.5.3.4.7 1 .8 2.1v4.4"/></svg>
);

interface GitHubSummaryProps {
  profile: {
    username: string;
    avatarUrl: string;
    bio: string;
    followers: number;
    following: number;
    publicRepos: number;
    stars: number;
    forks: number;
    createdAt: string;
    updatedAt: string;
  };
  githubUrl: string;
  linkedinUrl?: string;
}

export const GitHubSummary: React.FC<GitHubSummaryProps> = ({
  profile,
  githubUrl,
  linkedinUrl
}) => {
  const formattedDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500" />
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="relative w-24 h-24 rounded-full border-2 border-slate-800 object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <GithubIcon className="w-6 h-6 text-indigo-400" />
              {profile.username}
            </h3>
            <div className="flex justify-center md:justify-start gap-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 font-medium rounded-full border border-slate-700 transition"
              >
                GitHub Profile
              </a>
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 font-medium rounded-full border border-indigo-500/30 transition"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <p className="text-slate-300 text-sm max-w-xl italic">
            {profile.bio || "This user doesn't have a bio configured on GitHub."}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 border-t border-slate-800/60 pt-6">
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 text-center">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <BookOpen className="w-3 h-3 text-indigo-400" />
            Repos
          </div>
          <div className="text-xl font-bold text-white">{profile.publicRepos}</div>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 text-center">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Star className="w-3 h-3 text-yellow-400" />
            Stars
          </div>
          <div className="text-xl font-bold text-white">{profile.stars}</div>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 text-center">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <GitFork className="w-3 h-3 text-blue-400" />
            Forks
          </div>
          <div className="text-xl font-bold text-white">{profile.forks}</div>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 text-center">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Users className="w-3 h-3 text-emerald-400" />
            Followers
          </div>
          <div className="text-xl font-bold text-white">{profile.followers}</div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 text-center">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Users className="w-3 h-3 text-purple-400" />
            Following
          </div>
          <div className="text-xl font-bold text-white">{profile.following}</div>
        </div>
      </div>
    </div>
  );
};
