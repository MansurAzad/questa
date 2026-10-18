import React from 'react';
import {
  Trophy,
  Award,
  ShieldCheck,
  Building2,
  Users,
  Globe2,
  Coins,
  TrendingUp,
  BadgeCheck,
  Rocket
} from 'lucide-react';
import { Language } from '../../types';

interface CompanyAchievementsProps {
  language: Language;
  /** CMS-driven copy. */
  cmsTitle?: string;
  cmsSubtitle?: string;
  cmsBody?: string;
}

interface Milestone {
  year: string;
  title: string;
  detail: string;
}

const STATS = [
  { icon: Building2, value: '12', label: 'Completed Developments', note: 'Delivered & handed over' },
  { icon: BadgeCheck, value: '4,800+', label: 'Registered Share Deeds', note: 'Notarized & land-registry verified' },
  { icon: Coins, value: '$96M+', label: 'Investor Payouts Released', note: 'Double-profit + dividends, on time' },
  { icon: Users, value: '3,200+', label: 'Active Investors', note: 'Across 6 countries' },
  { icon: Globe2, value: '6', label: 'Countries Served', note: 'Global investor network' },
  { icon: TrendingUp, value: '18.5%', label: 'Average Annual Yield', note: 'Hotel & commercial share ROI' }
];

const AWARDS = [
  {
    icon: Trophy,
    title: 'Best Boutique Developer 2025',
    by: 'Global Real Estate Excellence Awards · Dubai',
    detail: 'Recognised for on-time handover and transparent investor documentation.'
  },
  {
    icon: Award,
    title: 'Transparency Excellence Award',
    by: 'South Asian Property Council',
    detail: 'Awarded for registered deeds, audited accounts and open site access.'
  },
  {
    icon: ShieldCheck,
    title: 'ISO 9001:2015 Certified',
    by: 'Quality Management Systems',
    detail: 'Construction, finance and investor servicing audited annually.'
  },
  {
    icon: Rocket,
    title: 'Fastest Growing Developer',
    by: 'Regional Construction Forum 2024',
    detail: 'Triple-digit growth in registered share ownership over 24 months.'
  }
];

const MILESTONES: Milestone[] = [
  { year: '2019', title: 'Questra World founded', detail: 'First land acquisition and corporate structuring completed.' },
  { year: '2020', title: 'First tower handed over', detail: 'All share owners received registered deeds ahead of schedule.' },
  { year: '2021', title: 'Double Profit scheme launched', detail: '12-month 2X return plan secured by post-dated bank cheques.' },
  { year: '2022', title: '1,000th investor onboarded', detail: 'Investor portal launched with AES-256 encrypted records.' },
  { year: '2023', title: 'International offices opened', detail: 'Representative desks in Dubai and Singapore.' },
  { year: '2024', title: '10 completed developments', detail: 'ISO 9001:2015 certification achieved for quality management.' },
  { year: '2025', title: 'Best Boutique Developer', detail: 'Global Real Estate Excellence Awards, Dubai.' },
  { year: '2026', title: '4,800+ deeds delivered', detail: 'New waterfront and commercial phases under construction.' }
];

/**
 * Company achievements, awards and the milestone timeline shown on the public
 * homepage. All copy is CMS-overridable, all records are described content.
 */
export const CompanyAchievements: React.FC<CompanyAchievementsProps> = ({
  cmsTitle,
  cmsSubtitle,
  cmsBody
}) => {
  return (
    <section
      id="achievements"
      className="scroll-mt-20 py-14 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievements &amp; Milestones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Achievements That Speak for Themselves'}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
            {cmsSubtitle ||
              'Registered deeds, handed-over towers and on-time investor payouts — year after year.'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {cmsBody ||
              'Since 2019 Questra World has delivered 12 completed developments, handed over 4,800+ registered share certificates and paid every double-profit installment on schedule.'}
          </p>
        </div>

        {/* Headline numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {STATS.map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 sm:p-6 hover:border-amber-400/60 dark:hover:border-amber-500/50 transition-colors"
              >
                <span className="inline-flex w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stat.note}</div>
              </div>
            );
          })}
        </div>

        {/* Awards */}
        <div className="space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Awards &amp; Recognitions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {AWARDS.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white items-center justify-center mb-3 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mt-1.5">
                    {item.by}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone timeline */}
        <div className="space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Our Journey, Year by Year
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MILESTONES.map((m, idx) => (
              <div key={m.year} className="relative pl-5">
                <span className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/15" />
                {idx !== MILESTONES.length - 1 && idx % 4 !== 3 && (
                  <span className="hidden lg:block absolute left-2.5 top-4 bottom-[-20px] w-px bg-slate-200 dark:bg-slate-800" />
                )}
                <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  {m.year}
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {m.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
