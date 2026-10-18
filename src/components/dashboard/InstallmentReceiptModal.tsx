import React from 'react';
import { X, Printer, ShieldCheck, QrCode, TrendingUp } from 'lucide-react';
import { InstallmentReceipt, Language, User } from '../../types';
import { formatBDT } from '../../services/i18n';
import { amountInWords } from '../../utils/money';

interface InstallmentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: InstallmentReceipt;
  user: User;
  language: Language;
}

/**
 * Official "installment payout receipt".
 *
 * Note the direction: unlike a payment receipt (money received FROM the
 * investor), this documents an installment the company credited TO the
 * investor on an invested amount, so the wording is reversed.
 */
export const InstallmentReceiptModal: React.FC<InstallmentReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
  user,
  language
}) => {
  if (!isOpen) return null;

  const creditDate = receipt.receivedDate || receipt.scheduledDate;
  const progressPct = Math.round((receipt.installmentNo / receipt.totalInstallments) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none print:max-h-none print:overflow-visible">

        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              INSTALLMENT PAYOUT RECEIPT
            </span>
            <span className="text-xs font-mono text-slate-500">{receipt.receiptNo || 'Pending issue'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <span className="sr-only">Close</span>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="mt-4 p-6 sm:p-8 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50/20 relative space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-amber-200 pb-4">
            <div className="flex items-center gap-3">
              <img
                src="/questra-logo.jpeg"
                alt="Questra World logo"
                className="w-12 h-12 rounded-xl object-cover shadow-xs border border-amber-300 bg-white"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  QUESTRA WORLD LIMITED
                </h2>
                <p className="text-[11px] text-slate-600">
                  Global Head Office: House #12, Road #03, International Business District, Dubai
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Hotline: +44 181 068 5888 · Web: www.questraworld.com
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                INSTALLMENT RECEIPT
              </div>
              <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                {receipt.receiptNo || 'Pending issue'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Credited on: {creditDate}
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-xs leading-relaxed text-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-[11px] block">Credited to (Investor):</span>
                <strong className="text-sm text-slate-900 font-bold">{user.fullName}</strong>
                <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  Member ID: <strong>{user.memberId}</strong> · Phone: {user.phone}
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Paying Entity:</span>
                <strong className="text-xs text-slate-900 font-semibold">Questra World Limited</strong>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Investments & Disbursements Division
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200">
              <span className="text-[11px] text-slate-500 block">Investment Reference:</span>
              <strong className="text-slate-900 font-bold text-xs block mt-0.5">
                {receipt.investmentTitle}
              </strong>
              <div className="text-[10px] text-slate-600 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <span>Invested Principal: <strong className="font-mono">{formatBDT(receipt.principalAmount, language)}</strong></span>
                <span>Installment: <strong className="font-mono">#{receipt.installmentNo} of {receipt.totalInstallments}</strong></span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Payout Description:</span>
                <strong className="text-slate-900 font-bold text-xs">
                  Monthly Installment #{receipt.installmentNo} — Capital & Profit Share
                </strong>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Credit Method: <strong>{receipt.creditMethod || 'Questra Payout Bank (HSBC)'}</strong>
                  {receipt.referenceNo && (
                    <> · Ref: <span className="font-mono">{receipt.referenceNo}</span></>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Amount Credited:</span>
                <span className="text-lg font-extrabold text-emerald-700 font-mono">
                  +{formatBDT(receipt.amount, language)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
              <strong>In Words:</strong> {amountInWords(receipt.amount)} USD Only (Received)
            </div>

            {/* Progress within the 12-installment schedule */}
            <div className="text-[11px] text-slate-600">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  Schedule Progress
                </span>
                <span className="font-mono font-bold">
                  {receipt.installmentNo}/{receipt.totalInstallments} ({progressPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Footer Seals & Verification */}
          <div className="pt-6 border-t border-amber-200 flex items-end justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-700 block">Digitally Verified</span>
                Scan to verify this installment payout against the Questra World Central Ledger.
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center font-serif italic text-sm text-slate-800 mb-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                M. A. Reynolds
              </div>
              <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-600 font-semibold uppercase">
                Authorized Officer (Disbursements)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
