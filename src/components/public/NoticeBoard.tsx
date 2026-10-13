import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  FileText,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Download,
  Search,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Language } from '../../types';

interface NoticeItem {
  id: string;
  title: string;
  titleBn: string;
  category: 'circular' | 'event' | 'handover' | 'important';
  categoryLabel: string;
  categoryLabelBn: string;
  date: string;
  summary: string;
  summaryBn: string;
  pdfUrl?: string;
  urgent?: boolean;
}

interface NoticeBoardProps {
  language: Language;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ language, cmsTitle, cmsSubtitle }) => {
  const isBn = language === 'bn';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  const notices: NoticeItem[] = [
    {
      id: 'not-00-double',
      title: 'Company Official Announcement: 12-Month Guaranteed Double Profit Scheme (Paid in 12 Monthly Installments)',
      titleBn: 'Company Official Announcement: 12-Month Guaranteed Double Profit Scheme (Paid in 12 Monthly Installments)',
      category: 'important',
      categoryLabel: 'Special Double Return',
      categoryLabelBn: 'Special Double Return',
      date: '11 October 2026',
      urgent: true,
      summary:
        'Our company guarantees 2X total payout in 12 months (100% net profit). Both capital and profits are disbursed consecutively across 12 equal monthly installments directly into your bank or portal wallet. Backed by 12 Bank PDC Cheques and registered legal deed.',
      summaryBn:
        'Questa World notification'
    },
    {
      id: 'not-01',
      title: 'Questa Royal Bay Hotel & Suites - Suite Handover & Ownership Registration Schedule',
      titleBn: 'Questa Royal Bay Hotel & Suites - Suite Handover & Ownership Registration Schedule',
      category: 'handover',
      categoryLabel: 'Possession & Handover',
      categoryLabelBn: 'Possession & Handover',
      date: '08 October 2026',
      urgent: true,
      summary:
        'Share owners whose suite-share payment schedules are completed are requested to visit our Mirpur Head Office to collect their registered ownership deeds and confirm suite handover dates for the Cox\'s Bazar beachfront tower.',
      summaryBn:
        'Questa World notification'
    },
    {
      id: 'not-02',
      title: 'Questa Royal Bay Hotel & Suites - Monthly Dividend Distribution Notification',
      titleBn: 'Questa Royal Bay Hotel & Suites - Monthly Dividend Distribution Notification',
      category: 'important',
      categoryLabel: 'Dividend Distribution',
      categoryLabelBn: 'Dividend Distribution',
      date: '01 October 2026',
      urgent: false,
      summary:
        'Monthly profit sharing and Q3 performance dividends for Questa Royal Bay Hotel & Suites share owners have been directly transferred to respective bank accounts. Investors can view detailed statement vouchers in the portal.',
      summaryBn:
        'Questa World notification'
    },
    {
      id: 'not-03',
      title: 'Free Weekend Site Visit to Questa Royal Bay & Commercial Center',
      titleBn: 'Free Weekend Site Visit to Questa Royal Bay & Commercial Center',
      category: 'event',
      categoryLabel: 'Site Tour',
      categoryLabelBn: 'Site Tour',
      date: '25 September 2026',
      urgent: false,
      summary:
        'Complimentary luxury AC Microbus tours depart every Friday and Saturday from Pallabi Head Office (9:30 AM) and Motijheel Branch (10:00 AM). Complimentary lunch and refreshments are provided for visiting families.',
      summaryBn:
        'Questa World notification'
    },
    {
      id: 'not-04',
      title: 'Official Circular on Share Registration & Ownership Deed Guidelines',
      titleBn: 'Official Circular on Share Registration & Ownership Deed Guidelines',
      category: 'circular',
      categoryLabel: 'Official Circular',
      categoryLabelBn: 'Official Circular',
      date: '15 September 2026',
      urgent: false,
      summary:
        'As per the latest digital sub-registry guidelines, all share and floor unit registration for Questa World properties is being expedited with zero physical hassle. Certified ownership deeds are issued within 15 working days.',
      summaryBn:
        'Questa World notification'
    },
    {
      id: 'not-05',
      title: 'Annual General Meeting (AGM) 2026 for Share Investors & Valued Associates',
      titleBn: 'Annual General Meeting (AGM) 2026 for Share Investors & Valued Associates',
      category: 'event',
      categoryLabel: 'Corporate Event',
      categoryLabelBn: 'Corporate Event',
      date: '05 September 2026',
      urgent: false,
      summary:
        'The Annual General Meeting of Questa World Limited will be held on 18 December 2026 at the Grand Ball Room, Hotel Radisson Blu Dhaka. All registered investors are cordially invited.',
      summaryBn:
        'Questa World notification'
    }
  ];

  const filtered = selectedCategory === 'all'
    ? notices
    : notices.filter(n => n.category === selectedCategory);

  return (
    <section id="news" className="py-20 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" />
              <span>{ 'Official Notice Board'}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {cmsTitle || 'Company Notices & Announcements'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {cmsSubtitle || (isBn
                ? 'Latest official updates on share transfers, sub-registry, dividend distribution, and site visits.।'
                : 'Stay updated with official company notices, AGM circulars, dividend distributions, and handover alerts.')}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label:  'All Notices' },
              { id: 'handover', label:  'Handovers' },
              { id: 'important', label:  'Dividends' },
              { id: 'event', label:  'Events' },
              { id: 'circular', label:  'Circulars' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(notice => (
            <div
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className="cursor-pointer flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    { notice.categoryLabel}
                  </span>
                  {notice.urgent && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse">
                      { 'URGENT'}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                  { notice.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  { notice.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{notice.date}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>{ 'Read'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Notice Detail */}
        {activeNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    { activeNotice.categoryLabel}
                  </span>
                  <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{activeNotice.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNotice(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  { activeNotice.title}
                </h3>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  { activeNotice.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>
                  {isBn
                    ? 'For any queries, contact our head office hotline directly at +880 1810-685888.'
                    : 'For official clarifications, please call our Head Office Help Desk at +880 1810-685888.'}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveNotice(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90"
                >
                  { 'Close'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
