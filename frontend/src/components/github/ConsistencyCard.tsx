import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Layers } from 'lucide-react';

interface ConsistencyCardProps {
  consistencyScore: number;
  missingProjects: string[];
  missingSkills: string[];
}

export const ConsistencyCard: React.FC<ConsistencyCardProps> = ({
  consistencyScore,
  missingProjects,
  missingSkills
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-indigo-400" />
        Resume Consistency Check
      </h3>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Score Radial Ring */}
        <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl w-44 h-44 text-center">
          <div className="relative flex items-center justify-center">
            {/* SVG circle logic */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="url(#indigoGrad)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * consistencyScore) / 100}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-2xl font-black text-white">{consistencyScore}%</div>
          </div>
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-3">Consistency Score</div>
        </div>

        {/* Mismatches and gaps */}
        <div className="flex-1 w-full space-y-4">
          {/* Missing projects */}
          <div className="bg-slate-950/20 border border-slate-850/60 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Missing Projects / Mismatches
            </h4>
            {missingProjects.length === 0 ? (
              <p className="text-slate-400 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                All projects mentioned on your resume align perfectly with your GitHub profile.
              </p>
            ) : (
              <ul className="list-disc pl-4 space-y-1">
                {missingProjects.map((proj, index) => (
                  <li key={index} className="text-slate-300 text-xs">{proj}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Missing skills */}
          <div className="bg-slate-950/20 border border-slate-850/60 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-4 h-4" />
              Skills Gap (In Resume but not on GitHub)
            </h4>
            {missingSkills.length === 0 ? (
              <p className="text-slate-400 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                No skills gaps detected. Your GitHub code reflects all the skills on your resume.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-[10px] bg-slate-850 text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
