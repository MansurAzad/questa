import React, { useMemo, useRef, useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language, User, TransactionRecord } from '../../types';
import { formatBDT } from '../../services/i18n';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  minLength,
  minAmount,
  pin as pinRule,
  runRules,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

const fieldBase =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500';

interface MemberTransferViewProps {
  user: User;
  language: Language;
  onRefreshData: () => void;
}

export const MemberTransferView: React.FC<MemberTransferViewProps> = ({
  user,
  language,
  onRefreshData
}) => {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [transactionPin, setTransactionPin] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [successTx, setSuccessTx] = useState<TransactionRecord | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Withdrawable wallet balance = credits (dividends/commissions) minus debits already made
  const credits = StorageService.getTransactions()
    .filter(t => t.type === 'credit')
    .reduce((a, t) => a + t.amount, 0);
  const debits = StorageService.getTransactions()
    .filter(t => t.type === 'debit' && t.category !== 'installment')
    .reduce((a, t) => a + t.amount, 0);
  const availableBalance = Math.max(0, credits - debits);

  const rules: RuleSet = useMemo(() => ({
    recipientUsername: compose(required('Recipient username'), minLength('Recipient username', 3)),
    transferAmount: compose(
      minAmount('Transfer amount', 500),
      (v) => (Number(v) > availableBalance ? `Amount exceeds your available balance of ${formatBDT(availableBalance, language)}.` : null)
    ),
    transactionPin: pinRule('Transaction PIN (T-PIN)', 4)
  }), [availableBalance, language]);

  const values = { recipientUsername, transferAmount, transactionPin };
  const result = useMemo(() => runRules(values, rules), [rules, recipientUsername, transferAmount, transactionPin]);

  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || serverErrors[field] || null) : (serverErrors[field] || null);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors({});
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }

    const security = StorageService.getSecuritySettings();
    const nextServerErrors: Record<string, string> = {};

    if (transactionPin !== security.transactionPin) {
      nextServerErrors.transactionPin = 'Incorrect Transaction PIN. Please re-enter your 4-digit T-PIN.';
    }

    const recipient = recipientUsername.trim().toLowerCase();
    const recipientExists = StorageService.getAdminInvestors().some(
      i => i.username.toLowerCase() === recipient || i.memberId.toLowerCase() === recipient
    );
    if (!recipientExists) {
      nextServerErrors.recipientUsername = 'Recipient not found in the Questra World member registry. Check the username or member ID.';
    } else if (recipient === user.username.toLowerCase() || recipient === user.memberId.toLowerCase()) {
      nextServerErrors.recipientUsername = 'You cannot transfer funds to your own account.';
    }

    if (Object.keys(nextServerErrors).length > 0) {
      setServerErrors(nextServerErrors);
      focusFirstInvalid(formRef.current);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const tx: TransactionRecord = {
        id: 'tx-trf-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        title: `P2P Fund Transfer to @${recipientUsername}${transferNote.trim() ? ` — ${transferNote.trim()}` : ''}`,
        titleBn: `Internal Balance Transfer to @${recipientUsername}`,
        category: 'payout',
        amount: transferAmount,
        type: 'debit',
        status: 'completed',
        method: 'Internal P2P Wallet Transfer',
        referenceNo: 'TRF-' + Math.floor(100000 + Math.random() * 900000)
      };

      StorageService.addTransaction(tx);
      StorageService.addAuditLog('P2P_TRANSFER', `@${recipientUsername}`, `Transferred ৳${tx.amount.toLocaleString()} from @${user.username}. Ref: ${tx.referenceNo}`, 'success');

      setIsProcessing(false);
      setSuccessTx(tx);
      setSubmitAttempt(false);
      setTouched({});
      onRefreshData();
    }, 800);
  };

  const showFixLabel = submitAttempt && (!result.isValid || Object.keys(serverErrors).length > 0);
  const failCount = result.messages.length + Object.values(serverErrors).filter(Boolean).length;
  const combinedMessages = [...result.messages, ...Object.values(serverErrors)];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Member-to-Member Balance Transfer
          </h2>
          <p className="text-xs text-slate-500">
            Transfer wallet funds to another verified member ID or investor account within Questra World using your 4-digit Transaction PIN.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono">
          <span>Available Wallet: <strong>{formatBDT(availableBalance, language)}</strong></span>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {successTx ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Transfer Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ref: <strong className="font-mono">{successTx.referenceNo}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Member:</span>
                <strong className="text-slate-900 dark:text-white">@{recipientUsername}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transferred Amount:</span>
                <strong className="text-emerald-600">{formatBDT(successTx.amount, language)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Timestamp:</span>
                <span className="font-mono">{successTx.date}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessTx(null);
                setRecipientUsername('');
                setTransactionPin('');
                setTransferNote('');
                setTransferAmount(5000);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
            >
              Make Another Transfer
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleTransfer} noValidate className="space-y-4 text-xs">
            {showFixLabel && <ValidationSummary messages={combinedMessages} />}

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Recipient Username / Member ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. anwar_ctg or QW-CTG-9021"
                  value={recipientUsername}
                  onChange={e => { setRecipientUsername(e.target.value); if (serverErrors.recipientUsername) setServerErrors(prev => ({ ...prev, recipientUsername: '' })); }}
                  onBlur={() => mark('recipientUsername')}
                  aria-invalid={!!showError('recipientUsername')}
                  className={withValidation(`${fieldBase} font-mono`, !!showError('recipientUsername'))}
                />
              </div>
              <FieldError message={showError('recipientUsername')} />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Instant verification across Questra World member registry.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Amount to Transfer (BDT) *
              </label>
              <input
                type="number"
                min="500"
                max={availableBalance}
                value={transferAmount}
                onChange={e => setTransferAmount(Number(e.target.value))}
                onBlur={() => mark('transferAmount')}
                aria-invalid={!!showError('transferAmount')}
                className={withValidation(`${fieldBase} font-mono`, !!showError('transferAmount'))}
              />
              <FieldError message={showError('transferAmount')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                4-Digit Security Transaction PIN (T-PIN) *
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={transactionPin}
                onChange={e => { setTransactionPin(e.target.value.replace(/\D/g, '')); if (serverErrors.transactionPin) setServerErrors(prev => ({ ...prev, transactionPin: '' })); }}
                onBlur={() => mark('transactionPin')}
                aria-invalid={!!showError('transactionPin')}
                className={withValidation(`${fieldBase} font-mono text-center tracking-widest text-base`, !!showError('transactionPin'))}
              />
              <FieldError message={showError('transactionPin')} />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Transfer Note / Reference Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Share installment co-transfer"
                value={transferNote}
                onChange={e => setTransferNote(e.target.value)}
                className={fieldBase}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              aria-disabled={showFixLabel}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 ${
                showFixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isProcessing ? (
                <span>Verifying T-PIN &amp; Transferring...</span>
              ) : showFixLabel ? (
                `Fix ${failCount} field${failCount > 1 ? 's' : ''} to transfer`
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Member Transfer</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
