import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Hammer,
  HardHat,
  ChevronRight,
  ShieldCheck,
  Building2,
  Hotel,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Language, ProjectInfo, ConstructionMilestone } from '../../types';
import { PUBLIC_PROJECTS } from '../../services/storage';
import { getTranslation, translations } from '../../services/i18n';

interface ProjectTimelineProps {
  language: Language;
  onSelectProjectForBooking?: (projectId: string) => void;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  language,
  onSelectProjectForBooking,
  cmsTitle,
  cmsSubtitle
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('questa-royal-bay');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'completed' | 'in_progress'>('all');

  const t = (key: keyof typeof translations.en) => getTranslation(language, key);

  const currentProject = PUBLIC_PROJECTS.find(p => p.id === selectedProjectId) || PUBLIC_PROJECTS[0];

  if (!currentProject) {
    return null;
  }

  const filteredMilestones = currentProject.milestones.filter(m => {
    if (filterState === 'all') return true;
    return m.status === filterState;
  });

  const activeMilestone =
    currentProject.milestones.find(m => m.id === selectedMilestoneId) ||
    currentProject.milestones.find(m => m.status === 'in_progress') ||
    currentProject.milestones[0];

  // SVG Node positions for a 5-node curved bezier roadmap (viewBox: 0 0 1000 180)
  const svgPoints = [
    { x: 70, y: 110 },
    { x: 270, y: 60 },
    { x: 500, y: 120 },
    { x: 730, y: 60 },
    { x: 930, y: 100 }
  ];

  // Calculate progress curve length
  const completedCount = currentProject.milestones.filter(m => m.status === 'completed').length;
  const inProgressIndex = currentProject.milestones.findIndex(m => m.status === 'in_progress');
  const activeFraction =
    inProgressIndex !== -1
      ? (inProgressIndex + (currentProject.milestones[inProgressIndex].completionPercentage / 100)) / currentProject.milestones.length
      : completedCount / currentProject.milestones.length;

