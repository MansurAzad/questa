import React from 'react';
import { ShieldCheck, ExternalLink, Copyright } from 'lucide-react';
import { Language } from '../../types';
import { CmsSiteSettings } from '../../types/cms';

interface FooterProps {
  language: Language;
  settings?: CmsSiteSettings;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

const DEFAULT_SETTINGS: CmsSiteSettings = {
  brandName: 'Questa World',
  legalName: 'Questa World Limited',
  tagline: "Official Investor Portal · Cox's Bazar & Mirpur, Dhaka",
  supportPhone: '+880 1819-001122',
  supportEmail: 'support@questaworld.com',
  corporateAddress: 'Questa World Tower, Pallabi, Mirpur-12, Dhaka, Bangladesh',
  footerNote: '',
  copyrightText: '© {year} Questa World Limited. All rights reserved.'
};

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenAuth }) => {
  const s = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  const year = new Date().getFullYear();
  const copyright = (s.copyrightText || DEFAULT_SETTINGS.copyrightText).replace(/\{year\}/g, String(year));

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-3xl">

          {/* Developments */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              { 'Developments' }
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  Questa Royal Bay Hotel &amp; Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  Questa World Commercial Center - Mirpur
                </button>
              </li>
            </ul>
          </div>

          {/* Investor Portal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              { 'Investor Portal' }
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenAuth}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  Investor Sign In (Ziabulctg1)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  ROI &amp; Installment Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  Legal Deeds &amp; Ownership Records
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal')}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-[11px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>End-to-End Encrypted Cloud</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Copyright className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
            <span className="text-[11px] text-slate-400">{copyright}</span>
          </div>
          {s.footerNote && (
            <p className="text-[10px] text-slate-500 max-w-xl text-center sm:text-right leading-relaxed">
              {s.footerNote}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};
