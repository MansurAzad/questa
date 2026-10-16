import React from 'react';
import {
  Building2,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
  Compass,
  Quote,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Language } from '../../types';

interface AboutUsProps {
  language: Language;
  onBookSiteVisit?: () => void;
  onOpenProjects?: () => void;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
  cmsBody?: string;
}

export const AboutUs: React.FC<AboutUsProps> = ({
  language,
  onBookSiteVisit,
  onOpenProjects,
  cmsTitle,
  cmsSubtitle
}) => {
  const leaders = [
    {
      name: 'Mr. Ripon Hossain',
      role: 'Chairman',
      company: 'Questra World Real Estate Limited',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      message:
        'Our core philosophy has always been transparency, legal integrity, and sustainable wealth creation. At Questra World, we do not merely sell shares or floor units; we build generations of trust and lasting family heritage across Bangladesh.'
    },
    {
      name: 'Mr. H. M. Ziaur Rahman',
      role: 'Managing Director',
      company: 'Questra World Real Estate Limited',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      message:
        'We are determined to pioneer world-class beachfront hospitality and premium commercial developments in Cox\'s Bazar and Mirpur, Dhaka. Our commitment is timely project execution, zero legal flaws, and guaranteed returns for our valued investors.'
    },
    {
      name: 'Mr. Uttam Saha',
      role: 'Marketing Director',
      company: 'Questra World Real Estate Limited',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      message:
        'Customer satisfaction and transparent communication define our investor relationships. Whether for small fractional hotel suite shares or larger commercial floor investments, we offer bespoke guidance and unwavering post-purchase service.'
    }
  ];

  const milestones = [
    {
      year: '2016',
      title: 'Founded in Dhaka',
      desc: 'Started operations with a core focus on vetted, legally secure real estate investment opportunities.'
    },
    {
      year: '2019',
      title: 'Site Securing',
      desc: 'Began securing prime beachfront and commercial sites for landmark hotel and retail developments.'
    },
    {
      year: '2022',
      title: 'Chattogram Expansion',
      desc: 'Inaugurated Chattogram regional office at Muradpur and launched 5-star resort fractional suites.'
    },
    {
      year: '2026',
      title: 'Digital Portal',
      desc: 'Next-generation encrypted portal with instant payment, monthly dividend tracking, and possession handovers.'
    }
  ];

  const coreValues = [
    { icon: ShieldCheck, title: 'Legal Integrity', desc: 'Every project is RAJUK-approved with registered deeds and bank PDC cheque security.' },
    { icon: CheckCircle2, title: 'Guaranteed Returns', desc: 'Monthly dividend disbursements and 2X double profit backed by legal agreements.' },
    { icon: Users, title: 'Investor-First', desc: 'Transparent communication, 24/7 support, and dedicated relationship managers.' },
    { icon: Compass, title: 'Visionary Growth', desc: 'Pioneering world-class hospitality and commercial infrastructure in Bangladesh.' },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            About Questra World
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Building Generations of Trust & Wealth'}
          </h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            {cmsSubtitle || 'Questra World Limited is a government-registered real estate and hospitality investment enterprise headquartered in Dhaka, with regional offices in Chattogram. We specialize in fractional hotel suite ownership, commercial tower floor shares, and our flagship 12-Month Double Profit investment scheme.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { value: '৳48.5 Cr+', label: 'Total Collections' },
            { value: '284+', label: 'Active Investors' },
            { value: '60+', label: 'Hotel Suites' },
            { value: '120+', label: 'Commercial Floors' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono block">
                {stat.value}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Leadership */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Leadership & Vision
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map((leader, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/80 shadow-xs group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {leader.name}
                    </h4>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {leader.role}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {leader.company}
                    </p>
                  </div>
                </div>

                <div className="relative flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  <Quote className="w-5 h-5 text-amber-500/30 absolute top-2 right-2 pointer-events-none" />
                  "{leader.message}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Our Pillars of Integrity
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The foundational standards that set Questra World apart in the real estate sector.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <val.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {val.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Milestones */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden mt-14">
          <div className="relative z-10 space-y-8">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Milestones Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                A Legacy of Continuous Growth
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((m, idx) => (
                <div key={idx} className="border-l-2 border-amber-500/60 pl-4 space-y-1.5">
                  <span className="font-mono text-xl font-bold text-amber-400">{m.year}</span>
                  <h4 className="font-bold text-white text-sm">{m.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA inside */}
            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-slate-800">
              <button
                onClick={onOpenProjects}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Explore Projects
              </button>
              <button
                onClick={onBookSiteVisit}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Book a Site Visit
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
