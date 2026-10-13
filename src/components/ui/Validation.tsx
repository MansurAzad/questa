import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * In-field inline error. Renders nothing when the field is valid so forms
 * stay clean, and announces itself to assistive tech via role="alert".
 */
export const FieldError: React.FC<{ message?: string | null; id?: string; className?: string }> = ({
  message,
  id,
  className = ''
}) => {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={`mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 ${className}`}
    >
      <AlertCircle className="w-3 h-3 mt-[1px] shrink-0" />
      <span>{message}</span>
    </p>
  );
};

/**
 * In-box validation summary. Shown at the top of a form when the user tries to
 * submit with one or more invalid fields. Lists every problem at once.
 */
export const ValidationSummary: React.FC<{
  messages: string[];
  title?: string;
  className?: string;
}> = ({ messages, title = 'Please correct the highlighted fields', className = '' }) => {
  if (!messages.length) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs ${className}`}
    >
      <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300 mb-1.5">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{title}</span>
      </div>
      <ul className="list-disc pl-4 space-y-0.5 text-rose-600 dark:text-rose-400">
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Small inline information note used to reassure the user (e.g. why a field is
 * required or what format is expected). Kept subtle and inline.
 */
export const FieldHint: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <p className={`mt-1 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed ${className}`}>
    {children}
  </p>
);

/**
 * Appends the standard invalid-field styling to any tailwind input class
 * string. When `invalid` is true the border + focus ring turn rose.
 */
export const withValidation = (base: string, invalid: boolean): string => {
  if (!invalid) return base;
  return `${base} border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/40`;
};

/** Focus + scroll the first invalid control so the user sees the problem. */
export const focusFirstInvalid = (form: HTMLFormElement | null) => {
  if (!form) return;
  const target = form.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (target) {
    target.focus();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
