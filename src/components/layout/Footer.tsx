import React from 'react';
import { ShieldCheck, ExternalLink, Copyright } from 'lucide-react';
import { Language, User } from '../../types';
import { CmsSiteSettings } from '../../types/cms';

interface FooterProps {
  language: Language;
  settings?: CmsSiteSettings;
  /** Current session — used to hide sign-in affordances once logged in. */
  user?: User | null;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

const DEFAULT_SETTINGS: CmsSiteSettings = {
  brandName: 'Questra World',
  legalName: 'Questra World Limited',
  tagline: "Official Investor Portal · Global",
  supportPhone: '+971 4 512 8800',
  supportEmail: 'support@questraworld.com',
  corporateAddress: 'Questra World Tower, Business Bay, Dubai',
  footerNote: '',
  copyrightText: '© {year} Questra World Limited. All rights reserved.'
};

export const Footer: React.FC<FooterProps> = ({ settings, user, onNavigate, onOpenAuth }) => {
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
                  onClick={() => onNavigate('gallery')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  Questra Royal Bay Suites &amp; Residences
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  Questra World Commercial Center - Mirpur
                </button>
              </li>
            </ul>
          </div>

          {/* Investor Portal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              { 'Portal' }
            </h4>
            <ul className="space-y-2">
              {!user && (
                <li>
                  <button
                    onClick={onOpenAuth}
                    className="text-left hover:text-amber-400 transition-colors"
                  >
                    Sign In
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  ROI &amp; Installment Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-left hover:text-amber-400 transition-colors"
                >
                  Legal Deeds &amp; Ownership Records
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
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
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <img
              src="/questra-logo.jpeg"
              alt="Questra World logo"
              className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-700 shrink-0"
            />
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
