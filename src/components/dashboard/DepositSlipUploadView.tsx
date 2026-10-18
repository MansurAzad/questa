import React, { useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Image,
  Copy,
  Wallet,
  Trash2
} from 'lucide-react';
import { Language, User, InstallmentRecord } from '../../types';
import { formatBDT } from '../../services/i18n';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  tronTxId,
  runRules,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

interface DepositSlipUploadViewProps {
  user: User;
  installments: InstallmentRecord[];
  language: Language;
}

const fieldBase =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500';

const todayISO = () => new Date().toISOString().split('T')[0];

export const DepositSlipUploadView: React.FC<DepositSlipUploadViewProps> = ({
  user,
  installments,
  language
}) => {
  const dueInstallments = installments.filter(i => i.status !== 'paid');

  const [selectedInstallmentId, setSelectedInstallmentId] = useState(
    () => dueInstallments[0]?.id || installments[0]?.id || ''
  );
  const [paymentMode, setPaymentMode] = useState('Bank Cash Deposit');
  const [bankName, setBankName] = useState('HSBC (Central Branch)');
  const [slipNumber, setSlipNumber] = useState('CBL-DEP-884291');
  const [depositDate, setDepositDate] = useState(todayISO());
  const [txHash, setTxHash] = useState('');
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [slips, setSlips] = useState(() => StorageService.getDepositSlips().filter(s => s.memberUsername === user.username || s.memberId === user.memberId));
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const crypto = StorageService.getCryptoPaymentSettings();
  const cryptoMode = paymentMode === 'USDT (TRC20) Crypto Transfer';
  const selectedInstallment = installments.find(i => i.id === selectedInstallmentId) || dueInstallments[0] || installments[0];

  const rules: RuleSet = useMemo(() => {
    const base: RuleSet = {
      selectedInstallmentId: required('Installment'),
      depositDate: (v) => {
        if (!v.trim()) return 'Deposit date is required.';
        if (v > todayISO()) return 'Deposit date cannot be in the future.';
        return null;
      }
    };
    if (cryptoMode) {
      return { ...base, txHash: tronTxId('On-chain Transaction Hash (TxID)') };
    }
    return {
      ...base,
      bankName: required('Bank name & branch'),
      slipNumber: compose(required('Slip / Scroll / Cheque number'))
    };
  }, [cryptoMode]);

  const values: Record<string, any> = {
    selectedInstallmentId,
    depositDate,
    txHash,
    bankName,
    slipNumber
  };
  const result = useMemo(() => runRules(values, rules), [rules, selectedInstallmentId, depositDate, txHash, bankName, slipNumber]);

  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const refreshSlips = () => {
    setSlips(StorageService.getDepositSlips().filter(s => s.memberUsername === user.username || s.memberId === user.memberId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    const inst = selectedInstallment;
    if (!inst) return;

    if (cryptoMode) {
      StorageService.submitCryptoDeposit({
        amountBDT: inst.amount,
        txHash: txHash.trim(),
        installmentId: inst.id,
        bookingId: 'share-royal-bay-204'
      });
      refreshSlips();
      setSuccess(true);
      setTxHash('');
      setSubmitAttempt(false);
      setTouched({});
      setTimeout(() => setSuccess(false), 3000);
      return;
    }

    StorageService.createDepositSlip({
      memberUsername: user.username,
      memberName: user.fullName,
      memberId: user.memberId,
      bookingId: 'share-royal-bay-204',
      projectName: 'Questra Royal Bay (Suites & Residences)',
      bankName,
      branchName: paymentMode,
      amount: inst.amount,
      depositDate,
      slipNo: slipNumber,
      transactionId: 'DEP-' + Math.floor(100000 + Math.random() * 900000),
      notes: `${paymentMode} for ${inst.title}`
    });

    refreshSlips();
    setSuccess(true);
    setSlipNumber('CBL-DEP-' + Math.floor(100000 + Math.random() * 900000));
    setSubmitAttempt(false);
    setTouched({});
    setTimeout(() => setSuccess(false), 3000);
  };

  const copyWallet = () => {
    navigator.clipboard?.writeText(crypto.walletAddress);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleDeleteSlip = (slipId: string) => {
    if (!window.confirm('Cancel and delete this pending deposit slip? This cannot be undone.')) return;
    StorageService.deleteDepositSlip(slipId);
    refreshSlips();
  };

  const showFixLabel = submitAttempt && !result.isValid;
  const noDueInstallment = dueInstallments.length === 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Manual Deposit &amp; Crypto Payment Submission
          </h2>
          <p className="text-xs text-slate-500">
            Upload bank deposit counterfoils, or pay by USDT (TRC20). Every submission is verified manually by the Questra World accounts department.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Average Approval Time: Under 2 Hours</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Upload Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Submit New Deposit Counterfoil
          </h3>

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Deposit slip submitted successfully! Our audit desk is verifying the bank clearing.</span>
            </div>
          )}

          {noDueInstallment && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>You have no outstanding installments — every scheduled payment is settled.</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
            {showFixLabel && <ValidationSummary messages={result.messages} />}

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Select Due Installment *
              </label>
              <select
                value={selectedInstallmentId}
                onChange={e => { setSelectedInstallmentId(e.target.value); mark('selectedInstallmentId'); }}
                onBlur={() => mark('selectedInstallmentId')}
                aria-invalid={!!showError('selectedInstallmentId')}
                className={withValidation(fieldBase, !!showError('selectedInstallmentId'))}
              >
                {dueInstallments.length === 0 && <option value="">No due installments</option>}
                {dueInstallments.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.title} — {formatBDT(i.amount, language)} (Due: {i.dueDate})
                  </option>
                ))}
              </select>
              <FieldError message={showError('selectedInstallmentId')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Payment Mode *
                </label>
                <select
                  value={paymentMode}
                  onChange={e => { setPaymentMode(e.target.value); setSubmitAttempt(false); setTouched({}); }}
                  className={fieldBase}
                >
                  <option>Bank Cash Deposit</option>
                  <option>Account Transfer / IBFT</option>
                  <option>Cheque / Pay Order</option>
                  <option>PayPal / Wise Agent Counter</option>
                  {crypto.enabled && <option>USDT (TRC20) Crypto Transfer</option>}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Deposit Date *
                </label>
                <input
                  type="date"
                  max={todayISO()}
                  value={depositDate}
                  onChange={e => setDepositDate(e.target.value)}
                  onBlur={() => mark('depositDate')}
                  aria-invalid={!!showError('depositDate')}
                  className={withValidation(`${fieldBase} font-mono`, !!showError('depositDate'))}
                />
                <FieldError message={showError('depositDate')} />
              </div>
            </div>

            {cryptoMode ? (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-amber-500" />
                    {crypto.network} Wallet
                  </span>
                  <span className="text-[10px] text-slate-400">Manual verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-2.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">
                    {crypto.walletAddress}
                  </code>
                  <button
                    type="button"
                    onClick={copyWallet}
                    className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                    title="Copy wallet address"
                  >
                    {copiedWallet ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase block">Payable</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">
                      {formatBDT(selectedInstallment?.amount || 0, language)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase block">USDT (≈)</span>
                    <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                      {StorageService.bdtToUsdt(selectedInstallment?.amount || 0)} USDT
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{crypto.instructions}</p>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    On-chain Transaction Hash (TxID) *
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={e => setTxHash(e.target.value)}
                    onBlur={() => mark('txHash')}
                    placeholder="Paste your TRC20 transaction hash"
                    aria-invalid={!!showError('txHash')}
                    className={withValidation(`${fieldBase} font-mono`, !!showError('txHash'))}
                  />
                  <FieldError message={showError('txHash')} />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Bank Name & Branch *
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      onBlur={() => mark('bankName')}
                      aria-invalid={!!showError('bankName')}
                      className={withValidation(fieldBase, !!showError('bankName'))}
                    />
                    <FieldError message={showError('bankName')} />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Slip No. / Scroll No. / Cheque No. *
                    </label>
                    <input
                      type="text"
                      value={slipNumber}
                      onChange={e => setSlipNumber(e.target.value)}
                      onBlur={() => mark('slipNumber')}
                      aria-invalid={!!showError('slipNumber')}
                      className={withValidation(`${fieldBase} font-mono`, !!showError('slipNumber'))}
                    />
                    <FieldError message={showError('slipNumber')} />
                  </div>
                </div>

                {/* Drag & Drop Simulation */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Attach Scanned Deposit Voucher / Slip Photo
                  </label>
                  <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800/50 space-y-2">
                    <Image className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-amber-600">Slip attached automatically</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      PNG, JPG, PDF up to 10MB accepted
                    </span>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={noDueInstallment}
              aria-disabled={showFixLabel}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 ${
                showFixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {showFixLabel
                ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''} to submit`
                : cryptoMode ? 'Submit Crypto Payment for Verification' : 'Submit Deposit Slip for Verification'}
            </button>
          </form>
        </div>

        {/* History / Status List */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{ 'Submission Status'}</span>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
              {slips.length} { 'Slips'}
            </span>
          </h3>

          <div className="space-y-3">
            {slips.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                { 'No deposit slips submitted yet.'}
              </div>
            ) : (
              slips.map(s => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{s.projectName}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : s.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                      }`}>
                        {s.status}
                      </span>
                      {s.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteSlip(s.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Cancel/Delete Slip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-slate-500 font-mono">
                    <span>Slip: {s.slipNo}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatBDT(s.amount, language)}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{s.bankName}</span>
                    <span>Date: {s.depositDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
