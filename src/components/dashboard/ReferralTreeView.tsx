import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Network,
  Copy,
  CheckCircle2,
  Award,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  Gift,
  Calculator,
  Layers,
  Search,
  X,
  Building2,
  Sparkles
} from 'lucide-react';
import { Language, User } from '../../types';
import { formatBDT } from '../../services/i18n';
import { StorageService } from '../../services/storage';
import { compose, required, minLength, username as usernameRule, phone as phoneRule, runRules, RuleSet } from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid } from '../ui/Validation';

interface ReferralTreeViewProps {
  user: User;
  language: Language;
  onNavigateToProgram?: () => void;
}

interface DownlineMember {
  id: string;
  name: string;
  username: string;
  sponsorUsername: string;
  generation: number;
  phone: string;
  joinedDate: string;
  assetBooked: string;
  investmentValue: number;
  commissionEarned: number;
  status: 'active' | 'pending';
  rank: string;
}

/**
 * Builds the current investor's downline from the persisted referral signups
 * by walking the sponsor chain outward from the logged-in user. This keeps the
 * tree, generation counts and KPIs in sync with real (and newly added) members.
 */
const deriveDownline = (user: User): DownlineMember[] => {
  const all = StorageService.getReferralSignups();
  const result: DownlineMember[] = [];
  let frontier = new Set<string>([user.username]);

  for (let gen = 1; gen <= 8 && frontier.size > 0; gen++) {
    const level = all.filter(
      s => frontier.has(s.sponsorUsername) && !result.some(r => r.username === s.username)
    );
    if (level.length === 0) break;
    level.forEach(s => {
      result.push({
        id: s.id,
        name: s.name,
        username: s.username,
        sponsorUsername: s.sponsorUsername,
        generation: Math.min(gen, 8),
        phone: s.phone,
        joinedDate: s.signupDate,
        assetBooked: s.assetBooked,
        investmentValue: s.investmentValue,
        commissionEarned: s.commissionEarned,
        status: s.status === 'pending' ? 'pending' : 'active',
        rank: s.rank
      });
    });
    frontier = new Set(level.map(s => s.username));
  }

  return result;
};

