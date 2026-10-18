import React, { useMemo, useRef, useState } from 'react';
import {
  X,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { User, Language } from '../../types';
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  language: Language;
  /** Sponsor username carried by a referral link (?ref=…), pre-filled into the register form. */
  initialReferenceUsername?: string;
}

const fieldBase =
  'w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
  initialReferenceUsername
}) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [confirmTransactionPin, setConfirmTransactionPin] = useState('');
  const [referenceUsername, setReferenceUsername] = useState(initialReferenceUsername || '');
  const [userId, setUserId] = useState<string>(() => {
    const last = localStorage.getItem('qw_last_user_id');
    const next = last ? parseInt(last, 10) + 1 : 6120;
    const idStr = String(next);
    localStorage.setItem('qw_last_user_id', idStr);
    return idStr;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const t = (key: keyof typeof translations.en) => getTranslation(language, key);

  const rules: RuleSet = isLoginTab
    ? {
        username: required('Username'),
        password: required('Password')
      }
    : {
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
      };

  const values = {
    username,
    password,
    fullName,
    phone,
    email,
    confirmPassword,
    transactionPin,
    confirmTransactionPin,
    referenceUsername
  };
  const result = useMemo(
    () => runRules(values, rules),
    [
      isLoginTab,
      username,
      password,
      fullName,
      phone,
      email,
      confirmPassword,
      transactionPin,
      confirmTransactionPin,
      referenceUsername
    ]
  );

  if (!isOpen) return null;

  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const switchTab = (login: boolean) => {
    setIsLoginTab(login);
    setError(null);
    setTouched({});
    setSubmitAttempt(false);
    if (!login) {
      const last = localStorage.getItem('qw_last_user_id');
      const next = last ? parseInt(last, 10) + 1 : 6120;
      const idStr = String(next);
      setUserId(idStr);
      localStorage.setItem('qw_last_user_id', idStr);
    }
  };

  const handleFillDemo = () => {
    setUsername('user1');
    setPassword('123456');
    setError(null);
    setTouched({});
    setSubmitAttempt(false);
  };

  const handleFillAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
    setTouched({});
    setSubmitAttempt(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitAttempt(true);

    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }

    if (isLoginTab) {
      const loggedUser = StorageService.login(username, password);
      if (loggedUser) {
        onLoginSuccess(loggedUser);
        onClose();
      } else {
        setError('Invalid credentials. Please check your username and password.');
      }
    } else {
      if (StorageService.accountExists(username)) {
        setError('That username is already registered. Please choose another username or sign in.');
        return;
      }
      StorageService.register(
        {
          username,
          fullName,
          phone,
          email,
          transactionPin,
          referenceUsername: referenceUsername.trim() || undefined,
          userId: userId || undefined
        },
        password
      );
      // Registration successful — switch to Login tab instead of auto-login
      setError(null);
      setTouched({});
      setSubmitAttempt(false);
      setIsLoginTab(true);
      setPassword('');
      setConfirmPassword('');
      setTransactionPin('');
      setConfirmTransactionPin('');
      return;
    }
  };

  const invalidCount = result.messages.length;
  const showFixLabel = submitAttempt && !result.isValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Top Banner */}
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src="/questra-logo.jpeg"
            alt="Questra World logo"
            className="w-14 h-14 mx-auto rounded-xl object-cover ring-2 ring-amber-400/40 shadow-lg mb-3 bg-white"
          />

          <h2 className="text-lg font-bold tracking-tight">
            Login
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1">
          <button
            type="button"
            onClick={() => switchTab(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              isLoginTab
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('tabLogin')}
          </button>
          <button
            type="button"
            onClick={() => switchTab(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              !isLoginTab
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('tabRegister')}
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {showFixLabel && <ValidationSummary messages={result.messages} />}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              User Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onBlur={() => mark('username')}
                placeholder="user1"
                aria-invalid={!!showError('username')}
                className={withValidation(`${fieldBase} pl-9 font-mono`, !!showError('username'))}
              />
            </div>
            <FieldError message={showError('username')} />
          </div>

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onBlur={() => mark('fullName')}
                placeholder="e.g. Michael Anderson"
                aria-invalid={!!showError('fullName')}
                className={withValidation(fieldBase, !!showError('fullName'))}
              />
              <FieldError message={showError('fullName')} />
            </div>
          )}

          {!isLoginTab && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onBlur={() => mark('phone')}
                  placeholder="+971 000 880 1819..."
                  aria-invalid={!!showError('phone')}
                  className={withValidation(fieldBase, !!showError('phone'))}
                />
                <FieldError message={showError('phone')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => mark('email')}
                  placeholder="you@gmail.com"
                  aria-invalid={!!showError('email')}
                  className={withValidation(fieldBase, !!showError('email'))}
                />
                <FieldError message={showError('email')} />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => mark('password')}
                placeholder="123456"
                aria-invalid={!!showError('password')}
                className={withValidation(`${fieldBase} pl-9 pr-9 font-mono`, !!showError('password'))}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError message={showError('password')} />
          </div>

          {!isLoginTab && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={() => mark('confirmPassword')}
                    placeholder="Re-enter password"
                    aria-invalid={!!showError('confirmPassword')}
                    className={withValidation(`${fieldBase} pl-9 font-mono`, !!showError('confirmPassword'))}
                  />
                </div>
                <FieldError message={showError('confirmPassword')} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Pin
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={transactionPin}
                    onChange={e => setTransactionPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onBlur={() => mark('transactionPin')}
                    placeholder="4 digits"
                    aria-invalid={!!showError('transactionPin')}
                    className={withValidation(`${fieldBase} font-mono tracking-widest`, !!showError('transactionPin'))}
                  />
                  <FieldError message={showError('transactionPin')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Transaction Pin
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={confirmTransactionPin}
                    onChange={e => setConfirmTransactionPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onBlur={() => mark('confirmTransactionPin')}
                    placeholder="4 digits"
                    aria-invalid={!!showError('confirmTransactionPin')}
                    className={withValidation(`${fieldBase} font-mono tracking-widest`, !!showError('confirmTransactionPin'))}
                  />
                  <FieldError message={showError('confirmTransactionPin')} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  USER ID
                </label>
                <input
                  type="text"
                  value={userId}
                  readOnly
                  disabled
                  className={`${fieldBase} font-mono bg-slate-100 dark:bg-slate-800 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reference Username
                </label>
                <input
                  type="text"
                  value={referenceUsername}
                  onChange={e => setReferenceUsername(e.target.value)}
                  onBlur={() => mark('referenceUsername')}
                  placeholder="Optional — sponsor's username or USER ID"
                  aria-invalid={!!showError('referenceUsername')}
                  className={withValidation(`${fieldBase} font-mono`, !!showError('referenceUsername'))}
                />
                <FieldError message={showError('referenceUsername')} />
              </div>
            </>
          )}

          {isLoginTab && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                <span>{t('rememberMe')}</span>
              </label>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-Bit SSL
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              aria-disabled={showFixLabel}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                showFixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow-amber-600/20'
              }`}
            >
              <span>
                {showFixLabel
                  ? `Fix ${invalidCount} field${invalidCount > 1 ? 's' : ''} to continue`
                  : isLoginTab ? t('btnSignIn') : 'Submit'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {isLoginTab && (
              <button
                type="button"
                onClick={() => switchTab(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                New Registration
              </button>
            )}
          </div>
        </form>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
          Questra World 24/7 Support Hotline: +44 181 068 5888</div>

      </div>
    </div>
  );
};
