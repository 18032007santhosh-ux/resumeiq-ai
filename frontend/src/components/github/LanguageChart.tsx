import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

interface LanguageChartProps {
  languages: { [key: string]: number };
}

export const LanguageChart: React.FC<LanguageChartProps> = ({ languages }) => {
  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalReposWithLang = Object.values(languages).reduce((sum, val) => sum + val, 0);

  // Predefined color palette for languages to make it look premium
  const languageColors: { [key: string]: string } = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-500',
    Python: 'bg-teal-500',
    HTML: 'bg-orange-500',
    CSS: 'bg-purple-500',
    Java: 'bg-red-500',
    Go: 'bg-sky-400',
    Rust: 'bg-orange-600',
    'C++': 'bg-pink-500',
    Ruby: 'bg-red-650',
    PHP: 'bg-violet-400',
    Shell: 'bg-emerald-400',
    Swift: 'bg-orange-400',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
      {/* Background ambient light */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Languages Breakdown
        </h3>

        {sortedLanguages.length === 0 ? (
          <p className="text-slate-500 text-xs py-8 text-center italic">
            No language statistics detected.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Visual breakdown bar */}
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-850">
              {sortedLanguages.map(([lang, count], index) => {
                const percentage = totalReposWithLang > 0 ? (count / totalReposWithLang) * 100 : 0;
                const colorClass = languageColors[lang] || 'bg-slate-500';
                return (
                  <div
                    key={lang}
                    className={`${colorClass} h-full transition-all`}
                    style={{ width: `${percentage}%` }}
                    title={`${lang}: ${count} repos (${Math.round(percentage)}%)`}
                  />
                );
              })}
            </div>

            {/* Language details list */}
            <div className="space-y-3 pt-2">
              {sortedLanguages.map(([lang, count]) => {
                const percentage = totalReposWithLang > 0 ? (count / totalReposWithLang) * 100 : 0;
                const colorClass = languageColors[lang] || 'bg-slate-500';

                return (
                  <div key={lang} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                      <span className="font-medium text-slate-350">{lang}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{count} repos</span>
                      <span className="font-semibold text-white">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-550 border-t border-slate-850/60 pt-4 mt-6">
        Note: Language breakdown aggregates the primary languages declared by GitHub on your public repositories.
      </div>
    </div>
  );
};
