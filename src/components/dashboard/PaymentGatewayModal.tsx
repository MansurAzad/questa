import React, { useMemo, useRef, useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Copy,
  Clock
} from 'lucide-react';
import { AdminDepositSlip } from '../../types/admin';
import { InstallmentRecord, Language, TransactionRecord } from '../../types';
import { formatBDT, getTranslation, translations } from '../../services/i18n';
import { StorageService } from '../../services/storage';
import { compose, phone, required, runRules, tronTxId, Rule, RuleSet } from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid } from '../ui/Validation';

type PayChannel = 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Card' | 'USDT (TRC20)';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  installment: InstallmentRecord | null;
  language: Language;
  onPaymentSuccess: (tx?: TransactionRecord) => void;
}

const fieldBase =
  'w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2';
const fieldOk = 'border-slate-300 dark:border-slate-600 focus:ring-amber-500/30';
const fieldBad = 'border-rose-400 dark:border-rose-500 focus:ring-rose-500/30';
const fc = (invalid: boolean, extra = '') => `${fieldBase} ${invalid ? fieldBad : fieldOk} ${extra}`;

const cardNumberRule: Rule = v => {
  const digits = v.replace(/\s/g, '');
  if (!digits) return 'Card number is required.';
  if (!/^\d{16}$/.test(digits)) return 'Card number must be 16 digits.';
  return null;
};
const cardExpiryRule: Rule = v => {
  const t = v.trim();
  if (!t) return 'Card expiry is required.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(t)) return 'Use MM/YY format (e.g. 09/28).';
  const [mm, yy] = t.split('/').map(Number);
  const expiry = new Date(2000 + yy, mm, 0);
  if (expiry < new Date()) return 'This card has expired.';
  return null;
};
const cardCvvRule: Rule = v => {
  const t = v.trim();
  if (!t) return 'CVV is required.';
  if (!/^\d{3,4}$/.test(t)) return 'CVV must be 3 or 4 digits.';
  return null;
};

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  installment,
  language,
  onPaymentSuccess
}) => {
  const [selectedChannel, setSelectedChannel] = useState<PayChannel>('bKash');
  const [accountNumber, setAccountNumber] = useState('01819745239');
  const [transactionId, setTransactionId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 9182 7364 8842');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<TransactionRecord | null>(null);
  const [pendingCrypto, setPendingCrypto] = useState<AdminDepositSlip | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const t = (key: keyof typeof translations.en) => getTranslation(language, key);

  const cryptoSettings = StorageService.getCryptoPaymentSettings();
  const cryptoEnabled = cryptoSettings.enabled && !!cryptoSettings.walletAddress.trim();
  const usdtAmount = StorageService.bdtToUsdt(installment?.amount || 0);

  const isMobile = selectedChannel === 'bKash' || selectedChannel === 'Nagad' || selectedChannel === 'Rocket';

  const rules: RuleSet = useMemo<RuleSet>(() => {
    if (isMobile) {
      const r: RuleSet = { accountNumber: phone('Mobile number', true) };
      return r;
    }
    if (selectedChannel === 'Card') {
      const r: RuleSet = { cardNumber: cardNumberRule, cardExpiry: cardExpiryRule, cardCvv: cardCvvRule };
      return r;
    }
    if (selectedChannel === 'Bank Transfer') {
      const r: RuleSet = { transactionId: required('Bank deposit slip no / online reference') };
      return r;
    }
    if (selectedChannel === 'USDT (TRC20)') {
      const r: RuleSet = { transactionId: tronTxId('On-chain transaction hash') };
      return r;
    }
    const r: RuleSet = {};
    return r;
  }, [selectedChannel, isMobile]);

  const values = { accountNumber, transactionId, cardNumber, cardExpiry, cardCvv };
  const result = useMemo(() => runRules(values, rules), [rules, accountNumber, transactionId, cardNumber, cardExpiry, cardCvv]);

  const showError = (field: string): string | null =>
    touched[field] || submitAttempt ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  if (!isOpen || !installment) return null;

  const channels: { id: PayChannel; label: string; icon: string; desc: string }[] = [
    { id: 'bKash', label: 'bKash Pay', icon: '🇧🇩', desc: 'Merchant 01700-xxx' },
    { id: 'Nagad', label: 'Nagad Direct', icon: '⚡', desc: 'Instant 0.99%' },
    { id: 'Rocket', label: 'Rocket (DBBL)', icon: '🚀', desc: 'Mobile Banking' },
    { id: 'Bank Transfer', label: 'Bank Transfer', icon: '🏛️', desc: 'City Bank / CBL' },
    { id: 'Card', label: 'Visa / Master', icon: '💳', desc: 'Debit / Credit' }
  ];
  if (cryptoEnabled) {
    channels.push({ id: 'USDT (TRC20)', label: 'USDT / TRC20', icon: '🪙', desc: 'Manual crypto' });
  }

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);

    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }

    if (selectedChannel === 'USDT (TRC20)') {
      const hash = transactionId.trim();
      setIsProcessing(true);
      setTimeout(() => {
        try {
          const slip = StorageService.submitCryptoDeposit({
            amountBDT: installment.amount,
            txHash: hash,
            installmentId: installment.id,
            bookingId: installment.bookingId
          });
          setIsProcessing(false);
          setPendingCrypto(slip);
          onPaymentSuccess();
        } catch (err) {
          setIsProcessing(false);
          console.error(err);
        }
      }, 1200);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      try {
        const genTxId = transactionId.trim() || `${selectedChannel.substring(0, 2).toUpperCase()}${Math.floor(1000000 + Math.random() * 9000000)}`;
        const result2 = StorageService.payInstallment(installment.id, selectedChannel as Exclude<PayChannel, 'USDT (TRC20)'>, genTxId);
        setIsProcessing(false);
        setCompletedTx(result2.transaction);
        setSubmitAttempt(false);
        onPaymentSuccess(result2.transaction);
      } catch (err) {
        setIsProcessing(false);
        console.error(err);
      }
    }, 1200);
  };

  const copyWallet = () => {
    navigator.clipboard?.writeText(cryptoSettings.walletAddress);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleResetAndClose = () => {
    setCompletedTx(null);
    setPendingCrypto(null);
    setTransactionId('');
    setSubmitAttempt(false);
    setTouched({});
    onClose();
  };

  const selectChannel = (id: PayChannel) => {
    setSelectedChannel(id);
    setTransactionId('');
    setSubmitAttempt(false);
    setTouched({});
  };

  const fixLabel = submitAttempt && !result.isValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight">
              {t('modalPayTitle')}
            </h3>
            <p className="text-xs text-amber-200/80 mt-0.5">
              {installment.title} - {formatBDT(installment.amount, language)}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedTx ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                { 'Payment Successful!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                { 'Transaction successfully recorded in Questra World ledger.'}
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Money Receipt No:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{completedTx.referenceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel / Method:</span>
                <span className="font-medium text-slate-900 dark:text-white">{completedTx.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatBDT(completedTx.amount, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Timestamp:</span>
                <span className="text-slate-900 dark:text-white font-mono">
                  {completedTx.date} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} BDT
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
            >
              { 'Return to Dashboard'}
            </button>
          </div>
        ) : pendingCrypto ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Crypto Payment Submitted
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your USDT transfer is queued for manual verification. The installment will be marked paid once the finance desk confirms it on-chain.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Reference No:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{pendingCrypto.slipNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Network / Method:</span>
                <span className="font-medium text-slate-900 dark:text-white">{pendingCrypto.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paid Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatBDT(pendingCrypto.amount, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">USDT Sent:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{usdtAmount} USDT</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 shrink-0">TxID:</span>
                <span className="font-mono text-slate-900 dark:text-white break-all text-right">{pendingCrypto.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">PENDING VERIFICATION</span>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handlePay} noValidate className="p-6 space-y-4">

            {fixLabel && <ValidationSummary messages={result.messages} />}

            {/* Amount Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">
                  Payable Amount
                </span>
                <span className="text-lg font-extrabold text-amber-900 dark:text-amber-100">
                  {formatBDT(installment.amount, language)}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-mono font-semibold">
                Due: {installment.dueDate}
              </span>
            </div>

            {/* Select Channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('selectPaymentMethod')}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {channels.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectChannel(c.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedChannel === c.id
                        ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-1 ring-amber-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm">{c.icon}</div>
                    <span className="text-xs font-bold block mt-1 leading-tight">{c.label}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 block">{c.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Channel specific inputs */}
            {isMobile ? (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Merchant Wallet:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">01810-685888</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your {selectedChannel} Mobile Number *
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    onBlur={() => mark('accountNumber')}
                    aria-invalid={!!showError('accountNumber')}
                    className={fc(!!showError('accountNumber'))}
                  />
                  <FieldError message={showError('accountNumber')} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction ID (TrxID) / Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BK9X88291A (or leave blank to auto-generate)"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className={fc(false, 'uppercase')}
                  />
                </div>
              </div>
            ) : selectedChannel === 'Bank Transfer' ? (
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">Questra World Principal Bank Accounts:</p>
                <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-300 font-mono">
                  <p>• The City Bank Ltd (Agrabad/Mirpur) A/C: 1102948192001</p>
                  <p>• Islami Bank Bangladesh PLC A/C: 2050218940023</p>
                </div>
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bank Deposit Slip No / Online Ref *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CBL-FT-94021"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    onBlur={() => mark('transactionId')}
                    aria-invalid={!!showError('transactionId')}
                    className={fc(!!showError('transactionId'))}
                  />
                  <FieldError message={showError('transactionId')} />
                </div>
              </div>
            ) : selectedChannel === 'USDT (TRC20)' ? (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Network:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cryptoSettings.network}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Send USDT to this wallet address:
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">
                      {cryptoSettings.walletAddress}
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
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase block">Payable</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">{formatBDT(installment.amount, language)}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase block">USDT (≈)</span>
                    <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400">{usdtAmount} USDT</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{cryptoSettings.instructions}</p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    On-chain Transaction Hash (TxID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Paste your TRC20 transaction hash"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    onBlur={() => mark('transactionId')}
                    aria-invalid={!!showError('transactionId')}
                    className={fc(!!showError('transactionId'))}
                  />
                  <FieldError message={showError('transactionId')} />
                </div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Manual verification required — your installment is marked paid after admin approval.
                </p>
              </div>
            ) : (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div>
                  <input
                    type="text"
                    placeholder="Card Number: 4532 •••• •••• 8842"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    onBlur={() => mark('cardNumber')}
                    aria-invalid={!!showError('cardNumber')}
                    className={fc(!!showError('cardNumber'))}
                  />
                  <FieldError message={showError('cardNumber')} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      onBlur={() => mark('cardExpiry')}
                      aria-invalid={!!showError('cardExpiry')}
                      className={fc(!!showError('cardExpiry'))}
                    />
                    <FieldError message={showError('cardExpiry')} />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      onBlur={() => mark('cardCvv')}
                      aria-invalid={!!showError('cardCvv')}
                      className={fc(!!showError('cardCvv'))}
                    />
                    <FieldError message={showError('cardCvv')} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                PCI-DSS Compliant Gateway
              </span>
              <span>Instant Digital Receipt</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              aria-disabled={fixLabel}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                fixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isProcessing ? (
                <span>{ 'Processing Payment Securely...'}</span>
              ) : fixLabel ? (
                <span>{`Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''} to pay`}</span>
              ) : selectedChannel === 'USDT (TRC20)' ? (
                <>
                  <span>Submit Crypto Payment for Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{t('btnConfirmPayment')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
