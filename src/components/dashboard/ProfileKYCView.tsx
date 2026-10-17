import React, { useMemo, useRef, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  Save,
  IdCard
} from 'lucide-react';
import { Language, User } from '../../types';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  minLength,
  email as emailRule,
  phone as phoneRule,
  runRules,
  Rule,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

const fieldBase =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500';

const nidRule = (label = 'Government ID / Passport number'): Rule => v => {
  const t = v.replace(/\s|-/g, '');
  if (!t) return `${label} is required.`;
  if (!/^(\d{10}|\d{13}|\d{17})$/.test(t)) return `${label} must be 10, 13 or 17 digits.`;
  return null;
};

const RULES: RuleSet = {
  fullName: compose(required('Full Name'), minLength('Full Name', 3)),
  nidNo: nidRule(),
  phone: phoneRule('Mobile number', true),
  email: emailRule('Email address'),
  address: minLength('Present address', 5),
  nomineeName: compose(required('Nominee name'), minLength('Nominee name', 3)),
  nomineePhone: phoneRule('Nominee phone', false),
  nomineeNid: nidRule('Nominee ID / Passport'),
  bankAccount: (v) => (v.trim() && !/^\d{6,20}$/.test(v.trim()) ? 'Account number must be 6–20 digits.' : null),
  routingNumber: (v) => (v.trim() && !/^\d{6,12}$/.test(v.trim()) ? 'Routing number must be 6–12 digits.' : null),
  walletNumber: phoneRule('PayPal / Wise wallet number', false)
};

interface ProfileKYCViewProps {
  user: User;
  language: Language;
  onProfileUpdated: (updatedUser: User) => void;
}