export const ReferralTreeView: React.FC<ReferralTreeViewProps> = ({ user, language, onNavigateToProgram }) => {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'tree' | 'generation_list' | 'ranks' | 'calculator' | 'add_downline'>('tree');
  const [selectedGenerationFilter, setSelectedGenerationFilter] = useState<'all' | number>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active (admin-configurable) commission matrix
  const settings = StorageService.getReferralSettings();

  // Commission Simulator State
  const [calcAssetType, setCalcAssetType] = useState<'commercial' | 'hotel_share'>('hotel_share');
  const [calcValue, setCalcValue] = useState<number>(3500000);
  const [calcGen, setCalcGen] = useState<number>(1);

  // New Downline Registration Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [newMemberAsset, setNewMemberAsset] = useState('Questra Royal Bay (1 Suite Share)');
  const [newMemberPlacement, setNewMemberPlacement] = useState('1');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [downlineTouched, setDownlineTouched] = useState<Record<string, boolean>>({});
  const [downlineAttempt, setDownlineAttempt] = useState(false);
  const downlineFormRef = useRef<HTMLFormElement>(null);

  const downlineRules: RuleSet = {
    newMemberName: compose(required('Full name'), minLength('Full name', 3)),
    newMemberPhone: phoneRule('Phone number', true),
    newMemberUsername: (v) => (v.trim() ? usernameRule('Username')(v) : null)
  };
  const downlineValues = { newMemberName, newMemberPhone, newMemberUsername };
  const downlineResult = useMemo(
    () => runRules(downlineValues, downlineRules),
    [newMemberName, newMemberPhone, newMemberUsername]
  );
  const showDownlineError = (f: string): string | null =>
    downlineTouched[f] || downlineAttempt ? (downlineResult.errors[f] || null) : null;
  const markDownline = (f: string) => setDownlineTouched(prev => ({ ...prev, [f]: true }));

  const referralCode = user.referralCode || 'QW-8842';
  const refUrl = `https://questraworld.com/user/register?ref=${user.username}&code=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Downline derived live from persisted referral signups (recomputed after each add)
  const [treeVersion, setTreeVersion] = useState(0);
  const downline = useMemo(() => deriveDownline(user), [user, treeVersion]);

  const filteredDownline = downline.filter(d => {
    const matchGen = selectedGenerationFilter === 'all' || d.generation === Number(selectedGenerationFilter);
    const matchSearch = searchQuery === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGen && matchSearch;
  });

  const totalDownline = downline.length;
  const maxGenPresent = downline.reduce((m, d) => Math.max(m, d.generation), 0);
  const genCount = (g: number) => downline.filter(d => d.generation === g).length;
  const totalVolume = downline.reduce((acc, d) => acc + d.investmentValue, 0);
  const totalCommission = downline.reduce((acc, d) => acc + d.commissionEarned, 0);

  // Commission calculation driven by the admin's active matrix
  const treeGenerations = Math.max(settings.generations, maxGenPresent, 1);
  const generationOptions = Array.from({ length: treeGenerations }, (_, i) => i + 1);
  const rateFor = (gen: number) =>
    gen >= 1 && gen <= settings.generations ? settings.rates[gen - 1] ?? 0 : 0;
  const calcRate = rateFor(calcGen);
  const calcCommission = Math.round(calcValue * (calcRate / 100));

  const handleRegisterDownline = (e: React.FormEvent) => {
    e.preventDefault();
    setDownlineAttempt(true);
    if (!downlineResult.isValid) {
      focusFirstInvalid(downlineFormRef.current);
      return;
    }

    // Resolve the real sponsor so the chosen placement generation is honoured.
    const existing = deriveDownline(user);
    let sponsorUsername = user.username;
    let sponsorName = user.fullName;
    let placementGen = 1;
    const placementTarget = Number(newMemberPlacement);
    if (Number.isFinite(placementTarget) && placementTarget > 1) {
      const parent = existing.find(d => d.generation === placementTarget - 1);
      if (parent) {
        sponsorUsername = parent.username;
        sponsorName = parent.name;
        placementGen = placementTarget;
      }
    }

    const safeUsername = (newMemberUsername || newMemberName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, '_')
      .slice(0, 24) || `member_${Date.now()}`;

    const rate = rateFor(placementGen);
    const investmentValue = 3500000;
    const commissionEarned = Math.round(investmentValue * (rate / 100));

    StorageService.addReferralSignup({
      name: newMemberName,
      nameBn: newMemberName,
      username: safeUsername,
      memberId: `QW-INT-${Math.floor(9500 + Math.random() * 499)}`,
      email: `${safeUsername}@client.com`,
      phone: newMemberPhone,
      avatar: '',
      sponsorUsername,
      sponsorName,
      generation: placementGen,
      signupDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      signupTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      assetBooked: newMemberAsset,
      investmentValue,
      commissionEarned,
      commissionRate: rate,
      payoutStatus: 'available',
      rank: 'Associate Member',
      location: 'Regional Client Office',
      kycVerified: false,
      notes: 'Registered directly from the generation tree.'
    });

    // Refresh the tree immediately so the new member appears and KPIs update.
    setTreeVersion(v => v + 1);
    setRegistrationSuccess(true);
    setTimeout(() => {
      setRegistrationSuccess(false);
      setDownlineAttempt(false);
      setDownlineTouched({});
      setNewMemberName('');
      setNewMemberPhone('');
      setNewMemberUsername('');
      setNewMemberPlacement('1');
    }, 3000);
  };

  const rankQualifiers = [
    { rank: 'Gold Senior Associate', minVolume: 40000000, reward: 'Bangkok Couple Tour', achieved: true },
    { rank: 'Senior Associate', minVolume: 20000000, reward: "Waterfront District Holiday (3D/2N)", achieved: true },
    { rank: 'Executive Associate', minVolume: 10000000, reward: 'Smart Watch & Leather Bag', achieved: true },
    { rank: 'Associate Member', minVolume: 5000000, reward: 'Weekend Resort Voucher', achieved: false },
    { rank: 'Member (In Review)', minVolume: 1000000, reward: 'Welcome Gift Box', achieved: false },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Generation Tree & Team Network
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualize your referral network. Commission is paid on {settings.generations} active generation{settings.generations > 1 ? 's' : ''}.
          </p>
        </div>
        <button
          onClick={onNavigateToProgram}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Referral Program
        </button>
      </div>

      {/* Referral Code Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Your Referral Code</span>
            <span className="text-lg font-black font-mono tracking-widest text-amber-300">{referralCode}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
          >
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-semibold transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase block">Total Downline</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalDownline}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase block">Network Turnover</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{formatBDT(totalVolume, language)}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase block">Commission Earned</span>
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{formatBDT(totalCommission, language)}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase block">Generations Active</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">{Math.max(1, maxGenPresent)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {[
          { id: 'tree' as const, label: 'Tree View', icon: Network },
          { id: 'generation_list' as const, label: 'Generation List', icon: Layers },
          { id: 'ranks' as const, label: 'Rank Qualifiers', icon: Award },
          { id: 'calculator' as const, label: 'Commission Calculator', icon: Calculator },
          { id: 'add_downline' as const, label: 'Add Downline', icon: UserPlus },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-300'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tree View */}
      {activeTab === 'tree' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-6 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Root */}
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-white text-center shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wider opacity-80">You</div>
                <div className="text-sm font-extrabold">{user.fullName}</div>
                <div className="text-[10px] font-mono opacity-70">{referralCode}</div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Generations rendered from the active matrix */}
            {generationOptions.map(gen => {
              const members = downline.filter(d => d.generation === gen);
              const rate = settings.rates[gen - 1] ?? 0;
              const inPlan = gen <= settings.generations;
              return (
                <div key={gen} className="mb-4">
                  <div className="text-center text-[10px] font-bold uppercase tracking-wider mb-3">
                    <span className="text-slate-400">
                      Generation {gen}{gen === 1 ? ' (Direct)' : ''} — {members.length} member{members.length === 1 ? '' : 's'}
                    </span>
                    <span className={`ml-2 px-1.5 py-0.5 rounded font-mono ${
                      inPlan ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {inPlan ? `${rate}%` : 'Not in plan'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {members.map(d => (
                      <div key={d.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                          <Users className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{d.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">@{d.username}</div>
                        <div className="text-[10px] text-emerald-600 font-mono font-bold mt-1">+{formatBDT(d.commissionEarned, language)}</div>
                      </div>
                    ))}
                    {members.length === 0 && (
                      <div className="col-span-full text-center text-[11px] text-slate-400 py-2">
                        No members in this generation yet.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Generation List */}
      {activeTab === 'generation_list' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or username..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={selectedGenerationFilter}
              onChange={e => setSelectedGenerationFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Generations</option>
              {generationOptions.map(g => (
                <option key={g} value={g}>Gen {g}</option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Member</th>
                    <th className="p-3">Gen</th>
                    <th className="p-3">Asset</th>
                    <th className="p-3 font-mono">Investment</th>
                    <th className="p-3 font-mono">Commission</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDownline.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{d.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">@{d.username}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Gen {d.generation}</span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 max-w-[160px] truncate">{d.assetBooked}</td>
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{formatBDT(d.investmentValue, language)}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">+{formatBDT(d.commissionEarned, language)}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {d.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredDownline.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                        No members match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Rank Qualifiers */}
      {activeTab === 'ranks' && (
        <div className="space-y-3">
          {rankQualifiers.map((r, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              r.achieved
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  r.achieved ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {r.achieved ? <CheckCircle2 className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{r.rank}</div>
                  <div className="text-[10px] text-slate-400">Min. turnover: {formatBDT(r.minVolume, language)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{r.reward}</span>
                {r.achieved && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">ACHIEVED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Commission Calculator */}
      {activeTab === 'calculator' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Commission Simulator</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Asset Type</label>
              <select
                value={calcAssetType}
                onChange={e => setCalcAssetType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="hotel_share">Hotel Suite Share</option>
                <option value="commercial">Commercial Floor Share</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Investment Value (USD)</label>
              <input
                type="number"
                value={calcValue}
                onChange={e => setCalcValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Generation</label>
              <select
                value={calcGen}
                onChange={e => setCalcGen(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {generationOptions.map(g => (
                  <option key={g} value={g}>
                    Generation {g}{g === 1 ? ' (Direct)' : ''} ({settings.rates[g - 1] ?? 0}%)
                  </option>
                ))}
              </select>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-[10px] text-emerald-600 uppercase tracking-wider">Your Commission</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                +{formatBDT(calcCommission, language)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Downline */}
      {activeTab === 'add_downline' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg">
          {registrationSuccess ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Downline Registered!</h3>
              <p className="text-xs text-slate-500">The new member has been added to your network.</p>
            </div>
          ) : (
            <form ref={downlineFormRef} onSubmit={handleRegisterDownline} noValidate className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register New Downline</h3>
              {downlineAttempt && !downlineResult.isValid && (
                <ValidationSummary messages={downlineResult.messages} />
              )}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  onBlur={() => markDownline('newMemberName')}
                  aria-invalid={!!showDownlineError('newMemberName')}
                  className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                    showDownlineError('newMemberName')
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                  }`}
                />
                <FieldError message={showDownlineError('newMemberName')} />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone *</label>
                <input
                  type="text"
                  value={newMemberPhone}
                  onChange={e => setNewMemberPhone(e.target.value)}
                  onBlur={() => markDownline('newMemberPhone')}
                  aria-invalid={!!showDownlineError('newMemberPhone')}
                  className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                    showDownlineError('newMemberPhone')
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                  }`}
                />
                <FieldError message={showDownlineError('newMemberPhone')} />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Username</label>
                <input
                  type="text"
                  value={newMemberUsername}
                  onChange={e => setNewMemberUsername(e.target.value)}
                  onBlur={() => markDownline('newMemberUsername')}
                  aria-invalid={!!showDownlineError('newMemberUsername')}
                  className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                    showDownlineError('newMemberUsername')
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-amber-500/30'
                  }`}
                />
                <FieldError message={showDownlineError('newMemberUsername')} />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Asset Booked</label>
                <select
                  value={newMemberAsset}
                  onChange={e => setNewMemberAsset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option>Questra Royal Bay (1 Suite Share)</option>
                  <option>Questra Royal Bay (2 Suite Shares)</option>
                  <option>Questra Commercial Center (Floor Share)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Placement</label>
                <select
                  value={newMemberPlacement}
                  onChange={e => setNewMemberPlacement(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {generationOptions.map(g => (
                    <option key={g} value={String(g)}>
                      {g === 1 ? 'Direct (Gen 1)' : `Generation ${g}`} — {settings.rates[g - 1] ?? 0}%
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                aria-disabled={downlineAttempt && !downlineResult.isValid}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                  downlineAttempt && !downlineResult.isValid
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                {downlineAttempt && !downlineResult.isValid
                  ? `Fix ${downlineResult.messages.length} field${downlineResult.messages.length > 1 ? 's' : ''} to register`
                  : 'Register Downline'}
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
