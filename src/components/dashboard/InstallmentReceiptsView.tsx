import React, { useMemo, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  CalendarClock,
  FileText,
  CheckCircle2,
  Clock,
  Hourglass,
  Sparkles,
  Banknote,
  Inbox,
  RefreshCw
} from 'lucide-react';
import { DoubleProfitPlan, InstallmentReceipt, Language, User } from '../../types';
import { StorageService } from '../../services/storage';
import { formatBDT } from '../../services/i18n';
import { InstallmentReceiptModal } from './InstallmentReceiptModal';

interface InstallmentReceiptsViewProps {
  user: User;
  language: Language;
  plans: DoubleProfitPlan[];
  onRefreshData: () => void;
  onGoToInvest: () => void;
}

type ReceiptFilter = 'all' | 'received' | 'processing' | 'upcoming';

/**
 * Installment Receipts — the RECEIVE side of the investment.
 *
 * An investor puts capital into a 12-Month Double Profit plan and the company
 * pays it back (capital + 100% net profit) in 12 equal monthly installments.
 * This view lists every installment credited to the member, grouped by the
 * invested amount it belongs to, and lets them open / print the official
 * payout receipt for anything already received.
 */
export const InstallmentReceiptsView: React.FC<InstallmentReceiptsViewProps> = ({
  user,
  language,
  plans,
  onRefreshData,
  onGoToInvest
}) => {
  // Fresh on mount so a disbursement made by admin is reflected; the
  // "Refresh Schedule" button bumps refreshKey to re-derive without a reload.
  const [refreshKey, setRefreshKey] = useState(0);
  const receipts = useMemo<InstallmentReceipt[]>(
    () => StorageService.getInstallmentReceipts(user.memberId),
    [user.memberId, refreshKey]
  );
  const [filter, setFilter] = useState<ReceiptFilter>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<InstallmentReceipt | null>(null);

  // Group the flat receipt rows back into their invested amount.
  const grouped = useMemo(() => {
    const map = new Map<string, { title: string; principal: number; planId: string; rows: InstallmentReceipt[] }>();
    receipts.forEach(r => {
      const existing = map.get(r.planId);
      if (existing) {
        existing.rows.push(r);
      } else {
        map.set(r.planId, { title: r.investmentTitle, principal: r.principalAmount, planId: r.planId, rows: [r] });
      }
    });
    return [...map.values()].map(g => ({
      ...g,
      rows: [...g.rows].sort((a, b) => a.installmentNo - b.installmentNo)
    }));
  }, [receipts]);

  const receivedRows = receipts.filter(r => r.status === 'received');
  const processingRows = receipts.filter(r => r.status === 'processing');
  const upcomingRows = receipts.filter(r => r.status === 'upcoming');

  const totalInvested = grouped.reduce((acc, g) => acc + g.principal, 0);
  const totalReceived = receivedRows.reduce((acc, r) => acc + r.amount, 0);
  const totalReceivable = receipts.reduce((acc, r) => acc + r.amount, 0);

  // The soonest installment that has not landed yet.
  const nextReceipt = useMemo(() => {
    const pending = receipts
      .filter(r => r.status !== 'received')
      .sort((a, b) => (a.scheduledDate < b.scheduledDate ? -1 : 1));
    return pending[0] || null;
  }, [receipts]);

  const planFor = (planId: string) => plans.find(p => p.id === planId) || null;

  const filterChips: { id: ReceiptFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Installments', count: receipts.length },
    { id: 'received', label: 'Received', count: receivedRows.length },
    { id: 'processing', label: 'Processing', count: processingRows.length },
    { id: 'upcoming', label: 'Upcoming', count: upcomingRows.length }
  ];

  const passesFilter = (r: InstallmentReceipt) =>
    filter === 'all' || r.status === filter;

  const summaryCards = [
    {
      label: 'Total Invested Capital',
      value: formatBDT(totalInvested, language),
      sub: `${grouped.length} active investment${grouped.length === 1 ? '' : 's'}`,
      tone: 'amber',
      icon: Sparkles
    },
    {
      label: 'Total Installments Received',
      value: `+${formatBDT(totalReceived, language)}`,
      sub: `${receivedRows.length} of ${receipts.length} installments credited`,
      tone: 'emerald',
      icon: CheckCircle2
    },
    {
      label: 'Still Receivable',
      value: formatBDT(totalReceivable - totalReceived, language),
      sub: `${upcomingRows.length + processingRows.length} installments pending`,
      tone: 'blue',
      icon: TrendingUp
    },
    {
      label: 'Next Installment Due',
      value: nextReceipt ? formatBDT(nextReceipt.amount, language) : formatBDT(0, language),
      sub: nextReceipt
        ? `Scheduled ${nextReceipt.scheduledDate} · #${nextReceipt.installmentNo} of ${nextReceipt.totalInstallments}`
        : 'All installments received',
      tone: 'purple',
      icon: CalendarClock
    }
  ];

  const toneClasses: Record<string, { icon: string; value: string }> = {
    amber: { icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', value: 'text-amber-600 dark:text-amber-400' },
    emerald: { icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', value: 'text-emerald-600 dark:text-emerald-400' },
    blue: { icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', value: 'text-blue-600 dark:text-blue-400' },
    purple: { icon: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', value: 'text-purple-600 dark:text-purple-400' }
  };

  const statusPill = (r: InstallmentReceipt) => {
    if (r.status === 'received') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          RECEIVED
        </span>
      );
    }
    if (r.status === 'processing') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
          <Clock className="w-3 h-3" />
          PROCESSING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/30">
        <Hourglass className="w-3 h-3" />
        UPCOMING
      </span>
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Banknote className="w-5 h-5 text-amber-600" />
            Installment Receipts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every monthly installment credited on your invested amounts — open or print the official payout receipt for anything already received.
          </p>
        </div>
        <button
          onClick={() => {
            onRefreshData();
            setRefreshKey(k => k + 1);
          }}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
          <span>Refresh Schedule</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map(card => {
          const Icon = card.icon;
          const tone = toneClasses[card.tone];
          return (
            <div key={card.label} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{card.label}</span>
                <div className={`p-2 rounded-xl ${tone.icon}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className={`text-xl sm:text-2xl font-extrabold font-mono block ${tone.value}`}>
                {card.value}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                {card.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filterChips.map(chip => {
          const active = filter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active
                  ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400'
              }`}
            >
              {chip.label}
              <span className={`ml-1.5 font-mono ${active ? 'text-amber-100' : 'text-slate-400'}`}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {grouped.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            No installment receipts yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Installment receipts are generated automatically the moment you invest. Enroll in the
            12-Month Double Profit plan and your monthly receipts will start appearing here.
          </p>
          <button
            onClick={onGoToInvest}
            className="mt-5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Explore Investment Plans
          </button>
        </div>
      )}

      {/* Receipts grouped by invested amount */}
      {grouped.map(group => {
        const plan = planFor(group.planId);
        const groupReceived = group.rows.filter(r => r.status === 'received');
        const groupReceivedTotal = groupReceived.reduce((a, r) => a + r.amount, 0);
        const visibleRows = group.rows.filter(passesFilter);
        const progressPct = Math.round((groupReceived.length / group.rows.length) * 100);

        return (
          <div key={group.planId} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

            {/* Plan header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{group.title}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Invested {formatBDT(group.principal, language)} · Started {plan?.startDate || '—'}
                    {plan?.agreementDeedNo ? ` · Deed ${plan.agreementDeedNo}` : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Received to date</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    +{formatBDT(groupReceivedTotal, language)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Progress</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {groupReceived.length}/{group.rows.length}
                  </span>
                </div>
                {plan?.status === 'completed' ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Completed
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-5 pb-4">
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Receipts table */}
            {visibleRows.length === 0 ? (
              <div className="px-5 pb-5 text-xs text-slate-400">
                No {filter} installments in this investment.
              </div>
            ) : (
              <div className="rtable-scroll">
                <table className="rtable w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3.5">Receipt No.</th>
                      <th className="p-3.5">Installment</th>
                      <th className="p-3.5">Scheduled Date</th>
                      <th className="p-3.5">Received Date</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {visibleRows.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td data-label="Receipt No." className="p-3.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {r.receiptNo || '—'}
                        </td>
                        <td data-label="Installment" className="p-3.5 font-medium text-slate-900 dark:text-white">
                          #{r.installmentNo} of {r.totalInstallments}
                        </td>
                        <td data-label="Scheduled Date" className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                          {r.scheduledDate}
                        </td>
                        <td data-label="Received Date" className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                          {r.receivedDate || '—'}
                        </td>
                        <td data-label="Amount" className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          +{formatBDT(r.amount, language)}
                        </td>
                        <td data-label="Reference" className="p-3.5 font-mono text-[11px] text-slate-400">
                          {r.referenceNo || '—'}
                        </td>
                        <td data-label="Status" className="p-3.5">{statusPill(r)}</td>
                        <td data-label="Action" className="p-3.5 text-right">
                          {r.status === 'received' ? (
                            <button
                              onClick={() => setSelectedReceipt(r)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold font-mono transition-colors inline-flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-emerald-600" />
                              <span>View Receipt</span>
                            </button>
                          ) : r.status === 'processing' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                              <Clock className="w-3 h-3" />
                              Being credited
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              <CalendarClock className="w-3 h-3" />
                              Scheduled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Receipt modal */}
      {selectedReceipt && (
        <InstallmentReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={selectedReceipt}
          user={user}
          language={language}
        />
      )}

    </div>
  );
};
