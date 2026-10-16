import React, { useMemo, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  minLength,
  email as emailRule,
  phone as phoneRule,
  runRules,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

type TicketCategory = 'payment' | 'possession' | 'dividend' | 'general';

const CONTACT_TOPICS: Record<string, { label: string; category: TicketCategory }> = {
  'share-inquiry': { label: 'Share Investment Inquiry', category: 'general' },
  'double-profit': { label: '12-Month Double Profit', category: 'dividend' },
  'installment': { label: 'Installment Question', category: 'payment' },
  'site-visit': { label: 'Book a Site Visit', category: 'general' },
  'other': { label: 'General Inquiry', category: 'general' }
};

const RULES: RuleSet = {
  name: compose(required('Full Name'), minLength('Full Name', 3)),
  email: emailRule('Email address'),
  phone: phoneRule('Phone number', false),
  subject: required('Subject'),
  message: compose(required('Message'), minLength('Message', 10))
};

const fieldBase =
  'w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500';

interface ContactUsProps {
  language: Language;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
  cmsPhone?: string;
  cmsEmail?: string;
  cmsAddress?: string;
}

export const ContactUs: React.FC<ContactUsProps> = ({ language, cmsTitle, cmsSubtitle, cmsPhone, cmsEmail, cmsAddress }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const result = useMemo(() => runRules(formData, RULES), [formData]);
  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    setSending(true);

    // Persist the enquiry as a real support ticket so nothing is lost.
    const topic = CONTACT_TOPICS[formData.subject] || CONTACT_TOPICS['other'];
    try {
      StorageService.createTicket(
        `${topic.label} — ${formData.name}`,
        topic.category,
        `From: ${formData.name} <${formData.email}>${formData.phone ? ` · Phone: ${formData.phone}` : ''}\n\n${formData.message}`,
        'medium'
      );
    } catch {
      // Never block the visitor if persistence is unavailable.
    }

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTouched({});
      setSubmitAttempt(false);
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  const contactMethods = [
    { icon: Phone, label: 'Hotline', value: cmsPhone || '+880 1810-685888', sub: 'Sat–Thu, 9:00 AM – 6:00 PM' },
    { icon: Mail, label: 'Email', value: cmsEmail || 'info@questraworld.com', sub: 'Response within 24 hours' },
    { icon: MapPin, label: 'Head Office', value: cmsAddress || 'House #12, Road #03, Pallabi, Mirpur, Dhaka-1216', sub: 'By appointment only' },
  ];

  const bankAccounts = [
    { bank: 'The City Bank Limited', branch: 'Agrabad, Chattogram', acc: '1102948192001' },
    { bank: 'Islami Bank Bangladesh PLC', branch: 'Khatungonj, Chattogram', acc: '2050218940023' },
  ];

  const showFixLabel = submitAttempt && !result.isValid;

  return (
    <section id="contact" className="py-12 sm:py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cmsTitle || 'Contact Our Investment Team'}
          </h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            {cmsSubtitle || 'Have questions about Questra World shares, installments, or the 12-Month Double Profit scheme? Reach out and our team will guide you.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((m, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{m.label}</span>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{m.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Corporate Bank Accounts */}
            <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-700/50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                Corporate Bank Accounts
              </h3>
              <div className="space-y-3">
                {bankAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1 font-mono text-xs"
                  >
                    <div className="font-bold text-amber-300">{acc.bank}</div>
                    <div className="text-slate-300 text-[11px] font-sans">
                      Branch: {acc.branch} · A/C: {acc.acc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-slate-500">
                  A support ticket has been created. Our investment team will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                {showFixLabel && <ValidationSummary messages={result.messages} />}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => mark('name')}
                      placeholder="e.g. Ziabul Hoque"
                      aria-invalid={!!showError('name')}
                      className={withValidation(fieldBase, !!showError('name'))}
                    />
                    <FieldError message={showError('name')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => mark('email')}
                      placeholder="you@example.com"
                      aria-invalid={!!showError('email')}
                      className={withValidation(fieldBase, !!showError('email'))}
                    />
                    <FieldError message={showError('email')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => mark('phone')}
                      placeholder="+880 1XXX-XXXXXX"
                      aria-invalid={!!showError('phone')}
                      className={withValidation(fieldBase, !!showError('phone'))}
                    />
                    <FieldError message={showError('phone')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={() => mark('subject')}
                      aria-invalid={!!showError('subject')}
                      className={withValidation(fieldBase, !!showError('subject'))}
                    >
                      <option value="">Select a topic...</option>
                      <option value="share-inquiry">Share Investment Inquiry</option>
                      <option value="double-profit">12-Month Double Profit</option>
                      <option value="installment">Installment Question</option>
                      <option value="site-visit">Book a Site Visit</option>
                      <option value="other">Other</option>
                    </select>
                    <FieldError message={showError('subject')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={() => mark('message')}
                    placeholder="Type your message here..."
                    aria-invalid={!!showError('message')}
                    className={withValidation(`${fieldBase} resize-none`, !!showError('message'))}
                  />
                  <FieldError message={showError('message')} />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  aria-disabled={showFixLabel}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                    showFixLabel
                      ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {sending ? (
                    'Sending...'
                  ) : showFixLabel ? (
                    `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''} to send`
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
