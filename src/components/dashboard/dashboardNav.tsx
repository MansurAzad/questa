import {
  LayoutDashboard,
  Sparkles,
  User as UserIcon,
  Banknote,
  Upload,
  Wallet,
  Send,
  FileText,
  TrendingUp,
  Share2,
  Network,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation, translations } from '../../services/i18n';

export type DashboardTab =
  | 'overview'
  | 'double_profit'
  | 'installment_receipts'
  | 'slip_upload'
  | 'dividends'
  | 'member_transfer'
  | 'ledger'
  | 'analytics'
  | 'affiliate'
  | 'referral_tree'
  | 'profile'
  | 'support'
  | 'security';

export interface DashboardNavItem {
  id: DashboardTab;
  label: string;
  icon: LucideIcon;
}

/**
 * Single source of truth for the investor dashboard menu.
 * Shared between the sidebar-free dashboard content area and the
 * top-header profile dropdown (Navbar) so both stay in sync.
 */
export function getDashboardNavItems(language: Language): DashboardNavItem[] {
  const t = (key: keyof typeof translations.en) => getTranslation(language, key);
  return [
    { id: 'overview', label: t('dashOverview'), icon: LayoutDashboard },
    {
      id: 'double_profit',
      label: '12-Month Double Profit',
      icon: Sparkles
    },
    { id: 'installment_receipts', label: t('dashInstallmentReceipts'), icon: Banknote },
    { id: 'slip_upload', label: t('dashSlipUpload'), icon: Upload },
    { id: 'dividends', label: t('dashDividends'), icon: Wallet },
    { id: 'member_transfer', label: t('dashMemberTransfer'), icon: Send },
    { id: 'ledger', label: t('dashTransactions'), icon: FileText },
    { id: 'analytics', label: t('dashAnalytics'), icon: TrendingUp },
    { id: 'affiliate', label: t('dashAffiliate'), icon: Share2 },
    { id: 'referral_tree', label: t('dashReferralTree'), icon: Network },
    { id: 'profile', label: t('dashProfile'), icon: UserIcon },
    { id: 'support', label: t('dashSupport'), icon: HelpCircle },
    { id: 'security', label: t('dashSecurity'), icon: ShieldCheck }
  ];
}
