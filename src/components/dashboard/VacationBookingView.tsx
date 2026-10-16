import React, { useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Award,
  Sparkles,
  Printer,
  Car,
  Coffee,
  Waves
} from 'lucide-react';
import { Language, User, ShareInvestment } from '../../types';
import { StorageService } from '../../services/storage';
import { required, runRules, RuleSet } from '../../utils/validation';
import { FieldError, ValidationSummary, focusFirstInvalid, withValidation } from '../ui/Validation';

interface VacationBookingViewProps {
  user: User;
  shares: ShareInvestment[];
  language: Language;
}

const fieldBase =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500';

export const VacationBookingView: React.FC<VacationBookingViewProps> = ({
  user,
  shares,
  language
}) => {
  const [checkInDate, setCheckInDate] = useState('2026-11-12');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-15');
  const [guestCount, setGuestCount] = useState(2);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [specialRequest, setSpecialRequest] = useState('High floor ocean-view suite requested');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const activeShare = shares[0];

  const rules: RuleSet = {
    checkInDate: required('Check-in date'),
    checkOutDate: (v) => {
      if (!v.trim()) return 'Check-out date is required.';
      if (checkInDate && v <= checkInDate) return 'Check-out date must be after the check-in date.';
      return null;
    },
    guestCount: required('Number of guests')
  };

  const values = { checkInDate, checkOutDate, guestCount };
  const result = useMemo(() => runRules(values, rules), [checkInDate, checkOutDate, guestCount, checkInDate]);

  const showError = (field: string): string | null =>
    (touched[field] || submitAttempt) ? (result.errors[field] || null) : null;
  const mark = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempt(true);
    if (!result.isValid) {
      focusFirstInvalid(formRef.current);
      return;
    }
    const booking = StorageService.createVacationBooking({
      memberId: user.memberId,
      memberName: user.fullName,
      checkInDate,
      checkOutDate,
      guestsCount: guestCount,
      roomType: 'Oceanfront Royal Executive Suite',
      specialRequest
    });
    setConfirmationCode(booking.confirmationCode);
    setBookingConfirmed(true);
    setSubmitAttempt(false);
    setTouched({});
  };

  const showFixLabel = submitAttempt && !result.isValid;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Claim 7-Day Complimentary Annual Resort Stay
          </h2>
          <p className="text-xs text-slate-500">
            Exclusive fractional owner privilege: 7 days complimentary stay per year at Questra Royal Bay Hotel & Suites, Inani.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold">
          <Award className="w-4 h-4 text-amber-600" />
          <span>7 of 7 Days Available for 2026</span>
        </div>
      </div>

      {/* Resort Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80"
            alt="Questra Royal Bay Cox's Bazar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-xl space-y-3">
          <span className="text-[11px] font-mono tracking-wider text-amber-300 uppercase block">
            5-STAR LUXURY HOSPITALITY PRIVILEGE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Questra Royal Bay Hotel & Suites — Marine Drive, Cox's Bazar
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            Your fractional ownership in suite units <strong className="text-amber-300 font-mono">#RB-204 & #RB-205</strong> entitles you and your family to 7 complimentary nights every calendar year with 5-star resort amenities.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Buffet Breakfast</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Car className="w-4 h-4 text-amber-400" />
              <span>Airport Transfer</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Waves className="w-4 h-4 text-amber-400" />
              <span>Infinity Pool</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>VIP Lounge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form or Voucher */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {bookingConfirmed ? (
          <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 mx-auto flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                VIP Resort Stay Confirmed!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Reservation Voucher: <strong className="font-mono text-amber-700 dark:text-amber-400">{confirmationCode}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Guest Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-in:</span>
                <span className="font-mono text-slate-900 dark:text-white">{checkInDate} (2:00 PM)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-out:</span>
                <span className="font-mono text-slate-900 dark:text-white">{checkOutDate} (12:00 PM)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Type:</span>
                <span className="font-semibold text-emerald-600">Oceanfront Royal Executive Suite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Special Notes:</span>
                <span className="text-slate-600 dark:text-slate-300">{specialRequest}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print VIP Stay Voucher</span>
              </button>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Modify
              </button>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleConfirm} noValidate className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Reserve Your Complimentary Vacation Dates
            </h3>

            {showFixLabel && <ValidationSummary messages={result.messages} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={e => setCheckInDate(e.target.value)}
                  onBlur={() => mark('checkInDate')}
                  aria-invalid={!!showError('checkInDate')}
                  className={withValidation(fieldBase, !!showError('checkInDate'))}
                />
                <FieldError message={showError('checkInDate')} />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  min={checkInDate}
                  value={checkOutDate}
                  onChange={e => setCheckOutDate(e.target.value)}
                  onBlur={() => mark('checkOutDate')}
                  aria-invalid={!!showError('checkOutDate')}
                  className={withValidation(fieldBase, !!showError('checkOutDate'))}
                />
                <FieldError message={showError('checkOutDate')} />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Number of Guests *
                </label>
                <select
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults (Couple)</option>
                  <option value={3}>2 Adults + 1 Child</option>
                  <option value={4}>2 Adults + 2 Children</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Special Preference
                </label>
                <input
                  type="text"
                  value={specialRequest}
                  onChange={e => setSpecialRequest(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              aria-disabled={showFixLabel}
              className={`py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm ${
                showFixLabel
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {showFixLabel
                ? `Fix ${result.messages.length} field${result.messages.length > 1 ? 's' : ''} to book`
                : 'Confirm VIP Vacation Booking'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
