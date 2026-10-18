import React, { useMemo, useRef, useState } from 'react';
import { X, UserPlus, CreditCard, Sparkles } from 'lucide-react';
import { AdminInvestor } from '../../types/admin';
import { SupportTicket, DoubleProfitPlan } from '../../types';
import {
  compose,
  required,
  minLength,
  username as usernameRule,
  phone as phoneRule,
  optionalEmail,
  minAmount,
  runRules,
  Rule,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid } from '../ui/Validation';

// Shared theme tokens (light + dark) matching the investor dashboard colour theory.
const OVERLAY = 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4';
const PANEL = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4';
const HEAD = 'flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3';
const HEAD_BORDER = 'flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800';
const TITLE = 'text-base font-bold text-slate-900 dark:text-white';
const LABEL = 'block text-slate-600 dark:text-slate-300 font-semibold mb-1';
const INPUT = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500';
const INPUT_INVALID = 'w-full px-3 py-2 rounded-xl border border-rose-400 dark:border-rose-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30';
const CLOSE_BTN = 'p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
const CANCEL_BTN = 'px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold';

/** Build an input class that turns rose when the field is invalid. */
const ic = (invalid: boolean, extra = '') => `${invalid ? INPUT_INVALID : INPUT} ${extra}`;

/** Optional government ID: only validated when something is typed. */
const optionalGovId = (label = 'Government ID / Passport number'): Rule => v => {
  const t = v.replace(/\s|-/g, '');
  if (!t) return null;
  if (!/^(\d{10}|\d{13}|\d{17})$/.test(t)) return `${label} must be 10, 13 or 17 digits.`;
  return null;
};

// ==========================================
// 1. ADD INVESTOR MODAL
// ==========================================
interface AddInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (investor: Omit<AdminInvestor, 'id'>) => void;
}

const ADD_INVESTOR_RULES: RuleSet = {
  fullName: compose(required('Full Name'), minLength('Full Name', 3)),
  username: usernameRule('Username / Portal ID'),
  phone: phoneRule('Mobile phone number', true),
  email: optionalEmail('Email'),
  nidNo: optionalGovId('Government ID / Passport number'),
  totalInvested: minAmount('Initial portfolio value', 0),
  nomineeName: minLength('Nominee name', 3)
};

