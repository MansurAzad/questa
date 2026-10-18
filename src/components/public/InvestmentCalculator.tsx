import React, { useState } from 'react';
import { Sparkles, TrendingUp, Calculator, Building, CreditCard } from 'lucide-react';
import { Language } from '../../types';
import { formatBDT } from '../../services/i18n';

interface InvestmentCalculatorProps {
  language: Language;
  onEnquire: () => void;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
}

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ language, onEnquire, cmsTitle, cmsSubtitle }) => {
  const [activeTab, setActiveTab] = useState<'share' | 'double'>('share');
  const [shareAmount, setShareAmount] = useState<number>(600000);
  const [doubleInvestmentAmount, setDoubleInvestmentAmount] = useState<number>(500000);

  const handleDoubleInputChange = (val: string) => {
    const num = Number(val.replace(/\D/g, '')) || 0;
    setDoubleInvestmentAmount(num);
  };

  const shareMonthlyProfit = Math.round(shareAmount * 0.0154);
  const shareAnnualProfit = shareMonthlyProfit * 12;

  const doubleTotalReturn = doubleInvestmentAmount * 2;
  const doubleMonthlyInstallment = Math.round(doubleTotalReturn / 12);

  return (
    <section id="calculator" className="py-12 sm:py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Investment Calculator
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Plan Your Returns'}
          </h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            {cmsSubtitle || 'Estimate your monthly dividends from suite share ownership or calculate your 2X return from the 12-Month Double Profit Scheme.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-md mx-auto mb-8 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('share')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'share'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Share Dividend
          </button>
          <button
            onClick={() => setActiveTab('double')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'double'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            12-Month Double Profit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
            {activeTab === 'share' ? (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-600" />
                  Share Dividend Calculator
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={shareAmount}
                    onChange={e => setShareAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <input
                    type="range"
                    min={600000}
                    max={5000000}
                    step={100000}
                    value={shareAmount}
                    onChange={e => setShareAmount(Number(e.target.value))}
                    className="w-full mt-3 accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>$600,000</span>
                    <span>$5,000,000</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Projected Annual ROI</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">18.5% – 22%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dividend Cycle</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Monthly (auto-credit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ownership Deed</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Sub-Registry Fractional</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  12-Month Double Profit Scheme
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Enter Any Amount (USD)
                  </label>
                  <input
                    type="text"
                    value={doubleInvestmentAmount.toLocaleString()}
                    onChange={e => handleDoubleInputChange(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[100000, 250000, 500000, 1000000, 2500000, 5000000].map(p => (
                    <button
                      key={p}
                      onClick={() => setDoubleInvestmentAmount(p)}
                      className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                        doubleInvestmentAmount === p
                          ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300'
                      }`}
                    >
                      ${p.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guaranteed Return</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">2X (200%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payout Structure</span>
                    <span className="font-semibold text-slate-900 dark:text-white">12 Equal Monthly Installments</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security</span>
                    <span className="font-semibold text-slate-900 dark:text-white">12 Bank PDC Cheques + Deed</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white shadow-xl border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-6">
              <Calculator className="w-4 h-4" />
              Projected Returns
            </h3>

            {activeTab === 'share' ? (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Monthly Dividend</span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
                    +{formatBDT(shareMonthlyProfit, language)}
                    <span className="text-sm text-slate-400 font-normal"> /mo</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Annual Dividend</span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
                    {formatBDT(shareAnnualProfit, language)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase">Investment</span>
                    <div className="text-sm font-mono font-bold mt-0.5">{formatBDT(shareAmount, language)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase">7-Day Stay</span>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">Free / Year</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Monthly Installment (12 months)</span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
                    {formatBDT(doubleMonthlyInstallment, language)}
                    <span className="text-sm text-slate-400 font-normal"> /mo</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Total 2X Payout</span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
                    {formatBDT(doubleTotalReturn, language)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase">Your Investment</span>
                    <div className="text-sm font-mono font-bold mt-0.5">{formatBDT(doubleInvestmentAmount, language)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase">Net Profit</span>
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">+{formatBDT(doubleInvestmentAmount, language)}</div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onEnquire}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <CreditCard className="w-4 h-4" />
              Start Investment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
