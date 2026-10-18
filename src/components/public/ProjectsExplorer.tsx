import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { Language, ProjectInfo } from '../../types';
import { PUBLIC_PROJECTS } from '../../services/storage';
import { translations, getTranslation } from '../../services/i18n';

interface ProjectsExplorerProps {
  language: Language;
  onSelectProject: (projectId: string) => void;
  onOpenMasterPlan: () => void;
  onViewDetails?: (project: ProjectInfo) => void;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
}

export const ProjectsExplorer: React.FC<ProjectsExplorerProps> = ({
  language,
  onSelectProject,
  onOpenMasterPlan,
  onViewDetails,
  cmsTitle,
  cmsSubtitle
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'commercial' | 'hospitality'>('all');

  const t = (key: keyof typeof translations.en) => getTranslation(language, key);

  const filtered = PUBLIC_PROJECTS.filter(p => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <section id="projects" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Our Prime Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {cmsTitle || 'Featured Hospitality & Commercial Investments'}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {cmsSubtitle || 'Secure high-yield investments in strategically located hospitality and commercial assets.'}
            </p>
          </div>

          {/* Filter Bar (buttons with proper semantic click handlers) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label:  'All Projects' },
              { id: 'hospitality', label:  'Hospitality Shares' },
              { id: 'commercial', label:  'Commercial' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterCategory === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(project => {
            return (
              <div
                key={project.id}
                className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image Frame */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={project.heroImage}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-slate-950/80 text-white backdrop-blur-xs">
                      {project.startingPrice}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    {/* Unboxed Location and Category */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{ project.location}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      { project.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      { project.tagline}
                    </p>

                    {/* Features List */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                      {( project.features).slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => onViewDetails?.(project)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{ 'View Specs & Brochure'}</span>
                  </button>

                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t('bookNow')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
