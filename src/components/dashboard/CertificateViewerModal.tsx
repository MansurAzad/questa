import React from 'react';
import { X, Printer, ShieldCheck, Download, Award, Building2, CheckCircle2, QrCode } from 'lucide-react';
import { User, Language, ShareInvestment, DoubleProfitPlan } from '../../types';
import { formatBDT } from '../../services/i18n';

interface CertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'hotel_share' | 'double_profit_deed';
  user: User;
  share?: ShareInvestment;
  plans?: DoubleProfitPlan[];
  language: Language;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  isOpen,
  onClose,
  type,
  user,
  share,
  plans,
  language
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        
        {/* Action Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              {type === 'double_profit_deed'
                ? 'Official 12-Month Double Return Investment Deed'
                : 'Fractional Ownership Share Certificate'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Close document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="p-6 sm:p-10 bg-amber-50/30 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-serif relative">
          
          {/* Ornate Border */}
          <div className="border-4 border-double border-amber-800/40 dark:border-amber-500/30 p-6 sm:p-8 rounded-lg relative bg-white/80 dark:bg-slate-900/80 shadow-inner">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.05]">
              <Building2 className="w-96 h-96 text-amber-900 dark:text-amber-100" />
            </div>

            {/* Top Emblem & Header */}
            <div className="text-center pb-6 border-b border-amber-800/20 dark:border-amber-500/20">
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-amber-600 bg-amber-50 dark:bg-slate-800 flex items-center justify-center mb-2">
                <Building2 className="w-8 h-8 text-amber-700 dark:text-amber-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-widest text-amber-950 dark:text-amber-200 uppercase">
                Questa World LIMITED
              </h1>
              <p className="text-xs font-sans text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
                Government Registered Corporate Real Estate & Investment Enterprise · Dhaka & Chattogram
              </p>
              <p className="text-[11px] font-sans text-slate-400 font-mono mt-1">
                Ref No: {type === 'double_profit_deed' ? (plans?.[0]?.agreementDeedNo || 'QW-DP-2026-DEED') : share?.certificateNo}
              </p>
            </div>

            {/* Title */}
            <div className="text-center py-6">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-slate-900 dark:text-white underline decoration-amber-600 underline-offset-8">
                {type === 'double_profit_deed'
                  ? 'CERTIFICATE OF 12-MONTH DOUBLE PROFIT INVESTMENT'
                  : 'CERTIFICATE OF FRACTIONAL RESORT OWNERSHIP'}
              </h2>
              <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-2 font-sans">
                Issued in accordance with the Statutory Investment Agreement & Section 138 NI Act Security Compliance
              </p>
            </div>

            {/* Document Details */}
            {type === 'double_profit_deed' ? (
              <div className="font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
                <p>
                  This is to certify that <strong className="text-slate-900 dark:text-white">{user.fullName}</strong> (Member ID: <span className="font-mono">{user.memberId}</span>) is an enrolled investor in the official <strong>Questa World 12-Month Double Profit Scheme</strong>.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200/50 dark:border-amber-800/50 text-xs">
                  <div>
                    <span className="text-slate-500 block">Investment Package:</span>
                    <strong className="text-slate-900 dark:text-white">{plans?.[0]?.packageName || '12-Month Double Profit'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Capital Invested:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{formatBDT(plans?.[0]?.principalAmount || 0, language)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total 2X Payout:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{formatBDT(plans?.[0]?.totalReturnAmount || 0, language)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Monthly Installment:</span>
                    <strong className="text-amber-700 dark:text-amber-400 font-bold font-mono">
                      {plans?.[0] ? `${formatBDT(plans[0].monthlyInstallmentAmount, language)} / mo` : '—'}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-200">
                  <strong>Security Guarantee:</strong> Fully secured by {(plans?.[0]?.pdcCheckNumbers.length || 12)} official post-dated bank cheques (PDC) and registered legal deed {plans?.[0] ? `(${plans[0].agreementDeedNo})` : ''}. Monthly installments disbursed consecutively across 12 months.
                </div>
              </div>
            ) : share ? (
              <div className="font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
                <p>
                  This is to certify that <strong className="text-slate-900 dark:text-white">{user.fullName}</strong> is the verified lawful holder of <strong>{share.shareUnits} fractional ownership suite unit shares</strong> in Questa World developments at {share.projectName}.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-mono">
                  Total Investment: {formatBDT(share.totalInvestment, language)}
                </div>
              </div>
            ) : null}

            {/* Signatures & Seal */}
            <div className="pt-10 mt-6 border-t border-amber-800/20 dark:border-amber-500/20 grid grid-cols-3 items-end text-center font-sans text-xs text-slate-600 dark:text-slate-400">
              <div>
                <div className="w-24 border-b border-slate-400 mx-auto mb-1.5 font-script italic text-slate-800 dark:text-slate-200">
                  M. Rahman
                </div>
                <span className="block font-semibold">Md. Mokhlesur Rahman</span>
                <span className="text-[10px] text-slate-400">Head of Legal Affairs</span>
              </div>

              {/* Verified Digital Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center p-1 text-center">
                  <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter block leading-tight">
                    GOVT. VETTED<br />SEAL OF TRUST<br />QUESTA
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1">100% DISPUTE FREE</span>
              </div>

              <div>
                <div className="w-24 border-b border-slate-400 mx-auto mb-1.5 font-script italic text-slate-800 dark:text-slate-200">
                  A. Chowdhury
                </div>
                <span className="block font-semibold">Managing Director</span>
                <span className="text-[10px] text-slate-400">Questa World LIMITED</span>
              </div>
            </div>

            {/* Encrypted Hash Bar */}
            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-[9px] text-slate-400">
              <span>SHA-256: 49e8a7192bc0f1882d...</span>
              <span>VERIFIED: RJSC & JOINT STOCK COMPLIANT</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
