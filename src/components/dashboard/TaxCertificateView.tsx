import React from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Award,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { Language, User, ShareInvestment } from '../../types';
import { formatBDT } from '../../services/i18n';

interface TaxCertificateViewProps {
  user: User;
  shares: ShareInvestment[];
  language: Language;
}

export const TaxCertificateView: React.FC<TaxCertificateViewProps> = ({
  user,
  shares,
  language
}) => {
  const totalPaid = shares.reduce((a, b) => a + b.paidAmount, 0);
  const totalValuation = shares.reduce((a, b) => a + b.totalInvestment, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Official NBR Income Tax &amp; Wealth Certificate
          </h2>
          <p className="text-xs text-slate-500">
            Certified real estate asset statement for annual Income Tax return filing and tax rebate claims under the Income Tax Act.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Official Certificate Paper Canvas */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-serif text-slate-900 dark:text-slate-100 relative overflow-hidden">
        
        {/* Certificate Inner Frame */}
        <div className="border-4 border-double border-amber-900/30 dark:border-amber-500/30 p-6 sm:p-8 rounded-xl bg-amber-50/10 dark:bg-slate-950/60 relative">
          
          {/* Header */}
          <div className="text-center pb-6 border-b border-amber-900/20 dark:border-amber-500/20 font-sans">
            <img
              src="/questra-logo.jpeg"
              alt="Questra World logo"
              className="w-14 h-14 mx-auto rounded-full object-cover border-2 border-amber-600 bg-white mb-2 shadow-md"
            />
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">
              QUESTRA WORLD LIMITED
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Corporate Real Estate Developer & Taxpayer Withholding Entity · Worldwide
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Certificate No: QW/TAX/2026-27/0842 · Tax Assessment Year: 2026–2027
            </p>
          </div>

          {/* Title */}
          <div className="text-center py-6">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-white underline decoration-amber-600 underline-offset-8">
              ANNUAL REAL ESTATE INVESTMENT & WEALTH CERTIFICATE
            </h2>
            <p className="text-xs italic text-slate-500 mt-2 font-sans">
              (For submission to National Board of Revenue under Section 44(2) of the Income Tax Act)
            </p>
          </div>

          {/* Declaration Statement */}
          <div className="font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
            <p>
              To Whom It May Concern,
            </p>
            <p>
              This is to solemnly certify that <strong className="text-slate-900 dark:text-white">{user.fullName}</strong>, holder of Tax ID: <span className="font-mono font-bold text-slate-900 dark:text-white">QW-TAX-{user.memberId.replace(/-/g, '')}</span>, Government ID: <span className="font-mono text-slate-900 dark:text-white">{user.nidNo}</span>, and Questra World Member ID: <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{user.memberId}</span>, has legitimately invested in our approved properties as detailed below:
            </p>

            {/* Assets Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono uppercase">
                  <tr>
                    <th className="p-3">Asset Description</th>
                    <th className="p-3">Certificate Ref</th>
                    <th className="p-3">Total Consideration</th>
                    <th className="p-3 text-right">Cumulative Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {shares.map(s => (
                    <tr key={s.id}>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">
                        {s.projectName} ({s.shareNumbers.join(', ')})
                      </td>
                      <td className="p-3 text-slate-500">{s.certificateNo}</td>
                      <td className="p-3">{formatBDT(s.totalInvestment, language)}</td>
                      <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {formatBDT(s.paidAmount, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-mono font-bold text-slate-900 dark:text-white">
                  <tr>
                    <td colSpan={2} className="p-3 text-right font-sans">TOTAL QUALIFYING INVESTMENT:</td>
                    <td className="p-3">{formatBDT(totalValuation, language)}</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">
                      {formatBDT(totalPaid, language)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-xs text-slate-500">
              All transactions have been executed through recognized banking channels (HSBC & formal electronic gateways) in full compliance with anti-money laundering and tax withholding directives.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-10 mt-6 border-t border-amber-800/20 dark:border-amber-500/20 grid grid-cols-2 sm:grid-cols-3 items-end text-center font-sans text-xs text-slate-600 dark:text-slate-400">
            <div>
              <div className="w-24 border-b border-slate-400 mx-auto mb-1.5 font-script italic text-slate-800 dark:text-slate-200">
                S. Ashton
              </div>
              <span className="block font-semibold">Steven Ashton, CPA</span>
              <span className="text-[10px] text-slate-400">Chief Financial Officer</span>
            </div>

            <div className="hidden sm:flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center p-1 text-center">
                <span className="text-[8px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tighter block leading-tight">
                  CORPORATE<br />TAX SEAL<br />QW LTD
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1">NBR REGISTERED</span>
            </div>

            <div>
              <div className="w-24 border-b border-slate-400 mx-auto mb-1.5 font-script italic text-slate-800 dark:text-slate-200">
                M. Reynolds
              </div>
              <span className="block font-semibold">Mark Reynolds</span>
              <span className="text-[10px] text-slate-400">Senior Tax & Legal Advisor</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
