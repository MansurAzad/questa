import React, { useMemo, useRef, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Hotel,
  Network,
  CreditCard,
  Bell,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  TrendingUp,
  Check,
  X,
  UserCheck,
  KeyRound,
  Trash2,
  Edit2,
  MessageSquare,
  Eye,
  Sparkles,
  Building2,
  Ban,
  RotateCcw,
  Wallet,
  ChevronRight,
  ChevronDown,
  LogOut,
  Camera,
  UserCog,
  LayoutTemplate
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
import { AdminInvestor, AdminDepositSlip, AdminDividendRound } from '../../types/admin';
import { formatBDT } from '../../services/i18n';
import { StorageService } from '../../services/storage';
import { isTronAddress, compose, required, minLength, runRules, RuleSet } from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid } from '../ui/Validation';
import {
  AddInvestorModal,
  EditInvestorModal,
  AddManualSlipModal,
  ReplyTicketModal,
  AddDoublePlanModal
} from './AdminModals';
import { CmsManager } from './CmsManager';

// ---------------------------------------------------------------------------
// Shared "cards in rows" summary strip used at the top of every admin tab so
// the control center reads consistently as a row of KPI cards.
// ---------------------------------------------------------------------------
type StatTone = 'amber' | 'emerald' | 'rose' | 'slate' | 'indigo' | 'purple' | 'blue';
const STAT_TONE: Record<StatTone, string> = {
  amber: 'text-amber-600 dark:text-amber-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  rose: 'text-rose-600 dark:text-rose-400',
  slate: 'text-slate-900 dark:text-white',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  purple: 'text-purple-600 dark:text-purple-400',
  blue: 'text-blue-600 dark:text-blue-400'
};

const StatCards: React.FC<{
  items: { label: string; value: string; sub?: string; tone?: StatTone }[];
}> = ({ items }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {items.map((it, i) => (
      <div
        key={i}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
      >
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">{it.label}</span>
        <span className={`text-lg font-extrabold font-mono block mt-1 ${STAT_TONE[it.tone || 'slate']}`}>
          {it.value}
        </span>
        {it.sub && <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{it.sub}</span>}
      </div>
    ))}
  </div>
);

interface AdminDashboardProps {
  currentUser: User;
  language: Language;
  onLogout: () => void;
  onSwitchToUserPortal: () => void;
  onSwitchToPublic: () => void;
}

/**
 * Admin tabs intentionally mirror the investor dashboard sections so the
 * control panel only carries functionality that supports the user portal:
 *   overview        → user dashboard overview
 *   investors       → My Profile & KYC
 *   double_profit   → 12-Month Double Profit
 *   shares          → Hotel Shares & Dividend Payouts
 *   accounts        → Deposit Slip Upload & Installments
 *   referrals       → Referral & Network
 *   notices         → Notice Board (shown to investors)
 *   support         → Support Desk
 *   cms             → Homepage CMS (sections, content library, site settings)
 */
