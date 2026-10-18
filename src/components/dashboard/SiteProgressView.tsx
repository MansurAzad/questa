import React, { useState } from 'react';
import {
  Camera,
  Calendar,
  CheckCircle2,
  HardHat,
  Eye,
  Clock,
  ChevronRight,
  ShieldCheck,
  Video,
  MapPin
} from 'lucide-react';
import { Language, User } from '../../types';
import { StorageService } from '../../services/storage';

interface SiteProgressViewProps {
  user: User;
  language: Language;
}

export const SiteProgressView: React.FC<SiteProgressViewProps> = ({ user, language }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [visitBooked, setVisitBooked] = useState(false);
  const [visitDate, setVisitDate] = useState('2026-12-18');
  const [pickupLocation, setPickupLocation] = useState(
    'Regional Client Office (Downtown)'
  );

  const handleBookVisit = () => {
    const formatted = new Date(visitDate + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    StorageService.createSiteTour({
      clientName: user.fullName,
      phone: user.phone,
      preferredDate: formatted,
      timeSlot: 'Morning (09:30 AM)',
      projectInterested: pickupLocation.includes('Dubai')
        ? 'Questra World Commercial Center - Mirpur'
        : "Questra Royal Bay (Suites & Residences)",
      pickupLocation,
      guestsCount: 1
    });
    setVisitBooked(true);
  };

  const updates = [
    {
      id: 'project-1',
      title: 'Royal Bay Suites & Residences — RCC Superstructure & Facade Glazing',
      date: '02 October 2026',
      phase: 'Phase 2',
      progress: 88,
      description:
        '12-storey beachfront RCC frame completed up to the 11th floor. Marine-grade curtain-wall glazing and sea-facing balcony railing installation is in progress.',
      image:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'project-2',
      title: 'Commercial Center — Interior Fit-out & Central HVAC',
      date: '24 September 2026',
      phase: 'Phase 3',
      progress: 72,
      description:
        'Ground to third-floor retail fit-out underway. Central HVAC ducting and 100% DG backup power cabling installed across the podium.',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'project-3',
      title: 'Resort Landscaping, Infinity Pool & Beach Access Deck',
      date: '11 September 2026',
      phase: 'Amenities',
      progress: 64,
      description:
        'Infinity pool waterproofing and imported stone paving completed. Beachfront landscaping and guest access deck are progressing on schedule.',
      image:
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const selected = updates[selectedPhotoIndex];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Live Project Progress & Drone Updates
          </h2>
          <p className="text-xs text-slate-500">
            Real-time verified engineering progress, live civil works, and handover schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>Independently Verified</span>
        </div>
      </div>

      {/* Featured Photo / Drone View */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="relative">
          <img
            src={selected.image}
            alt={selected.title}
            className="w-full h-56 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider">
              {selected.phase}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950/70 text-white text-[11px] font-mono flex items-center gap-1">
              <Video className="w-3 h-3" />
              Drone View
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white space-y-1">
            <h3 className="text-sm sm:text-base font-bold leading-snug">
              {selected.title}
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selected.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Waterfront District, Singapore
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selected.description}
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">
                Phase Completion
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400">{selected.progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${selected.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Update Timeline Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {updates.map((u, idx) => (
          <button
            key={u.id}
            onClick={() => setSelectedPhotoIndex(idx)}
            className={`text-left rounded-2xl bg-white dark:bg-slate-900 border shadow-xs overflow-hidden transition-all ${
              selectedPhotoIndex === idx
                ? 'border-amber-500 ring-2 ring-amber-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-amber-400'
            }`}
          >
            <img src={u.image} alt={u.title} className="w-full h-28 object-cover" />
            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{u.date}</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{u.progress}%</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">
                {u.title}
              </h4>
            </div>
          </button>
        ))}
      </div>

      {/* Book Project Visit */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Book a Free Project Visit
          </h3>
        </div>

        {visitBooked ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Thank you! Your project visit request for {visitDate} has been received. Our team will contact you shortly.
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pickup Point
                </label>
                <select
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option>Regional Client Office (Downtown)</option>
                  <option>Waterfront Project Office</option>
                  <option>Global Head Office (Financial District)</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleBookVisit}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <HardHat className="w-4 h-4" />
              <span>Confirm Project Visit</span>
            </button>
          </>
        )}
      </div>

      {/* Handover Timeline */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Handover Milestones
        </h3>
        <div className="space-y-3">
          {[
            { label: 'RCC Structure Completed', date: 'Q1 2026', done: true },
            { label: 'Facade & Glazing', date: 'Q4 2026', done: false },
            { label: 'Interior Fit-out', date: 'Q2 2027', done: false },
            { label: 'Final Handover', date: 'Q4 2027', done: false }
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  m.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {m.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              </span>
              <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">{m.label}</span>
              <span className="font-mono text-slate-400">{m.date}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <Eye className="w-3.5 h-3.5" />
        <span>
          Viewing latest updates as {user.fullName}.
        </span>
      </div>

    </div>
  );
};
