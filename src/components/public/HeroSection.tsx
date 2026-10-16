import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { Language, User } from '../../types';
import { translations, getTranslation } from '../../services/i18n';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  minLength,
  username as usernameRule,
  password as passwordRule,
  email as emailRule,
  phone as phoneRule,
  pin as pinRule,
  optionalUsername,
  matches,
  runRules,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

interface HeroSectionProps {
  language: Language;
  user: User | null;
  onOpenAuth: () => void;
  onExploreProjects: () => void;
  onOpenPortal: () => void;
  onRegisterSuccess: (user: User) => void;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
  cmsBanner?: string;
  cmsKicker?: string;
  brandName?: string;
}

/**
 * The signup form is fixed by requirement: User Name, Full Name, Phone Number,
 * Email, Password, Confirm Password, Transaction Pin, Confirm Transaction Pin
 * and Reference Username — no other fields.
 */

const inputBase =
  'w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500';

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  user,
  onOpenAuth,
  onExploreProjects,
  onOpenPortal,
  onRegisterSuccess,
  cmsTitle,
  cmsSubtitle
}) => {
  const t = (key: keyof typeof translations.en) => getTranslation(language, key);

  // --- Registration / Signup form state ---
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [confirmTransactionPin, setConfirmTransactionPin] = useState('');
  const [referenceUsername, setReferenceUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const rules = useMemo<RuleSet>(
    () => ({
      username: usernameRule('User Name'),
      fullName: compose(required('Full Name'), minLength('Full Name', 3)),
      phone: phoneRule('Phone Number'),
      email: emailRule('Email'),
      password: passwordRule('Password', 6),
      confirmPassword: matches('Confirm Password', 'Password', () => password),
      transactionPin: pinRule('Transaction Pin', 4),
      confirmTransactionPin: compose(
        pinRule('Confirm Transaction Pin', 4),
        matches('Confirm Transaction Pin', 'Transaction Pin', () => transactionPin)
      ),
      referenceUsername: optionalUsername('Reference Username')
    }),
    [password, transactionPin]
  );

  const values = {
    username,
    fullName,
    phone,
    email,
    password,
    confirmPassword,
    transactionPin,
    confirmTransactionPin,
    referenceUsername
  };
  const result = useMemo(
    () => runRules(values, rules),
    [
      username,
      fullName,
      phone,
      email,
      password,
      confirmPassword,
      transactionPin,
      confirmTransactionPin,
      referenceUsername,
      rules
    ]
  );

  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  // --- Recovery state ---
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryTouched, setRecoveryTouched] = useState(false);
  const [recoveryMsg, setRecoveryMsg] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupDone(null);
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    if (StorageService.accountExists(username)) {
      setSignupError('That username is already registered. Please choose another username or sign in.');
      return;
    }
    const registered = StorageService.register(
      {
        fullName,
        username,
        phone,
        email,
        transactionPin,
        referenceUsername: referenceUsername.trim() || undefined
      },
      password
    );
    setSignupDone(`Welcome ${registered.fullName}! Your investor account is ready.`);
    onRegisterSuccess(registered);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryTouched(true);
    setRecoveryMsg(null);
    const trimmed = recoveryId.trim();
    if (!trimmed) {
      setRecoveryError('Enter your username or registered mobile number.');
      return;
    }
    if (trimmed.length < 4) {
      setRecoveryError('Enter at least 4 characters of your username or full mobile number.');
      return;
    }
    setRecoveryError(null);
    if (StorageService.accountExists(recoveryId)) {
      setRecoveryMsg('Recovery instructions have been sent to the mobile number and email on file for this account.');
    } else {
      setRecoveryMsg('No account found with those details. Please check and try again, or call our 24/7 hotline.');
    }
  };

  const signupReady = result.isValid;

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-6 pb-20 sm:pt-8 sm:pb-28">

      {/* Background Architectural Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Investor Registration / Signup */}
        <div className="max-w-md mx-auto">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-6 shadow-2xl">

              {/* Card Header */}
              <div className="flex items-center gap-3">
                <img
                  src="/questra-logo.jpeg"
                  alt="Questra World logo"
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-amber-400/30 shrink-0 bg-white"
                />
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {cmsTitle || 'New Investor Registration'}
                  </h2>
                  <span className="text-[11px] text-slate-400">
                    {cmsSubtitle || 'Create your secure Questra World account'}
                  </span>
                </div>
              </div>

              {/* Signup Form */}
              <form ref={formRef} onSubmit={handleSignup} noValidate className="space-y-3 mt-4 text-xs">
                {submitAttempt && !result.isValid && (
                  <ValidationSummary messages={result.messages} className="!bg-rose-500/10 !border-rose-500/30 !text-rose-300 [&_*]:!text-rose-300" />
                )}
                {signupError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                    {signupError}
                  </div>
                )}
                {signupDone && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{signupDone}</span>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">User Name *</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onBlur={() => mark('username')}
                    placeholder="e.g. alex_johnson"
                    aria-invalid={!!showError('username')}
                    className={withValidation(`${inputBase} font-mono`, !!showError('username'))}
                  />
                  <FieldError message={showError('username')} />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    onBlur={() => mark('fullName')}
                    placeholder="e.g. Michael Anderson"
                    aria-invalid={!!showError('fullName')}
                    className={withValidation(inputBase, !!showError('fullName'))}
                  />
                  <FieldError message={showError('fullName')} />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onBlur={() => mark('phone')}
                    placeholder="+61 171 100 0000"
                    aria-invalid={!!showError('phone')}
                    className={withValidation(`${inputBase} font-mono`, !!showError('phone'))}
                  />
                  <FieldError message={showError('phone')} />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => mark('email')}
                    placeholder="you@gmail.com"
                    aria-invalid={!!showError('email')}
                    className={withValidation(inputBase, !!showError('email'))}
                  />
                  <FieldError message={showError('email')} />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onBlur={() => mark('password')}
                      placeholder="Choose a password"
                      aria-invalid={!!showError('password')}
                      className={withValidation(`${inputBase} pl-9 pr-9 font-mono`, !!showError('password'))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <FieldError message={showError('password')} />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirm Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      onBlur={() => mark('confirmPassword')}
                      placeholder="Re-enter password"
                      aria-invalid={!!showError('confirmPassword')}
                      className={withValidation(`${inputBase} pl-9 font-mono`, !!showError('confirmPassword'))}
                    />
                  </div>
                  <FieldError message={showError('confirmPassword')} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Transaction Pin *</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={transactionPin}
                      onChange={e => setTransactionPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onBlur={() => mark('transactionPin')}
                      placeholder="4-digit PIN"
                      aria-invalid={!!showError('transactionPin')}
                      className={withValidation(`${inputBase} font-mono tracking-widest`, !!showError('transactionPin'))}
                    />
                    <FieldError message={showError('transactionPin')} />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Confirm Transaction Pin *</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={confirmTransactionPin}
                      onChange={e => setConfirmTransactionPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onBlur={() => mark('confirmTransactionPin')}
                      placeholder="Re-enter PIN"
                      aria-invalid={!!showError('confirmTransactionPin')}
                      className={withValidation(`${inputBase} font-mono tracking-widest`, !!showError('confirmTransactionPin'))}
                    />
                    <FieldError message={showError('confirmTransactionPin')} />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reference Username</label>
                  <input
                    type="text"
                    value={referenceUsername}
                    onChange={e => setReferenceUsername(e.target.value)}
                    onBlur={() => mark('referenceUsername')}
                    placeholder="Optional — your sponsor's username"
                    aria-invalid={!!showError('referenceUsername')}
                    className={withValidation(`${inputBase} font-mono`, !!showError('referenceUsername'))}
                  />
                  <FieldError message={showError('referenceUsername')} />
                </div>

                <button
                  type="submit"
                  aria-disabled={submitAttempt && !signupReady}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    submitAttempt && !signupReady
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <span>
                    {submitAttempt && !signupReady
                      ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''} to continue`
                      : 'Submit'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Login information */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {'Existing investor demo login: '}
                    <span className="font-mono text-amber-300">user1 / 123456</span>
                  </span>
                </div>
              </form>

              {/* Login & Recovery Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                  <span>{ 'Login' }</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryOpen(!recoveryOpen);
                    setRecoveryMsg(null);
                    setRecoveryError(null);
                  }}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ 'Recovery' }</span>
                </button>
              </div>

              {/* Recovery Panel */}
              {recoveryOpen && (
                <form onSubmit={handleRecovery} noValidate className="mt-3 space-y-2 text-xs">
                  <input
                    type="text"
                    value={recoveryId}
                    onChange={e => { setRecoveryId(e.target.value); if (recoveryError) setRecoveryError(null); }}
                    onBlur={() => setRecoveryTouched(true)}
                    placeholder="Username or registered mobile number"
                    aria-invalid={recoveryTouched && !!recoveryError}
                    className={withValidation(`${inputBase} font-mono`, recoveryTouched && !!recoveryError)}
                  />
                  <FieldError message={recoveryTouched ? recoveryError : null} />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all"
                  >
                    { 'Send Recovery Instructions' }
                  </button>
                  {recoveryMsg && (
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {recoveryMsg}
                    </p>
                  )}
                </form>
              )}

            </div>
          </div>

      </div>
    </section>
  );
};
