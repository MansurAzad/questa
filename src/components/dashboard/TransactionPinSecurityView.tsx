import React, { useMemo, useRef, useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Laptop
} from 'lucide-react';
import { Language, User } from '../../types';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  password as passwordRule,
  pin as pinRule,
  runRules,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

const fieldBase =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500';

interface TransactionPinSecurityViewProps {
  user: User;
  language: Language;
}

export const TransactionPinSecurityView: React.FC<TransactionPinSecurityViewProps> = ({
  user,
  language
}) => {
  const [security, setSecurity] = useState(() => StorageService.getSecuritySettings());

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passServerErr, setPassServerErr] = useState<Record<string, string>>({});
  const [passTouched, setPassTouched] = useState<Record<string, boolean>>({});
  const [passAttempt, setPassAttempt] = useState(false);
  const passRef = useRef<HTMLFormElement>(null);

  // PIN form
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinServerErr, setPinServerErr] = useState<Record<string, string>>({});
  const [pinTouched, setPinTouched] = useState<Record<string, boolean>>({});
  const [pinAttempt, setPinAttempt] = useState(false);
  const pinRef = useRef<HTMLFormElement>(null);

  const passRules: RuleSet = {
    currentPassword: required('Current password'),
    newPassword: compose(required('New password'), passwordRule('New password', 6)),
    confirmPassword: (v) => {
      if (!v) return 'Please confirm your new password.';
      if (v !== newPassword) return 'New passwords do not match.';
      return null;
    }
  };
  const passValues = { currentPassword, newPassword, confirmPassword };
  const passResult = useMemo(() => runRules(passValues, passRules), [currentPassword, newPassword, confirmPassword]);

  const pinRules: RuleSet = {
    currentPin: pinRule('Current T-PIN', 4),
    newPin: pinRule('New T-PIN', 4),
    confirmPin: (v) => {
      if (!v) return 'Please confirm your new T-PIN.';
      if (!/^\d{4}$/.test(v)) return 'T-PIN must be exactly 4 digits.';
      if (v !== newPin) return 'T-PINs do not match.';
      return null;
    }
  };
  const pinValues = { currentPin, newPin, confirmPin };
  const pinResult = useMemo(() => runRules(pinValues, pinRules), [currentPin, newPin, confirmPin]);

  const passShow = (f: string): string | null =>
    (passTouched[f] || passAttempt) ? (passResult.errors[f] || passServerErr[f] || null) : (passServerErr[f] || null);
  const pinShow = (f: string): string | null =>
    (pinTouched[f] || pinAttempt) ? (pinResult.errors[f] || pinServerErr[f] || null) : (pinServerErr[f] || null);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassServerErr({});
    setPassAttempt(true);
    if (!passResult.isValid) {
      focusFirstInvalid(passRef.current);
      return;
    }
    if (currentPassword !== security.password) {
      setPassServerErr({ currentPassword: 'Current password is incorrect.' });
      focusFirstInvalid(passRef.current);
      return;
    }
    StorageService.updateSecuritySettings({ password: newPassword });
    setSecurity(StorageService.getSecuritySettings());
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPassAttempt(false);
    setPassTouched({});
    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinServerErr({});
    setPinAttempt(true);
    if (!pinResult.isValid) {
      focusFirstInvalid(pinRef.current);
      return;
    }
    if (currentPin !== security.transactionPin) {
      setPinServerErr({ currentPin: 'Current T-PIN is incorrect.' });
      focusFirstInvalid(pinRef.current);
      return;
    }
    StorageService.updateSecuritySettings({ transactionPin: newPin });
    setSecurity(StorageService.getSecuritySettings());
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setPinAttempt(false);
    setPinTouched({});
    setPinSuccess(true);
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleToggle2FA = () => {
    const next = !security.twoFactorEnabled;
    StorageService.updateSecuritySettings({ twoFactorEnabled: next });
    StorageService.updateUser({ twoFactorEnabled: next });
    setSecurity(StorageService.getSecuritySettings());
  };

  const passFail = passResult.messages.length + Object.values(passServerErr).filter(Boolean).length;
  const pinFail = pinResult.messages.length + Object.values(pinServerErr).filter(Boolean).length;
  const passFix = passAttempt && fail2Bool(passResult, passServerErr);
  const pinFix = pinAttempt && fail2Bool(pinResult, pinServerErr);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Account Security, Password & Transaction PIN
          </h2>
          <p className="text-xs text-slate-500">
            Manage login credentials, 4-digit transfer PIN, and multi-factor authentication protocols.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>E2E ENCRYPTED VAULT: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: Change Login Password */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Change Login Password</span>
          </h3>

          {passSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password successfully updated!</span>
            </div>
          )}

          {passFix && (
            <ValidationSummary messages={[...passResult.messages, ...Object.values(passServerErr)]} />
          )}

          <form ref={passRef} onSubmit={handleUpdatePassword} noValidate className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Current Password *
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => { setCurrentPassword(e.target.value); if (passServerErr.currentPassword) setPassServerErr({}); }}
                onBlur={() => setPassTouched(p => ({ ...p, currentPassword: true }))}
                aria-invalid={!!passShow('currentPassword')}
                className={withValidation(`${fieldBase} font-mono`, !!passShow('currentPassword'))}
              />
              <FieldError message={passShow('currentPassword')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                New Password *
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                onBlur={() => setPassTouched(p => ({ ...p, newPassword: true }))}
                aria-invalid={!!passShow('newPassword')}
                className={withValidation(`${fieldBase} font-mono`, !!passShow('newPassword'))}
              />
              <FieldError message={passShow('newPassword')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Confirm New Password *
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onBlur={() => setPassTouched(p => ({ ...p, confirmPassword: true }))}
                aria-invalid={!!passShow('confirmPassword')}
                className={withValidation(`${fieldBase} font-mono`, !!passShow('confirmPassword'))}
              />
              <FieldError message={passShow('confirmPassword')} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-[11px]"
              >
                {showPass ? 'Hide Password' : 'Show Password'}
              </button>
              <button
                type="submit"
                aria-disabled={passFix}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                  passFix
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {passFix ? `Fix ${passFail} field${passFail > 1 ? 's' : ''}` : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: 4-Digit Transaction PIN (T-PIN) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>4-Digit Transaction PIN (T-PIN)</span>
          </h3>

          <p className="text-xs text-slate-500">
            Required for approving fund withdrawals, member balance transfers, and nominee updates.
          </p>

          {pinSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>T-PIN successfully updated!</span>
            </div>
          )}

          {pinFix && (
            <ValidationSummary messages={[...pinResult.messages, ...Object.values(pinServerErr)]} />
          )}

          <form ref={pinRef} onSubmit={handleUpdatePin} noValidate className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Current 4-Digit T-PIN *
              </label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={e => { setCurrentPin(e.target.value.replace(/\D/g, '')); if (pinServerErr.currentPin) setPinServerErr({}); }}
                onBlur={() => setPinTouched(p => ({ ...p, currentPin: true }))}
                aria-invalid={!!pinShow('currentPin')}
                className={withValidation(`${fieldBase} font-mono text-center tracking-widest text-base`, !!pinShow('currentPin'))}
              />
              <FieldError message={pinShow('currentPin')} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  New 4-Digit T-PIN *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => setPinTouched(p => ({ ...p, newPin: true }))}
                  aria-invalid={!!pinShow('newPin')}
                  className={withValidation(`${fieldBase} font-mono text-center tracking-widest text-base`, !!pinShow('newPin'))}
                />
                <FieldError message={pinShow('newPin')} />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Confirm T-PIN *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => setPinTouched(p => ({ ...p, confirmPin: true }))}
                  aria-invalid={!!pinShow('confirmPin')}
                  className={withValidation(`${fieldBase} font-mono text-center tracking-widest text-base`, !!pinShow('confirmPin'))}
                />
                <FieldError message={pinShow('confirmPin')} />
              </div>
            </div>

            <button
              type="submit"
              aria-disabled={pinFix}
              className={`w-full py-2 rounded-xl font-semibold text-xs transition-colors ${
                pinFix
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {pinFix ? `Fix ${pinFail} field${pinFail > 1 ? 's' : ''}` : 'Update Transaction PIN'}
            </button>
          </form>
        </div>

      </div>

      {/* Two-Factor Authentication & Device Log Strip */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>SMS / Mobile Two-Factor Authentication (2FA)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Receive a 6-digit one-time passcode on {user.phone} whenever signing in from a new browser.
            </p>
          </div>

          <button
            onClick={handleToggle2FA}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              security.twoFactorEnabled
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {security.twoFactorEnabled ? '2FA Active' : 'Enable 2FA'}
          </button>
        </div>

        {/* Active Session Devices */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block">
            Active Verified Login Sessions:
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 gap-2">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-emerald-600" />
              <div>
                <strong className="text-slate-900 dark:text-white block">Current Device (Chrome on Linux / Web Preview)</strong>
                <span className="text-[10px] text-slate-400 font-mono">IP: 103.205.71.x · Chattogram / Dhaka Gateway</span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600">THIS SESSION (ACTIVE)</span>
          </div>
        </div>
      </div>

    </div>
  );
};

function fail2Bool(result: { isValid: boolean }, serverErr: Record<string, string>): boolean {
  return !result.isValid || Object.values(serverErr).some(Boolean);
}
