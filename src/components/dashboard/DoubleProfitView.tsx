import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Wallet,
  Plus,
  FileCheck2,
  ExternalLink,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { DoubleProfitPlan, Language, User } from '../../types';
import { StorageService } from '../../services/storage';
import { formatBDT } from '../../services/i18n';

interface DoubleProfitViewProps {
  user: User;
  language: Language;
  onRefreshData: () => void;
}

export const DoubleProfitView: React.FC<DoubleProfitViewProps> = ({
  user,
  language,
  onRefreshData
}) => {
  const myPlansOnly = (list: DoubleProfitPlan[]) => list.filter(p => p.memberId === user.memberId);

  const [plans, setPlans] = useState<DoubleProfitPlan[]>(() => {
    return myPlansOnly(StorageService.getDoubleProfitPlans());
  });

  const [selectedPlan, setSelectedPlan] = useState<DoubleProfitPlan | null>(() => {
    const list = myPlansOnly(StorageService.getDoubleProfitPlans());
    return list.length > 0 ? list[0] : null;
  });

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDeedModalOpen, setIsDeedModalOpen] = useState(false);
  const [deedPlan, setDeedPlan] = useState<DoubleProfitPlan | null>(null);

  // New Plan Enrollment Form State
  const [selectedPackageAmount, setSelectedPackageAmount] = useState<number>(500000);
  const [customAmountInput, setCustomAmountInput] = useState<string>('500000');
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollAttempt, setEnrollAttempt] = useState(false);

  const MIN_ENROLL = 50000;
  const enrollAmountError =
    selectedPackageAmount <= 0
      ? 'Enter the capital amount you wish to invest.'
      : selectedPackageAmount < MIN_ENROLL
      ? `Minimum investment amount is ৳${MIN_ENROLL.toLocaleString()}.`
      : null;
  const showEnrollError = enrollAttempt ? enrollAmountError : null;

  const refreshPlans = () => {
    const updated = myPlansOnly(StorageService.getDoubleProfitPlans());
    setPlans(updated);
    if (selectedPlan) {
      const match = updated.find(p => p.id === selectedPlan.id);
      setSelectedPlan(match || (updated.length > 0 ? updated[0] : null));
    } else if (updated.length > 0) {
      setSelectedPlan(updated[0]);
    }
    onRefreshData();
  };

  // Preset packages
  const packages = [
    { amount: 100000, label: '৳1,00,000', returnLabel: '12-Month ৳2,00,000', monthly: '৳16,667 / mo' },
    { amount: 250000, label: '৳2,50,000', returnLabel: '12-Month ৳5,00,000', monthly: '৳41,667 / mo' },
    { amount: 500000, label: '৳5,00,000', returnLabel: '12-Month ৳10,00,000', monthly: '৳83,333 / mo' },
    { amount: 1000000, label: '৳10,00,000', returnLabel: '12-Month ৳20,00,000', monthly: '৳1,66,667 / mo' },
    { amount: 2500000, label: '৳25,00,000', returnLabel: '12-Month ৳50,00,000', monthly: '৳4,16,667 / mo' },
    { amount: 5000000, label: '৳50,00,000', returnLabel: '12-Month ৳1,00,00,000', monthly: '৳8,33,333 / mo' }
  ];

  const handleSelectPackage = (amt: number) => {
    setSelectedPackageAmount(amt);
    setCustomAmountInput(String(amt));
    setEnrollError(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmountInput(val);
    setSelectedPackageAmount(Number(val) || 0);
    setEnrollError(null);
  };

  // Submit new enrollment
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollAttempt(true);
    if (enrollAmountError) {
      setEnrollError(enrollAmountError);
      return;
    }
    setEnrollError(null);

    StorageService.createDoubleProfitPlan({
      memberId: user.memberId,
      memberName: user.fullName,
      packageName: `Premium 12-Month Double Return (৳${selectedPackageAmount.toLocaleString()})`,
      packageNameBn: `Premium 12-Month Double Return (৳${selectedPackageAmount.toLocaleString()})`,
      principalAmount: selectedPackageAmount
    });

    refreshPlans();
    setIsEnrollModalOpen(false);
    setEnrollAttempt(false);
    setEnrollSuccessMessage(
      `Congratulations! Your BDT ${selectedPackageAmount.toLocaleString()} 12-Month Double Profit Plan is now active. Monthly installments will be credited automatically.`
    );
    setTimeout(() => setEnrollSuccessMessage(null), 8000);
  };

  // Calculated metrics across all user plans
  const totalInvestedCapital = plans.reduce((acc, p) => acc + p.principalAmount, 0);
  const totalTarget2xReturn = plans.reduce((acc, p) => acc + p.totalReturnAmount, 0);
  const totalMonthlyInstallmentReceivable = plans
    .filter(p => p.status === 'active')
    .reduce((acc, p) => acc + p.monthlyInstallmentAmount, 0);
  const totalAlreadyPaidOut = plans.reduce((acc, p) => acc + p.totalPaidOut, 0);

  // Generate 12-Month Installment Ledger for a selected plan
  const generate12MonthSchedule = (plan: DoubleProfitPlan) => {
    const schedule = [];
    const baseDate = new Date(plan.startDate);

    for (let i = 1; i <= 12; i++) {
      const payoutDate = new Date(baseDate);
      payoutDate.setMonth(baseDate.getMonth() + i);
      const isPaid = i <= plan.paidInstallments;
      const isNext = i === plan.paidInstallments + 1;
      const chequeNumber = plan.pdcCheckNumbers && plan.pdcCheckNumbers[i - 1]
        ? plan.pdcCheckNumbers[i - 1]
        : `PDC-IBBL-${new Date().getFullYear()}-${1000 + i}`;

      schedule.push({
        installmentNo: i,
        monthLabel: payoutDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        dueDate: payoutDate.toISOString().split('T')[0],
        amount: plan.monthlyInstallmentAmount,
        chequeNumber,
        status: isPaid ? 'paid' : isNext ? 'processing' : 'upcoming',
        voucherRef: isPaid ? `DP-VOUCH-${plan.agreementDeedNo}-${i}` : '—'
      });
    }
    return schedule;
  };

  return (
    <div className="space-y-6">

      {/* Success Notification */}
      {enrollSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{enrollSuccessMessage}</p>
          </div>
          <button
            onClick={() => setEnrollSuccessMessage(null)}
            className="text-xs font-bold text-emerald-600 hover:underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Scheme Guarantee Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-amber-400/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/20 border border-white/20 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Guaranteed 12-Month Double Return Scheme</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Invest Any Amount — Get 2X Back in 12 Months, Paid in 12 Equal Monthly Installments!
            </h2>
            <p className="text-xs sm:text-sm text-amber-50/90 leading-relaxed">
              However much you invest, you receive double (2X) of your capital back — disbursed month by month across 12 equal installments credited directly to your bank account or portal wallet. Every taka you put in is matched by 100% net profit, guaranteed by our company.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-amber-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>12 Bank PDC Cheques</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-300" />
                <span>Notarized Legal Deed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>Monthly Auto Credit on 1st-5th</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={() => { setIsEnrollModalOpen(true); setEnrollAttempt(false); setEnrollError(null); }}
              className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Enroll in New Plan</span>
            </button>
            {selectedPlan && (
              <button
                onClick={() => {
                  setDeedPlan(selectedPlan);
                  setIsDeedModalOpen(true);
                }}
                className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/20 flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>View Deed & Cheques</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Invested Capital */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Capital Invested
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono block">
            {formatBDT(totalInvestedCapital, language)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {plans.length} Active Plan{plans.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Total 2X Target Return */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total 2X Target Return
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block">
            {formatBDT(totalTarget2xReturn, language)}
          </span>
          <span className="text-[11px] text-emerald-600/80 font-medium mt-1 block">
            200% Guaranteed Payout
          </span>
        </div>

        {/* Monthly Installment Receivable */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Monthly Installment Receivable
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono block">
            +{formatBDT(totalMonthlyInstallmentReceivable, language)}
            <span className="text-xs text-slate-400 font-normal"> /mo</span>
          </span>
          <span className="text-[11px] text-blue-600/80 font-medium mt-1 block">
            Next credit: 1st-5th of month
          </span>
        </div>

        {/* Already Paid Out */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Already Paid Out
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono block">
            {formatBDT(totalAlreadyPaidOut, language)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across all enrolled plans
          </span>
        </div>

      </div>

      {/* Enrolled Plans List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Your Enrolled Double Profit Plans
        </h3>

        {plans.length === 0 && (
          <div className="p-10 text-center text-slate-400 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            No Double Profit plans enrolled yet. Click "Enroll in New Plan" above to get started.
          </div>
        )}

        {plans.map(plan => {
          const progressPct = Math.round((plan.paidInstallments / plan.totalMonths) * 100);
          const schedule = generate12MonthSchedule(plan);
          const isExpanded = selectedPlan?.id === plan.id;

          return (
            <div key={plan.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                onClick={() => setSelectedPlan(isExpanded ? null : plan)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{plan.packageName}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {plan.memberId} · Started {plan.startDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Monthly Installment</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      +{formatBDT(plan.monthlyInstallmentAmount, language)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Progress</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                      {plan.paidInstallments}/12
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    plan.status === 'active'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {plan.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-5 pb-4">
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Expanded: 12-Month Installment Ledger */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800">
                  <div className="p-5">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                      12-Month Installment Ledger & PDC Cheque Security
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[720px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Month</th>
                            <th className="p-3">Due Date</th>
                            <th className="p-3 font-mono">Amount</th>
                            <th className="p-3">PDC Cheque No</th>
                            <th className="p-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {schedule.map(row => (
                            <tr key={row.installmentNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="p-3 font-mono text-slate-500">{row.installmentNo}</td>
                              <td className="p-3 font-medium text-slate-900 dark:text-white">{row.monthLabel}</td>
                              <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{row.dueDate}</td>
                              <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                                {formatBDT(row.amount, language)}
                              </td>
                              <td className="p-3 font-mono text-[11px] text-slate-400">{row.chequeNumber}</td>
                              <td className="p-3 text-center">
                                {row.status === 'paid' ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                    PAID
                                  </span>
                                ) : row.status === 'processing' ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                    PROCESSING
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/30">
                                    UPCOMING
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enroll in 12-Month Double Profit Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  100% Net Profit Disbursed in 12 Equal Monthly Installments
                </p>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} noValidate className="space-y-5 text-sm">
              {/* Preset Packages */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Choose Capital Package
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {packages.map(p => (
                    <button
                      key={p.amount}
                      type="button"
                      onClick={() => handleSelectPackage(p.amount)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPackageAmount === p.amount
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                      }`}
                    >
                      <strong className="block text-sm font-mono text-slate-900 dark:text-white">{p.label}</strong>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">2X: {p.returnLabel}</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-mono">{p.monthly}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Enter Custom Amount (BDT)
                </label>
                <input
                  type="text"
                  value={customAmountInput}
                  onChange={handleCustomChange}
                  placeholder="Enter any amount (min 50,000)"
                  aria-invalid={!!showEnrollError}
                  className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    showEnrollError
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/40'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {showEnrollError && (
                  <p className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400" role="alert">
                    <AlertCircle className="w-3 h-3 mt-[1px] shrink-0" />
                    <span>{showEnrollError}</span>
                  </p>
                )}
              </div>

              {/* Live Calculation Preview */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Invested Principal</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{formatBDT(selectedPackageAmount, language)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">100% Net Profit</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm">+{formatBDT(selectedPackageAmount, language)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Total 12-Mo Payout</span>
                  <strong className="text-amber-600 dark:text-amber-400 text-sm">{formatBDT(selectedPackageAmount * 2, language)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Monthly Installment</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{formatBDT(Math.round((selectedPackageAmount * 2) / 12), language)} / mo</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  aria-disabled={enrollAttempt && !!enrollAmountError}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                    enrollAttempt && enrollAmountError
                      ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {enrollAttempt && enrollAmountError ? 'Fix the amount to continue' : 'Enroll Plan & Generate 12 PDC Cheques'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deed & Cheques Modal */}
      {isDeedModalOpen && deedPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-amber-600" />
                  Agreement Deed & PDC Cheques
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{deedPlan.agreementDeedNo}</p>
              </div>
              <button
                onClick={() => setIsDeedModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-5 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Investor:</span>
                  <strong className="text-slate-900 dark:text-white">{deedPlan.memberName} ({deedPlan.memberId})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Package:</span>
                  <strong className="text-slate-900 dark:text-white">{deedPlan.packageName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Capital Invested:</span>
                  <strong className="text-amber-600 dark:text-amber-400">{formatBDT(deedPlan.principalAmount, language)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total 2X Payout:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{formatBDT(deedPlan.totalReturnAmount, language)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Installment:</span>
                  <strong className="text-slate-900 dark:text-white">{formatBDT(deedPlan.monthlyInstallmentAmount, language)} / mo</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  12 Post-Dated Cheques (PDC) Security
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {deedPlan.pdcCheckNumbers.map((chk, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] flex items-center justify-between">
                      <span className="text-slate-500">#{idx + 1}</span>
                      <strong className="text-slate-900 dark:text-white">{chk}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsDeedModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Close Document Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