  return (
    <section id="timeline" className="py-14 sm:py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <HardHat className="w-3.5 h-3.5" />
            <span>{ 'Civil Progress & Milestones'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || t('timelineTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {cmsSubtitle || t('timelineSubtitle')}
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl max-w-full">
            {PUBLIC_PROJECTS.map(proj => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    const defaultActive = proj.milestones.find(m => m.status === 'in_progress') || proj.milestones[0];
                    setSelectedMilestoneId(defaultActive?.id || null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-amber-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                  <span>{ proj.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Snapshot & Progress Gauge Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden mb-8">
          
          {/* Top Banner with Overall Completion Gauge */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono tracking-wider uppercase">
                <span>{currentProject.size}</span>
                <span aria-hidden="true">·</span>
                <span>{ currentProject.location}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                { currentProject.name}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                { currentProject.tagline}
              </p>
            </div>

            {/* Gauge & Handover Stat */}
            <div className="flex items-center gap-6 shrink-0 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <div className="text-right">
                <span className="text-[11px] text-slate-300 block font-medium">
                  {t('expectedHandover')}
                </span>
                <span className="text-base font-extrabold text-white font-mono block">
                  {currentProject.expectedHandoverYear}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                  ON SCHEDULE · 100% COMPLIANT
                </span>
              </div>

              {/* Circular Gauge Representation */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${currentProject.overallProgressPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-black text-white font-mono">
                    {currentProject.overallProgressPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SVG Timeline Visualization (Desktop View) */}
          <div className="hidden lg:block p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700">
            <div className="relative w-full overflow-hidden">
              <svg viewBox="0 0 1000 180" className="w-full h-44 overflow-visible">
                <defs>
                  {/* Glowing progress line gradient */}
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="60%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>

                  <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Base background road curve */}
                <path
                  d="M 70 110 C 170 110, 170 60, 270 60 C 370 60, 400 120, 500 120 C 600 120, 630 60, 730 60 C 830 60, 830 100, 930 100"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700/80"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Animated active completed progress curve */}
                <path
                  d="M 70 110 C 170 110, 170 60, 270 60 C 370 60, 400 120, 500 120 C 600 120, 630 60, 730 60 C 830 60, 830 100, 930 100"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset={`${1000 - (1000 * activeFraction * 0.9)}`}
                  className="transition-all duration-700 ease-out"
                />

                {/* Milestones SVG Nodes */}
                {currentProject.milestones.map((m, idx) => {
                  const pt = svgPoints[idx] || { x: 100 + idx * 180, y: 90 };
                  const isSelected = selectedMilestoneId === m.id;
                  const isCompleted = m.status === 'completed';
                  const isInProgress = m.status === 'in_progress';

                  return (
                    <g
                      key={m.id}
                      className="cursor-pointer group"
                      onClick={() => setSelectedMilestoneId(m.id)}
                    >
                      {/* Pulse beacon ring on in-progress active milestone */}
                      {isInProgress && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="22"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          className="animate-ping opacity-60"
                        />
                      )}

                      {/* Selection ring */}
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="19"
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="3"
                          className="opacity-90"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="14"
                        fill={isCompleted ? '#10b981' : isInProgress ? '#f59e0b' : '#64748b'}
                        stroke="#ffffff"
                        strokeWidth="3"
                        className="transition-transform duration-200 group-hover:scale-110 shadow-lg"
                      />

                      {/* Inner Node Indicator */}
                      <text
                        x={pt.x}
                        y={pt.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        className="pointer-events-none font-mono"
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </text>

                      {/* Node Label Below/Above */}
                      <text
                        x={pt.x}
                        y={pt.y > 90 ? pt.y - 24 : pt.y + 32}
                        textAnchor="middle"
                        className={`text-[11px] font-bold transition-colors ${
                          isSelected
                            ? 'fill-amber-600 dark:fill-amber-400 font-extrabold'
                            : 'fill-slate-700 dark:fill-slate-300'
                        }`}
                      >
                        {m.phase}
                      </text>

                      <text
                        x={pt.x}
                        y={pt.y > 90 ? pt.y - 10 : pt.y + 46}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-slate-600 dark:fill-slate-300"
                      >
                        {m.targetDate}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Active Highlighted Milestone Card */}
          {activeMilestone && (
            <div className="p-6 sm:p-8 bg-amber-50/40 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                      {activeMilestone.phase}
                    </span>
                    <span aria-hidden="true" className="text-slate-600 dark:text-slate-300">·</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono">
                      Target: {activeMilestone.targetDate}
                    </span>
                    <span aria-hidden="true" className="text-slate-600 dark:text-slate-300">·</span>
                    <span className={`font-semibold ${
                      activeMilestone.status === 'completed'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : activeMilestone.status === 'in_progress'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-400'
                    }`}>
                      {activeMilestone.status === 'completed'
                        ? ( 'Verified Completed')
                        : activeMilestone.status === 'in_progress'
                        ? ( 'Active On-Site Phase')
                        : ( 'Scheduled Phase')}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    { activeMilestone.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    { activeMilestone.description}
                  </p>

                  {/* Quality Assurance & Engineering Note */}
                  {activeMilestone.inspectorNote && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-2.5 shadow-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 dark:text-white">
                          {t('inspectionVerified')}:
                        </strong>
                        <span className="text-slate-600 dark:text-slate-300">
                          {activeMilestone.inspectorNote} ({activeMilestone.verifiedDate})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar inside milestone card */}
                <div className="md:w-64 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shrink-0">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Phase Completion</span>
                    <span className="font-mono text-amber-700 dark:text-amber-400">
                      {activeMilestone.completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        activeMilestone.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${activeMilestone.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-mono">
                    Updated by Project Engineering Directorate
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* All Milestones List Cards (Mobile & Responsive Grid) */}
          <div className="p-6 sm:p-8 space-y-4">
            
            {/* Filter Buttons */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                { 'Milestone Schedule'}
              </span>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl text-xs">
                {(['all', 'completed', 'in_progress'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterState(tab)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      filterState === tab
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'all'
                      ? t('filterAllMilestones')
                      : tab === 'completed'
                      ? t('filterCompleted')
                      : t('filterActive')}
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Milestone Stack */}
            <div className="space-y-3">
              {filteredMilestones.map((m, idx) => {
                const isSelected = selectedMilestoneId === m.id;
                const isCompleted = m.status === 'completed';
                const isInProgress = m.status === 'in_progress';

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-semibold text-slate-500">{m.phase}</span>
                          <span aria-hidden="true" className="text-slate-600 dark:text-slate-300">·</span>
                          <span className="text-slate-600 dark:text-slate-300 font-mono">{m.targetDate}</span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          { m.title}
                        </h5>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white block">
                          {m.completionPercentage}%
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {m.status}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-300'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
