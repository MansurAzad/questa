import React from 'react';
import { Globe2, MapPin, CalendarDays, Users, Mic, Handshake } from 'lucide-react';
import { Language } from '../../types';

interface GlobalConferencesProps {
  language: Language;
  /** CMS-driven copy. */
  cmsTitle?: string;
  cmsSubtitle?: string;
  cmsBody?: string;
}

interface ConferenceEvent {
  title: string;
  city: string;
  venue: string;
  dates: string;
  attendance: string;
  detail: string;
  featured?: boolean;
}

const EVENTS: ConferenceEvent[] = [
  {
    title: 'Dubai International Property Show',
    city: 'Dubai, UAE',
    venue: 'Dubai World Trade Centre',
    dates: '14 – 16 February 2026',
    attendance: '2,400+ investors met',
    detail:
      'Questra World presented the Royal Bay waterfront phase and signed 340 new share agreements on the exhibition floor.',
    featured: true
  },
  {
    title: 'Singapore Real Estate Investment Summit',
    city: 'Singapore',
    venue: 'Marina Bay Sands Expo',
    dates: '08 – 09 November 2025',
    attendance: '1,850+ investors met',
    detail:
      'Our finance desk hosted a transparency panel on registered deeds, bank PDC protection and investor payout records.'
  },
  {
    title: 'Dhaka Property & Investment Expo',
    city: 'Dhaka, Bangladesh',
    venue: 'International Convention City Bashundhara',
    dates: '05 – 07 December 2025',
    attendance: '6,200+ visitors',
    detail:
      'The largest Questra World stand to date — live deed verification desk, project-tour bookings and instant installment planning.'
  },
  {
    title: 'London Diaspora Investment Expo',
    city: 'London, UK',
    venue: 'ExCeL London',
    dates: '21 – 22 June 2025',
    attendance: '1,300+ investors met',
    detail:
      'A dedicated expatriate investor clinic covering remote ownership, nominee registration and dividend remittance.'
  },
  {
    title: 'Toronto Global Property Forum',
    city: 'Toronto, Canada',
    venue: 'Metro Toronto Convention Centre',
    dates: '12 – 13 September 2025',
    attendance: '900+ investors met',
    detail:
      'North American investor roadshow introducing the 12-month double profit plan and commercial floor ownership.'
  },
  {
    title: 'Kuala Lumpur Investor Convention',
    city: 'Kuala Lumpur, Malaysia',
    venue: 'Kuala Lumpur Convention Centre',
    dates: '18 – 19 April 2025',
    attendance: '1,100+ investors met',
    detail:
      'Regional convention focused on suite share yields and hands-on walkthroughs of completed towers.'
  }
];

const HIGHLIGHTS = [
  { icon: Users, value: '13,750+', label: 'Investors met in 2025' },
  { icon: Globe2, value: '11', label: 'Countries hosted' },
  { icon: Mic, value: '24', label: 'Keynote & panel sessions' },
  { icon: Handshake, value: '680+', label: 'On-location share agreements' }
];

/**
 * Global conferences, expos and summits section for the public homepage.
 */
export const GlobalConferences: React.FC<GlobalConferencesProps> = ({
  cmsTitle,
  cmsSubtitle,
  cmsBody
}) => {
  return (
    <section
      id="conferences"
      className="scroll-mt-20 py-14 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global Conferences &amp; Summits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Questra World on the Global Stage'}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
            {cmsSubtitle ||
              'International property expos, investment summits and diaspora conventions.'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {cmsBody ||
              'Every year our leadership team presents Questra World developments to investors, banks and regulators around the world.'}
          </p>
        </div>

        {/* Highlights band */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HIGHLIGHTS.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
              >
                <span className="inline-flex w-10 h-10 shrink-0 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
                    {item.value}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {EVENTS.map(event => (
            <article
              key={event.title}
              className={`flex flex-col rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow ${
                event.featured
                  ? 'border-amber-400/70 dark:border-amber-500/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {event.featured && (
                <span className="self-start mb-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                  Flagship Event
                </span>
              )}

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {event.title}
              </h3>

              <div className="mt-3 space-y-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {event.venue}, {event.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
                  {event.dates}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  {event.attendance}
                </span>
              </div>

              <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {event.detail}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
