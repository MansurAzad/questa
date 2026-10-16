import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Copy,
  QrCode,
  TrendingUp,
  Award,
  Search,
  Phone,
  Mail,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Download,
  Send,
  UserPlus,
  X,
  Eye,
  Gift
} from 'lucide-react';
import { Language, User, ReferralSignup } from '../../types';
import { StorageService } from '../../services/storage';
import { formatBDT } from '../../services/i18n';
import { QRCodeSVG } from 'qrcode.react';
import {
  compose,
  required,
  minLength,
  username as usernameRule,
  phone as phoneRule,
  optionalEmail,
  minAmount,
  runRules,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid } from '../ui/Validation';

interface ReferralProgramViewProps {
  user: User;
  language: Language;
  onNavigateToTree?: () => void;
}

/**
 * Returns ONLY the signups that belong to the logged-in investor's own network
 * (sponsor chain walks back to their username) and re-stamps each with its true
 * generation relative to that investor. This guarantees an investor never sees
 * another sponsor's downline data.
 */
const deriveOwnNetwork = (owner: User, all: ReferralSignup[]): ReferralSignup[] => {
  const seen = new Set<string>();
  const scoped: ReferralSignup[] = [];
  let frontier = new Set<string>([owner.username]);

  for (let gen = 1; gen <= 8 && frontier.size > 0; gen++) {
    const level = all.filter(s => frontier.has(s.sponsorUsername) && !seen.has(s.username));
    if (level.length === 0) break;
    level.forEach(s => {
      seen.add(s.username);
      scoped.push({ ...s, generation: gen });
    });
    frontier = new Set(level.map(s => s.username));
  }

  return scoped;
};

