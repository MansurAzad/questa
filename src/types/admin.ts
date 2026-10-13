export interface AdminInvestor {
  id: string;
  username: string;
  fullName: string;
  fullNameBn?: string;
  phone: string;
  email: string;
  memberId: string;
  branch: string;
  rank: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  nidNo: string;
  totalInvested: number;
  commissionBalance: number;
  dividendBalance: number;
  status: 'active' | 'suspended';
  joinedDate: string;
  nomineeName: string;
  nomineeRelation: string;
}

export interface AdminDepositSlip {
  id: string;
  slipNo: string;
  memberUsername: string;
  memberName: string;
  memberId: string;
  bookingId: string;
  projectName: string;
  bankName: string;
  branchName: string;
  amount: number;
  depositDate: string;
  transactionId: string;
  slipImageUrl: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface AdminSiteTourBooking {
  id: string;
  clientName: string;
  phone: string;
  preferredDate: string;
  timeSlot: string;
  projectInterested: string;
  pickupLocation: string;
  guestsCount: number;
  assignedBus?: string;
  coordinator?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AdminDividendRound {
  id: string;
  monthYear: string;
  ratePerSuite: number;
  ratePerDeluxe: number;
  totalDisbursed: number;
  investorsCount: number;
  disbursedDate: string;
  status: 'completed' | 'scheduled';
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  target: string;
  details: string;
  status: 'success' | 'warning' | 'info';
}