type AdminTab =
  | 'overview'
  | 'investors'
  | 'double_profit'
  | 'shares'
  | 'accounts'
  | 'referrals'
  | 'notices'
  | 'support'
  | 'cms';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  language,
  onLogout,
  onSwitchToUserPortal,
  onSwitchToPublic
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ------------------------------------------------------------------
  // All admin data is sourced from StorageService so every action
  // persists and the overview KPIs reflect the real central ledger.
  // ------------------------------------------------------------------
  const [investors, setInvestors] = useState<AdminInvestor[]>(() => StorageService.getAdminInvestors());
  const [depositSlips, setDepositSlips] = useState<AdminDepositSlip[]>(() => StorageService.getDepositSlips());
  const [notices, setNotices] = useState(() => StorageService.getNotices());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getTickets());
  const [doubleProfitPlans, setDoubleProfitPlans] = useState<DoubleProfitPlan[]>(() => StorageService.getDoubleProfitPlans());
  const [referralSignups, setReferralSignups] = useState(() => StorageService.getReferralSignups());
  const [referralSettings, setReferralSettings] = useState(() => StorageService.getReferralSettings());
  const [cryptoSlipFilter, setCryptoSlipFilter] = useState(false);
  const [cryptoSettings, setCryptoSettings] = useState(() => StorageService.getCryptoPaymentSettings());
  const [shares, setShares] = useState<ShareInvestment[]>(() => StorageService.getShares());
  const [installments, setInstallments] = useState<InstallmentRecord[]>(() => StorageService.getInstallments());
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => StorageService.getTransactions());

  const refreshAll = () => {
    setInvestors(StorageService.getAdminInvestors());
    setDepositSlips(StorageService.getDepositSlips());
    setNotices(StorageService.getNotices());
    setTickets(StorageService.getTickets());
    setDoubleProfitPlans(StorageService.getDoubleProfitPlans());
    setReferralSignups(StorageService.getReferralSignups());
    setReferralSettings(StorageService.getReferralSettings());
    setShares(StorageService.getShares());
    setInstallments(StorageService.getInstallments());
    setTransactions(StorageService.getTransactions());
  };

  // ---------------------------------------------------------------
  // DOUBLE PROFIT PLANS (storage-backed, monthly disbursement)
  // ---------------------------------------------------------------
  const [isAddDoublePlanModalOpen, setIsAddDoublePlanModalOpen] = useState(false);

  const handleDisburseInstallment = (planId: string) => {
    const res = StorageService.disburseDoubleProfitInstallment(planId);
    if (res && res.success) {
      refreshAll();
      showToast(res.message);
    } else {
      showToast(res?.message || 'Failed to disburse installment.');
    }
  };

  const handleDeleteDoublePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this Double Profit Plan?')) {
      StorageService.deleteDoubleProfitPlan(planId);
      refreshAll();
      showToast('Double Profit Plan deleted successfully.');
    }
  };

  const handleCreateDoublePlan = (plan: Partial<DoubleProfitPlan>) => {
    StorageService.createDoubleProfitPlan(plan);
    refreshAll();
    showToast('New 12-Month Double Profit Plan enrolled successfully!');
    setIsAddDoublePlanModalOpen(false);
  };

  // ---------------------------------------------------------------
  // DEPOSIT SLIPS APPROVAL QUEUE (storage-backed)
  // ---------------------------------------------------------------
  const [isAddSlipModalOpen, setIsAddSlipModalOpen] = useState(false);
  const [slipFilterStatus, setSlipFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleApproveSlip = (slip: AdminDepositSlip) => {
    const ok = StorageService.approveDepositSlip(slip.id);
    if (ok) {
      refreshAll();
      showToast(`Deposit Slip #${slip.slipNo} approved. Installment paid & Money Receipt generated.`);
    } else {
      showToast('Could not approve this slip.');
    }
  };

  const handleRejectSlip = (slip: AdminDepositSlip) => {
    const reason = window.prompt('Reason for rejection (will be recorded in audit log):', 'Invalid voucher / mismatch');
    if (reason === null) return;
    const ok = StorageService.rejectDepositSlip(slip.id, reason);
    if (ok) {
      refreshAll();
      showToast(`Deposit Slip #${slip.slipNo} rejected.`);
    }
  };

  const handleAddManualSlip = (slipData: any) => {
    const created = StorageService.createDepositSlip(slipData);
    StorageService.approveDepositSlip(created.id);
    refreshAll();
    showToast(`Manual deposit of ৳${created.amount.toLocaleString()} recorded, credited & receipt generated!`);
    setIsAddSlipModalOpen(false);
  };

  const handleDeleteSlip = (id: string, slipNo: string) => {
    if (!window.confirm(`Delete deposit slip #${slipNo}?`)) return;
    StorageService.deleteDepositSlip(id);
    refreshAll();
    showToast(`Deposit Slip #${slipNo} removed.`);
  };

  // ---------------------------------------------------------------
  // REFERRAL COMMISSION MATRIX (admin-configurable)
  // ---------------------------------------------------------------
  const handleReferralGenerationCount = (delta: number) => {
    const next = Math.max(1, Math.min(10, referralSettings.generations + delta));
    const rates = Array.from(
      { length: next },
      (_, i) => referralSettings.rates[i] ?? (i === 0 ? 10 : 5)
    );
    setReferralSettings({ generations: next, rates });
  };

  const handleRemoveGeneration = (index: number) => {
    if (referralSettings.generations <= 1) return;
    const rates = referralSettings.rates.filter((_, i) => i !== index);
    setReferralSettings({ generations: rates.length, rates });
  };

  const handleReferralRateChange = (index: number, value: number) => {
    const rates = [...referralSettings.rates];
    rates[index] = Math.max(0, Math.min(100, Number(value) || 0));
    setReferralSettings({ ...referralSettings, rates });
  };

  const [referralTouched, setReferralTouched] = useState(false);
  const referralRateErrors = referralSettings.rates.map(r =>
    Number.isFinite(r) && r >= 0 && r <= 100 ? null : 'Each rate must be between 0% and 100%.'
  );
  const referralErrorCount = referralRateErrors.filter(Boolean).length;

  const handleSaveReferralSettings = () => {
    setReferralTouched(true);
    if (referralErrorCount > 0) return;
    const saved = StorageService.updateReferralSettings(referralSettings);
    setReferralSettings(saved);
    refreshAll();
    showToast(
      `Commission matrix saved — ${saved.generations} generation(s): ${saved.rates.map(r => `${r}%`).join(' / ')}.`
    );
  };

  const handleRecalcReferralNetwork = () => {
    if (!window.confirm('Re-apply the active commission matrix to every referral signup in the network?')) return;
    const res = StorageService.recalcReferralCommissions();
    refreshAll();
    showToast(`Network recomputed — ${res.processed} signup(s) updated with the active matrix.`);
  };

  // ---------------------------------------------------------------
  // CRYPTO (USDT / TRC20) PAYMENT SETTINGS (admin-controlled)
  // ---------------------------------------------------------------
  const [cryptoTouched, setCryptoTouched] = useState(false);
  const cryptoIsTron = /TRC20|Tron/i.test(cryptoSettings.network);
  const cryptoWalletError = !cryptoSettings.walletAddress.trim()
    ? 'A USDT wallet address is required before investors can pay.'
    : !cryptoIsTron ? null : (isTronAddress(cryptoSettings.walletAddress)
        ? null
        : 'Enter a valid Tron (TRC20) address — it must start with “T” and be 34 characters long.');
  const cryptoRateError = cryptoSettings.bdtPerUsdt > 0
    ? null
    : 'Conversion rate must be greater than 0 ৳ per USDT.';
  const cryptoErrorCount = [cryptoWalletError, cryptoRateError].filter(Boolean).length;

  const handleSaveCryptoSettings = () => {
    setCryptoTouched(true);
    if (cryptoWalletError || cryptoRateError) return;
    const saved = StorageService.updateCryptoPaymentSettings(cryptoSettings);
    setCryptoSettings(saved);
    refreshAll();
    showToast(`Crypto payments ${saved.enabled ? 'enabled' : 'disabled'} — network ${saved.network}.`);
  };

  // ---------------------------------------------------------------
  // INVESTOR CRM (storage-backed)
  // ---------------------------------------------------------------
  const [isAddInvestorModalOpen, setIsAddInvestorModalOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<AdminInvestor | null>(null);
  const [selectedInvestorForModal, setSelectedInvestorForModal] = useState<AdminInvestor | null>(null);
  const [investorSearchQuery, setInvestorSearchQuery] = useState('');
  const [investorFilterStatus, setInvestorFilterStatus] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');

  const handleAddInvestor = (newInv: Omit<AdminInvestor, 'id'>) => {
    const inv = StorageService.createAdminInvestor(newInv);
    refreshAll();
    showToast(`Investor @${inv.username} (${inv.fullName}) registered in CRM!`);
    setIsAddInvestorModalOpen(false);
  };

  const handleUpdateInvestor = (updated: AdminInvestor) => {
    StorageService.updateAdminInvestor(updated.id, updated);
    refreshAll();
    setEditingInvestor(null);
    showToast(`Investor profile for ${updated.fullName} updated successfully!`);
  };

  const handleDeleteInvestor = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete/deactivate investor ${name}?`)) {
      StorageService.deleteAdminInvestor(id);
      refreshAll();
      showToast(`Investor ${name} has been removed from active CRM.`);
    }
  };

  const handleApproveKYC = (investorId: string) => {
    StorageService.updateAdminInvestor(investorId, { kycStatus: 'verified' });
    refreshAll();
    showToast('Investor KYC approved & verified!');
  };

  const handleToggleSuspend = (inv: AdminInvestor) => {
    const newStatus = inv.status === 'active' ? 'suspended' : 'active';
    StorageService.updateAdminInvestor(inv.id, { status: newStatus });
    refreshAll();
    showToast(newStatus === 'suspended' ? `@${inv.username} account suspended.` : `@${inv.username} account re-activated.`);
  };

  // ---------------------------------------------------------------
  // NOTICES CMS (storage-backed)
  // ---------------------------------------------------------------
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('Share Allotment');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'high' | 'normal' | 'urgent'>('normal');
  const [noticeTouched, setNoticeTouched] = useState<Record<string, boolean>>({});
  const [noticeAttempt, setNoticeAttempt] = useState(false);
  const noticeFormRef = useRef<HTMLFormElement>(null);

  const noticeRules: RuleSet = {
    newNoticeTitle: compose(required('Notice title'), minLength('Notice title', 5)),
    newNoticeContent: compose(required('Notice details'), minLength('Notice details', 10))
  };
  const noticeValues = { newNoticeTitle, newNoticeContent };
  const noticeResult = useMemo(() => runRules(noticeValues, noticeRules), [newNoticeTitle, newNoticeContent]);
  const showNoticeError = (f: string): string | null =>
    noticeTouched[f] || noticeAttempt ? (noticeResult.errors[f] || null) : null;
  const markNotice = (f: string) => setNoticeTouched(prev => ({ ...prev, [f]: true }));

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeAttempt(true);
    if (!noticeResult.isValid) {
      focusFirstInvalid(noticeFormRef.current);
      return;
    }
    StorageService.createNotice({
      title: newNoticeTitle,
      category: newNoticeCategory,
      content: newNoticeContent,
      priority: newNoticePriority,
      status: 'published'
    });
    refreshAll();
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticePriority('normal');
    setNoticeAttempt(false);
    setNoticeTouched({});
    showToast('Official notice published to Notice Board successfully!');
  };

  const handleDeleteNotice = (id: string) => {
    StorageService.deleteNotice(id);
    refreshAll();
    showToast('Notice deleted successfully.');
  };

  // ---------------------------------------------------------------
  // SUPPORT TICKETS (storage-backed)
  // ---------------------------------------------------------------
  const [selectedTicketForReply, setSelectedTicketForReply] = useState<SupportTicket | null>(null);
  const [ticketFilterStatus, setTicketFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  const handleReplyTicket = (ticketId: string, replyText: string) => {
    const updated = StorageService.replyTicket(ticketId, replyText, 'support', `${currentUser.fullName} (Support Admin)`);
    if (updated) {
      refreshAll();
      setSelectedTicketForReply(null);
      showToast('Support reply sent and ticket updated!');
    }
  };

  const handleToggleTicketStatus = (ticket: SupportTicket) => {
    const newStatus = ticket.status === 'resolved' ? 'open' : 'resolved';
    StorageService.updateTicketStatus(ticket.id, newStatus);
    refreshAll();
    showToast(`Ticket status updated to ${newStatus.toUpperCase()}`);
  };

  const handleDeleteTicket = (ticketId: string) => {
    StorageService.deleteTicket(ticketId);
    refreshAll();
    showToast('Support ticket deleted.');
  };

  // ---------------------------------------------------------------
  // MASS DIVIDEND DISTRIBUTION ENGINE
  // Credits every active investor's dividend wallet (persisted) and
  // records the disbursement round in the history log.
  // ---------------------------------------------------------------
  const [dividendRounds, setDividendRounds] = useState<AdminDividendRound[]>([
    {
      id: 'div-sep-2026',
      monthYear: 'September 2026',
      ratePerSuite: 18500,
      ratePerDeluxe: 9500,
      totalDisbursed: 1480000,
      investorsCount: 48,
      disbursedDate: '01 October 2026',
      status: 'completed'
    },
    {
      id: 'div-aug-2026',
      monthYear: 'August 2026',
      ratePerSuite: 18500,
      ratePerDeluxe: 9500,
      totalDisbursed: 1480000,
      investorsCount: 48,
      disbursedDate: '01 September 2026',
      status: 'completed'
    }
  ]);
  const [disburseMonth, setDisburseMonth] = useState('October 2026');
  const [disburseSuiteRate, setDisburseSuiteRate] = useState(18500);
  const [isDisbursing, setIsDisbursing] = useState(false);

  const handleExecuteDividendPayout = () => {
    const eligible = investors.filter(i => i.status === 'active' && i.kycStatus === 'verified');
    if (eligible.length === 0) {
      showToast('No active verified investors eligible for dividend payout.');
      return;
    }
    setIsDisbursing(true);
    setTimeout(() => {
      eligible.forEach(inv => {
        StorageService.adjustInvestorWallet(inv.id, 'dividend', disburseSuiteRate, `Monthly dividend ${disburseMonth}`);
      });

      const totalDisbursed = disburseSuiteRate * eligible.length;
      const newRound: AdminDividendRound = {
        id: 'div-' + Date.now(),
        monthYear: disburseMonth,
        ratePerSuite: disburseSuiteRate,
        ratePerDeluxe: Math.round(disburseSuiteRate * 0.5),
        totalDisbursed,
        investorsCount: eligible.length,
        disbursedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'completed'
      };
      setDividendRounds(prev => [newRound, ...prev]);
      StorageService.addAuditLog(
        'MASS_DIVIDEND_PAYOUT',
        disburseMonth,
        `Disbursed ৳${totalDisbursed.toLocaleString()} to ${eligible.length} verified investors at ৳${disburseSuiteRate.toLocaleString()}/unit.`,
        'success'
      );
      refreshAll();
      setIsDisbursing(false);
      showToast(`Dividend payout of ৳${totalDisbursed.toLocaleString()} executed for ${disburseMonth}. All eligible investor wallets credited.`);
    }, 1000);
  };

  // ---------------------------------------------------------------
  // FILTERS & KPI CALCULATIONS (real central-ledger derived numbers)
  // ---------------------------------------------------------------
  const filteredInvestors = investors.filter(inv => {
    const matchesSearch =
      inv.fullName.toLowerCase().includes(investorSearchQuery.toLowerCase()) ||
      inv.username.toLowerCase().includes(investorSearchQuery.toLowerCase()) ||
      inv.memberId.toLowerCase().includes(investorSearchQuery.toLowerCase()) ||
      inv.phone.includes(investorSearchQuery);
    const matchesStatus =
      investorFilterStatus === 'all' ||
      (investorFilterStatus === 'verified' && inv.kycStatus === 'verified') ||
      (investorFilterStatus === 'pending' && inv.kycStatus === 'pending') ||
      (investorFilterStatus === 'suspended' && inv.status === 'suspended');
    return matchesSearch && matchesStatus;
  });

  const filteredTickets = tickets.filter(t => (ticketFilterStatus === 'all' ? true : t.status === ticketFilterStatus));
  const isCryptoSlip = (s: AdminDepositSlip) => /usdt/i.test(s.bankName) || /crypto/i.test(s.branchName);
  const filteredSlips = depositSlips.filter(
    s =>
      (cryptoSlipFilter ? isCryptoSlip(s) : true) &&
      (slipFilterStatus === 'all' ? true : s.status === slipFilterStatus)
  );
  const pendingCryptoCount = depositSlips.filter(s => s.status === 'pending' && isCryptoSlip(s)).length;

  const pendingSlipsCount = depositSlips.filter(s => s.status === 'pending').length;
  const pendingKycCount = investors.filter(i => i.kycStatus === 'pending').length;
  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  // KPI derived from the live ledger
  const totalCollections =
    installments.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0) +
    depositSlips.filter(s => s.status === 'approved').reduce((a, s) => a + s.amount, 0);
  const activeInvestorsCount = investors.filter(i => i.status === 'active').length;
  const sharesOnRecord = shares.length;
  const totalInvestedInShares = shares.reduce((a, s) => a + s.totalInvestment, 0);
  const referalPayoutsCredited = referralSignups
    .filter(r => r.payoutStatus === 'credited')
    .reduce((a, r) => a + r.commissionEarned, 0);
  const dividendsDisbursed = transactions
    .filter(t => t.category === 'dividend' && t.type === 'credit')
    .reduce((a, t) => a + t.amount, 0);

  // Per-tab summary figures feeding the "cards in rows" strips.
  const kycVerifiedCount = investors.filter(i => i.kycStatus === 'verified').length;
  const suspendedInvestorsCount = investors.filter(i => i.status === 'suspended').length;

  const activeDoublePlans = doubleProfitPlans.filter(p => p.status === 'active').length;
  const totalDoublePrincipal = doubleProfitPlans.reduce((a, p) => a + (p.principalAmount || 0), 0);
  const totalDoublePayout = doubleProfitPlans.reduce((a, p) => a + (p.totalPaidOut || 0), 0);

  const paidInstallmentsCount = installments.filter(i => i.status === 'paid').length;
  const dueInstallmentsCount = installments.filter(i => i.status === 'due').length;
  const approvedSlipsCount = depositSlips.filter(s => s.status === 'approved').length;

  const creditedReferralCount = referralSignups.filter(r => r.payoutStatus === 'credited').length;
  const availableReferralCount = referralSignups.filter(r => r.payoutStatus === 'available').length;
  const referralNetworkVolume = referralSignups.reduce((a, r) => a + (r.investmentValue || 0), 0);

  const publishedNoticeCount = notices.filter(n => n.status === 'published').length;
  const urgentNoticeCount = notices.filter(n => n.priority === 'urgent').length;

  const resolvedTicketCount = tickets.filter(t => t.status === 'resolved').length;
  const openTicketCount = tickets.filter(t => t.status === 'open').length;

  const navItems: { id: AdminTab; label: string; icon: any; badge: number | null }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'investors', label: 'Investors & KYC', icon: Users, badge: pendingKycCount > 0 ? pendingKycCount : null },
    { id: 'double_profit', label: 'Double Profit', icon: Sparkles, badge: null },
    { id: 'shares', label: 'Shares & Dividends', icon: Hotel, badge: null },
    { id: 'accounts', label: 'Deposits & Installments', icon: CreditCard, badge: pendingSlipsCount > 0 ? pendingSlipsCount : null },
    { id: 'referrals', label: 'Referrals & Network', icon: Network, badge: null },
    { id: 'notices', label: 'Notice Board', icon: Bell, badge: null },
    { id: 'support', label: 'Support Desk', icon: HelpCircle, badge: openTicketsCount > 0 ? openTicketsCount : null },
    { id: 'cms', label: 'Homepage CMS', icon: LayoutTemplate, badge: null }
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      verified: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      approved: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      confirmed: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      completed: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      published: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      resolved: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      active: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      due: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      in_progress: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      rejected: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      suspended: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      upcoming: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    };
    return map[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs';
  const inputCls =
    'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500';
  const tableHead =
    'bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold';

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-16">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Control Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/questa-logo.jpeg"
              alt="Questa World logo"
              className="w-10 h-10 rounded-xl object-cover shadow-xs bg-white ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white truncate">
                  Questa <span className="text-amber-600 dark:text-amber-500">World</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 shrink-0">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                Investor Operations Control Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Secure Session
            </span>

            {/* Profile Name → Menu (top actions consolidated here) */}
            <div className="relative">
              <button
                onClick={() => setAdminMenuOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={adminMenuOpen}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 bg-white dark:bg-slate-800 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
                />
                <div className="hidden sm:block min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight truncate max-w-[140px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono block">
                    {currentUser.memberId} · Super Admin
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {adminMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAdminMenuOpen(false)} />
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                        @{currentUser.username} · Administrator
                      </p>
                    </div>

                    <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                      Navigation
                    </div>
                    <div className="py-1 max-h-[55vh] overflow-y-auto">
                      {navItems.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            role="menuitem"
                            onClick={() => { setActiveTab(tab.id); setAdminMenuOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs transition-colors text-left ${
                              isActive
                                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                            <span className="flex-1 truncate">{tab.label}</span>
                            {tab.badge != null && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300/50 dark:border-amber-700/50">
                                {tab.badge}
                              </span>
                            )}
                            {isActive && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="py-1 border-t border-slate-100 dark:border-slate-700">
                      <button
                        role="menuitem"
                        onClick={() => { setAdminMenuOpen(false); onSwitchToUserPortal(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                      >
                        <UserCog className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Investor Portal</span>
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => { setAdminMenuOpen(false); onSwitchToPublic(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                      >
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Public Website</span>
                      </button>
                    </div>

                    <button
                      role="menuitem"
                      onClick={() => { setAdminMenuOpen(false); onLogout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left border-t border-slate-100 dark:border-slate-700"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 text-xs">
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW                                              */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Action Alert Bar */}
            {(pendingSlipsCount > 0 || pendingKycCount > 0) && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Immediate Action Required:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {pendingSlipsCount > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold">
                        {pendingSlipsCount} Pending Bank Slips
                      </span>
                    )}
                    {pendingKycCount > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
                        {pendingKycCount} KYC Pending
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('accounts')}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
                >
                  Review Now &rarr;
                </button>
              </div>
            )}

            {/* KPI Grid — all figures derived from the live central ledger */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className={`p-4 ${card}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Collections</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block mt-1">
                  {formatBDT(totalCollections, language)}
                </span>
                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> Paid installments + approved slips
                </span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Active Investors</span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono block mt-1">
                  {activeInvestorsCount} / {investors.length}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {pendingKycCount} KYC pending verification
                </span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Shares on Record</span>
                <span className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono block mt-1">
                  {sharesOnRecord}
                </span>
                <span className="text-[10px] text-amber-600/80 dark:text-amber-300 mt-1 block">
                  {formatBDT(totalInvestedInShares, language)} invested
                </span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Referral Payouts</span>
                <span className="text-lg sm:text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono block mt-1">
                  {formatBDT(referalPayoutsCredited, language)}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {referralSignups.length} referral signups on record
                </span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Dividends Disbursed</span>
                <span className="text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono block mt-1">
                  {formatBDT(dividendsDisbursed, language)}
                </span>
                <span className="text-[10px] text-indigo-600/80 dark:text-indigo-300 mt-1 block">
                  Credits posted to member ledgers
                </span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Pending Approvals</span>
                <span className="text-lg sm:text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono block mt-1">
                  {pendingSlipsCount + pendingKycCount}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Slips · KYC awaiting review
                </span>
              </div>
            </div>

            {/* Quick Control Center Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Pending Deposit Slip Approval Queue */}
              <div className={`lg:col-span-2 p-5 ${card} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Pending Bank Slips Approval Queue
                  </h3>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                    {pendingSlipsCount} Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {depositSlips.filter(s => s.status === 'pending').map(slip => (
                    <div
                      key={slip.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 dark:text-white text-sm">{slip.memberName}</strong>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">@{slip.memberUsername}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            {slip.slipNo}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                          {slip.projectName} · {slip.bankName} ({slip.branchName})
                        </p>
                        <div className="flex items-center gap-3 text-[11px] font-mono">
                          <span className="text-slate-600 dark:text-slate-300">TxID: {slip.transactionId}</span>
                          <span className="text-slate-500 dark:text-slate-400">Submitted: {slip.submittedAt}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                        <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                          {formatBDT(slip.amount, language)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRejectSlip(slip)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 font-semibold transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveSlip(slip)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {depositSlips.filter(s => s.status === 'pending').length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      All deposit slips have been verified and processed!
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Operations Launcher */}
              <div className={`p-5 ${card} space-y-4`}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Quick Operations
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white">Monthly Dividend Distribution</strong>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Ready</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Credit ৳{disburseSuiteRate.toLocaleString()}/unit to all verified investors for {disburseMonth}.
                    </p>
                    <button
                      onClick={() => setActiveTab('shares')}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Open Distribution Engine</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white">Investor CRM &amp; KYC</strong>
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                        {pendingKycCount} KYC Pending
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Approve KYC documents, manage wallets and account status.
                    </p>
                    <button
                      onClick={() => setActiveTab('investors')}
                      className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Open Investor CRM</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white">Notice Board</strong>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                        {notices.length} Published
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Publish circulars visible to investors and website visitors.
                    </p>
                    <button
                      onClick={() => setActiveTab('notices')}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Manage Notices</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Member Payments & Receipts */}
            <div className={`p-5 ${card} space-y-3`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Recent Member Payments &amp; Receipts
                </h3>
                <button
                  onClick={() => setActiveTab('accounts')}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Deposits</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {depositSlips.slice(0, 3).map(slip => (
                  <div
                    key={slip.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-white truncate">{slip.memberName}</strong>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">{slip.slipNo}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 truncate">
                        {slip.bankName} · {slip.depositDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatBDT(slip.amount, language)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(slip.status)}`}>
                        {slip.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
                {depositSlips.length === 0 && (
                  <div className="p-6 text-center text-slate-500 text-xs">No member payments recorded yet.</div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: INVESTOR & CRM (KYC, WALLETS, RANKS)                  */}
        {/* ============================================================ */}
        {activeTab === 'investors' && (
          <div className="space-y-4">

            <StatCards
              items={[
                { label: 'Total Investors', value: String(investors.length), sub: 'Registered in CRM', tone: 'slate' },
                { label: 'KYC Verified', value: String(kycVerifiedCount), sub: 'Identity approved', tone: 'emerald' },
                { label: 'KYC Pending', value: String(pendingKycCount), sub: 'Awaiting review', tone: 'amber' },
                { label: 'Suspended', value: String(suspendedInvestorsCount), sub: 'Access restricted', tone: 'rose' }
              ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Investor CRM, KYC Verifications &amp; Wallet Management
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage member portfolios, approve KYC identity docs, adjust balances and control account status.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, member ID..."
                    value={investorSearchQuery}
                    onChange={e => setInvestorSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={investorFilterStatus}
                  onChange={e => setInvestorFilterStatus(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">KYC Verified</option>
                  <option value="pending">KYC Pending</option>
                  <option value="suspended">Suspended</option>
                </select>

                <button
                  onClick={() => setIsAddInvestorModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Investor</span>
                </button>
              </div>
            </div>

            <div className={`${card} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[860px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Investor &amp; Member ID</th>
                      <th className="p-3.5">Branch</th>
                      <th className="p-3.5">Rank</th>
                      <th className="p-3.5">KYC</th>
                      <th className="p-3.5 font-mono">Portfolio</th>
                      <th className="p-3.5 font-mono">Dividend Wallet</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredInvestors.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{inv.fullName}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            @{inv.username} · ID: <strong className="text-amber-600 dark:text-amber-400">{inv.memberId}</strong>
                          </div>
                          <div className="text-[10px] text-slate-400">{inv.phone}</div>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">
                          {inv.branch}
                          <span className="block text-[10px] text-slate-400 font-mono">Joined {inv.joinedDate}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            {inv.rank}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${statusBadge(inv.kycStatus)}`}>
                            {inv.kycStatus === 'verified' && <Check className="w-3 h-3" />}
                            {inv.kycStatus === 'verified' ? 'Verified' : 'Pending NID'}
                          </span>
                          {inv.status === 'suspended' && (
                            <span className="block mt-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">SUSPENDED</span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          {formatBDT(inv.totalInvested, language)}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatBDT(inv.dividendBalance, language)}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inv.kycStatus === 'pending' && (
                              <button
                                onClick={() => handleApproveKYC(inv.id)}
                                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                                title="Approve KYC"
                              >
                                Verify KYC
                              </button>
                            )}
                            {inv.status === 'active' ? (
                              <button
                                onClick={() => handleToggleSuspend(inv)}
                                className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 font-semibold text-[11px] hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center gap-1"
                                title="Suspend account"
                              >
                                <Ban className="w-3 h-3" />
                                <span className="hidden lg:inline">Suspend</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleSuspend(inv)}
                                className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-semibold text-[11px] hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                                title="Re-activate account"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span className="hidden lg:inline">Activate</span>
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedInvestorForModal(inv)}
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-[11px] transition-colors flex items-center gap-1"
                              title="Inspect profile"
                            >
                              <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span className="hidden lg:inline">Inspect</span>
                            </button>
                            <button
                              onClick={() => setEditingInvestor(inv)}
                              className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-semibold text-[11px] transition-colors flex items-center gap-1"
                              title="Edit data"
                            >
                              <Edit2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span className="hidden lg:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteInvestor(inv.id, inv.fullName)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 transition-colors"
                              title="Delete investor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredInvestors.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                          No investors match the current search/filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Investor Inspection Modal */}
            {selectedInvestorForModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedInvestorForModal.fullName} ({selectedInvestorForModal.memberId})
                      </h3>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                        @{selectedInvestorForModal.username} · {selectedInvestorForModal.rank}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedInvestorForModal(null)}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">National NID No:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedInvestorForModal.nidNo}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Phone Number:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedInvestorForModal.phone}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Authorized Nominee:</span>
                      <strong className="text-slate-900 dark:text-white">
                        {selectedInvestorForModal.nomineeName} ({selectedInvestorForModal.nomineeRelation})
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Office Branch:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedInvestorForModal.branch}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Total Invested</span>
                      <strong className="text-slate-900 dark:text-white font-mono text-sm">
                        {formatBDT(selectedInvestorForModal.totalInvested, language)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Dividend Wallet</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                        {formatBDT(selectedInvestorForModal.dividendBalance, language)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Referral Commission</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">
                        {formatBDT(selectedInvestorForModal.commissionBalance, language)}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Admin Control Actions:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => {
                          handleApproveKYC(selectedInvestorForModal.id);
                          setSelectedInvestorForModal(null);
                        }}
                        className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Confirm KYC Verified</span>
                      </button>
                      <button
                        onClick={() => {
                          StorageService.updateSecuritySettings({ transactionPin: '8842' });
                          StorageService.addAuditLog(
                            'RESET_TPIN',
                            `${selectedInvestorForModal.memberId} (@${selectedInvestorForModal.username})`,
                            'Transaction PIN reset to the default (8842) by admin.',
                            'warning'
                          );
                          showToast(`Transaction PIN reset to default (8842) for @${selectedInvestorForModal.username}`);
                          setSelectedInvestorForModal(null);
                        }}
                        className="py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold flex items-center justify-center gap-1"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Reset T-PIN</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: 12-MONTH DOUBLE PROFIT & MONTHLY DISBURSEMENT        */}
        {/* ============================================================ */}
        {activeTab === 'double_profit' && (
          <div className="space-y-6">

            <StatCards
              items={[
                { label: 'Total Plans', value: String(doubleProfitPlans.length), sub: '12-month contracts', tone: 'slate' },
                { label: 'Active Plans', value: String(activeDoublePlans), sub: 'Disbursing monthly', tone: 'emerald' },
                { label: 'Total Principal', value: formatBDT(totalDoublePrincipal, language), sub: 'Capital enrolled', tone: 'amber' },
                { label: 'Total Payout', value: formatBDT(totalDoublePayout, language), sub: 'Paid to members', tone: 'indigo' }
              ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    12-Month Double Profit &amp; Monthly Installment Disbursement
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
                    2X SCHEME
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage investor 2X capital plans and disburse monthly installments directly into member ledgers.
                </p>
              </div>

              <button
                onClick={() => setIsAddDoublePlanModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll Investor in Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 ${card}`}>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium block">Total Enrolled Plans</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  {doubleProfitPlans.length} Plans
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
                  {doubleProfitPlans.filter(p => p.status === 'active').length} Active Enrolments
                </span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium block">Total Capital Invested</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1 block">
                  {formatBDT(doubleProfitPlans.reduce((acc, p) => acc + p.principalAmount, 0), language)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">100% Principal Collateral</span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium block">Total 2X Target Return</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  {formatBDT(doubleProfitPlans.reduce((acc, p) => acc + p.totalReturnAmount, 0), language)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Disbursed in 12 Equal Installments</span>
              </div>

              <div className={`p-4 ${card}`}>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium block">Monthly Installment Outflow</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
                  {formatBDT(
                    doubleProfitPlans.filter(p => p.status === 'active').reduce((acc, p) => acc + p.monthlyInstallmentAmount, 0),
                    language
                  )}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Disbursed per Month</span>
              </div>
            </div>

            <div className={`${card} overflow-hidden`}>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Active Portfolios &amp; Monthly Installment Ledger</h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Total Disbursed to Date: {formatBDT(doubleProfitPlans.reduce((acc, p) => acc + p.totalPaidOut, 0), language)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[900px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Investor Member</th>
                      <th className="p-3.5">Package &amp; Capital</th>
                      <th className="p-3.5">12-Mo Total Return</th>
                      <th className="p-3.5">Monthly Installment</th>
                      <th className="p-3.5">Progress</th>
                      <th className="p-3.5">Next Payout</th>
                      <th className="p-3.5">Deed &amp; PDC Cheques</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {doubleProfitPlans.map(plan => {
                      const isCompleted = plan.status === 'completed' || plan.remainingInstallments <= 0;
                      const progressPct = Math.round((plan.paidInstallments / plan.totalMonths) * 100);

                      return (
                        <tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <strong className="text-slate-900 dark:text-white block font-sans text-xs">{plan.memberName}</strong>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px]">{plan.memberId}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-slate-700 dark:text-slate-200 font-sans block text-xs">{plan.packageName}</span>
                            <strong className="text-amber-600 dark:text-amber-400 text-xs">Capital: {formatBDT(plan.principalAmount, language)}</strong>
                          </td>
                          <td className="p-3.5">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm block">
                              {formatBDT(plan.totalReturnAmount, language)}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">200% Payout</span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-amber-600 dark:text-amber-300 font-bold text-xs block">
                              {formatBDT(plan.monthlyInstallmentAmount, language)}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">/ month</span>
                          </td>
                          <td className="p-3.5 min-w-36">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-slate-600 dark:text-slate-300 font-sans">{plan.paidInstallments}/12 Paid</span>
                              <span className="text-emerald-600 dark:text-emerald-400">{progressPct}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="text-slate-600 dark:text-slate-300 text-xs">{plan.nextPayoutDate}</span>
                            <span className={`block text-[10px] font-sans font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                              {isCompleted ? 'Completed' : 'Active'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 block">{plan.agreementDeedNo}</span>
                            <span className="text-[10px] text-amber-600/90 dark:text-amber-400/90 font-mono">
                              {plan.pdcCheckNumbers.length} PDC Cheques Backed
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isCompleted && (
                                <button
                                  onClick={() => handleDisburseInstallment(plan.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1"
                                  title="Disburse next monthly installment"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Disburse #{plan.paidInstallments + 1}</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteDoublePlan(plan.id)}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 transition-colors"
                                title="Delete plan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {doubleProfitPlans.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                          No double profit plans enrolled yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: SHARES & MASS DIVIDEND DISTRIBUTION ENGINE            */}
        {/* ============================================================ */}
        {activeTab === 'shares' && (
          <div className="space-y-6">

            <StatCards
              items={[
                { label: 'Shares on Record', value: String(sharesOnRecord), sub: 'Certificates issued', tone: 'amber' },
                { label: 'Capital Invested', value: formatBDT(totalInvestedInShares, language), sub: 'Across all shares', tone: 'emerald' },
                { label: 'Dividends Disbursed', value: formatBDT(dividendsDisbursed, language), sub: 'Credited to wallets', tone: 'indigo' },
                { label: 'Capital Paid', value: formatBDT(shares.reduce((a, s) => a + (s.paidAmount || 0), 0), language), sub: 'Received to date', tone: 'slate' }
              ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Hotel Shares &amp; Dividend Distribution Engine
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Declare monthly profit rates and disburse returns directly into all verified investors' dividend wallets.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/40 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                    MONTHLY PROFIT DISTRIBUTION ENGINE
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Mass Disbursement — {disburseMonth}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-300">
                  {investors.filter(i => i.status === 'active' && i.kycStatus === 'verified').length} Eligible Investors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Disbursement Month
                  </label>
                  <input
                    type="text"
                    value={disburseMonth}
                    onChange={e => setDisburseMonth(e.target.value)}
                    className={`${inputCls} font-mono`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Rate per Suite Share (BDT)
                  </label>
                  <input
                    type="number"
                    value={disburseSuiteRate}
                    onChange={e => setDisburseSuiteRate(Number(e.target.value))}
                    className={`${inputCls} font-mono`}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={handleExecuteDividendPayout}
                    disabled={isDisbursing}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{isDisbursing ? 'Disbursing...' : `Disburse ${formatBDT(disburseSuiteRate * Math.max(investors.filter(i => i.status === 'active' && i.kycStatus === 'verified').length, 0), language)} Now`}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Share Holdings on Record */}
            <div className={`${card} overflow-hidden`}>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Share Holdings on Record</h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{shares.length} active shares</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[720px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Project</th>
                      <th className="p-3.5">Units</th>
                      <th className="p-3.5 font-mono">Total Investment</th>
                      <th className="p-3.5 font-mono">Paid</th>
                      <th className="p-3.5 font-mono">Monthly Dividend</th>
                      <th className="p-3.5 font-mono">Total Earned</th>
                      <th className="p-3.5">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {shares.map(share => (
                      <tr key={share.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-medium text-slate-900 dark:text-white">{share.projectName}</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{share.shareUnits}</td>
                        <td className="p-3.5 font-mono text-slate-900 dark:text-white">{formatBDT(share.totalInvestment, language)}</td>
                        <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400">{formatBDT(share.paidAmount, language)}</td>
                        <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400">+{formatBDT(share.monthlyDividendAmount, language)}</td>
                        <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400">{formatBDT(share.totalDividendsEarned, language)}</td>
                        <td className="p-3.5 font-mono text-amber-600 dark:text-amber-400 font-bold">{share.annualRoiPercentage}%</td>
                      </tr>
                    ))}
                    {shares.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                          No share holdings on record.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dividend Disbursement History */}
            <div className={`${card} overflow-hidden`}>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Historical Dividend Disbursement Rounds</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[720px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Month</th>
                      <th className="p-3.5 font-mono">Rate / Suite</th>
                      <th className="p-3.5">Investors Benefited</th>
                      <th className="p-3.5 font-mono">Total Disbursed</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dividendRounds.map(round => (
                      <tr key={round.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white text-sm">{round.monthYear}</td>
                        <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {formatBDT(round.ratePerSuite, language)}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{round.investorsCount} Investors</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          {formatBDT(round.totalDisbursed, language)}
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{round.disbursedDate}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(round.status)}`}>
                            {round.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: DEPOSITS & INSTALLMENTS APPROVAL                      */}
        {/* ============================================================ */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">

            <StatCards
              items={[
                { label: 'Total Collections', value: formatBDT(totalCollections, language), sub: 'Paid + approved slips', tone: 'emerald' },
                { label: 'Pending Slips', value: String(pendingSlipsCount), sub: 'Awaiting approval', tone: 'amber' },
                { label: 'Paid Installments', value: String(paidInstallmentsCount), sub: 'Settled payments', tone: 'blue' },
                { label: 'Due Installments', value: String(dueInstallmentsCount), sub: 'Requires follow-up', tone: 'rose' }
              ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Bank Deposit Slips &amp; Installment Approvals
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review member deposit slips and pay orders to issue official Money Receipts (MR).
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={slipFilterStatus}
                  onChange={e => setSlipFilterStatus(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => setCryptoSlipFilter(v => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                    cryptoSlipFilter
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Crypto / USDT{pendingCryptoCount > 0 ? ` · ${pendingCryptoCount}` : ''}
                </button>
                <button
                  onClick={() => setIsAddSlipModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Manual Deposit</span>
                </button>
              </div>
            </div>

            {/* Admin-controlled crypto (USDT / TRC20) payment settings */}
            <div className={`p-5 ${card} space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Crypto Payments — USDT / TRC20 (Manual)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Enable crypto checkout for investors and set the wallet address they must pay to. Every crypto deposit is verified manually here.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accept Crypto</span>
                  <button
                    type="button"
                    onClick={() => setCryptoSettings(s => ({ ...s, enabled: !s.enabled }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      cryptoSettings.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        cryptoSettings.enabled ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Network</label>
                  <select
                    value={cryptoSettings.network}
                    onChange={e => setCryptoSettings(s => ({ ...s, network: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="TRC20 (Tron)">TRC20 (Tron)</option>
                    <option value="ERC20 (Ethereum)">ERC20 (Ethereum)</option>
                    <option value="BEP20 (BSC)">BEP20 (BSC)</option>
                    <option value="TRC20 / ERC20">TRC20 / ERC20</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">USDT Wallet Address (set manually)</label>
                  <input
                    type="text"
                    value={cryptoSettings.walletAddress}
                    onChange={e => setCryptoSettings(s => ({ ...s, walletAddress: e.target.value }))}
                    onBlur={() => setCryptoTouched(true)}
                    placeholder="e.g. TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
                    aria-invalid={cryptoTouched && !!cryptoWalletError}
                    className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                      cryptoTouched && cryptoWalletError
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-amber-500/30'
                    }`}
                  />
                  <FieldError message={cryptoTouched ? cryptoWalletError : null} />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Conversion Rate (৳ per 1 USDT)</label>
                  <input
                    type="number"
                    min={1}
                    value={cryptoSettings.bdtPerUsdt}
                    onChange={e => setCryptoSettings(s => ({ ...s, bdtPerUsdt: Number(e.target.value) }))}
                    onBlur={() => setCryptoTouched(true)}
                    aria-invalid={cryptoTouched && !!cryptoRateError}
                    className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                      cryptoTouched && cryptoRateError
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-amber-500/30'
                    }`}
                  />
                  <FieldError message={cryptoTouched ? cryptoRateError : null} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Payment Instructions (shown to investors)</label>
                  <input
                    type="text"
                    value={cryptoSettings.instructions}
                    onChange={e => setCryptoSettings(s => ({ ...s, instructions: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Status: {cryptoSettings.enabled ? (
                    <strong className="text-emerald-600 dark:text-emerald-400">Enabled</strong>
                  ) : (
                    <strong className="text-rose-600 dark:text-rose-400">Disabled</strong>
                  )} · A crypto payment will appear in the queue below as <strong>pending</strong> until you approve it.
                </span>
                <button
                  onClick={handleSaveCryptoSettings}
                  aria-disabled={cryptoTouched && cryptoErrorCount > 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
                    cryptoTouched && cryptoErrorCount > 0
                      ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {cryptoTouched && cryptoErrorCount > 0
                    ? `Fix ${cryptoErrorCount} field${cryptoErrorCount > 1 ? 's' : ''} to save`
                    : 'Save Crypto Settings'}
                </button>
              </div>
              {cryptoTouched && cryptoErrorCount > 0 && (
                <ValidationSummary messages={[cryptoWalletError, cryptoRateError].filter(Boolean) as string[]} />
              )}
            </div>

            <div className={`${card} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[860px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Slip # &amp; Booking</th>
                      <th className="p-3.5">Investor</th>
                      <th className="p-3.5">Bank &amp; Branch</th>
                      <th className="p-3.5">TxID / Ref</th>
                      <th className="p-3.5 font-mono">Amount</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredSlips.map(slip => (
                      <tr key={slip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <strong className="text-slate-900 dark:text-white text-sm">{slip.slipNo}</strong>
                          <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-mono">{slip.bookingId}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 dark:text-white">{slip.memberName}</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">@{slip.memberUsername}</span>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">
                          {slip.bankName}
                          <span className="block text-[10px] text-slate-400">{slip.branchName}</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">
                          {slip.transactionId}
                          <span className="block text-[10px] text-slate-400">{slip.depositDate}</span>
                        </td>
                        <td className="p-3.5 font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatBDT(slip.amount, language)}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(slip.status)}`}>
                            {slip.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {slip.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleRejectSlip(slip)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 font-semibold text-[11px] hover:bg-rose-100 dark:hover:bg-rose-500/30 transition-colors"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleApproveSlip(slip)}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                                >
                                  Approve
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-slate-500">Processed</span>
                            )}
                            <button
                              onClick={() => handleDeleteSlip(slip.id, slip.slipNo)}
                              className="p-1 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              title="Delete slip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSlips.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                          No deposit slips found in this category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: REFERRALS & NETWORK                                   */}
        {/* ============================================================ */}
        {activeTab === 'referrals' && (
          <div className="space-y-6">

            <StatCards
              items={[
                { label: 'Referral Signups', value: String(referralSignups.length), sub: 'Across all generations', tone: 'slate' },
                { label: 'Credited', value: String(creditedReferralCount), sub: 'Commission paid out', tone: 'emerald' },
                { label: 'Available', value: String(availableReferralCount), sub: 'Ready to claim', tone: 'amber' },
                { label: 'Network Volume', value: formatBDT(referralNetworkVolume, language), sub: 'Referred turnover', tone: 'purple' }
              ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Referral Network &amp; Commission Tracker
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Multi-generation referral commission matrix and live signups shown in the investor network.
                </p>
              </div>
            </div>

            {/* Commission Config Matrix (editable, admin-controlled) */}
            <div className={`p-5 ${card} space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Active Multi-Generation Commission Matrix
                </h3>
                <button
                  onClick={() => handleReferralGenerationCount(1)}
                  disabled={referralSettings.generations >= 10}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Generation
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                {Array.from({ length: referralSettings.generations }, (_, i) => i).map(idx => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        Gen {idx + 1}{idx === 0 ? ' (Direct)' : ''}
                      </span>
                      {referralSettings.generations > 1 && (
                        <button
                          onClick={() => handleRemoveGeneration(idx)}
                          title="Remove generation"
                          className="p-0.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={referralSettings.rates[idx] ?? 0}
                        onChange={e => handleReferralRateChange(idx, Number(e.target.value))}
                        onBlur={() => setReferralTouched(true)}
                        aria-invalid={referralTouched && !!referralRateErrors[idx]}
                        className={`w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-center focus:outline-none focus:ring-2 ${
                          referralTouched && referralRateErrors[idx]
                            ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                            : 'border-slate-300 dark:border-slate-600 focus:ring-amber-500/30'
                        }`}
                      />
                      <span className="text-sm font-bold text-slate-500">%</span>
                    </div>
                    <FieldError message={referralTouched ? referralRateErrors[idx] : null} />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-lg">
                  Add or remove generations and set any rate from 0–100%. Saving updates the investor
                  portal instantly. Use “Recalculate Network” to re-apply this matrix to existing signups.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRecalcReferralNetwork}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Recalculate Network
                  </button>
                  <button
                    onClick={handleSaveReferralSettings}
                    aria-disabled={referralTouched && referralErrorCount > 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      referralTouched && referralErrorCount > 0
                        ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {referralTouched && referralErrorCount > 0
                      ? `Fix ${referralErrorCount} rate${referralErrorCount > 1 ? 's' : ''}`
                      : 'Save Commission Matrix'}
                  </button>
                </div>
              </div>
              {referralTouched && referralErrorCount > 0 && (
                <ValidationSummary messages={referralRateErrors.filter(Boolean) as string[]} />
              )}
            </div>

            {/* Referral Signups (live data) */}
            <div className={`${card} overflow-hidden`}>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Recent Referral Signups &amp; Commission Status</h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{referralSignups.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[860px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Member</th>
                      <th className="p-3.5">Sponsor</th>
                      <th className="p-3.5">Asset Booked</th>
                      <th className="p-3.5 font-mono">Investment</th>
                      <th className="p-3.5 font-mono">Commission</th>
                      <th className="p-3.5 text-center">KYC</th>
                      <th className="p-3.5 text-center">Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {referralSignups.map(ref => (
                      <tr key={ref.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <strong className="text-slate-900 dark:text-white text-sm">{ref.name}</strong>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            @{ref.username} · Gen {ref.generation}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{ref.sponsorName}</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{ref.assetBooked}</td>
                        <td className="p-3.5 font-mono text-slate-900 dark:text-white">{formatBDT(ref.investmentValue, language)}</td>
                        <td className="p-3.5 font-mono text-amber-600 dark:text-amber-400 font-bold">
                          {formatBDT(ref.commissionEarned, language)}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge(ref.kycVerified ? 'verified' : 'pending')}`}>
                            {ref.kycVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge(ref.payoutStatus === 'credited' ? 'approved' : 'pending')}`}>
                            {ref.payoutStatus.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {referralSignups.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                          No referral signups yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: NOTICE BOARD CMS                                      */}
        {/* ============================================================ */}
        {activeTab === 'notices' && (
          <div className="space-y-6">

            <StatCards
              items={[
                { label: 'Total Notices', value: String(notices.length), sub: 'All circulars', tone: 'slate' },
                { label: 'Published', value: String(publishedNoticeCount), sub: 'Live on portal', tone: 'emerald' },
                { label: 'Urgent', value: String(urgentNoticeCount), sub: 'High-visibility', tone: 'rose' },
                { label: 'Categories', value: String(new Set(notices.map(n => n.category)).size), sub: 'Distinct types', tone: 'amber' }
              ]}
            />

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Notice Board &amp; Official Circular CMS
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Publish notices that appear on both the public website and investor portal.
              </p>
            </div>

            <form ref={noticeFormRef} onSubmit={handleAddNotice} noValidate className={`p-5 ${card} space-y-4`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Publish New Official Circular</h3>
              {noticeAttempt && !noticeResult.isValid && (
                <ValidationSummary messages={noticeResult.messages} />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Notice Title / Heading *</label>
                  <input
                    type="text"
                    value={newNoticeTitle}
                    onChange={e => setNewNoticeTitle(e.target.value)}
                    onBlur={() => markNotice('newNoticeTitle')}
                    aria-invalid={!!showNoticeError('newNoticeTitle')}
                    placeholder="e.g. Questa Royal Bay Hotel Share & Quarterly Dividend Distribution Urgent Notice"
                    className={showNoticeError('newNoticeTitle')
                      ? 'w-full px-3 py-2 rounded-xl border border-rose-400 dark:border-rose-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30'
                      : inputCls}
                  />
                  <FieldError message={showNoticeError('newNoticeTitle')} />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newNoticeCategory}
                    onChange={e => setNewNoticeCategory(e.target.value)}
                    className={inputCls}
                  >
                    <option value="Share Allotment">Hotel &amp; Tower Share Allotment</option>
                    <option value="Dividend Distribution">Dividend Distribution</option>
                    <option value="AGM Circular">Annual General Meeting (AGM)</option>
                    <option value="Site Visit Schedule">Site Visit Schedule</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Notice Details *</label>
                  <textarea
                    rows={3}
                    value={newNoticeContent}
                    onChange={e => setNewNoticeContent(e.target.value)}
                    onBlur={() => markNotice('newNoticeContent')}
                    aria-invalid={!!showNoticeError('newNoticeContent')}
                    placeholder="Write the full circular text that will be displayed to investors and website visitors..."
                    className={showNoticeError('newNoticeContent')
                      ? 'w-full px-3 py-2 rounded-xl border border-rose-400 dark:border-rose-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30'
                      : inputCls}
                  />
                  <FieldError message={showNoticeError('newNoticeContent')} />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newNoticePriority}
                    onChange={e => setNewNoticePriority(e.target.value as any)}
                    className={inputCls}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                aria-disabled={noticeAttempt && !noticeResult.isValid}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                  noticeAttempt && !noticeResult.isValid
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {noticeAttempt && !noticeResult.isValid
                  ? `Fix ${noticeResult.messages.length} field${noticeResult.messages.length > 1 ? 's' : ''} to publish`
                  : 'Publish Notice to Portal'}
              </button>
            </form>

            <div className={`${card} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[720px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Circular Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Published Date</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notices.map(ntc => (
                      <tr key={ntc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white text-sm">
                          <div className="flex items-center gap-2">
                            {ntc.priority === 'urgent' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                                URGENT
                              </span>
                            )}
                            <span className="line-clamp-2">{ntc.title}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-amber-600 dark:text-amber-400 font-mono">{ntc.category}</td>
                        <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{ntc.date}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(ntc.status)}`}>
                            {ntc.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteNotice(ntc.id)}
                            className="p-1 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                            title="Delete notice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {notices.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                          No notices published yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: SUPPORT HELPDESK                                      */}
        {/* ============================================================ */}
        {activeTab === 'support' && (
          <div className="space-y-6">

            <StatCards
              items={[
                { label: 'Total Tickets', value: String(tickets.length), sub: 'All inquiries', tone: 'slate' },
                { label: 'Open', value: String(openTicketCount), sub: 'Awaiting first reply', tone: 'amber' },
                { label: 'In Progress', value: String(tickets.filter(t => t.status === 'in_progress').length), sub: 'Being handled', tone: 'blue' },
                { label: 'Resolved', value: String(resolvedTicketCount), sub: 'Closed successfully', tone: 'emerald' }
              ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Investor Support Desk &amp; Ticket Resolution
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage incoming inquiries, provide administrative replies, and resolve investor tickets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={ticketFilterStatus}
                  onChange={e => setTicketFilterStatus(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className={`${card} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[860px]">
                  <thead className={tableHead}>
                    <tr>
                      <th className="p-3.5">Ticket # &amp; Subject</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Latest Message</th>
                      <th className="p-3.5">Updated</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredTickets.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <strong className="text-slate-900 dark:text-white text-sm block">{t.subject}</strong>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">#{t.ticketNo}</span>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">{t.category.toUpperCase()}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            t.priority === 'high'
                              ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                              : t.priority === 'medium'
                              ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}>
                            {t.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {t.messages[t.messages.length - 1]?.text || 'No message'}
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{t.updatedAt}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(t.status)}`}>
                            {t.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedTicketForReply(t)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                            <button
                              onClick={() => handleToggleTicketStatus(t)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                                t.status === 'resolved'
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {t.status === 'resolved' ? 'Reopen' : 'Resolve'}
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(t.id)}
                              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              title="Delete ticket"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTickets.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                          No support tickets found in this category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB: HOMEPAGE CMS (sections, content, settings)              */}
        {/* ============================================================ */}
        {activeTab === 'cms' && (
          <CmsManager onToast={showToast} />
        )}

        {/* CRUD Modals */}
        <AddInvestorModal
          isOpen={isAddInvestorModalOpen}
          onClose={() => setIsAddInvestorModalOpen(false)}
          onAdd={handleAddInvestor}
        />

        <EditInvestorModal
          key={editingInvestor?.id || 'no-investor'}
          investor={editingInvestor}
          onClose={() => setEditingInvestor(null)}
          onSave={handleUpdateInvestor}
        />

        <AddManualSlipModal
          isOpen={isAddSlipModalOpen}
          onClose={() => setIsAddSlipModalOpen(false)}
          onAdd={handleAddManualSlip}
        />

        <ReplyTicketModal
          key={selectedTicketForReply?.id || 'no-ticket'}
          ticket={selectedTicketForReply}
          onClose={() => setSelectedTicketForReply(null)}
          onReply={handleReplyTicket}
        />

        <AddDoublePlanModal
          isOpen={isAddDoublePlanModalOpen}
          onClose={() => setIsAddDoublePlanModalOpen(false)}
          investors={investors}
          onAdd={handleCreateDoublePlan}
        />

      </div>
    </div>
  );
};
