export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

export interface UserNominee {
  name: string;
  relation: string;
  phone: string;
  nid: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  fullNameBn?: string;
  email: string;
  phone: string;
  branch: string;
  memberId: string;
  avatar: string;
  address: string;
  city: string;
  nidNo: string;
  role: 'investor' | 'associate' | 'admin';
  joinedDate: string;
  e2eEncryptionKey: string;
  twoFactorEnabled: boolean;
  referralCode?: string;
  nominee: UserNominee;
  bankName?: string;
  bankBranch?: string;
  bankAccount?: string;
  bankRoutingNumber?: string;
  mfsNumber?: string;
  /** 4-digit transaction PIN chosen at signup. */
  transactionPin?: string;
  /** Username of the investor who referred this account (optional). */
  referenceUsername?: string;
}

export interface ReferralSignup {
  id: string;
  name: string;
  nameBn?: string;
  username: string;
  memberId: string;
  email: string;
  phone: string;
  avatar?: string;
  sponsorUsername: string;
  sponsorName: string;
  generation: number;
  signupDate: string;
  signupTime?: string;
  status: 'active' | 'pending' | 'completed';
  assetBooked: string;
  investmentValue: number;
  commissionEarned: number;
  commissionRate: number; // e.g. 5 for 5%
  payoutStatus: 'credited' | 'pending' | 'available';
  rank: string;
  location: string;
  kycVerified: boolean;
  notes?: string;
}

/**
 * Admin-configurable multi-generation referral commission structure.
 * `generations` is the active depth (default 2) and `rates[n]` is the
 * commission percentage paid on generation n+1 (default [10, 5]).
 */
export interface ReferralSettings {
  generations: number;
  rates: number[];
  updatedAt?: string;
}

/**
 * Admin-controlled manual crypto (USDT / TRC20) payment configuration.
 * All crypto deposits are verified manually by an admin before approval.
 */
export interface CryptoPaymentSettings {
  enabled: boolean;
  network: string;
  walletAddress: string;
  bdtPerUsdt: number;
  instructions: string;
  updatedAt?: string;
}

export interface ShareInvestment {
  id: string;
  projectName: string;
  projectNameBn: string;
  location?: string;
  locationBn?: string;
  suiteNo?: string;
  shareCategory: 'luxury_suite' | 'deluxe_room' | 'commercial_retail';
  shareUnits: number;
  shareNumbers: string[];
  unitCost: number;
  totalInvestment: number;
  paidAmount: number;
  monthlyDividendAmount: number;
  totalDividendsEarned: number;
  purchaseDate: string;
  certificateNo: string;
  projectCompletionPercentage: number;
  annualRoiPercentage: number;
  status: 'active' | 'in_progress';
}

export interface InstallmentRecord {
  id: string;
  bookingId: string;
  title: string;
  installmentNo: number;
  dueDate: string;
  amount: number;
  status: 'paid' | 'due' | 'upcoming';
  paidDate?: string;
  paymentMethod?: 'PayPal' | 'Wise' | 'Stripe' | 'Bank Transfer' | 'Card' | 'USDT (TRC20)';
  transactionId?: string;
  receiptNo?: string;
}

export interface TransactionRecord {
  id: string;
  date: string;
  title: string;
  titleBn: string;
  category: 'installment' | 'dividend' | 'referral' | 'booking' | 'payout';
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'processing';
  method: string;
  referenceNo: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  date: string;
  read: boolean;
  type: 'installment' | 'dividend' | 'project' | 'security';
  actionUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  subject: string;
  category: 'payment' | 'possession' | 'dividend' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  messages: {
    sender: 'user' | 'support';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface ConstructionMilestone {
  id: string;
  title: string;
  titleBn?: string;
  phase: string;
  targetDate: string;
  completionPercentage: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
  descriptionBn?: string;
  inspectorNote?: string;
  verifiedDate?: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  nameBn: string;
  tagline: string;
  taglineBn: string;
  category: 'residential' | 'commercial' | 'hospitality';
  location: string;
  locationBn: string;
  size: string;
  startingPrice: string;
  heroImage: string;
  description: string;
  features: string[];
  featuresBn: string[];
  rajukApproved: boolean;
  status: 'booking_open' | 'under_development' | 'handover_started';
  overallProgressPercentage: number;
  expectedHandoverYear: string;
  milestones: ConstructionMilestone[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: string;
  content?: string;
  date: string;
  priority: 'high' | 'normal' | 'urgent';
  status: 'published' | 'draft';
  documentUrl?: string;
}

export interface VacationBooking {
  id: string;
  memberId: string;
  memberName: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  roomType: string;
  specialRequest?: string;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
  confirmationCode: string;
  createdAt: string;
}

export interface DoubleProfitPlan {
  id: string;
  memberId: string;
  memberName: string;
  packageName: string;
  packageNameBn: string;
  principalAmount: number;
  totalReturnAmount: number; // 2x principal in 12 months
  monthlyInstallmentAmount: number; // totalReturnAmount / 12
  totalMonths: number; // 12
  paidInstallments: number;
  remainingInstallments: number;
  totalPaidOut: number;
  startDate: string;
  nextPayoutDate: string;
  status: 'active' | 'completed' | 'pending';
  agreementDeedNo: string;
  pdcCheckNumbers: string[];
}