export const AddInvestorModal: React.FC<AddInvestorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [fullName, setFullName] = useState('');
  const [fullNameBn, setFullNameBn] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('Regional Client Office (Downtown)');
  const [rank, setRank] = useState('Associate Member');
  const [nidNo, setNidNo] = useState('');
  const [totalInvested, setTotalInvested] = useState(500000);
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('Spouse');
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const values = { fullName, username, phone, email, nidNo, totalInvested, nomineeName };
  const result = useMemo(() => runRules(values, ADD_INVESTOR_RULES), [fullName, username, phone, email, nidNo, totalInvested, nomineeName]);
  const showError = (f: string): string | null => (touched[f] || submitAttempt) ? (result.errors[f] || null) : null;
  const mark = (f: string) => setTouched(prev => ({ ...prev, [f]: true }));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    setServerError(null);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    const memberId = 'QW-' + (branch.includes('Singapore') ? 'INT' : 'GLB') + '-' + Math.floor(1000 + Math.random() * 9000);
    onAdd({
      fullName,
      fullNameBn: fullNameBn || fullName,
      username: username || fullName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 12),
      phone,
      email: email || `${username || 'investor'}@questraworld.com`,
      memberId,
      branch,
      rank,
      kycStatus: 'verified',
      nidNo: nidNo || '1990 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
      totalInvested: Number(totalInvested),
      commissionBalance: 0,
      dividendBalance: 0,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      nomineeName: nomineeName || 'Not Appointed',
      nomineeRelation
    });
    onClose();
  };

  const fixLabel = submitAttempt && !result.isValid;

  return (
    <div className={OVERLAY}>
      <div className={`${PANEL} max-w-xl`}>
        <div className={HEAD}>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className={TITLE}>Create New Investor Account</h3>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {fixLabel && <ValidationSummary messages={result.messages} />}
          {serverError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Full Name (English) *</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onBlur={() => mark('fullName')}
                placeholder="e.g. Michael Anderson"
                aria-invalid={!!showError('fullName')}
                className={ic(!!showError('fullName'))}
              />
              <FieldError message={showError('fullName')} />
            </div>
            <div>
              <label className={LABEL}>Full Name (Alternate)</label>
              <input
                type="text"
                value={fullNameBn}
                onChange={e => setFullNameBn(e.target.value)}
                placeholder="e.g. Michael Anderson"
                className={INPUT}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Username / Portal ID *</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onBlur={() => mark('username')}
                placeholder="e.g. michael_anderson"
                aria-invalid={!!showError('username')}
                className={ic(!!showError('username'), 'font-mono')}
              />
              <FieldError message={showError('username')} />
            </div>
            <div>
              <label className={LABEL}>Mobile Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={() => mark('phone')}
                placeholder="+971 50 236 8842"
                aria-invalid={!!showError('phone')}
                className={ic(!!showError('phone'), 'font-mono')}
              />
              <FieldError message={showError('phone')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Corporate Branch</label>
              <select value={branch} onChange={e => setBranch(e.target.value)} className={INPUT}>
                <option value="Regional Client Office (Downtown)">Regional Client Office (Downtown)</option>
                <option value="Global Head Office (Financial District)">Global Head Office (Financial District)</option>
                <option value="Manchester Regional Branch">Manchester Regional Branch</option>
                <option value="Waterfront Project Office">Waterfront Project Office</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Membership Rank Level</label>
              <select value={rank} onChange={e => setRank(e.target.value)} className={INPUT}>
                <option value="Associate Member">Associate Member</option>
                <option value="Senior Associate">Senior Associate</option>
                <option value="Executive Associate">Executive Associate</option>
                <option value="Gold Senior Associate">Gold Senior Associate</option>
                <option value="Crown Diamond Director">Crown Diamond Director</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Government ID / Passport Number</label>
              <input
                type="text"
                value={nidNo}
                onChange={e => setNidNo(e.target.value)}
                onBlur={() => mark('nidNo')}
                placeholder="1985 4481 0021 99"
                aria-invalid={!!showError('nidNo')}
                className={ic(!!showError('nidNo'), 'font-mono')}
              />
              <FieldError message={showError('nidNo')} />
            </div>
            <div>
              <label className={LABEL}>Initial Portfolio Value (USD)</label>
              <input
                type="number"
                value={totalInvested}
                onChange={e => setTotalInvested(Number(e.target.value))}
                onBlur={() => mark('totalInvested')}
                aria-invalid={!!showError('totalInvested')}
                className={ic(!!showError('totalInvested'), 'font-mono')}
              />
              <FieldError message={showError('totalInvested')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Authorized Nominee Name</label>
              <input
                type="text"
                value={nomineeName}
                onChange={e => setNomineeName(e.target.value)}
                onBlur={() => mark('nomineeName')}
                placeholder="e.g. Jane Doe"
                aria-invalid={!!showError('nomineeName')}
                className={ic(!!showError('nomineeName'))}
              />
              <FieldError message={showError('nomineeName')} />
            </div>
            <div>
              <label className={LABEL}>Nominee Relation</label>
              <input
                type="text"
                value={nomineeRelation}
                onChange={e => setNomineeRelation(e.target.value)}
                placeholder="e.g. Spouse / Son / Daughter"
                className={INPUT}
              />
            </div>
          </div>

          <div className={HEAD_BORDER}>
            <button type="button" onClick={onClose} className={CANCEL_BTN}>
              Cancel
            </button>
            <button
              type="submit"
              aria-disabled={fixLabel}
              className={`px-5 py-2 rounded-xl font-bold shadow-md transition-colors ${
                fixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {fixLabel ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''}` : 'Add Investor to CRM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. EDIT INVESTOR MODAL
// ==========================================
interface EditInvestorModalProps {
  investor: AdminInvestor | null;
  onClose: () => void;
  onSave: (updated: AdminInvestor) => void;
}

const EDIT_INVESTOR_RULES: RuleSet = {
  fullName: compose(required('Full Name'), minLength('Full Name', 3)),
  phone: phoneRule('Phone number', true),
  email: optionalEmail('Email'),
  branch: required('Office branch'),
  dividendBalance: minAmount('Dividend wallet balance', 0),
  commissionBalance: minAmount('Commission balance', 0)
};

export const EditInvestorModal: React.FC<EditInvestorModalProps> = ({ investor, onClose, onSave }) => {
  const [fullName, setFullName] = useState(investor?.fullName || '');
  const [phone, setPhone] = useState(investor?.phone || '');
  const [email, setEmail] = useState(investor?.email || '');
  const [branch, setBranch] = useState(investor?.branch || '');
  const [rank, setRank] = useState(investor?.rank || '');
  const [kycStatus, setKycStatus] = useState(investor?.kycStatus || 'verified');
  const [dividendBalance, setDividendBalance] = useState(investor?.dividendBalance ?? 0);
  const [commissionBalance, setCommissionBalance] = useState(investor?.commissionBalance ?? 0);
  const [status, setStatus] = useState(investor?.status || 'active');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const values = { fullName, phone, email, branch, dividendBalance, commissionBalance };
  const result = useMemo(
    () => runRules(values, EDIT_INVESTOR_RULES),
    [fullName, phone, email, branch, dividendBalance, commissionBalance]
  );
  const showError = (f: string): string | null => (touched[f] || submitAttempt) ? (result.errors[f] || null) : null;
  const mark = (f: string) => setTouched(prev => ({ ...prev, [f]: true }));

  if (!investor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    onSave({
      ...investor,
      fullName,
      phone,
      email,
      branch,
      rank,
      kycStatus: kycStatus as AdminInvestor['kycStatus'],
      dividendBalance: Number(dividendBalance),
      commissionBalance: Number(commissionBalance),
      status: status as AdminInvestor['status']
    });
    onClose();
  };

  const fixLabel = submitAttempt && !result.isValid;

  return (
    <div className={OVERLAY}>
      <div className={`${PANEL} max-w-xl`}>
        <div className={HEAD}>
          <div>
            <h3 className={TITLE}>Edit Investor Details</h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">@{investor.username} · {investor.memberId}</span>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {fixLabel && <ValidationSummary messages={result.messages} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onBlur={() => mark('fullName')}
                aria-invalid={!!showError('fullName')}
                className={ic(!!showError('fullName'))}
              />
              <FieldError message={showError('fullName')} />
            </div>
            <div>
              <label className={LABEL}>Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={() => mark('phone')}
                aria-invalid={!!showError('phone')}
                className={ic(!!showError('phone'), 'font-mono')}
              />
              <FieldError message={showError('phone')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => mark('email')}
                aria-invalid={!!showError('email')}
                className={ic(!!showError('email'))}
              />
              <FieldError message={showError('email')} />
            </div>
            <div>
              <label className={LABEL}>Office Branch *</label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                onBlur={() => mark('branch')}
                aria-invalid={!!showError('branch')}
                className={ic(!!showError('branch'))}
              />
              <FieldError message={showError('branch')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={LABEL}>Membership Rank</label>
              <input type="text" value={rank} onChange={e => setRank(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>KYC Status</label>
              <select value={kycStatus} onChange={e => setKycStatus(e.target.value as any)} className={INPUT}>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Account Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className={INPUT}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Dividend Wallet Balance (USD)</label>
              <input
                type="number"
                value={dividendBalance}
                onChange={e => setDividendBalance(Number(e.target.value))}
                onBlur={() => mark('dividendBalance')}
                aria-invalid={!!showError('dividendBalance')}
                className={ic(!!showError('dividendBalance'), 'font-mono font-bold')}
              />
              <FieldError message={showError('dividendBalance')} />
            </div>
            <div>
              <label className="block text-amber-600 dark:text-amber-400 font-semibold mb-1">Referral Commission Balance (USD)</label>
              <input
                type="number"
                value={commissionBalance}
                onChange={e => setCommissionBalance(Number(e.target.value))}
                onBlur={() => mark('commissionBalance')}
                aria-invalid={!!showError('commissionBalance')}
                className={ic(!!showError('commissionBalance'), 'font-mono font-bold')}
              />
              <FieldError message={showError('commissionBalance')} />
            </div>
          </div>

          <div className={HEAD_BORDER}>
            <button type="button" onClick={onClose} className={CANCEL_BTN}>
              Cancel
            </button>
            <button
              type="submit"
              aria-disabled={fixLabel}
              className={`px-5 py-2 rounded-xl font-bold shadow-md transition-colors ${
                fixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {fixLabel ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''}` : 'Save Updates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. ADD MANUAL BANK DEPOSIT SLIP MODAL
// ==========================================
interface AddManualSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (slipData: any) => void;
}

const ADD_SLIP_RULES: RuleSet = {
  memberUsername: compose(required('Investor username'), minLength('Investor username', 3)),
  memberName: compose(required('Investor full name'), minLength('Investor full name', 3)),
  amount: minAmount('Deposit amount', 1),
  bankName: required('Deposit bank'),
  branchName: required('Bank branch')
};

export const AddManualSlipModal: React.FC<AddManualSlipModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [memberUsername, setMemberUsername] = useState('user1');
  const [memberName, setMemberName] = useState('Alex Johnson');
  const [amount, setAmount] = useState(35000);
  const [bankName, setBankName] = useState('Standard Chartered');
  const [branchName, setBranchName] = useState('Central Commercial Branch, Singapore');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('Counter deposit / pay-order clearance');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const values = { memberUsername, memberName, amount, bankName, branchName };
  const result = useMemo(() => runRules(values, ADD_SLIP_RULES), [memberUsername, memberName, amount, bankName, branchName]);
  const showError = (f: string): string | null => (touched[f] || submitAttempt) ? (result.errors[f] || null) : null;
  const mark = (f: string) => setTouched(prev => ({ ...prev, [f]: true }));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    onAdd({
      id: 'slip-' + Date.now(),
      slipNo: 'SLIP-MAN-' + Math.floor(1000 + Math.random() * 9000),
      memberUsername,
      memberName,
      memberId: 'QW-GLOBAL-1001',
      bookingId: 'questra-royal-bay-suite-04',
      projectName: 'Questra Royal Bay Kuakata',
      bankName,
      branchName,
      amount: Number(amount),
      depositDate: new Date().toISOString().split('T')[0],
      transactionId: transactionId || 'PO-' + Math.floor(100000 + Math.random() * 900000),
      slipImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
      notes,
      status: 'approved',
      submittedAt: 'Just Now (Manual Entry)'
    });
    onClose();
  };

  const fixLabel = submitAttempt && !result.isValid;

  return (
    <div className={OVERLAY}>
      <div className={`${PANEL} max-w-lg`}>
        <div className={HEAD}>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            <h3 className={TITLE}>Record Manual Offline Deposit / Pay-Order</h3>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {fixLabel && <ValidationSummary messages={result.messages} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Investor Username *</label>
              <input
                type="text"
                value={memberUsername}
                onChange={e => setMemberUsername(e.target.value)}
                onBlur={() => mark('memberUsername')}
                aria-invalid={!!showError('memberUsername')}
                className={ic(!!showError('memberUsername'), 'font-mono')}
              />
              <FieldError message={showError('memberUsername')} />
            </div>
            <div>
              <label className={LABEL}>Investor Full Name *</label>
              <input
                type="text"
                value={memberName}
                onChange={e => setMemberName(e.target.value)}
                onBlur={() => mark('memberName')}
                aria-invalid={!!showError('memberName')}
                className={ic(!!showError('memberName'))}
              />
              <FieldError message={showError('memberName')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Deposit Amount (USD) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                onBlur={() => mark('amount')}
                aria-invalid={!!showError('amount')}
                className={ic(!!showError('amount'), 'font-mono font-bold')}
              />
              <FieldError message={showError('amount')} />
            </div>
            <div>
              <label className={LABEL}>Deposit Bank *</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                onBlur={() => mark('bankName')}
                aria-invalid={!!showError('bankName')}
                className={ic(!!showError('bankName'))}
              />
              <FieldError message={showError('bankName')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Bank Branch *</label>
              <input
                type="text"
                value={branchName}
                onChange={e => setBranchName(e.target.value)}
                onBlur={() => mark('branchName')}
                aria-invalid={!!showError('branchName')}
                className={ic(!!showError('branchName'))}
              />
              <FieldError message={showError('branchName')} />
            </div>
            <div>
              <label className={LABEL}>Pay-Order / TxID</label>
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                placeholder="IBBL-PO-88219"
                className={`${INPUT} font-mono`}
              />
            </div>
          </div>

          <div>
            <label className={LABEL}>Notes / Ledger Remarks</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className={INPUT} />
          </div>

          <div className={HEAD_BORDER}>
            <button type="button" onClick={onClose} className={CANCEL_BTN}>
              Cancel
            </button>
            <button
              type="submit"
              aria-disabled={fixLabel}
              className={`px-5 py-2 rounded-xl font-bold shadow-md transition-colors ${
                fixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {fixLabel ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''}` : 'Credit & Generate Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. REPLY TICKET MODAL
// ==========================================
interface ReplyTicketModalProps {
  ticket: SupportTicket | null;
  onClose: () => void;
  onReply: (ticketId: string, replyMessage: string) => void;
}

const REPLY_RULES: RuleSet = {
  replyText: (v) => {
    if (!v.trim()) return 'A reply message is required.';
    if (v.trim().length < 5) return 'Please write at least 5 characters.';
    return null;
  }
};

export const ReplyTicketModal: React.FC<ReplyTicketModalProps> = ({ ticket, onClose, onReply }) => {
  const [replyText, setReplyText] = useState('');
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const result = useMemo(() => runRules({ replyText }, REPLY_RULES), [replyText]);

  if (!ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    onReply(ticket.id, replyText);
    setReplyText('');
    setSubmitAttempt(false);
    onClose();
  };

  const showError = submitAttempt ? (result.errors.replyText || null) : null;
  const fixLabel = submitAttempt && !result.isValid;

  return (
    <div className={OVERLAY}>
      <div className={`${PANEL} max-w-xl`}>
        <div className={HEAD}>
          <div>
            <h3 className={TITLE}>Reply to Ticket: {ticket.subject}</h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">Ticket #{ticket.ticketNo} · Category: {ticket.category}</span>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto text-xs">
          {ticket.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${
                msg.sender === 'support'
                  ? 'bg-amber-50 dark:bg-amber-600/20 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-100 ml-4'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 mr-4'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                <span>{msg.senderName} ({msg.sender.toUpperCase()})</span>
                <span className="text-slate-400 font-mono">{msg.timestamp}</span>
              </div>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-3 text-xs">
          {submitAttempt && showError && <ValidationSummary messages={[showError]} />}
          <div>
            <label className={LABEL}>Support Official Response *</label>
            <textarea
              rows={3}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your official administrative reply to the investor..."
              aria-invalid={!!showError}
              className={ic(!!showError, 'placeholder-slate-400')}
            />
            <FieldError message={showError} />
          </div>

          <div className={HEAD_BORDER}>
            <button type="button" onClick={onClose} className={CANCEL_BTN}>
              Cancel
            </button>
            <button
              type="submit"
              aria-disabled={fixLabel}
              className={`px-5 py-2 rounded-xl font-bold shadow-md transition-colors ${
                fixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {fixLabel ? 'Write a reply to continue' : 'Send Reply & Update Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 5. ADD 12-MONTH DOUBLE PROFIT PLAN MODAL
// ==========================================
interface AddDoublePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  investors: AdminInvestor[];
  onAdd: (plan: Partial<DoubleProfitPlan>) => void;
}

const MIN_PLAN_AMOUNT = 50000;

export const AddDoublePlanModal: React.FC<AddDoublePlanModalProps> = ({
  isOpen,
  onClose,
  investors,
  onAdd
}) => {
  const [selectedInvestorId, setSelectedInvestorId] = useState(investors[0]?.id || '');
  const [customMemberName, setCustomMemberName] = useState('');
  const [customMemberId, setCustomMemberId] = useState('');
  const [principalAmount, setPrincipalAmount] = useState<number>(500000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('500000');
  const [packageName, setPackageName] = useState('Executive Gold Double Profit (12 Months)');
  const [deedNo, setDeedNo] = useState(`QW-DP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [bankPrefix, setBankPrefix] = useState('IBBL-PDC');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const selectedInv = investors.find(i => i.id === selectedInvestorId);
  const memberName = selectedInv ? selectedInv.fullName : (customMemberName || 'Investor Member');
  const memberId = selectedInv ? selectedInv.memberId : (customMemberId || 'QW-INT-9999');

  const totalReturn = principalAmount * 2;
  const monthlyInstallment = Math.round(totalReturn / 12);

  const rules: RuleSet = useMemo(() => {
    const base: RuleSet = {
      customAmountStr: minAmount('Capital amount', MIN_PLAN_AMOUNT),
      packageName: required('Package title'),
      deedNo: required('Agreement deed number')
    };
    if (!selectedInvestorId) {
      base.customMemberName = compose(required('Custom member full name'), minLength('Custom member full name', 3));
      base.customMemberId = required('Custom member ID');
    }
    return base;
  }, [selectedInvestorId]);

  const values = { customAmountStr, packageName, deedNo, customMemberName, customMemberId };
  const result = useMemo(
    () => runRules(values, rules),
    [rules, customAmountStr, packageName, deedNo, customMemberName, customMemberId]
  );
  const showError = (f: string): string | null => (touched[f] || submitAttempt) ? (result.errors[f] || null) : null;
  const mark = (f: string) => setTouched(prev => ({ ...prev, [f]: true }));

  if (!isOpen) return null;

  const handleSelectPackage = (amt: number, name: string) => {
    setPrincipalAmount(amt);
    setCustomAmountStr(String(amt));
    setPackageName(name);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmountStr(val);
    const num = Number(val) || 0;
    setPrincipalAmount(num);
    setPackageName(`Custom Double Return Plan ($${num.toLocaleString()})`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }

    const checkNumbers = Array.from({ length: 12 }, (_, i) => `${bankPrefix}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000) + i}`);

    onAdd({
      memberId,
      memberName,
      packageName,
      packageNameBn: `${packageName} (12-Month Double Profit)`,
      principalAmount,
      totalReturnAmount: totalReturn,
      monthlyInstallmentAmount: monthlyInstallment,
      totalMonths: 12,
      paidInstallments: 0,
      remainingInstallments: 12,
      totalPaidOut: 0,
      startDate: new Date().toISOString().split('T')[0],
      nextPayoutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      agreementDeedNo: deedNo,
      pdcCheckNumbers: checkNumbers
    });
    onClose();
  };

  const fixLabel = submitAttempt && !result.isValid;

  return (
    <div className={OVERLAY}>
      <div className={`${PANEL} max-w-2xl`}>
        <div className={HEAD}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <div>
              <h3 className={TITLE}>Enroll Investor in 12-Month Double Profit Plan</h3>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">100% Net Profit Disbursed in 12 Equal Monthly Installments</span>
            </div>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {fixLabel && <ValidationSummary messages={result.messages} />}

          {/* Select Existing Investor or Enter Custom */}
          <div>
            <label className={LABEL}>Select Registered CRM Investor</label>
            <select
              value={selectedInvestorId}
              onChange={e => {
                setSelectedInvestorId(e.target.value);
                setCustomMemberName('');
              }}
              className={INPUT}
            >
              <option value="">-- Choose Investor from CRM or Enter Custom Below --</option>
              {investors.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.fullName} ({inv.memberId}) · Phone: {inv.phone}
                </option>
              ))}
            </select>
          </div>

          {!selectedInvestorId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Custom Member Full Name *</label>
                <input
                  type="text"
                  value={customMemberName}
                  onChange={e => setCustomMemberName(e.target.value)}
                  onBlur={() => mark('customMemberName')}
                  placeholder="e.g. Michael Anderson"
                  aria-invalid={!!showError('customMemberName')}
                  className={ic(!!showError('customMemberName'))}
                />
                <FieldError message={showError('customMemberName')} />
              </div>
              <div>
                <label className={LABEL}>Custom Member ID *</label>
                <input
                  type="text"
                  value={customMemberId}
                  onChange={e => setCustomMemberId(e.target.value)}
                  onBlur={() => mark('customMemberId')}
                  placeholder="e.g. QW-GLB-9812"
                  aria-invalid={!!showError('customMemberId')}
                  className={ic(!!showError('customMemberId'), 'font-mono')}
                />
                <FieldError message={showError('customMemberId')} />
              </div>
            </div>
          )}

          {/* Preset Packages */}
          <div>
            <label className={`${LABEL} mb-1.5`}>Choose Capital Package</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { amount: 100000, name: 'Starter Double Profit ($100,000)' },
                { amount: 250000, name: 'Silver Wealth Booster ($250,000)' },
                { amount: 500000, name: 'Executive Gold Double Profit ($500,000)' },
                { amount: 1000000, name: 'Platinum 2X Elite ($1,000,000)' },
                { amount: 2500000, name: 'Crown VIP Double Return ($2,500,000)' },
                { amount: 5000000, name: 'Presidential Diamond ($5,000,000)' }
              ].map(p => (
                <button
                  key={p.amount}
                  type="button"
                  onClick={() => handleSelectPackage(p.amount, p.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    principalAmount === p.amount
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/20 text-slate-900 dark:text-white ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <strong className="block text-xs font-mono">${p.amount.toLocaleString()}</strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">2X: ${(p.amount * 2).toLocaleString()}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-300 block font-mono">${Math.round((p.amount * 2) / 12).toLocaleString()}/mo</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Or Custom Capital Amount (USD) *</label>
              <input
                type="text"
                value={customAmountStr}
                onChange={handleCustomChange}
                onBlur={() => mark('customAmountStr')}
                placeholder="500000"
                aria-invalid={!!showError('customAmountStr')}
                className={ic(!!showError('customAmountStr'), 'font-mono font-bold')}
              />
              <FieldError message={showError('customAmountStr')} />
            </div>
            <div>
              <label className={LABEL}>Package Title *</label>
              <input
                type="text"
                value={packageName}
                onChange={e => setPackageName(e.target.value)}
                onBlur={() => mark('packageName')}
                aria-invalid={!!showError('packageName')}
                className={ic(!!showError('packageName'))}
              />
              <FieldError message={showError('packageName')} />
            </div>
          </div>

          {/* Live Calculation Preview */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">Invested Principal</span>
              <strong className="text-slate-900 dark:text-white text-xs">${principalAmount.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">100% Net Profit</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-xs">+${principalAmount.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">Total 12-Mo Payout</span>
              <strong className="text-amber-600 dark:text-amber-400 text-xs">${totalReturn.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">Monthly Installment</span>
              <strong className="text-emerald-600 dark:text-emerald-300 text-xs font-black">${monthlyInstallment.toLocaleString()} / mo</strong>
            </div>
          </div>

          {/* Deed & PDC Prefix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Agreement Deed Number *</label>
              <input
                type="text"
                value={deedNo}
                onChange={e => setDeedNo(e.target.value)}
                onBlur={() => mark('deedNo')}
                aria-invalid={!!showError('deedNo')}
                className={ic(!!showError('deedNo'), 'font-mono')}
              />
              <FieldError message={showError('deedNo')} />
            </div>
            <div>
              <label className={LABEL}>12 Bank PDC Cheques Prefix</label>
              <input
                type="text"
                value={bankPrefix}
                onChange={e => setBankPrefix(e.target.value)}
                placeholder="IBBL-PDC / CBL-PDC"
                className={`${INPUT} font-mono`}
              />
            </div>
          </div>

          <div className={HEAD_BORDER}>
            <button type="button" onClick={onClose} className={CANCEL_BTN}>
              Cancel
            </button>
            <button
              type="submit"
              aria-disabled={fixLabel}
              className={`px-5 py-2 rounded-xl font-black shadow-md flex items-center gap-1.5 transition-colors ${
                fixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{fixLabel ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''}` : 'Enroll Plan & Generate 12 PDC Cheques'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
