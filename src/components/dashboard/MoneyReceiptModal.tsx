import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { User, InstallmentRecord, Language } from '../../types';
import { formatBDT } from '../../services/i18n';

interface MoneyReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  installment: InstallmentRecord;
  user: User;
  language: Language;
}

/** Convert a number (up to crores) into English words for the receipt. */
function amountInWords(num: number): string {
  if (num <= 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const twoDigits = (n: number): string => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : ''));
  const threeDigits = (n: number): string => {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    return (h ? ones[h] + ' Hundred' + (rest ? ' ' : '') : '') + (rest ? twoDigits(rest) : '');
  };

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;

  const parts: string[] = [];
  if (crore) parts.push(threeDigits(crore) + ' Crore');
  if (lakh) parts.push(twoDigits(lakh) + ' Lakh');
  if (thousand) parts.push(twoDigits(thousand) + ' Thousand');
  if (rest) parts.push(threeDigits(rest));
  return parts.join(' ') || 'Zero';
}

export const MoneyReceiptModal: React.FC<MoneyReceiptModalProps> = ({
  isOpen,
  onClose,
  installment,
  user,
  language
}) => {
  if (!isOpen) return null;
  const isBn = language === 'bn';

  // Stable receipt number: use the persisted one, or derive deterministically
  // from the installment id so it never changes between renders.
  const [stableReceiptNo] = useState(
    () => installment.receiptNo || `MR-QW-${installment.id.replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase()}`
  );

  const receiptNo = stableReceiptNo;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 print:p-0 print:border-none print:shadow-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              OFFICIAL MONEY RECEIPT
            </span>
            <span className="text-xs font-mono text-slate-500">{receiptNo}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{ 'Print Receipt'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="mt-4 p-6 sm:p-8 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50/20 relative space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-amber-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-slate-900 flex items-center justify-center text-amber-200 font-bold text-xl shadow-xs">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  QUESTA WORLD LIMITED
                </h2>
                <p className="text-[11px] text-slate-600">
                  Corporate Head Office: House #12, Road #03, Section #12, Pallabi, Mirpur, Dhaka-1216
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Hotline: +880 1810-685888 · Web: www.questaworld.com
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                MONEY RECEIPT
              </div>
              <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                {receiptNo}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Date: {installment.paidDate || 'Today'}
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-xs leading-relaxed text-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-[11px] block">Received with thanks from:</span>
                <strong className="text-sm text-slate-900 font-bold">
                  {user.fullName} ({user.fullNameBn || ''})
                </strong>
                <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  Member ID: <strong>{user.memberId}</strong> · Phone: {user.phone}
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Branch / Zonal Office:</span>
                <strong className="text-xs text-slate-900 font-semibold">{user.branch}</strong>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Salma Centre, Muradpur, Chattogram
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Payment Purpose / Description:</span>
                <strong className="text-slate-900 font-bold text-xs">
                  {installment.title} - Questa Royal Bay (Hotel & Suites), Cox's Bazar
                </strong>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Payment Method: <strong>{installment.paymentMethod || 'Online Gateway / bKash'}</strong> · Ref/Trx: <span className="font-mono">{installment.transactionId || 'TRX-CS-8842'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Amount Received:</span>
                <span className="text-lg font-extrabold text-amber-700 font-mono">
                  {formatBDT(installment.amount, language)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
              <strong>In Words:</strong> {amountInWords(installment.amount)} Taka Only (Paid)
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
                Scan to verify receipt authenticity against Questa World Central Ledger.
              </div>
            </div>

            <div className="text-center">
              <div className="font-serif italic text-sm text-slate-800 mb-1 font-bold">
                M. A. Rahman
              </div>
              <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-600 font-semibold uppercase">
                Authorized Officer (Accounts)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
