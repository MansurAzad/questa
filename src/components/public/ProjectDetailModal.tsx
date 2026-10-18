import React from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Download,
  Calendar,
  Building2,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  Phone
} from 'lucide-react';
import { ProjectInfo, Language } from '../../types';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectInfo | null;
  language: Language;
  onBookNow: (project: ProjectInfo) => void;
  onBookTour: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  language,
  onBookNow,
  onBookTour
}) => {
  if (!isOpen || !project) return null;
  const isBn = language === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-16/8 rounded-2xl overflow-hidden mb-6">
          <img
            src={project.heroImage}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-600 text-white uppercase tracking-wider">
              {project.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              { project.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-amber-200 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{ project.location}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Starting Price</span>
            <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
              {project.startingPrice}
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Total Area / Scope</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              {project.size}
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Overall Progress</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-600 font-mono">
              {project.overallProgressPercentage}% Complete
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Expected Handover</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {project.expectedHandoverYear}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
            { 'Project Overview & Strategic Advantage'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            { 'Key Amenities & Legal Guarantees'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {( project.features).map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/40"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Preview */}
        {project.milestones && project.milestones.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              { 'Development Milestones'}
            </h3>
            <div className="space-y-2">
              {project.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-amber-600 font-mono">
                      {m.phase} · {m.targetDate}
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      { m.title}
                    </h5>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : m.status === 'in_progress'
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m.status.toUpperCase()} ({m.completionPercentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href="#project-visit"
              onClick={() => {
                onClose();
                onBookTour();
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              { 'Book Free Tour'}
            </a>
            <a
              href="tel:+971 4 512 8800"
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>+971 4 512 8800</span>
            </a>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow(project);
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            { 'Calculate Installments'}
          </button>
        </div>

      </div>
    </div>
  );
};
