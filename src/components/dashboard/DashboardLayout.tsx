import React, { useMemo, useRef, useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Wallet,
  Sparkles,
  BadgeCheck,
  Banknote,
  FileText
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
import { CertificateViewerModal } from './CertificateViewerModal';
import { DividendManagerView } from './DividendManagerView';
import { ProfileKYCView } from './ProfileKYCView';
import { MemberTransferView } from './MemberTransferView';
import { DepositSlipUploadView } from './DepositSlipUploadView';
import { ReferralTreeView } from './ReferralTreeView';
import { ReferralProgramView } from './ReferralProgramView';
import { TransactionPinSecurityView } from './TransactionPinSecurityView';
import { DoubleProfitView } from './DoubleProfitView';
import { InstallmentReceiptsView } from './InstallmentReceiptsView';
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
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certType, setCertType] = useState<'hotel_share' | 'double_profit_deed'>('hotel_share');

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

  const totalDividendsAccrued = shares.reduce((acc, s) => acc + s.totalDividendsEarned, 0);
  const monthlyDividendYield = shares.reduce((acc, s) => acc + s.monthlyDividendAmount, 0);

  const activeShare = shares[0];

  // Installment RECEIPTS (installments credited on invested amounts).
  // The user dashboard has no "pay an installment" flow — capital + profit is
  // credited back to the investor, so the overview surfaces the next credit.
  const installmentReceipts = useMemo(
    () => StorageService.getInstallmentReceipts(user.memberId),
    [user.memberId]
  );
  const receivedReceipts = installmentReceipts.filter(r => r.status === 'received');
  const totalInstallmentsReceived = receivedReceipts.reduce((acc, r) => acc + r.amount, 0);
  const nextInstallmentReceipt = useMemo(() => {
    const pending = installmentReceipts
      .filter(r => r.status !== 'received')
      .sort((a, b) => (a.scheduledDate < b.scheduledDate ? -1 : 1));
    return pending[0] || null;
  }, [installmentReceipts]);

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
        <div className="space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* FIRST CARD — the user's full details, listed row by row in a single card */}
                <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white border border-white/20 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_70px_-10px_rgba(79,70,229,0.6)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)]"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 pb-5 mb-2 border-b border-white/20">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/60 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-md"></div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-tight truncate">{user.fullName}</h3>
                        <p className="text-xs sm:text-sm text-white/90 font-mono truncate">@{user.username}</p>
                        <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25 text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active Member
                        </span>
                      </div>
                    </div>

                    {/* Details — one item per row */}
                    <dl className="divide-y divide-white/15">
                      {[
                        { label: 'User ID', value: user.userId },
                        { label: 'Member ID', value: user.memberId },
                        { label: 'Username', value: `@${user.username}` },
                        { label: 'Phone', value: user.phone },
                        { label: 'Email', value: user.email },
                        { label: 'City / Address', value: [user.city, user.address].filter(Boolean).join(', ') },
                        { label: 'Joined', value: user.joinedDate }
                      ]
                        .filter(row => row.value)
                        .map(row => (
                          <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                            <dt className="text-[11px] uppercase tracking-wider text-white/70 font-semibold shrink-0">{row.label}</dt>
                            <dd className="text-sm font-bold font-mono text-right break-all">{row.value}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </div>

                {/* 3D Colorful Stat Cards — each with a related icon centred at the top */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* Total Portfolio */}
                  <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700/60 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.8)] transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_70px_-10px_rgba(15,23,42,0.9)]">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-500/20 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                      <span className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3 shadow-inner">
                        <Wallet className="w-6 h-6 text-amber-300" />
                      </span>
                      <span className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-2">
                        {t('overviewTotalInvested')}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        {formatBDT(totalPortfolioValue, language)}
                      </span>
                      <span className="text-xs text-white/80 mt-2 font-medium">
                        Hotel & commercial share holdings
                      </span>
                    </div>
                  </div>

                  {/* Total Paid */}
                  <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white border border-emerald-300/40 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.6)] transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_70px_-10px_rgba(16,185,129,0.7)]">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/20 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                      <span className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-3 shadow-inner">
                        <BadgeCheck className="w-6 h-6 text-white" />
                      </span>
                      <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold mb-2">
                        {t('overviewTotalPaid')}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        {formatBDT(totalPaid, language)}
                      </span>
                      <span className="text-xs text-emerald-50 font-semibold mt-2">
                        {totalPortfolioValue > 0 ? Math.round((totalPaid / totalPortfolioValue) * 100) : 0}% Cleared
                      </span>
                    </div>
                  </div>

                  {/* Installments Received */}
                  <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-700 text-white border border-cyan-300/40 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.6)] transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_70px_-10px_rgba(14,165,233,0.7)]">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/20 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                      <span className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-3 shadow-inner">
                        <Banknote className="w-6 h-6 text-white" />
                      </span>
                      <span className="text-xs uppercase tracking-wider text-cyan-100 font-bold mb-2">
                        { 'Installments Received'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        {formatBDT(totalInstallmentsReceived, language)}
                      </span>
                      <span className="text-xs text-cyan-50 font-medium mt-2">
                        {receivedReceipts.length} of {installmentReceipts.length} installments credited
                      </span>
                    </div>
                  </div>

                  {/* Dividends Earned */}
                  <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-pink-700 text-white border border-fuchsia-300/40 shadow-[0_20px_60px_-15px_rgba(217,70,239,0.6)] transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_25px_70px_-10px_rgba(217,70,239,0.7)]">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/20 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                      <span className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-3 shadow-inner">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </span>
                      <span className="text-xs uppercase tracking-wider text-fuchsia-100 font-bold mb-2">
                        {t('overviewDividendsReceived')}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        {formatBDT(totalDividendsAccrued, language)}
                      </span>
                      <span className="text-xs text-fuchsia-50 font-semibold mt-2">
                        +{formatBDT(monthlyDividendYield, language)} / month
                      </span>
                    </div>
                  </div>

                </div>

                {/* Next Installment Credit Alert Banner */}
                {nextInstallmentReceipt && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          { 'Next Installment Credit'}: #{nextInstallmentReceipt.installmentNo} of {nextInstallmentReceipt.totalInstallments}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Credit amount: <strong className="font-mono text-slate-900 dark:text-white">{formatBDT(nextInstallmentReceipt.amount, language)}</strong> scheduled on <strong className="font-mono">{nextInstallmentReceipt.scheduledDate}</strong> from your <strong>{nextInstallmentReceipt.investmentTitle}</strong> investment.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('installment_receipts')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>{ 'View Receipts'}</span>
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

                {/* Portfolio Holdings Card removed per request (Active Share Holding section). */}

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

            {/* TAB: INSTALLMENT RECEIPTS (installments credited on invested amounts) */}
            {activeTab === 'installment_receipts' && (
              <InstallmentReceiptsView
                user={user}
                language={language}
                plans={doubleProfitPlans}
                onRefreshData={onRefreshData}
                onGoToInvest={() => setActiveTab('double_profit')}
              />
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
                  <div className="rtable-scroll">
                    <table className="rtable w-full text-left text-xs min-w-[720px]">
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
                            <td data-label="Date" className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                              {tx.date}
                            </td>
                            <td data-label="Description" className="p-3.5 font-medium text-slate-900 dark:text-white">
                              {tx.title}
                            </td>
                            <td data-label="Method" className="p-3.5 text-slate-600 dark:text-slate-300">
                              {tx.method}
                            </td>
                            <td data-label="Ref / TxID" className="p-3.5 font-mono text-slate-500">
                              {tx.referenceNo}
                            </td>
                            <td data-label="Amount" className="p-3.5 text-right font-mono font-bold">
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

            {/* TAB: SETTINGS — dashboard section shortcuts (moved from the top row) + security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h2>
                  <p className="text-xs text-slate-500">
                    Jump to any dashboard section below, or manage your login credentials and transaction PIN.
                  </p>
                </div>

                {/* Dashboard sections as cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className="group relative overflow-hidden text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      >
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="block text-xs font-bold text-slate-900 dark:text-white leading-snug pr-4">{item.label}</span>
                        <ChevronRight className="absolute top-4 right-3 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" />
                      </button>
                    );
                  })}

                  {/* Share certificate quick action (was in the removed holdings card) */}
                  <button
                    type="button"
                    onClick={() => handleOpenCertificate('hotel_share')}
                    className="group relative overflow-hidden text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white leading-snug pr-4">Share Certificate</span>
                    <ChevronRight className="absolute top-4 right-3 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" />
                  </button>
                </div>

                <TransactionPinSecurityView user={user} language={language} />
              </div>
            )}

        </div>
      </div>

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

    </div>
  );
};
