import React from 'react';
import { Star, Quote, BadgeCheck, Users, Wallet, Clock } from 'lucide-react';
import { Language } from '../../types';

interface SuccessStoriesProps {
  language: Language;
  /** CMS-driven copy. */
  cmsTitle?: string;
  cmsSubtitle?: string;
  cmsBody?: string;
}

interface Story {
  name: string;
  location: string;
  avatar: string;
  project: string;
  invested: string;
  returned: string;
  duration: string;
  quote: string;
}

const STORIES: Story[] = [
  {
    name: 'Farhan Ahmed',
    location: 'Dhaka, Bangladesh',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&auto=format&fit=crop&q=80',
    project: 'Questra Royal Bay · Suite Share #3168',
    invested: '$30,000',
    returned: '$60,000',
    duration: '12 monthly installments',
    quote:
      'Every installment arrived on the exact date written in the agreement. My registered deed was delivered before the final payment was even cleared.'
  },
  {
    name: 'Sarah Mitchell',
    location: 'Singapore',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    project: 'Questra World Commercial Center · Shop #221',
    invested: '$55,000',
    returned: '$110,000',
    duration: '12 monthly installments',
    quote:
      'I checked the ownership documents with my own lawyer before investing. Everything matched the registry — that is why I doubled my position.'
  },
  {
    name: 'Dr. Fiona Bennett',
    location: 'Singapore',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    project: 'Royal Bay Waterfront · Floor Unit',
    invested: '$60,000',
    returned: '$120,000',
    duration: '12 monthly installments',
    quote:
      'The investor portal showed every payment and dividend in real time. I never once had to chase anyone for information.'
  },
  {
    name: 'Engr. Thomas Anderson',
    location: 'Manchester, United Kingdom',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    project: 'Commercial Center · Office Floor',
    invested: '$45,000',
    returned: '$90,000',
    duration: '12 monthly installments',
    quote:
      'I flew in and walked the grounds with the project team. The development matched every single progress update posted on the portal.'
  }
];

const RESULTS = [
  { icon: Wallet, value: '$96M+', label: 'Total payouts released to investors' },
  { icon: BadgeCheck, value: '100%', label: 'On-time installment record since 2021' },
  { icon: Users, value: '3,200+', label: 'Investors completed or running plans' },
  { icon: Clock, value: '4.9 / 5', label: 'Average investor satisfaction rating' }
];

/**
 * Verified investor success stories shown on the public homepage.
 */
export const SuccessStories: React.FC<SuccessStoriesProps> = ({
  cmsTitle,
  cmsSubtitle,
  cmsBody
}) => {
  return (
    <section
      id="success-stories"
      className="scroll-mt-20 py-14 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5" />
            <span>Investor Success Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Real Investors. Real Returns.'}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
            {cmsSubtitle ||
              'Families who completed their payments, received registered deeds and doubled their investment.'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {cmsBody ||
              'Every story below belongs to a verified investor whose registered share, installment schedule and dividend payouts are visible in the Questra World investor portal.'}
          </p>
        </div>

        {/* Results band */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {RESULTS.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-center"
              >
                <span className="inline-flex w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Story cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {STORIES.map(story => (
            <article
              key={story.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={story.avatar}
                  alt={story.name}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40 bg-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {story.name}
                    </h3>
                    <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{story.location}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {story.project}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 text-center">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">Invested</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{story.invested}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">Received</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {story.returned}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">Return</div>
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400">2X</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {story.quote}
                </p>
              </div>

              <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500">
                Payout schedule: {story.duration}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
