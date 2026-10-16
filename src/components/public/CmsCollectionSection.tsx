import React, { useState } from 'react';
import { Sparkles, Quote, ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import { CmsSection, CmsCollectionItem } from '../../types/cms';

interface CmsCollectionSectionProps {
  section: CmsSection;
  items: CmsCollectionItem[];
}

/**
 * Renders a CMS-managed homepage section whose content is driven by a
 * repeatable collection (features / testimonials / faqs). Admins fully
 * control the heading text and every item through the CMS controller.
 */
export const CmsCollectionSection: React.FC<CmsCollectionSectionProps> = ({ section, items }) => {
  const [openFaq, setOpenFaq] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) return null;

  const isFeatures = section.collectionKey === 'features';
  const isTestimonials = section.collectionKey === 'testimonials';

  return (
    <section
      id={section.id}
      className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {isFeatures && <Sparkles className="w-3.5 h-3.5" />}
            {isTestimonials && <Quote className="w-3.5 h-3.5" />}
            {!isFeatures && !isTestimonials && <HelpCircle className="w-3.5 h-3.5" />}
            <span>{isFeatures ? 'Why Questra World' : isTestimonials ? 'Investor Voices' : 'Support & Answers'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{section.subtitle}</p>
          )}
        </div>

        {isFeatures && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                {item.subtitle && (
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 block -mt-1">{item.subtitle}</span>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {isTestimonials && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-4"
              >
                <Quote className="w-6 h-6 text-amber-500/70" />
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">{item.body}</p>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">{item.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isFeatures && !isTestimonials && (
          <div className="max-w-3xl mx-auto space-y-3">
            {items.map(item => {
              const isOpen = openFaq === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.body}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
