import React, { useMemo, useRef, useState } from 'react';
import { MapPin, Calendar, CheckCircle2, Bus } from 'lucide-react';
import { Language } from '../../types';
import { StorageService } from '../../services/storage';
import {
  compose,
  required,
  minLength,
  phone as phoneRule,
  runRules,
  RuleSet
} from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

const todayISO = () => new Date().toISOString().split('T')[0];

const RULES: RuleSet = {
  name: compose(required('Full Name'), minLength('Full Name', 3)),
  phone: phoneRule('Phone number', true),
  project: required('Project'),
  visitDate: (v) => {
    if (!v.trim()) return 'Visit date is required.';
    if (v < todayISO()) return 'Visit date cannot be in the past.';
    return null;
  },
  guests: required('Guest count')
};

const fieldBase =
  'w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500';

interface SiteVisitBookingProps {
  language: Language;
  onSuccess?: () => void;
  /** CMS overrides */
  cmsTitle?: string;
  cmsSubtitle?: string;
}

export const SiteVisitBooking: React.FC<SiteVisitBookingProps> = ({
  language,
  onSuccess,
  cmsTitle,
  cmsSubtitle
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    project: 'questra-royal-bay',
    pickupPoint: 'mirpur-pallabi',
    visitDate: todayISO(),
    guests: '2',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const result = useMemo(() => runRules(formData, RULES), [formData]);
  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const dateStr = new Date(formData.visitDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      StorageService.createSiteTour({
        clientName: formData.name,
        phone: formData.phone,
        preferredDate: dateStr,
        timeSlot: 'Morning (09:30 AM)',
        projectInterested: formData.project === 'questra-commercial-center'
          ? 'Questra Commercial Center (Mirpur, Dhaka)'
          : "Questra Royal Bay (Hotel & Suites), Cox's Bazar",
        pickupLocation: formData.pickupPoint,
        guestsCount: Number(formData.guests)
      });
      setLoading(false);
      setSubmitted(true);
      setTouched({});
      setSubmitAttempt(false);
      onSuccess?.();
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  const projects = [
    { id: 'questra-royal-bay', name: "Questra Royal Bay — Cox's Bazar", desc: 'Beachfront Hotel & Suites' },
    { id: 'questra-commercial-center', name: 'Questra Commercial Center — Mirpur', desc: 'Retail & Office Tower' },
  ];

  const pickupPoints = [
    { id: 'mirpur-pallabi', label: 'Dhaka: Mirpur-12 Corporate Head Office' },
    { id: 'agradabad', label: 'Chattogram: Salma Centre, Agrabad' },
    { id: 'cox-site', label: "Cox's Bazar: Site Office" },
  ];

  const showFixLabel = submitAttempt && !result.isValid;

  return (
    <section id="site-visit" className="py-12 sm:py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5" />
                Free Weekend Tours
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {cmsTitle || 'Book a Free Site Visit'}
              </h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                {cmsSubtitle || 'Visit our projects with complimentary AC microbus transport from Dhaka and Chattogram. See the construction progress, meet our sales team, and reserve your share on the spot.'}
              </p>
            </div>

            <div className="space-y-4">
              {projects.map((p, idx) => (
                <div key={p.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    {idx === 0 ? <MapPin className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{p.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-700/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Bus className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Every Friday & Saturday</span>
                <p className="text-[11px] text-slate-300 mt-0.5">AC Microbus departs 8:30 AM sharp · Includes breakfast & site tour</p>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Site Visit Booked!
                </h3>
                <p className="text-sm text-slate-500">
                  Our team will call you within 2 hours to confirm your pickup point and schedule.
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
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Project *</label>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    onBlur={() => mark('project')}
                    aria-invalid={!!showError('project')}
                    className={withValidation(fieldBase, !!showError('project'))}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <FieldError message={showError('project')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pickup Point</label>
                  <select
                    name="pickupPoint"
                    value={formData.pickupPoint}
                    onChange={handleChange}
                    className={fieldBase}
                  >
                    {pickupPoints.map(pp => (
                      <option key={pp.id} value={pp.id}>{pp.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Visit Date *</label>
                    <input
                      type="date"
                      name="visitDate"
                      min={todayISO()}
                      value={formData.visitDate}
                      onChange={handleChange}
                      onBlur={() => mark('visitDate')}
                      aria-invalid={!!showError('visitDate')}
                      className={withValidation(fieldBase, !!showError('visitDate'))}
                    />
                    <FieldError message={showError('visitDate')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guests</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className={fieldBase}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special request..."
                    className={`${fieldBase} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  aria-disabled={showFixLabel}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                    showFixLabel
                      ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {loading ? (
                    'Booking...'
                  ) : showFixLabel ? (
                    `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''} to book`
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Confirm Free Site Visit
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
