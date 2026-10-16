import React, { useMemo, useRef, useState } from 'react';
import {
  CreditCard,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  User as UserIcon,
  Phone,
  Mail,
  ChevronRight,
  Wallet,
  Send,
  Sparkles,
  Upload
} from 'lucide-react';
import {
  User,
  Language,
  ShareInvestment,
  InstallmentRecord,
  TransactionRecord,
  SupportTicket,
  DoubleProfitPlan
} from '../../types';
import { formatBDT, getTranslation, translations } from '../../services/i18n';
import { StorageService } from '../../services/storage';
import { compose, required, minLength, runRules, RuleSet } from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid } from '../ui/Validation';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { CertificateViewerModal } from './CertificateViewerModal';
import { MoneyReceiptModal } from './MoneyReceiptModal';
import { DividendManagerView } from './DividendManagerView';
import { ProfileKYCView } from './ProfileKYCView';
import { MemberTransferView } from './MemberTransferView';
import { DepositSlipUploadView } from './DepositSlipUploadView';
import { ReferralTreeView } from './ReferralTreeView';
import { ReferralProgramView } from './ReferralProgramView';
import { TransactionPinSecurityView } from './TransactionPinSecurityView';
import { DoubleProfitView } from './DoubleProfitView';
import { DashboardTab, getDashboardNavItems } from './dashboardNav';

