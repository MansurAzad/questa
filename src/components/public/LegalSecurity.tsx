import React from 'react';
import { ShieldCheck, Award, Scale } from 'lucide-react';
import { Language } from '../../types';

interface LegalSecurityProps {
  language: Language;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
}

export const LegalSecurity: React.FC<LegalSecurityProps> = ({ language, cmsTitle, cmsSubtitle }) => {
  const pillars = [
    {
      title: 'Registered Ownership & Title Chain',
      titleBn: 'Registered Ownership & Title Verification',
      desc: 'Every share and floor unit carries a clean, dispute-free ownership chain verified with the Sub-Registry and corporate legal counsel.',
      descBn: 'Every share and floor unit carries a clean, dispute-free ownership chain verified with the Sub-Registry and corporate legal counsel.'
    },
    {
      title: 'National Building Code & Safety Conformance',
      titleBn: 'National Building Code & Fire Safety Compliant Development',
      desc: 'All Questra World towers are designed strictly adhering to the national building code, fire-safety regulations and approved architectural plans.',
      descBn: 'All Questra World towers strictly follow the national building code, fire-safety regulations and approved architectural plans.'
    },
    {
      title: 'Direct Sub-Registry Deed Delivery',
      titleBn: 'Instant Registry Deed Transfer',
      desc: 'Share and floor owners receive full registered deed & ownership certificate delivery upon completion of payment schedules.',
      descBn: 'Share and floor owners receive full registered deed & ownership certificate delivery upon completion of payment schedules.'
    },
    {
      title: 'Bank & Islamic Finance Approved',
      titleBn: 'Bank Loan & Shariah-Compliant Investment',
      desc: 'All projects are pre-vetted by leading banks for seamless development finance and shariah-compliant fractional profit-sharing.',
      descBn: 'All projects are pre-vetted by leading banks for seamless development finance and shariah-compliant fractional profit-sharing.'
    }
  ];

  return (
    <section id="legal" className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>100% Legal Ownership Warranty</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Zero-Risk Real Estate & Ownership Security'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {cmsSubtitle || 'At Questra World, every share and floor unit is backed by ironclad registered deeds, verified ownership, and transparent registration.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                { item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                { item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Corporate Trust Badge Strip */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Official Verification Desk</h4>
              <p className="text-xs text-slate-300">
                Inspect registered deeds, ownership certificates, and project approvals at our Global Head Office or Central Singapore Branch.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 whitespace-nowrap">
            Hotline: +971 4 512 8800</div>
        </div>

      </div>
    </section>
  );
};
