/**
 * Questa World — central validation toolkit.
 *
 * Every form in the app uses these pure rule functions so that validation
 * behaviour (in-field messages, red-field highlighting, in-box summaries and
 * disabled in-button submit states) is identical for both investors and admins.
 *
 * A rule returns `null` when the value is valid, or a short human message
 * (English only) when it is not.
 */

export type Rule = (value: string) => string | null;

export interface RuleSet {
  [field: string]: Rule;
}

export interface ValidationResult {
  errors: Record<string, string>;
  isValid: boolean;
  firstInvalid: string | null;
  messages: string[];
}

/** Core runner — evaluates every rule and collects the failures. */
export const runRules = (values: Record<string, any>, rules: RuleSet): ValidationResult => {
  const errors: Record<string, string> = {};
  for (const field of Object.keys(rules)) {
    const raw = values[field];
    const message = rules[field](raw === undefined || raw === null ? '' : String(raw));
    if (message) errors[field] = message;
  }
  const keys = Object.keys(errors);
  return {
    errors,
    isValid: keys.length === 0,
    firstInvalid: keys[0] || null,
    messages: keys.map(k => errors[k])
  };
};

// ---------------------------------------------------------------------------
// Primitive checks
// ---------------------------------------------------------------------------
export const isBlank = (v: unknown) =>
  v === undefined || v === null || String(v).trim().length === 0;

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const isPhone = (v: string) => {
  const digits = v.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export const isStrongEnoughPassword = (v: string, min = 6) => v.length >= min;

export const isTronAddress = (v: string) => /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(v.trim());

export const isTronTxId = (v: string) => /^[0-9a-fA-F]{64}$/.test(v.trim()) || v.trim().length >= 16;

export const isPositiveNumber = (v: string) => {
  const n = Number(String(v).replace(/,/g, '').trim());
  return Number.isFinite(n) && n > 0;
};

// ---------------------------------------------------------------------------
// Composable rule factories
// ---------------------------------------------------------------------------
export const required = (label: string): Rule => v =>
  isBlank(v) ? `${label} is required.` : null;

export const minLength = (label: string, n: number): Rule => v =>
  !isBlank(v) && v.trim().length < n
    ? `${label} must be at least ${n} characters.`
    : null;

export const maxLength = (label: string, n: number): Rule => v =>
  v.trim().length > n ? `${label} must be ${n} characters or fewer.` : null;

/** Required + valid email. */
export const email = (label = 'Email address'): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  return isEmail(v) ? null : `Enter a valid ${label.toLowerCase()} (e.g. name@example.com).`;
};

/** Optional email — only fails when something is typed but malformed. */
export const optionalEmail = (label = 'Email address'): Rule => v => {
  if (isBlank(v)) return null;
  return isEmail(v) ? null : `Enter a valid ${label.toLowerCase()} (e.g. name@example.com).`;
};

export const phone = (label = 'Mobile number', requiredField = true): Rule => v => {
  if (isBlank(v)) return requiredField ? `${label} is required.` : null;
  return isPhone(v) ? null : `Enter a valid ${label.toLowerCase()} (10–15 digits).`;
};

export const username = (label = 'Username'): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  const t = v.trim();
  if (t.length < 4) return `${label} must be at least 4 characters.`;
  if (!/^[a-zA-Z0-9_.]+$/.test(t)) return `Use only letters, numbers, dot (.) and underscore (_).`;
  return null;
};

export const password = (label = 'Password', min = 6): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  if (!isStrongEnoughPassword(v, min)) return `${label} must be at least ${min} characters.`;
  return null;
};

export const positiveAmount = (label = 'Amount'): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  if (!isPositiveNumber(v)) return `${label} must be a positive number.`;
  return null;
};

export const minAmount = (label: string, minimum: number): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  const n = Number(String(v).replace(/,/g, ''));
  if (!Number.isFinite(n) || n <= 0) return `${label} must be a positive number.`;
  if (n < minimum) return `${label} must be at least ${minimum.toLocaleString()}.`;
  return null;
};

export const accountNumber = (label = 'Account number'): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  if (!/^[0-9]{6,20}$/.test(v.trim())) return `${label} must be 6–20 digits.`;
  return null;
};

export const tronAddress = (label = 'USDT (TRC20) wallet address'): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  return isTronAddress(v)
    ? null
    : `Enter a valid Tron address (starts with T, 34 characters).`;
};

export const tronTxId = (label = 'On-chain Transaction Hash'): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  return isTronTxId(v)
    ? null
    : `${label} looks too short — paste the full transaction hash from your wallet.`;
};

export const pin = (label = 'T-PIN', digits = 4): Rule => v => {
  if (isBlank(v)) return `${label} is required.`;
  if (!new RegExp(`^\\d{${digits}}$`).test(v.trim()))
    return `${label} must be exactly ${digits} digits.`;
  return null;
};

export const maxValue = (label: string, maximum: number, formatter?: (n: number) => string): Rule => v => {
  const n = Number(String(v).replace(/,/g, ''));
  if (!Number.isFinite(n)) return undefined as any;
  if (n > maximum)
    return `${label} cannot exceed ${formatter ? formatter(maximum) : maximum.toLocaleString()}.`;
  return null;
};

/** Compose several rules for one field (first failure wins). */
export const compose = (...rules: Rule[]): Rule => v => {
  for (const r of rules) {
    const msg = r(v);
    if (msg) return msg;
  }
  return null;
};

/** Human summary box title used by every form. */
export const SUMMARY_TITLE = 'Please correct the highlighted fields';