export const ProfileKYCView: React.FC<ProfileKYCViewProps> = ({
  user,
  language,
  onProfileUpdated
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [nidNo, setNidNo] = useState(user.nidNo);
  const [nomineeName, setNomineeName] = useState(user.nominee.name);
  const [nomineeRelation, setNomineeRelation] = useState(user.nominee.relation);
  const [nomineePhone, setNomineePhone] = useState(user.nominee.phone);
  const [nomineeNid, setNomineeNid] = useState(user.nominee.nid);

  const [bankName, setBankName] = useState(user.bankName || 'HSBC');
  const [bankBranch, setBankBranch] = useState(user.bankBranch || 'Central Commercial Area Branch, Singapore');
  const [bankAccount, setBankAccount] = useState(user.bankAccount || '1102948192001');
  const [routingNumber, setRoutingNumber] = useState(user.bankRoutingNumber || '225150921');
  const [walletNumber, setWalletNumber] = useState(user.mfsNumber || '+14155550199');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const values = {
    fullName, nidNo, phone, email, address,
    nomineeName, nomineePhone, nomineeNid,
    bankAccount, routingNumber, walletNumber
  };
  const result = useMemo(() => runRules(values, RULES), [
    fullName, nidNo, phone, email, address,
    nomineeName, nomineePhone, nomineeNid,
    bankAccount, routingNumber, walletNumber
  ]);

  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    const updated: User = {
      ...user,
      fullName,
      phone,
      email,
      address,
      city,
      nidNo,
      nominee: {
        name: nomineeName,
        relation: nomineeRelation,
        phone: nomineePhone,
        nid: nomineeNid
      },
      bankName,
      bankBranch,
      bankAccount,
      bankRoutingNumber: routingNumber,
      mfsNumber: walletNumber
    };

    StorageService.updateUser(updated);
    onProfileUpdated(updated);
    setSavedSuccess(true);
    setSubmitAttempt(false);
    setTouched({});
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const showFixLabel = submitAttempt && !result.isValid;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Investor Profile & KYC Verification
          </h2>
          <p className="text-xs text-slate-500">
            Verified membership profile, authorized nominee designation, and linked disbursement banking channels.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>KYC Status: VERIFIED & COMPLIANT</span>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white border border-white/20 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)]"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/60 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-md"></div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  {user.fullName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold uppercase">
                  INVESTOR
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 font-mono mt-2">
                <span className="px-2 py-1 rounded-lg bg-white/15 border border-white/20">Member ID: {user.memberId}</span>
                <span className="px-2 py-1 rounded-lg bg-white/15 border border-white/20">Username: @{user.username}</span>
                {user.userId && (<span className="px-2 py-1 rounded-lg bg-white/15 border border-white/20">USER ID: {user.userId}</span>)}
                {user.branch && (<span className="px-2 py-1 rounded-lg bg-white/15 border border-white/20">Branch: {user.branch}</span>)}
              </div>
            </div>
          </div>
          <div className="text-right sm:self-center font-mono text-xs text-white/90">
            <span className="px-2 py-1 rounded-lg bg-white/15 border border-white/20">Joined: {user.joinedDate}</span>
            <span className="block mt-1 px-2 py-1 rounded-lg bg-white/15 border border-white/20">Sponsor / Reference: {user.referenceUsername || '—'}</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes successfully encrypted and saved to Questra World database!</span>
        </div>
      )}

      {/* Profile Edit Form */}
      <form ref={formRef} onSubmit={handleSave} noValidate className="space-y-6">

        {showFixLabel && <ValidationSummary messages={result.messages} />}

        {/* Section 1: Personal & KYC */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <IdCard className="w-4 h-4 text-amber-600" />
            <span>1. Personal & Legal Identity</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onBlur={() => mark('fullName')}
                aria-invalid={!!showError('fullName')}
                className={withValidation(fieldBase, !!showError('fullName'))}
              />
              <FieldError message={showError('fullName')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Government ID (Passport) Number *
              </label>
              <input
                type="text"
                value={nidNo}
                onChange={e => setNidNo(e.target.value)}
                onBlur={() => mark('nidNo')}
                placeholder="10, 13 or 17 digits"
                aria-invalid={!!showError('nidNo')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('nidNo'))}
              />
              <FieldError message={showError('nidNo')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={() => mark('phone')}
                aria-invalid={!!showError('phone')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('phone'))}
              />
              <FieldError message={showError('phone')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => mark('email')}
                aria-invalid={!!showError('email')}
                className={withValidation(fieldBase, !!showError('email'))}
              />
              <FieldError message={showError('email')} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Present Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                onBlur={() => mark('address')}
                aria-invalid={!!showError('address')}
                className={withValidation(fieldBase, !!showError('address'))}
              />
              <FieldError message={showError('address')} />
            </div>
          </div>
        </div>

        {/* Section 2: Nominee Details */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>2. Authorized Legal Nominee</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Nominee Name *
              </label>
              <input
                type="text"
                value={nomineeName}
                onChange={e => setNomineeName(e.target.value)}
                onBlur={() => mark('nomineeName')}
                aria-invalid={!!showError('nomineeName')}
                className={withValidation(fieldBase, !!showError('nomineeName'))}
              />
              <FieldError message={showError('nomineeName')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Relationship
              </label>
              <select
                value={nomineeRelation}
                onChange={e => setNomineeRelation(e.target.value)}
                className={fieldBase}
              >
                <option>Spouse</option>
                <option>Son</option>
                <option>Daughter</option>
                <option>Mother</option>
                <option>Father</option>
                <option>Brother</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Nominee Phone
              </label>
              <input
                type="text"
                value={nomineePhone}
                onChange={e => setNomineePhone(e.target.value)}
                onBlur={() => mark('nomineePhone')}
                aria-invalid={!!showError('nomineePhone')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('nomineePhone'))}
              />
              <FieldError message={showError('nomineePhone')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Nominee ID
              </label>
              <input
                type="text"
                value={nomineeNid}
                onChange={e => setNomineeNid(e.target.value)}
                onBlur={() => mark('nomineeNid')}
                aria-invalid={!!showError('nomineeNid')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('nomineeNid'))}
              />
              <FieldError message={showError('nomineeNid')} />
            </div>
          </div>
        </div>

        {/* Section 3: Bank & Wallet Payout Channel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-600" />
            <span>3. Bank Account & Mobile Wallet</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className={fieldBase}
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Branch Name
              </label>
              <input
                type="text"
                value={bankBranch}
                onChange={e => setBankBranch(e.target.value)}
                className={fieldBase}
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={e => setBankAccount(e.target.value)}
                onBlur={() => mark('bankAccount')}
                aria-invalid={!!showError('bankAccount')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('bankAccount'))}
              />
              <FieldError message={showError('bankAccount')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Bank Routing Number
              </label>
              <input
                type="text"
                value={routingNumber}
                onChange={e => setRoutingNumber(e.target.value)}
                onBlur={() => mark('routingNumber')}
                aria-invalid={!!showError('routingNumber')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('routingNumber'))}
              />
              <FieldError message={showError('routingNumber')} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                PayPal / Wise Wallet Number
              </label>
              <input
                type="text"
                value={walletNumber}
                onChange={e => setWalletNumber(e.target.value)}
                onBlur={() => mark('walletNumber')}
                aria-invalid={!!showError('walletNumber')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('walletNumber'))}
              />
              <FieldError message={showError('walletNumber')} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          aria-disabled={showFixLabel}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-colors ${
            showFixLabel
              ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{showFixLabel ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''} to save` : 'Save Profile & KYC Information'}</span>
        </button>

      </form>

    </div>
  );
};