interface DashboardLayoutProps {
  user: User;
  language: Language;
  shares: ShareInvestment[];
  installments: InstallmentRecord[];
  transactions: TransactionRecord[];
  tickets: SupportTicket[];
  doubleProfitPlans: DoubleProfitPlan[];
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onChangeAvatar: () => void;
  onRefreshData: () => void;
  onUserUpdated: (updatedUser: User) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  language,
  shares,
  installments,
  transactions,
  tickets,
  doubleProfitPlans,
  activeTab,
  onTabChange,
  onChangeAvatar,
  onRefreshData,
  onUserUpdated
}) => {
  const setActiveTab = onTabChange;

  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInstallmentForPay, setSelectedInstallmentForPay] = useState<InstallmentRecord | null>(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certType, setCertType] = useState<'hotel_share' | 'double_profit_deed'>('hotel_share');

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedInstallmentForReceipt, setSelectedInstallmentForReceipt] = useState<InstallmentRecord | null>(null);

  // Support ticket form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<SupportTicket['category']>('general');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketTouched, setTicketTouched] = useState<Record<string, boolean>>({});
  const [ticketAttempt, setTicketAttempt] = useState(false);
  const ticketFormRef = useRef<HTMLFormElement>(null);

  const ticketRules: RuleSet = {
    newTicketSubject: compose(required('Subject'), minLength('Subject', 4)),
    newTicketMessage: compose(required('Message details'), minLength('Message details', 10))
  };
  const ticketValues = { newTicketSubject, newTicketMessage };
  const ticketResult = useMemo(() => runRules(ticketValues, ticketRules), [newTicketSubject, newTicketMessage]);
  const showTicketError = (f: string): string | null =>
    ticketTouched[f] || ticketAttempt ? (ticketResult.errors[f] || null) : null;
  const markTicket = (f: string) => setTicketTouched(prev => ({ ...prev, [f]: true }));

  const t = (key: keyof typeof translations.en) => getTranslation(language, key);

  const navItems = getDashboardNavItems(language);
  const currentSection = navItems.find(n => n.id === activeTab)?.label || t('dashOverview');

  // Computed metrics (hotel / commercial share based — no land)
  const totalShareCost = shares.reduce((acc, s) => acc + s.totalInvestment, 0);
  const totalPortfolioValue = totalShareCost;

  const totalSharePaid = shares.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalPaid = totalSharePaid;

  const pendingInstallments = installments.filter(i => i.status !== 'paid');
  const totalRemainingDue = pendingInstallments.reduce((acc, i) => acc + i.amount, 0);
  const totalDividendsAccrued = shares.reduce((acc, s) => acc + s.totalDividendsEarned, 0);
  const monthlyDividendYield = shares.reduce((acc, s) => acc + s.monthlyDividendAmount, 0);

  const activeShare = shares[0];
  const nextDueInstallment = installments.find(i => i.status === 'due') || pendingInstallments[0];

  const handleOpenPayment = (inst?: InstallmentRecord) => {
    setSelectedInstallmentForPay(inst || nextDueInstallment);
    setPaymentModalOpen(true);
  };

  const handleOpenCertificate = (type: 'hotel_share' | 'double_profit_deed') => {
    setCertType(type);
    setCertModalOpen(true);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketAttempt(true);
    if (!ticketResult.isValid) {
      focusFirstInvalid(ticketFormRef.current);
      return;
    }
    setIsSubmittingTicket(true);
    StorageService.createTicket(newTicketSubject, newTicketCategory, newTicketMessage);
    onRefreshData();
    setNewTicketSubject('');
    setNewTicketMessage('');
    setIsSubmittingTicket(false);
    setTicketAttempt(false);
    setTicketTouched({});
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16">

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TOP BUTTON BAR — every dashboard section is reachable as a button.
            The profile dropdown keeps only the 4-5 account-related items. */}
        <nav className="mb-5 no-scrollbar" aria-label="Dashboard sections">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={item.label}
                  className={`group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* Card 1: Total Portfolio */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                      {t('overviewTotalInvested')}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 block">
                      {formatBDT(totalPortfolioValue, language)}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Hotel & commercial share holdings
                    </span>
                  </div>

                  {/* Card 2: Total Paid */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                      {t('overviewTotalPaid')}
                    </span>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                      {formatBDT(totalPaid, language)}
                    </span>
                    <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-1 block">
                      {totalPortfolioValue > 0 ? Math.round((totalPaid / totalPortfolioValue) * 100) : 0}% Cleared
                    </span>
                  </div>

                  {/* Card 3: Remaining Due */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                      {t('overviewRemainingDue')}
                    </span>
                    <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1 block">
                      {formatBDT(totalRemainingDue, language)}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {pendingInstallments.length} Installments Remaining
                    </span>
                  </div>

                  {/* Card 4: Dividends Earned */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                      {t('overviewDividendsReceived')}
                    </span>
                    <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
                      {formatBDT(totalDividendsAccrued, language)}
                    </span>
                    <span className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 font-medium mt-1 block">
                      +{formatBDT(monthlyDividendYield, language)} / month
                    </span>
                  </div>

                </div>

                {/* Next Installment Due Alert Banner */}
                {nextDueInstallment && nextDueInstallment.status === 'due' && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {t('nextInstallmentDue')}: {nextDueInstallment.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Payable amount: <strong className="font-mono text-slate-900 dark:text-white">{formatBDT(nextDueInstallment.amount, language)}</strong> due on <strong className="font-mono">{nextDueInstallment.dueDate}</strong>.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenPayment(nextDueInstallment)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{t('payNow')}</span>
                    </button>
                  </div>
                )}

                {/* 12-Month Double Profit Scheme Spotlight Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 border border-amber-400/40">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/25 border border-white/20 text-xs font-black uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>12-Month Double Profit Scheme</span>
                    </div>
                    <h3 className="text-base sm:text-xl font-black tracking-tight">
                      Invest Any Amount — Get 2X Back in 12 Monthly Installments!
                    </h3>
                    <p className="text-xs text-amber-50/90 leading-relaxed">
                      Whatever you invest, you receive double back — paid to you month by month across 12 equal installments. 100% Backed by Bank PDC Cheques &amp; Notarized Deed, credited straight to your account.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('double_profit')}
                    className="px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 group"
                  >
                    <span>View Installment Ledger</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                {/* Portfolio Holdings Card */}
                {activeShare && (
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Active Share Holding
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {activeShare.projectName}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenCertificate('hotel_share')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                        >
                          Share Certificate
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Unit Numbers</span>
                        <strong className="text-slate-900 dark:text-white font-mono">{activeShare.shareNumbers.join(', ')}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Investment</span>
                        <strong className="text-amber-600 dark:text-amber-400 font-mono font-bold">{formatBDT(activeShare.totalInvestment, language)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Monthly Profit</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{formatBDT(activeShare.monthlyDividendAmount, language)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Annual ROI</span>
                        <strong className="text-slate-900 dark:text-white font-mono">{activeShare.annualRoiPercentage}% p.a.</strong>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-300">Project Construction Progress</span>
                        <span className="font-mono text-amber-700 dark:text-amber-400">
                          {activeShare.projectCompletionPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                          style={{ width: `${activeShare.projectCompletionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB: 12-MONTH DOUBLE PROFIT SCHEME */}
            {activeTab === 'double_profit' && (
              <DoubleProfitView
                user={user}
                language={language}
                onRefreshData={onRefreshData}
              />
            )}

            {/* TAB: PROFILE & KYC */}
            {activeTab === 'profile' && (
              <ProfileKYCView
                user={user}
                language={language}
                onProfileUpdated={(updated) => {
                  onRefreshData();
                  onUserUpdated(updated);
                }}
              />
            )}

            {/* TAB: INSTALLMENTS & PAY */}
            {activeTab === 'installments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('installmentsTitle')}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t('installmentsSubtitle')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenPayment()}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Next Installment</span>
                  </button>
                </div>

                {/* Installments Table */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[640px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-3.5">{t('thInstallmentNo')}</th>
                          <th className="p-3.5">{t('thDueDate')}</th>
                          <th className="p-3.5">{t('thAmount')}</th>
                          <th className="p-3.5">{t('thStatus')}</th>
                          <th className="p-3.5 text-right">{t('thAction')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {installments.map(inst => (
                          <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                              {inst.title}
                            </td>
                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                              {inst.dueDate}
                            </td>
                            <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                              {formatBDT(inst.amount, language)}
                            </td>
                            <td className="p-3.5">
                              {inst.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {t('statusPaid')}
                                </span>
                              ) : inst.status === 'due' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                  <Clock className="w-3.5 h-3.5" />
                                  {t('statusDue')}
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-slate-400">
                                  {t('statusUpcoming')}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              {inst.status === 'paid' ? (
                                <button
                                  onClick={() => {
                                    setSelectedInstallmentForReceipt(inst);
                                    setReceiptModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold font-mono transition-colors flex items-center gap-1 ml-auto"
                                >
                                  <FileText className="w-3 h-3 text-emerald-600" />
                                  <span>{inst.receiptNo || 'MR Receipt'}</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleOpenPayment(inst)}
                                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                                >
                                  {t('btnPayOnline')}
                                </button>
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

            {/* TAB: DEPOSIT SLIP UPLOAD */}
            {activeTab === 'slip_upload' && (
              <DepositSlipUploadView
                user={user}
                installments={installments}
                language={language}
              />
            )}

            {/* TAB: DIVIDENDS & PAYOUT MANAGER */}
            {activeTab === 'dividends' && (
              <DividendManagerView
                user={user}
                shares={shares}
                transactions={transactions}
                language={language}
                onRefreshData={onRefreshData}
              />
            )}

            {/* TAB: MEMBER-TO-MEMBER TRANSFER */}
            {activeTab === 'member_transfer' && (
              <MemberTransferView
                user={user}
                language={language}
                onRefreshData={onRefreshData}
              />
            )}

            {/* TAB: LEDGER & PASSBOOK */}
            {activeTab === 'ledger' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('dashTransactions')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time chronological passbook of installment debits, dividend credits, and referral bonuses.
                  </p>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[720px]">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Transaction Description</th>
                          <th className="p-3.5">Method / Channel</th>
                          <th className="p-3.5">Ref / TxID</th>
                          <th className="p-3.5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {transactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                              {tx.date}
                            </td>
                            <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                              {tx.title}
                            </td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-300">
                              {tx.method}
                            </td>
                            <td className="p-3.5 font-mono text-slate-500">
                              {tx.referenceNo}
                            </td>
                            <td className="p-3.5 text-right font-mono font-bold">
                              {tx.type === 'credit' ? (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  +{formatBDT(tx.amount, language)}
                                </span>
                              ) : (
                                <span className="text-rose-600 dark:text-rose-400">
                                  -{formatBDT(tx.amount, language)}
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

            {/* TAB: ANALYTICS & YIELD */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Investment Growth & Cashflow Analytics
                  </h2>
                  <p className="text-xs text-slate-500">
                    5-year capital appreciation projection and monthly dividend yields.
                  </p>
                </div>

                {/* Visual Chart Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Portfolio Valuation Trajectory (USD)
                  </h3>

                  {/* Simulated SVG Area Chart */}
                  <div className="h-48 w-full flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1 sm:px-2 border-b border-slate-100 dark:border-slate-800">
                    {[
                      { year: '2024 (Purchase)', val: '$120,000', height: '40%' },
                      { year: '2025 (Current)', val: '$142,000', height: '52%' },
                      { year: '2026 (Dev)', val: '$170,000', height: '65%' },
                      { year: '2027 (Handover)', val: '$215,000', height: '82%' },
                      { year: '2028 (Mature)', val: '$260,000', height: '100%' }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                          {bar.val}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300"
                          style={{ height: bar.height }}
                        />
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono text-center leading-tight">
                          {bar.year}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500">
                    <span>Average Annual Capital Gain: +18.2%</span>
                    <span>Projected 5-Yr Net Gain: +$1,400,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REFERRAL & NETWORK */}
            {activeTab === 'affiliate' && (
              <ReferralProgramView
                user={user}
                language={language}
                onNavigateToTree={() => setActiveTab('referral_tree')}
              />
            )}

            {/* TAB: GENERATION TREE & TEAM */}
            {activeTab === 'referral_tree' && (
              <ReferralTreeView
                user={user}
                language={language}
                onNavigateToProgram={() => setActiveTab('affiliate')}
              />
            )}

            {/* TAB: SUPPORT DESK */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('dashSupport')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Submit customer requests for share certificate copies, nominee changes, or payment receipts.
                  </p>
                </div>

                {/* Open New Ticket */}
                <form ref={ticketFormRef} onSubmit={handleCreateTicket} noValidate className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Submit Inquiry / Support Request
                  </h3>

                  {ticketAttempt && !ticketResult.isValid && (
                    <ValidationSummary messages={ticketResult.messages} />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Subject / Questra World *
                      </label>
                      <input
                        type="text"
                        value={newTicketSubject}
                        onChange={e => setNewTicketSubject(e.target.value)}
                        onBlur={() => markTicket('newTicketSubject')}
                        aria-invalid={!!showTicketError('newTicketSubject')}
                        placeholder="e.g. Request for Share Certificate Copy"
                        className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                          showTicketError('newTicketSubject')
                            ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                            : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                        }`}
                      />
                      <FieldError message={showTicketError('newTicketSubject')} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newTicketCategory}
                        onChange={e => setNewTicketCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="general">General Support</option>
                        <option value="payment">Payment & Bank Verification</option>
                        <option value="possession">Possession & Handover</option>
                        <option value="dividend">Hotel Dividend Disbursal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message Details *
                    </label>
                    <textarea
                      rows={3}
                      value={newTicketMessage}
                      onChange={e => setNewTicketMessage(e.target.value)}
                      onBlur={() => markTicket('newTicketMessage')}
                      aria-invalid={!!showTicketError('newTicketMessage')}
                      placeholder="Explain your inquiry in detail..."
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                        showTicketError('newTicketMessage')
                          ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                      }`}
                    />
                    <FieldError message={showTicketError('newTicketMessage')} />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingTicket}
                    aria-disabled={ticketAttempt && !ticketResult.isValid}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs ${
                      ticketAttempt && !ticketResult.isValid
                        ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {ticketAttempt && !ticketResult.isValid
                      ? `Fix ${ticketResult.messages.length} field${ticketResult.messages.length > 1 ? 's' : ''} to submit`
                      : 'Submit Ticket'}
                  </button>
                </form>

                {/* Existing Tickets */}
                <div className="space-y-4">
                  {tickets.map(tkt => (
                    <div key={tkt.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-amber-600 font-bold">{tkt.ticketNo}</span>
                        <span className="text-[11px] font-semibold uppercase text-emerald-600">{tkt.status}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tkt.subject}</h4>
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {tkt.messages.map((m, idx) => (
                          <div key={idx} className={`p-3 rounded-xl text-xs ${m.sender === 'support' ? 'bg-amber-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200' : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'}`}>
                            <div className="flex justify-between text-[11px] font-semibold mb-1 text-slate-500">
                              <span>{m.senderName}</span>
                              <span className="font-mono">{m.timestamp}</span>
                            </div>
                            <p>{m.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECURITY, PASSWORD & TRANSACTION PIN */}
            {activeTab === 'security' && (
              <TransactionPinSecurityView user={user} language={language} />
            )}

        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        installment={selectedInstallmentForPay}
        language={language}
        onPaymentSuccess={() => {
          onRefreshData();
        }}
      />

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        type={certType}
        user={user}
        share={activeShare}
        plans={doubleProfitPlans}
        language={language}
      />

      {/* Official Money Receipt Modal */}
      {selectedInstallmentForReceipt && (
        <MoneyReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          installment={selectedInstallmentForReceipt}
          user={user}
          language={language}
        />
      )}

    </div>
  );
};