export const ReferralProgramView: React.FC<ReferralProgramViewProps> = ({
  user,
  language,
  onNavigateToTree
}) => {
  const referralCode = user.referralCode || user.memberId.replace('QW-CTG-', 'QW-') || 'QW-8842';
  const referralUrl = `https://questraworld.com/user/register?ref=${user.username}&code=${referralCode}`;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState<ReferralSignup | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);

  // Signups list state — scoped to this investor's own network only.
  const [signups, setSignups] = useState<ReferralSignup[]>(() => {
    return deriveOwnNetwork(user, StorageService.getReferralSignups());
  });

  // Active (admin-configurable) commission matrix
  const settings = StorageService.getReferralSettings();
  const maxGenInData = signups.reduce((m, s) => Math.max(m, s.generation || 1), 1);
  const generationOptions = Array.from(
    { length: Math.max(settings.generations, maxGenInData) },
    (_, i) => i + 1
  );

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [genFilter, setGenFilter] = useState<'all' | number>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // New Invite / Direct Signup Form State
  const [newInviteName, setNewInviteName] = useState('');
  const [newInviteUsername, setNewInviteUsername] = useState('');
  const [newInvitePhone, setNewInvitePhone] = useState('');
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteProject, setNewInviteProject] = useState("Questra Royal Bay Cox's Bazar (1 Suite Share)");
  const [newInviteInvestment, setNewInviteInvestment] = useState('3500000');
  const [newInviteNotes, setNewInviteNotes] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');
  const [inviteTouched, setInviteTouched] = useState<Record<string, boolean>>({});
  const [inviteAttempt, setInviteAttempt] = useState(false);
  const inviteFormRef = useRef<HTMLFormElement>(null);

  const inviteRules: RuleSet = {
    newInviteName: compose(required('Full name'), minLength('Full name', 3)),
    newInviteUsername: usernameRule('Username'),
    newInvitePhone: phoneRule('Phone number', false),
    newInviteEmail: optionalEmail('Email address'),
    newInviteInvestment: minAmount('Investment amount', 1000)
  };
  const inviteValues = { newInviteName, newInviteUsername, newInvitePhone, newInviteEmail, newInviteInvestment };
  const inviteResult = useMemo(() => runRules(inviteValues, inviteRules), [newInviteName, newInviteUsername, newInvitePhone, newInviteEmail, newInviteInvestment]);
  const showInviteError = (f: string): string | null =>
    inviteTouched[f] || inviteAttempt ? (inviteResult.errors[f] || null) : null;
  const markInvite = (f: string) => setInviteTouched(prev => ({ ...prev, [f]: true }));

  // Copy handlers
  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Social Share Helpers
  const shareText = `Invest in Questra World premium hotel & commercial projects for guaranteed capital appreciation & halal returns. Use my referral code: ${referralCode} to sign up: ${referralUrl}`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, '_blank');
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Invitation to Invest with Questra World');
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Filtered Signups
  const filteredSignups = useMemo(() => {
    return signups.filter(s => {
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.assetBooked.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchGen = genFilter === 'all' || s.generation === Number(genFilter);

      return matchSearch && matchStatus && matchGen;
    });
  }, [signups, searchQuery, statusFilter, genFilter]);

  // Network Performance Metrics
  const totalSignupsCount = signups.length;
  const verifiedActiveCount = signups.filter(s => s.status === 'active' || s.status === 'completed').length;
  const pendingCount = signups.filter(s => s.status === 'pending').length;
  const directGen1Count = signups.filter(s => s.generation === 1).length;
  const totalNetworkVolume = signups.reduce((acc, s) => acc + s.investmentValue, 0);
  const totalCommissionEarned = signups.reduce((acc, s) => acc + s.commissionEarned, 0);
  const conversionRate = totalSignupsCount > 0 ? Math.round((verifiedActiveCount / totalSignupsCount) * 100) : 0;

  // Available commission to withdraw/transfer (real value from stored signups)
  const availableBonus = signups
    .filter(s => s.payoutStatus === 'available')
    .reduce((acc, s) => acc + s.commissionEarned, 0);

  // Handler for adding a new referral signup directly
  const handleCreateInviteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteAttempt(true);
    if (!inviteResult.isValid) {
      focusFirstInvalid(inviteFormRef.current);
      return;
    }

    setInviteSubmitting(true);
    const invAmount = Number(newInviteInvestment) || 3500000;
    const rate = settings.rates[0] ?? 0;
    const commEarned = (invAmount * rate) / 100;

    const newSignupData: Omit<ReferralSignup, 'id'> = {
      name: newInviteName,
      nameBn: newInviteName,
      username: newInviteUsername.toLowerCase().trim().replace('@', ''),
      memberId: `QW-CTG-${Math.floor(9500 + Math.random() * 499)}`,
      email: newInviteEmail || `${newInviteUsername.toLowerCase()}@client.com`,
      phone: newInvitePhone || '+880 1819-000000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      sponsorUsername: user.username,
      sponsorName: user.fullName,
      generation: 1,
      signupDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      signupTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      assetBooked: newInviteProject,
      investmentValue: invAmount,
      commissionEarned: commEarned,
      commissionRate: rate,
      payoutStatus: 'available',
      rank: 'Associate Member',
      location: 'Chattogram Office',
      kycVerified: true,
      notes: newInviteNotes || 'Referred directly by user referral program portal.'
    };

    const created = StorageService.addReferralSignup(newSignupData);
    setSignups(deriveOwnNetwork(user, StorageService.getReferralSignups()));

    setInviteSubmitting(false);
    setInviteSuccessMsg(`Successfully registered ${created.name} in your network! Commission: ${formatBDT(commEarned, language)}`);

    setTimeout(() => {
      setInviteSuccessMsg('');
      setShowInviteModal(false);
      setInviteAttempt(false);
      setInviteTouched({});
      setNewInviteName('');
      setNewInviteUsername('');
      setNewInvitePhone('');
      setNewInviteEmail('');
      setNewInviteNotes('');
    }, 2000);
  };

  // Claim commission handler — credits the available balance to the investor's
  // dividend wallet, marks the qualifying signups as credited, and records a
  // ledger transaction so the claim is fully persisted.
  const handleClaimCommission = () => {
    const claimable = signups.filter(s => s.payoutStatus === 'available');
    const total = claimable.reduce((acc, s) => acc + s.commissionEarned, 0);

    if (total > 0) {
      // 1) Mark the claimed signups as credited so they can't be claimed twice.
      claimable.forEach(s => StorageService.updateReferralSignup(s.id, { payoutStatus: 'credited' }));

      // 2) Credit the investor's dividend wallet in the CRM registry.
      const investor = StorageService.getAdminInvestors().find(
        i =>
          i.username.toLowerCase() === user.username.toLowerCase() ||
          i.memberId === user.memberId
      );
      if (investor) {
        StorageService.adjustInvestorWallet(
          investor.id,
          'dividend',
          total,
          `Referral commission claim (${claimable.length} signup${claimable.length > 1 ? 's' : ''})`
        );
      }

      // 3) Record the credit in the investor ledger.
      StorageService.addTransaction({
        title: `Referral Commission Claimed (${claimable.length} signup${claimable.length > 1 ? 's' : ''})`,
        category: 'referral',
        amount: total,
        type: 'credit',
        status: 'completed',
        method: 'Referral Wallet Credit'
      });

      // 4) Refresh local state so the available balance drops to the new value.
      setSignups(StorageService.getReferralSignups());
    }

    setClaimedAmount(total);
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setShowClaimModal(false);
    }, 1800);
  };

  const handleDownloadCSV = () => {
    const headers = ['Name', 'Username', 'Member ID', 'Generation', 'Status', 'Asset', 'Investment', 'Commission', 'Payout'];
    const rows = filteredSignups.map(s => [
      s.name, s.username, s.memberId, s.generation, s.status, s.assetBooked, s.investmentValue, s.commissionEarned, s.payoutStatus
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questra_referral_network.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Referral Program & Commission Network
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
              {settings.generations} GENERATION{settings.generations > 1 ? 'S' : ''}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Earn {settings.rates[0] ?? 0}% direct commission
            {settings.generations > 1
              ? ` plus ${settings.rates.slice(1, settings.generations).map((r, i) => `${r}% on Gen ${i + 2}`).join(' & ')} generation bonuses`
              : ''}{' '}
            on every successful referral.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToTree}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            View Tree
          </button>
          <button
            onClick={() => setShowClaimModal(true)}
            disabled={availableBonus <= 0}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Gift className="w-3.5 h-3.5" />
            Claim Commission ({formatBDT(availableBonus, language)})
          </button>
        </div>
      </div>

      {/* Active Commission Structure */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Active Commission Structure
          </h3>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Set by admin · No. of generations: {settings.generations}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: settings.generations }, (_, i) => i + 1).map(gen => (
            <div
              key={gen}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center"
            >
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                Gen {gen}{gen === 1 ? ' (Direct)' : ''}
              </span>
              <strong className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {settings.rates[gen - 1] ?? 0}%
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Code & Link Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950 p-6 sm:p-8 text-white shadow-xl border border-amber-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* Left / Main: Referral Code & Details */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Share Instantly
              </span>
              <button onClick={handleShareWhatsApp} className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
                <span>WhatsApp</span>
              </button>
              <button onClick={handleShareFacebook} className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
                <span>Facebook</span>
              </button>
              <button onClick={handleShareTelegram} className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
                <span>Telegram</span>
              </button>
              <button onClick={handleShareEmail} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 border border-white/20 text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Your Unique Referral Code</span>
              <div className="flex items-center gap-3 mt-1">
                <code className="px-4 py-2.5 rounded-xl bg-white/10 border border-amber-500/30 font-mono text-2xl font-black tracking-widest text-amber-300">
                  {referralCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                >
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Your Referral Link</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  readOnly
                  value={referralUrl}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Right / Quick Earnings Summary Card */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold text-slate-300">Network Performance</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Signups</span>
                <div className="text-xl font-extrabold text-white">{totalSignupsCount}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Active</span>
                <div className="text-xl font-extrabold text-emerald-400">{verifiedActiveCount}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Turnover</span>
                <div className="text-sm font-extrabold text-amber-300">{formatBDT(totalNetworkVolume, language)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Commission</span>
                <div className="text-sm font-extrabold text-emerald-300">{formatBDT(totalCommissionEarned, language)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Successful & Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-0.5">{verifiedActiveCount}</span>
          <span className="text-[10px] text-slate-400 block">{conversionRate}% conversion</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Signups</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white block mt-0.5">{pendingCount}</span>
          <span className="text-[10px] text-slate-400 block">awaiting KYC</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Network Turnover</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white block mt-0.5">{formatBDT(totalNetworkVolume, language)}</span>
          <span className="text-[10px] text-slate-400 block">{directGen1Count} direct referrals</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Available Commission</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">{formatBDT(availableBonus, language)}</span>
          <span className="text-[10px] text-slate-400 block">ready to claim</span>
        </div>
      </div>

      {/* Controls: Search, Filter, View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, phone, member ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={genFilter}
            onChange={e => setGenFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Generations</option>
            {generationOptions.map(g => (
              <option key={g} value={g}>
                Gen {g}{g === 1 ? ' (Direct)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Cards
            </button>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Referral
          </button>
        </div>
      </div>

      {/* Signups List: Table View */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[860px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Member</th>
                  <th className="p-3.5">Gen</th>
                  <th className="p-3.5">Asset Booked</th>
                  <th className="p-3.5 font-mono">Investment</th>
                  <th className="p-3.5 font-mono">Commission</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Payout</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSignups.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={s.avatar || ''} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">@{s.username} · {s.memberId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Gen {s.generation}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">{s.assetBooked}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">{formatBDT(s.investmentValue, language)}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">+{formatBDT(s.commissionEarned, language)}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        s.status === 'completed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.payoutStatus === 'credited' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        s.payoutStatus === 'available' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {s.payoutStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setShowDossierModal(s)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSignups.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                      No referrals match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Signups List: Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSignups.map(s => (
            <div key={s.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img src={s.avatar || ''} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{s.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">@{s.username}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.assetBooked}</div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-300">{formatBDT(s.investmentValue, language)}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{formatBDT(s.commissionEarned, language)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Gen {s.generation}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>{s.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
          {filteredSignups.length === 0 && (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs">
              No referrals match the current filters.
            </div>
          )}
        </div>
      )}

      {/* Add Referral Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Referral</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccessMsg ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{inviteSuccessMsg}</p>
              </div>
            ) : (
              <form ref={inviteFormRef} onSubmit={handleCreateInviteSignup} noValidate className="space-y-3 text-xs">
                {inviteAttempt && !inviteResult.isValid && (
                  <ValidationSummary messages={inviteResult.messages} />
                )}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newInviteName}
                    onChange={e => setNewInviteName(e.target.value)}
                    onBlur={() => markInvite('newInviteName')}
                    aria-invalid={!!showInviteError('newInviteName')}
                    className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                      showInviteError('newInviteName')
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                    }`}
                  />
                  <FieldError message={showInviteError('newInviteName')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Username *</label>
                    <input
                      type="text"
                      value={newInviteUsername}
                      onChange={e => setNewInviteUsername(e.target.value)}
                      onBlur={() => markInvite('newInviteUsername')}
                      aria-invalid={!!showInviteError('newInviteUsername')}
                      className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                        showInviteError('newInviteUsername')
                          ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                      }`}
                    />
                    <FieldError message={showInviteError('newInviteUsername')} />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone</label>
                    <input
                      type="text"
                      value={newInvitePhone}
                      onChange={e => setNewInvitePhone(e.target.value)}
                      onBlur={() => markInvite('newInvitePhone')}
                      aria-invalid={!!showInviteError('newInvitePhone')}
                      className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                        showInviteError('newInvitePhone')
                          ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                      }`}
                    />
                    <FieldError message={showInviteError('newInvitePhone')} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={newInviteEmail}
                    onChange={e => setNewInviteEmail(e.target.value)}
                    onBlur={() => markInvite('newInviteEmail')}
                    aria-invalid={!!showInviteError('newInviteEmail')}
                    className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                      showInviteError('newInviteEmail')
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                    }`}
                  />
                  <FieldError message={showInviteError('newInviteEmail')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Asset Booked</label>
                    <select
                      value={newInviteProject}
                      onChange={e => setNewInviteProject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option>Questra Royal Bay Cox's Bazar (1 Suite Share)</option>
                      <option>Questra Commercial Center (Tower Floor Share)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Investment (BDT) *</label>
                    <input
                      type="number"
                      value={newInviteInvestment}
                      onChange={e => setNewInviteInvestment(e.target.value)}
                      onBlur={() => markInvite('newInviteInvestment')}
                      aria-invalid={!!showInviteError('newInviteInvestment')}
                      className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                        showInviteError('newInviteInvestment')
                          ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                      }`}
                    />
                    <FieldError message={showInviteError('newInviteInvestment')} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={newInviteNotes}
                    onChange={e => setNewInviteNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={inviteSubmitting}
                  aria-disabled={inviteAttempt && !inviteResult.isValid}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 ${
                    inviteAttempt && !inviteResult.isValid
                      ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  {inviteSubmitting
                    ? 'Registering...'
                    : inviteAttempt && !inviteResult.isValid
                    ? `Fix ${inviteResult.messages.length} field${inviteResult.messages.length > 1 ? 's' : ''} to register`
                    : 'Register Referral'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Claim Commission Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            {claimSuccess ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Commission Claimed!</h3>
                <p className="text-xs text-slate-500">{formatBDT(claimedAmount, language)} has been credited to your dividend wallet.</p>
              </>
            ) : (
              <>
                <Gift className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Claim Available Commission</h3>
                <p className="text-xs text-slate-500">Available balance: <strong>{formatBDT(availableBonus, language)}</strong></p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClaimCommission}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Confirm Claim
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xs p-6 shadow-2xl text-center space-y-4">
            <div className="inline-flex p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <QRCodeSVG value={referralUrl} size={140} level="M" />
            </div>
            <p className="text-xs text-slate-500">Scan to register with code</p>
            <code className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-lg font-black text-amber-600">{referralCode}</code>
            <p className="text-[10px] text-slate-400 font-mono break-all">{referralUrl}</p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Dossier Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Referral Dossier</h3>
              <button onClick={() => setShowDossierModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <img src={showDossierModal.avatar || ''} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{showDossierModal.name}</div>
                  <div className="text-slate-400 font-mono">@{showDossierModal.username} · {showDossierModal.memberId}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Generation</span>
                  <strong className="text-slate-900 dark:text-white">Gen {showDossierModal.generation}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Status</span>
                  <strong className="text-slate-900 dark:text-white">{showDossierModal.status}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Investment</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{formatBDT(showDossierModal.investmentValue, language)}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Commission</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{formatBDT(showDossierModal.commissionEarned, language)}</strong>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Asset Booked</span>
                <span className="text-slate-900 dark:text-white">{showDossierModal.assetBooked}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Sponsor</span>
                <span className="text-slate-900 dark:text-white">{showDossierModal.sponsorName} (@{showDossierModal.sponsorUsername})</span>
              </div>
              {showDossierModal.notes && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Notes</span>
                  <span className="text-slate-600 dark:text-slate-300">{showDossierModal.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
