import {
  User,
  ShareInvestment,
  InstallmentRecord,
  InstallmentReceipt,
  TransactionRecord,
  AppNotification,
  SupportTicket,
  ProjectInfo,
  NoticeItem,
  VacationBooking,
  ReferralSignup,
  ReferralSettings,
  CryptoPaymentSettings,
  DoubleProfitPlan
} from '../types';
import {
  AdminInvestor,
  AdminDepositSlip,
  AdminSiteTourBooking,
  AdminDividendRound,
  AdminAuditLog
} from '../types/admin';
import {
  CmsSection,
  CmsCollectionItem,
  CmsCollectionKey,
  CmsSiteSettings
} from '../types/cms';
import { submitSignupToServer, findServerSignup, SignupRecord } from './registrations';

// Pre-seeded investor account for the demo login: user1 / 123456
export const INITIAL_USER: User = {
  id: 'usr-global-001',
  username: 'user1',
  fullName: 'Alex Johnson',
  fullNameBn: 'Alex Johnson',
  referralCode: 'QW-1001',
  email: 'alex.johnson@questraworld.com',
  phone: '+971 50 236 8842',
  branch: 'Global Headquarters (Financial District)',
  memberId: 'QW-GLOBAL-1001',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  address: 'Marina Plaza, Dubai Marina',
  city: 'Dubai',
  nidNo: '1984 1592 7831 44',
  role: 'investor',
  joinedDate: '15 March 2024',
  e2eEncryptionKey: 'QW-AES256-GCM-global-001',
  twoFactorEnabled: true,
  nominee: {
    name: 'Mrs. Jordan Johnson',
    relation: 'Spouse',
    phone: '+971 50 445 1907',
    nid: '1986 2174 9031 52'
  },
  bankName: 'HSBC',
  bankBranch: 'Emaar Square Branch, Dubai',
  bankAccount: '1102948192001',
  bankRoutingNumber: '225150921',
  mfsNumber: '+971502368899'
};

export const INITIAL_ADMIN: User = {
  id: 'usr-admin-001',
  username: 'admin',
  fullName: 'Richard Hoffman (Super Admin)',
  fullNameBn: 'Richard Hoffman (Super Admin)',
  email: 'admin@questraworld.com',
  phone: '+971 4 512 8800',
  branch: 'Global Head Office (Financial District)',
  memberId: 'QW-HQ-001',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  address: 'Questra World Tower, Business Bay',
  city: 'Dubai',
  nidNo: '1975 1209 8832 01',
  role: 'admin',
  joinedDate: '01 January 2020',
  e2eEncryptionKey: 'QW-ADMIN-ROOT-KEY-990182',
  twoFactorEnabled: true,
  nominee: {
    name: 'Henry M. Whitfield',
    relation: 'Managing Director Partner',
    phone: '+971 50 447 1123',
    nid: '1978 4429 8812 02'
  }
};

export const INITIAL_SHARES: ShareInvestment[] = [
  {
    id: 'share-royal-bay-204',
    projectName: 'Questra Royal Bay Suites & Residences',
    projectNameBn: 'Questra Royal Bay Suites & Residences',
    shareCategory: 'luxury_suite',
    shareUnits: 2,
    shareNumbers: ['RB-204', 'RB-205'],
    unitCost: 600000,
    totalInvestment: 1200000,
    paidAmount: 1200000,
    monthlyDividendAmount: 18500,
    totalDividendsEarned: 224500,
    purchaseDate: '2024-05-18',
    certificateNo: 'QW/SHR/CXB/2024/1109',
    projectCompletionPercentage: 88,
    annualRoiPercentage: 18.5,
    status: 'active'
  }
];

export const INITIAL_INSTALLMENTS: InstallmentRecord[] = [
  {
    id: 'inst-25',
    bookingId: 'share-royal-bay-204',
    title: 'Installment #25 (October 2026)',
    installmentNo: 25,
    dueDate: '2026-10-25',
    amount: 35000,
    status: 'due'
  },
  {
    id: 'inst-26',
    bookingId: 'share-royal-bay-204',
    title: 'Installment #26 (November 2026)',
    installmentNo: 26,
    dueDate: '2026-11-25',
    amount: 35000,
    status: 'upcoming'
  },
  {
    id: 'inst-24',
    bookingId: 'share-royal-bay-204',
    title: 'Installment #24 (September 2026)',
    installmentNo: 24,
    dueDate: '2026-09-25',
    amount: 35000,
    status: 'paid',
    paidDate: '2026-09-22',
    paymentMethod: 'PayPal',
    transactionId: 'BK9X88291A',
    receiptNo: 'REC-2026-09-881'
  },
  {
    id: 'inst-23',
    bookingId: 'share-royal-bay-204',
    title: 'Installment #23 (August 2026)',
    installmentNo: 23,
    dueDate: '2026-08-25',
    amount: 35000,
    status: 'paid',
    paidDate: '2026-08-20',
    paymentMethod: 'Bank Transfer',
    transactionId: 'WISE-FT-491028',
    receiptNo: 'REC-2026-08-412'
  },
  {
    id: 'inst-22',
    bookingId: 'share-royal-bay-204',
    title: 'Installment #22 (July 2026)',
    installmentNo: 22,
    dueDate: '2026-07-25',
    amount: 35000,
    status: 'paid',
    paidDate: '2026-07-24',
    paymentMethod: 'Wise',
    transactionId: 'NG8812048B',
    receiptNo: 'REC-2026-07-109'
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-101',
    date: '2026-10-01',
    title: 'Suite Share Monthly Dividend Distribution (September)',
    titleBn: 'Suite Share Monthly Dividend Distribution (September)',
    category: 'dividend',
    amount: 18500,
    type: 'credit',
    status: 'completed',
    method: 'HSBC Auto-Credit',
    referenceNo: 'DIV-2026-09-CXB'
  },
  {
    id: 'tx-102',
    date: '2026-09-22',
    title: 'Installment Payment #24 - Royal Bay Suite Share',
    titleBn: 'Installment Payment #24 - Royal Bay Suite Share',
    category: 'installment',
    amount: 35000,
    type: 'debit',
    status: 'completed',
    method: 'PayPal Gateway',
    referenceNo: 'BK9X88291A'
  },
  {
    id: 'tx-103',
    date: '2026-09-01',
    title: 'Suite Share Monthly Dividend Distribution (August)',
    titleBn: 'Suite Share Monthly Dividend Distribution (August)',
    category: 'dividend',
    amount: 18500,
    type: 'credit',
    status: 'completed',
    method: 'HSBC Auto-Credit',
    referenceNo: 'DIV-2026-08-CXB'
  },
  {
    id: 'tx-104',
    date: '2026-08-20',
    title: 'Installment Payment #23 - Royal Bay Suite Share',
    titleBn: 'Installment Payment #23 - Royal Bay Suite Share',
    category: 'installment',
    amount: 35000,
    type: 'debit',
    status: 'completed',
    method: 'HSBC Online Transfer',
    referenceNo: 'WISE-FT-491028'
  },
  {
    id: 'tx-105',
    date: '2026-08-15',
    title: 'Associate Referral Commission (Singapore Client Share Booking)',
    titleBn: 'Associate Referral Commission (Singapore Client Share Booking)',
    category: 'referral',
    amount: 25000,
    type: 'credit',
    status: 'completed',
    method: 'QW Wallet Credit',
    referenceNo: 'REF-COMM-8842-1'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Installment Received',
    titleBn: 'Installment Received',
    message: 'Monthly installment #5 of $83,333 from your Executive Gold Double Profit plan has been credited to your linked bank account. Receipt ready to download.',
    messageBn: 'Monthly installment #5 of $83,333 from your Executive Gold Double Profit plan has been credited to your linked bank account. Receipt ready to download.',
    date: '2026-10-01',
    read: false,
    type: 'installment',
    actionUrl: 'installment_receipts'
  },
  {
    id: 'notif-2',
    title: 'Monthly Dividend Disbursed',
    titleBn: 'Monthly Dividend Disbursed',
    message: '$18,500 has been credited to your linked bank account for Waterfront District Royal Bay shares.',
    messageBn: '$18,500 has been credited to your linked bank account for Waterfront District Royal Bay shares.',
    date: '2026-10-01',
    read: false,
    type: 'dividend',
    actionUrl: 'transactions'
  },
  {
    id: 'notif-3',
    title: 'Questra Royal Bay Development Milestone',
    titleBn: 'Questra Royal Bay Development Milestone',
    message: 'Beachfront RCC superstructure and facade glazing work progressing on schedule. Your suite floor is now structurally complete.',
    messageBn: 'Beachfront RCC superstructure and facade glazing work progressing on schedule. Your suite floor is now structurally complete.',
    date: '2026-09-28',
    read: true,
    type: 'project',
    actionUrl: 'overview'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNo: 'QW-TKT-9021',
    subject: 'Request for certified copy of Share Certificate & Sub-Registry clearance',
    category: 'possession',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-09-15',
    updatedAt: '2026-09-17',
    messages: [
      {
        sender: 'user',
        senderName: 'Alex Johnson',
        text: 'Dear Questra World Support, kindly provide the certified copy of my Royal Bay suite share certificate for my bank file.',
        timestamp: '2026-09-15 11:30 AM'
      },
      {
        sender: 'support',
        senderName: 'Karl Hansen (Legal Officer)',
        text: 'Assalamu Alaikum Mr. Johnson. Your certified copy is generated. You can view the authenticated digital copy in the Digital Certificates section.',
        timestamp: '2026-09-17 03:45 PM'
      }
    ]
  }
];

export const PUBLIC_PROJECTS: ProjectInfo[] = [
  {
    id: 'questra-royal-bay',
    name: 'Questra Royal Bay Luxury Suites & Residences',
    nameBn: 'Questra Royal Bay Luxury Suites & Residences',
    tagline: '5-Star Hospitality Fractional Ownership & Monthly Profit Sharing',
    taglineBn: '5-Star Hospitality Fractional Ownership & Monthly Profit Sharing',
    category: 'hospitality',
    location: 'Marine Drive Road, Waterfront District',
    locationBn: 'Marine Drive Road, Waterfront District',
    size: '320 Keys Luxury Beachfront Resort',
    startingPrice: '$600,000 / Suite Share',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    description: 'A landmark beachfront hospitality venture providing secure fractional share investment with guaranteed legal deed, lifetime vacation privileges (7 days free stay annually), and high-yield monthly revenue distribution.',
    features: [
      '18.5% to 22% Projected Annual Dividend Payout',
      'Monthly Auto-Transfer to Any Global Bank Account',
      'Sub-Registry Fractional Ownership Deed Provided',
      '7 Days Free Annual Stay for Family with VIP Access',
      'Professional International Resort Management Operator'
    ],
    featuresBn: [
      '18.5% to 22% Projected Annual Dividend Payout',
      'Monthly Auto-Transfer to Any Global Bank Account',
      'Sub-Registry Fractional Ownership Deed Provided',
      '7 Days Free Annual Stay for Family with VIP Access',
      'Professional International Resort Management Operator'
    ],
    rajukApproved: true,
    status: 'under_development',
    overallProgressPercentage: 88,
    expectedHandoverYear: 'August 2027',
    milestones: [
      {
        id: 'm-cxb-1',
        title: 'Coastal Deep Piling & Seismic Raft Foundation',
        titleBn: 'Coastal Deep Piling & Seismic Raft Foundation',
        phase: 'Phase 1',
        targetDate: 'Q1 2024',
        completionPercentage: 100,
        status: 'completed',
        description: 'Cast-in-situ bored piling to 35m depth with marine-grade sulphate-resistant concrete and seismic damper isolators.',
        inspectorNote: 'Load-bearing stress certified by Bureau Veritas Quality Assurance',
        verifiedDate: '12 March 2024'
      },
      {
        id: 'm-cxb-2',
        title: '12-Story Beachfront RCC Superstructure Frame',
        titleBn: '12-Story Beachfront RCC Superstructure Frame',
        phase: 'Phase 2',
        targetDate: 'Q4 2024',
        completionPercentage: 100,
        status: 'completed',
        description: 'All 12 floors of reinforced architectural concrete structure completed including ballroom and panoramic ocean-view sky lounge.',
        inspectorNote: 'Structural safety compliance certificate issued',
        verifiedDate: '18 Dec 2024'
      },
      {
        id: 'm-cxb-3',
        title: 'Double-Glazed Hurricane Façade & Infinity Pool',
        titleBn: 'Double-Glazed Hurricane Façade & Infinity Pool',
        phase: 'Phase 3',
        targetDate: 'Q3 2025',
        completionPercentage: 100,
        status: 'completed',
        description: 'Acoustic thermal double-glazed curtain glass installation and 5th-floor heated oceanfront infinity pool structural waterproofing.',
        inspectorNote: 'Hydrostatic water pressure testing passed at 100% capacity',
        verifiedDate: '10 July 2025'
      },
      {
        id: 'm-cxb-4',
        title: 'Interior Luxury Suite Fitouts & Central VRF HVAC',
        titleBn: 'Interior Luxury Suite Fitouts & Central VRF HVAC',
        phase: 'Phase 4',
        targetDate: 'Q2 2027',
        completionPercentage: 82,
        status: 'in_progress',
        description: 'Imported marble bathrooms, custom walnut millwork, high-efficiency Japanese Daikin VRF cooling, and elevators installation.',
        inspectorNote: 'Floors 2 to 9 fitouts complete; top suites and lobby styling ongoing.',
        verifiedDate: 'Current Active Phase'
      },
      {
        id: 'm-cxb-5',
        title: 'International Operator Trial Run & Grand Opening',
        titleBn: 'International Operator Trial Run & Grand Opening',
        phase: 'Phase 5',
        targetDate: 'Aug 2027',
        completionPercentage: 10,
        status: 'upcoming',
        description: 'Staff hospitality training, fire safety clearance, commercial booking engine launch, and investor dividend payout initiation.',
        inspectorNote: 'Hospitality management contract signed with 5-star resort chain.',
        verifiedDate: 'Scheduled 2027'
      }
    ]
  },
  {
    id: 'questra-commercial-center',
    name: 'Questra World Commercial Center - Mirpur',
    nameBn: 'Questra World Commercial Center - Mirpur',
    tagline: 'Prime Commercial Retail & Office Tower in Central',
    taglineBn: 'Prime Commercial Retail & Office Tower in Central',
    category: 'commercial',
    location: 'Prime Commercial District',
    locationBn: 'Prime Commercial District',
    size: '14 Storied Modern Commercial Hub',
    startingPrice: '$1,500,000 / Floor Share',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    description: 'Strategically positioned next to the Central Metro Station, Questra World Commercial Center is designed for corporate headquarters, banking institutions, and premium brand showrooms with triple-level basement parking.',
    features: [
      'Direct 2-Minute Walk from Central MRT Metro Station',
      'High Footfall Commercial Hotspot',
      'Central VRF Air Conditioning & High-Speed Elevators',
      'Guaranteed Rental Yield Agreement Option'
    ],
    featuresBn: [
      'Direct 2-Minute Walk from Central MRT Metro Station',
      'High Footfall Commercial Hotspot',
      'Central VRF Air Conditioning & High-Speed Elevators',
      'Guaranteed Rental Yield Agreement Option'
    ],
    rajukApproved: true,
    status: 'handover_started',
    overallProgressPercentage: 96,
    expectedHandoverYear: 'May 2027',
    milestones: [
      {
        id: 'm-pal-1',
        title: 'Triple-Basement Diaphragm Wall & Deep Excavation',
        titleBn: 'Triple-Basement Diaphragm Wall & Deep Excavation',
        phase: 'Phase 1',
        targetDate: '2023',
        completionPercentage: 100,
        status: 'completed',
        description: 'Deep 42ft excavation for 3-level automated car parking with perimeter soldier piles and water ingress barrier.',
        inspectorNote: 'Geotechnical soil retention certified without neighborhood settlement',
        verifiedDate: '14 Dec 2023'
      },
      {
        id: 'm-pal-2',
        title: '14-Story Commercial Tower RCC Core & Slabs',
        titleBn: '14-Story Commercial Tower RCC Core & Slabs',
        phase: 'Phase 2',
        targetDate: '2024',
        completionPercentage: 100,
        status: 'completed',
        description: 'Seismic Grade-75 post-tensioned beam-free slabs for maximum corporate open floor-plate flexibility.',
        inspectorNote: 'Concrete cube compression tests exceeded 4,500 PSI requirements',
        verifiedDate: '10 Nov 2024'
      },
      {
        id: 'm-pal-3',
        title: 'High-Speed Elevators & Central VRF Mechanical Plant',
        titleBn: 'High-Speed Elevators & Central VRF Mechanical Plant',
        phase: 'Phase 3',
        targetDate: '2025',
        completionPercentage: 100,
        status: 'completed',
        description: '4x Schindler 2.5m/s passenger elevators, rooftop cooling towers, and dual standby 1,000kVA Cummins generator sets.',
        inspectorNote: 'Elevator safety and backup power commissioning passed',
        verifiedDate: '05 Aug 2025'
      },
      {
        id: 'm-pal-4',
        title: 'Central Metro Station Skywalk & Showroom Handover',
        titleBn: 'Central Metro Station Skywalk & Showroom Handover',
        phase: 'Phase 4',
        targetDate: 'Dec 2026',
        completionPercentage: 92,
        status: 'in_progress',
        description: 'Ground and 1st floor bank & anchor tenant showroom interior fitouts and direct covered footbridge link.',
        inspectorNote: 'Fire safety NFPA standards clearance received',
        verifiedDate: 'Current Active Phase'
      },
      {
        id: 'm-pal-5',
        title: 'Full Building Commercial Handover & Occupancy',
        titleBn: 'Full Building Commercial Handover & Occupancy',
        phase: 'Phase 5',
        targetDate: 'May 2027',
        completionPercentage: 20,
        status: 'upcoming',
        description: 'Final municipal occupancy certificate issuance and rental yield cash disbursements to retail space owners.',
        inspectorNote: 'Final inspection checklist on schedule',
        verifiedDate: 'Scheduled 2027'
      }
    ]
  }
];

// Initial data constants for Admin CRM and shared tables:
export const INITIAL_ADMIN_INVESTORS: AdminInvestor[] = [
  {
    id: 'usr-ctg-8842',
    username: 'user1',
    fullName: 'Alex Johnson',
    fullNameBn: 'Alex Johnson',
    phone: '+971 50 236 8842',
    email: 'alex.johnson@questraworld.com',
    memberId: 'QW-GLOBAL-1001',
    branch: 'Global Headquarters (Financial District)',
    rank: 'Gold Senior Associate',
    kycStatus: 'verified',
    nidNo: '1984 1592 7831 44',
    totalInvested: 1200000,
    commissionBalance: 25000,
    dividendBalance: 74000,
    status: 'active',
    joinedDate: '15 March 2024',
    nomineeName: 'Mrs. Jordan Johnson',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-ctg-101',
    username: 'andrew_h',
    fullName: 'Andrew Hughes',
    fullNameBn: 'Andrew Hughes',
    phone: '+61 412 883 4455',
    email: 'andrew.hughes@outlook.com',
    memberId: 'QW-INT-9021',
    branch: 'Sydney Regional Office',
    rank: 'Associate Member',
    kycStatus: 'verified',
    nidNo: '1979 4819 0012 33',
    totalInvested: 3500000,
    commissionBalance: 15000,
    dividendBalance: 32000,
    status: 'active',
    joinedDate: '15 August 2026',
    nomineeName: 'Laura Hughes',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-dhk-102',
    username: 'thomas_eng',
    fullName: 'Engr. Thomas Anderson',
    fullNameBn: 'Engr. Thomas Anderson',
    phone: '+44 161 496 1180',
    email: 'thomas.anderson@andersonengineering.co.uk',
    memberId: 'QW-GLB-5512',
    branch: 'Principal Branch (Manchester)',
    rank: 'Silver Associate',
    kycStatus: 'verified',
    nidNo: '1986 2819 0451 90',
    totalInvested: 5200000,
    commissionBalance: 42000,
    dividendBalance: 92500,
    status: 'active',
    joinedDate: '01 June 2024',
    nomineeName: 'Fiona Anderson',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-dhk-103',
    username: 'fiona_b',
    fullName: 'Dr. Fiona Bennett',
    fullNameBn: 'Dr. Fiona Bennett',
    phone: '+65 8761 2244',
    email: 'fiona.bennett@protonmail.com',
    memberId: 'QW-GLB-6623',
    branch: 'Global Head Office (Singapore)',
    rank: 'Associate Member',
    kycStatus: 'verified',
    nidNo: '1991 3329 8812 40',
    totalInvested: 2500000,
    commissionBalance: 12000,
    dividendBalance: 45000,
    status: 'active',
    joinedDate: '28 September 2026',
    nomineeName: 'Yasmin Kabir',
    nomineeRelation: 'Sister'
  },
  {
    id: 'usr-syl-104',
    username: 'kevin_m',
    fullName: 'Kevin Mitchell',
    fullNameBn: 'Kevin Mitchell',
    phone: '+44 121 496 0566',
    email: 'kevin.mitchell@gmail.com',
    memberId: 'QW-GLB-7789',
    branch: 'Birmingham Regional Office',
    rank: 'Associate Member',
    kycStatus: 'pending',
    nidNo: '1982 7712 9940 11',
    totalInvested: 4800000,
    commissionBalance: 0,
    dividendBalance: 0,
    status: 'active',
    joinedDate: '10 October 2026',
    nomineeName: 'Nancy Mitchell',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-dhk-105',
    username: 'samuel_l',
    fullName: 'Samuel Lewis',
    fullNameBn: 'Samuel Lewis',
    phone: '+65 8127 4490',
    email: 'samuel.lewis@gmail.com',
    memberId: 'QW-GLB-8845',
    branch: 'Regional Client Office (Downtown)',
    rank: 'Associate Member',
    kycStatus: 'verified',
    nidNo: '1988 4471 2209 63',
    totalInvested: 1200000,
    commissionBalance: 60000,
    dividendBalance: 18500,
    status: 'active',
    joinedDate: '14 October 2026',
    nomineeName: 'Grace Lewis',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-dhk-106',
    username: 'robert_h',
    fullName: 'Robert Hughes',
    fullNameBn: 'Robert Hughes',
    phone: '+44 7911 245 118',
    email: 'robert.hughes@gmail.com',
    memberId: 'QW-GLB-9031',
    branch: 'London Regional Office',
    rank: 'Member (In Review)',
    kycStatus: 'pending',
    nidNo: '1990 5527 7104 18',
    totalInvested: 2200000,
    commissionBalance: 0,
    dividendBalance: 0,
    status: 'active',
    joinedDate: '22 October 2026',
    nomineeName: 'Helen Hughes',
    nomineeRelation: 'Mother'
  }
];

export const INITIAL_DEPOSIT_SLIPS: AdminDepositSlip[] = [
  {
    id: 'slip-01',
    slipNo: 'CBL-DEP-741982',
    memberUsername: 'user1',
    memberName: 'Alex Johnson',
    memberId: 'QW-GLOBAL-1001',
    bookingId: 'share-royal-bay-204',
    projectName: 'Questra Royal Bay (Suites & Residences)',
    bankName: 'HSBC',
    branchName: 'Emaar Square Branch, Dubai',
    amount: 35000,
    depositDate: '2026-09-22',
    transactionId: 'WISE-FT-491028',
    slipImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    notes: 'Installment #24 Cash Deposit at Bank counter verified.',
    status: 'approved',
    submittedAt: '22 Sep 2026, 02:40 PM'
  },
  {
    id: 'slip-02',
    slipNo: 'SLIP-RB-8820',
    memberUsername: 'andrew_h',
    memberName: 'Andrew Hughes',
    memberId: 'QW-INT-9021',
    bookingId: 'share-royal-bay-618',
    projectName: 'Questra Royal Bay (Suites & Residences)',
    bankName: 'Standard Chartered',
    branchName: 'Barangaroo Corporate Branch, Sydney',
    amount: 35000,
    depositDate: '2026-10-09',
    transactionId: 'IBBL-CHQ-990142',
    slipImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    notes: 'Installment #02 cheque deposit voucher pending reconciliation.',
    status: 'pending',
    submittedAt: '09 Oct 2026, 11:15 AM'
  },
  {
    id: 'slip-03',
    slipNo: 'SLIP-RB-4412',
    memberUsername: 'thomas_eng',
    memberName: 'Engr. Thomas Anderson',
    memberId: 'QW-GLB-5512',
    bookingId: 'share-royal-bay-742',
    projectName: 'Questra Royal Bay Waterfront',
    bankName: 'Standard Chartered',
    branchName: 'Spinningfields Branch, Manchester',
    amount: 50000,
    depositDate: '2026-10-08',
    transactionId: 'INTL-WIRE-88310',
    slipImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    notes: 'Fractional Suite 2nd downpayment bank deposit slip.',
    status: 'pending',
    submittedAt: '08 Oct 2026, 04:30 PM'
  }
];

export const INITIAL_SITE_TOURS: AdminSiteTourBooking[] = [
  {
    id: 'tour-01',
    clientName: 'Michael Reynolds (accompanied by son)',
    phone: '+65 8127 6688',
    preferredDate: 'Friday, 17 Oct 2026',
    timeSlot: 'Morning (08:30 AM)',
    projectInterested: 'Questra Royal Bay (Suites & Residences)',
    pickupLocation: 'Financial District Global Head Office',
    guestsCount: 4,
    assignedBus: 'AC Microbus #01 (Dubai Plate 11-8842)',
    coordinator: 'Engr. Masum Billah (Assistant General Manager)',
    status: 'confirmed',
    createdAt: '09 Oct 2026'
  },
  {
    id: 'tour-02',
    clientName: 'Dr. Aisha Rahman & Family',
    phone: '+971 50 774 3388',
    preferredDate: 'Saturday, 18 Oct 2026',
    timeSlot: 'Morning (09:00 AM)',
    projectInterested: 'Questra World Commercial Center - Mirpur',
    pickupLocation: 'Central Branch, Downtown Dubai',
    guestsCount: 3,
    status: 'pending',
    createdAt: '10 Oct 2026'
  },
  {
    id: 'tour-03',
    clientName: 'Fiona Bennett (Expatriate returning)',
    phone: '+65 8761 2244',
    preferredDate: 'Friday, 24 Oct 2026',
    timeSlot: 'Morning (09:30 AM)',
    projectInterested: 'Questra Royal Bay Waterfront (Resort Tour)',
    pickupLocation: 'Regional Client Office (Downtown)',
    guestsCount: 2,
    status: 'pending',
    createdAt: '10 Oct 2026'
  }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'ntc-01',
    title: 'Questra Royal Bay Suites & Residences — New Share Unit Release & Dividend Schedule Notice',
    category: 'Share Release & Dividend',
    content:
      'All respected shareholders are hereby informed that on 25 October 2026 at 10:00 AM at the Head Office, the new share unit release and monthly dividend distribution schedule for Royal Bay Suites & Residences will be announced.',
    date: '08 October 2026',
    priority: 'high',
    status: 'published'
  },
  {
    id: 'ntc-02',
    title: 'Questra Royal Bay Waterfront 3rd Quarterly Dividend Distribution Completed',
    category: 'Dividend Distribution',
    content:
      'The September 2026 dividends for all respected shareholders of the Questra Royal Bay Suites & Residences project have been successfully credited to their linked bank accounts.',
    date: '01 October 2026',
    priority: 'normal',
    status: 'published'
  },
  {
    id: 'ntc-03',
    title: 'Friday & Saturday Family Project Visit AC Bus Pickup Schedule',
    category: 'Project Visit Schedule',
    content:
      'Every Friday and Saturday, air-conditioned microbuses will depart from Financial District and Central for family visits to the Questra Royal Bay Suites & Residences and Questra World Commercial Center projects.',
    date: '26 September 2026',
    priority: 'normal',
    status: 'published'
  }
];

export const INITIAL_VACATION_BOOKINGS: VacationBooking[] = [
  {
    id: 'vac-01',
    memberId: 'QW-GLOBAL-1001',
    memberName: 'Alex Johnson',
    checkInDate: '2026-11-12',
    checkOutDate: '2026-11-15',
    guestsCount: 2,
    roomType: 'Royal Suite (Ocean Front, 6th Floor)',
    specialRequest: 'High floor ocean-view suite requested with complimentary airport pickup.',
    bookingStatus: 'confirmed',
    confirmationCode: 'RB-VAC-2026-8842',
    createdAt: '2026-10-05'
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-01',
    timestamp: 'Today, 10:45 AM',
    adminUser: 'Richard Hoffman (Super Admin)',
    action: 'APPROVE_DEPOSIT_SLIP',
    target: 'Deposit Slip #SLIP-RB-8820 (Andrew Hughes)',
    details: 'Credited $35,000 to Royal Bay suite share Installment #02. Official Money Receipt #MR-2026-10-881 generated.',
    status: 'success'
  },
  {
    id: 'log-02',
    timestamp: 'Yesterday, 05:20 PM',
    adminUser: 'Richard Hoffman (Super Admin)',
    action: 'PROMOTED_MLM_RANK',
    target: 'user1 (QW-GLOBAL-1001)',
    details: 'Rank upgraded to Gold Senior Associate upon reaching $400,000 team sales volume milestone.',
    status: 'info'
  },
  {
    id: 'log-03',
    timestamp: '08 Oct 2026, 02:15 PM',
    adminUser: 'Richard Hoffman (Super Admin)',
    action: 'SHARE_TRANSFER_LOGGED',
    target: 'Share Transfer SH-TR-2026-084',
    details: 'Suite share ownership transfer application received from Alex Johnson.',
    status: 'warning'
  }
];

export const INITIAL_DOUBLE_PROFIT_PLANS: DoubleProfitPlan[] = [
  {
    id: 'dplan-8842-1',
    memberId: 'QW-GLOBAL-1001',
    memberName: 'Alex Johnson',
    packageName: 'Executive Gold Double Profit (12 Months)',
    packageNameBn: 'Executive Gold Double Profit (12 Months)',
    principalAmount: 500000,
    totalReturnAmount: 1000000,
    monthlyInstallmentAmount: 83333,
    totalMonths: 12,
    paidInstallments: 5,
    remainingInstallments: 7,
    totalPaidOut: 416665,
    startDate: '2026-05-01',
    nextPayoutDate: '2026-11-01',
    status: 'active',
    agreementDeedNo: 'CZS-DP-2026-8842-A',
    pdcCheckNumbers: ['IBBL-PDC-092141', 'IBBL-PDC-092142', 'IBBL-PDC-092143', 'IBBL-PDC-092144', 'IBBL-PDC-092145', 'IBBL-PDC-092146', 'IBBL-PDC-092147']
  },
  {
    id: 'dplan-9021-2',
    memberId: 'QW-INT-9021',
    memberName: 'Andrew Hughes',
    packageName: 'Silver Wealth Booster (12 Months)',
    packageNameBn: 'Silver Wealth Booster (12 Months)',
    principalAmount: 250000,
    totalReturnAmount: 500000,
    monthlyInstallmentAmount: 41666,
    totalMonths: 12,
    paidInstallments: 3,
    remainingInstallments: 9,
    totalPaidOut: 124998,
    startDate: '2026-07-01',
    nextPayoutDate: '2026-11-01',
    status: 'active',
    agreementDeedNo: 'CZS-DP-2026-9021-B',
    pdcCheckNumbers: ['CBL-PDC-441021', 'CBL-PDC-441022', 'CBL-PDC-441023']
  }
];

export const INITIAL_REFERRAL_SIGNUPS: ReferralSignup[] = [
  {
    id: 'ref-101',
    name: 'Andrew Hughes',
    nameBn: 'Andrew Hughes',
    username: 'andrew_h',
    memberId: 'QW-INT-9021',
    email: 'andrew.hughes@outlook.com',
    phone: '+61 412 883 4455',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'user1',
    sponsorName: 'Alex Johnson',
    generation: 1,
    signupDate: '15 Aug 2026',
    signupTime: '02:40 PM',
    status: 'active',
    assetBooked: 'Questra Royal Bay (Suite Share #168)',
    investmentValue: 3500000,
    commissionEarned: 350000,
    commissionRate: 10,
    payoutStatus: 'credited',
    rank: 'Associate Member',
    location: 'Sydney, Australia',
    kycVerified: true,
    notes: 'Down payment of $100,000 verified. Monthly installment ongoing.'
  },
  {
    id: 'ref-102',
    name: 'Engr. Thomas Anderson',
    nameBn: 'Engr. Thomas Anderson',
    username: 'thomas_eng',
    memberId: 'QW-GLB-5512',
    email: 'thomas.anderson@andersonengineering.co.uk',
    phone: '+44 161 496 1180',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'user1',
    sponsorName: 'Alex Johnson',
    generation: 1,
    signupDate: '04 Sep 2026',
    signupTime: '11:15 AM',
    status: 'active',
    assetBooked: "Questra Royal Bay Waterfront (1 Suite Share)",
    investmentValue: 600000,
    commissionEarned: 60000,
    commissionRate: 10,
    payoutStatus: 'credited',
    rank: 'Executive Associate',
    location: 'Manchester, United Kingdom',
    kycVerified: true,
    notes: 'Suite share booked with one-time full settlement.'
  },
  {
    id: 'ref-103',
    name: 'Dr. Fiona Bennett',
    nameBn: 'Dr. Fiona Bennett',
    username: 'fiona_b',
    memberId: 'QW-GLB-6623',
    email: 'fiona.bennett@protonmail.com',
    phone: '+65 8761 2244',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'user1',
    sponsorName: 'Alex Johnson',
    generation: 1,
    signupDate: '28 Sep 2026',
    signupTime: '04:50 PM',
    status: 'active',
    assetBooked: 'Questra Commercial Center (Shop #304)',
    investmentValue: 2500000,
    commissionEarned: 250000,
    commissionRate: 10,
    payoutStatus: 'credited',
    rank: 'Associate Member',
    location: 'Singapore (Riverside)',
    kycVerified: true,
    notes: 'Commercial space in Financial District tower. Possession target 2027.'
  },
  {
    id: 'ref-201',
    name: 'Kevin Mitchell',
    nameBn: 'Kevin Mitchell',
    username: 'kevin_m',
    memberId: 'QW-GLB-7789',
    email: 'kevin.mitchell@gmail.com',
    phone: '+44 121 496 0566',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'andrew_h',
    sponsorName: 'Andrew Hughes',
    generation: 2,
    signupDate: '10 Oct 2026',
    signupTime: '01:20 PM',
    status: 'active',
    assetBooked: 'Questra Commercial Center (Office #92)',
    investmentValue: 4800000,
    commissionEarned: 240000,
    commissionRate: 5,
    payoutStatus: 'available',
    rank: 'Associate Member',
    location: 'Birmingham, United Kingdom',
    kycVerified: true,
    notes: 'Secondary generation referral through Andrew Hughes.'
  },
  {
    id: 'ref-202',
    name: 'Samuel Lewis',
    nameBn: 'Samuel Lewis',
    username: 'samuel_l',
    memberId: 'QW-GLB-8845',
    email: 'samuel.lewis@gmail.com',
    phone: '+65 8127 4490',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'thomas_eng',
    sponsorName: 'Engr. Thomas Anderson',
    generation: 2,
    signupDate: '14 Oct 2026',
    signupTime: '06:10 PM',
    status: 'active',
    assetBooked: "Questra Royal Bay Waterfront (2 Suite Shares)",
    investmentValue: 1200000,
    commissionEarned: 60000,
    commissionRate: 5,
    payoutStatus: 'available',
    rank: 'Associate Member',
    location: 'Singapore (Downtown)',
    kycVerified: true,
    notes: 'Referred by Engr. Thomas Anderson. 2 Shares booked.'
  },
  {
    id: 'ref-301',
    name: 'Robert Hughes',
    nameBn: 'Robert Hughes',
    username: 'robert_h',
    memberId: 'QW-GLB-9031',
    email: 'robert.hughes@gmail.com',
    phone: '+44 7911 245 118',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'kevin_m',
    sponsorName: 'Kevin Mitchell',
    generation: 3,
    signupDate: '22 Oct 2026',
    signupTime: '10:05 AM',
    status: 'pending',
    assetBooked: 'Questra Commercial Center (Shop #21)',
    investmentValue: 2200000,
    commissionEarned: 0,
    commissionRate: 0,
    payoutStatus: 'pending',
    rank: 'Member (In Review)',
    location: 'London, United Kingdom',
    kycVerified: false,
    notes: 'Signed up via referral code. Initial booking form submitted, token verification in progress.'
  }
];

// Admin-configurable referral commission structure (default 2 generations: 10% & 5%)
export const DEFAULT_REFERRAL_SETTINGS: ReferralSettings = {
  generations: 2,
  rates: [10, 5]
};

// Admin-controlled manual crypto (USDT / TRC20) payment configuration
export const DEFAULT_CRYPTO_SETTINGS: CryptoPaymentSettings = {
  enabled: true,
  network: 'TRC20 (Tron)',
  walletAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
  bdtPerUsdt: 125,
  instructions:
    'Send the exact USDT (TRC20) amount to the Questra World wallet address above, then paste the on-chain Transaction Hash (TxID). All crypto deposits are verified manually by the Questra World finance desk.'
};

// ---------------------------------------------------------------------------
// HOMEPAGE CMS DEFAULTS
// ---------------------------------------------------------------------------
export const DEFAULT_CMS_SETTINGS: CmsSiteSettings = {
  brandName: 'Questra World',
  legalName: 'Questra World Limited',
  tagline: 'Official Investor Portal · Global',
  supportPhone: '+971 4 512 8800',
  supportEmail: 'support@questraworld.com',
  corporateAddress: 'Questra World Tower, Business Bay, Dubai',
  footerNote:
    'Government-registered real estate & hospitality investment enterprise. 100% legally verified ownership with notarized deeds and end-to-end encrypted records.',
  copyrightText: '© {year} Questra World Limited. All rights reserved.'
};

export const DEFAULT_CMS_SECTIONS: CmsSection[] = [
  {
    id: 'hero',
    label: 'Hero & Registration',
    kind: 'standard',
    title: 'New Registration',
    subtitle: 'Create your secure Questra World account',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 0
  },
  {
    id: 'gallery',
    label: 'Project Photo Gallery',
    kind: 'standard',
    title: 'Live Development Photo Gallery',
    subtitle: 'Real progress, documented on the ground every month.',
    body:
      'Explore transparent progress photography from our active developments — deep piling and raft foundations, RCC superstructures, façade glazing, interior fit-outs and investor handover ceremonies at Questra Royal Bay and Questra World Commercial Center.',
    ctaLabel: '',
    visible: true,
    order: 1
  },
  {
    id: 'gallery-videos',
    label: 'Video Tour Gallery',
    kind: 'standard',
    title: 'Aerial Drone & Project Walkthrough Videos',
    subtitle: 'Fly over the projects and walk every floor with our project team.',
    body:
      'High-definition drone flyovers and guided walkthrough videos capture the true scale, beachfront location and finishing quality of every Questra World development — the closest thing to standing on location.',
    ctaLabel: '',
    visible: true,
    order: 2
  },
  {
    id: 'achievements',
    label: 'Achievements & Milestones',
    kind: 'standard',
    title: 'Achievements That Speak for Themselves',
    subtitle: 'Registered deeds, handed-over towers and on-time investor payouts — year after year.',
    body:
      'Since 2019 Questra World has delivered 12 completed developments, handed over 4,800+ registered share certificates and paid every double-profit installment on schedule. Our growth is audited, documented and open for inspection at any branch.',
    ctaLabel: '',
    visible: true,
    order: 3
  },
  {
    id: 'conferences',
    label: 'Global Conferences & Summits',
    kind: 'standard',
    title: 'Questra World on the Global Stage',
    subtitle: 'International property expos, investment summits and diaspora conventions.',
    body:
      'From the Dubai International Property Show to the Singapore Real Estate Investment Summit and the London Diaspora Investment Expo, our leadership presents Questra World developments to investors, banks and regulators around the world.',
    ctaLabel: '',
    visible: true,
    order: 4
  },
  {
    id: 'success-stories',
    label: 'Investor Success Stories',
    kind: 'standard',
    title: 'Real Investors. Real Returns.',
    subtitle: 'Families who completed their payments, received registered deeds and doubled their investment.',
    body:
      'Every story below belongs to a verified investor whose registered share, installment schedule and dividend payouts are visible in the Questra World investor portal.',
    ctaLabel: '',
    visible: true,
    order: 5
  }
];

export const DEFAULT_CMS_COLLECTIONS: CmsCollectionItem[] = [
  // Features
  { id: 'feat-1', collection: 'features', title: '100% Legal Ownership', subtitle: 'Registered Deeds', body: 'Every share is backed by notarized, land-registry verified ownership documents.', badge: 'Legal', order: 0 },
  { id: 'feat-2', collection: 'features', title: '12-Month Double Profit', subtitle: '2X Return Scheme', body: 'Invest any amount and receive double back across 12 equal monthly installments.', badge: '2X', order: 1 },
  { id: 'feat-3', collection: 'features', title: '18.5% Annual ROI', subtitle: 'Suites Share Yield', body: 'Industry-leading dividend yield from premium suite share ownership.', badge: 'ROI', order: 2 },
  { id: 'feat-4', collection: 'features', title: 'End-to-End Encryption', subtitle: 'Bank-Grade Security', body: 'AES-256 encrypted records protect every transaction and personal document.', badge: 'Secure', order: 3 },
  { id: 'feat-5', collection: 'features', title: 'Bank PDC Protection', subtitle: 'Post-Dated Cheques', body: 'All double-profit investments are secured by post-dated bank cheques.', badge: 'Protected', order: 4 },
  { id: 'feat-6', collection: 'features', title: 'Dedicated Support Desk', subtitle: 'Investor Care', body: 'A branch-based support team guides you through every step of your investment.', badge: 'Support', order: 5 },

  // Testimonials
  { id: 'tst-1', collection: 'testimonials', title: 'Michael Anderson', subtitle: 'Investor · Dubai', body: 'The double profit scheme gave me exactly what was promised — 2X returned over 12 months, paid on time every month.', order: 0 },
  { id: 'tst-2', collection: 'testimonials', title: 'Sarah Mitchell', subtitle: 'Investor · Singapore', body: 'Transparent paperwork, verified deeds, and a support team that actually responds. Truly professional.', order: 1 },
  { id: 'tst-3', collection: 'testimonials', title: 'Engr. Sam Hughes', subtitle: 'Investor · Manchester', body: 'I visited the project myself before investing. The development progress matched every update on the portal.', order: 2 },

  // FAQs
  { id: 'faq-1', collection: 'faqs', title: 'How does the 12-Month Double Profit scheme work?', body: 'You invest any amount and receive double that amount back, paid across 12 equal monthly installments, secured by post-dated bank cheques and a notarized deed.', order: 0 },
  { id: 'faq-2', collection: 'faqs', title: 'What legal documents do I receive?', body: 'Every investor receives a registered share/ownership deed, a notarized agreement, and official money receipts for each payment.', order: 1 },
  { id: 'faq-3', collection: 'faqs', title: 'What payment methods are accepted?', body: 'We accept bank transfers, mobile financial services, and manual USDT (TRC20) crypto payments verified by our finance desk.', order: 2 },
  { id: 'faq-4', collection: 'faqs', title: 'Can I visit the project before investing?', body: 'Absolutely. We offer complimentary AC microbus project tours from global locations every weekend.', order: 3 },
  { id: 'faq-5', collection: 'faqs', title: 'How are dividends paid?', body: 'Share dividends are disbursed monthly to your registered bank account and are fully visible in your investor dashboard.', order: 4 },
  { id: 'faq-6', collection: 'faqs', title: 'Is my personal data secure?', body: 'Yes. All records and personal documents are protected with end-to-end AES-256 encryption on our secure cloud.', order: 5 }
];


// Persistent state wrapper with End-to-End Encryption simulation
const STORAGE_KEYS = {
  USER: 'qw_user_session_enc',
  SHARES: 'qw_share_investments_enc',
  INSTALLMENTS: 'qw_installments_enc',
  TRANSACTIONS: 'qw_transactions_enc',
  NOTIFICATIONS: 'qw_notifications_enc',
  TICKETS: 'qw_tickets_enc',
  ADMIN_INVESTORS: 'qw_admin_investors_enc',
  DEPOSIT_SLIPS: 'qw_deposit_slips_enc',
  NOTICES: 'qw_notices_enc',
  SITE_TOURS: 'qw_site_tours_enc',
  VACATION_BOOKINGS: 'qw_vacation_bookings_enc',
  AUDIT_LOGS: 'qw_audit_logs_enc',
  SECURITY: 'qw_security_settings',
  REFERRAL_SIGNUPS: 'qw_referral_signups_enc',
  DOUBLE_PROFIT_PLANS: 'qw_double_profit_plans_enc',
  REFERRAL_SETTINGS: 'qw_referral_settings',
  CRYPTO_SETTINGS: 'qw_crypto_payment_settings',
  CMS_SECTIONS: 'qw_cms_sections_enc',
  CMS_COLLECTIONS: 'qw_cms_collections_enc',
  CMS_SETTINGS: 'qw_cms_settings_enc',
  THEME: 'qw_theme_preference',
  LANGUAGE: 'qw_lang_preference',
  LAST_SYNC: 'qw_last_cloud_sync'
};

// Simple AES-style cipher masking simulation for secure offline client persistence
function encryptPayload(data: unknown): string {
  try {
    const raw = JSON.stringify(data);
    return btoa(encodeURIComponent(raw));
  } catch {
    return '';
  }
}

function decryptPayload<T>(cipher: string | null, fallback: T): T {
  if (!cipher) return fallback;
  try {
    const raw = decodeURIComponent(atob(cipher));
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export class StorageService {
  static getUser(): User | null {
    // Make sure demo content is current before we hand back the session —
    // a built-in account that is still signed in gets refreshed profile data.
    this.ensureDataInitialized();
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (!saved) {
      // Default to null until logged in or preloaded
      return null;
    }
    return decryptPayload<User | null>(saved, null);
  }

  /**
   * Finds a locally registered account whose username, USER ID, member ID,
   * email or mobile number matches the typed identifier, so investors can
   * sign in with whichever detail they remember.
   */
  private static findLocalAccount(
    identifier: string
  ): { key: string; record: { user?: User; password?: string } } | null {
    const cleaned = (identifier || '').trim();
    if (!cleaned) return null;
    const lower = cleaned.toLowerCase();

    const directKey = 'qw_registered_account_' + lower;
    const direct = localStorage.getItem(directKey);
    if (direct) {
      try {
        return { key: lower, record: JSON.parse(direct) };
      } catch {
        /* unreadable record — keep looking */
      }
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('qw_registered_account_')) continue;
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || '{}');
        const u = parsed?.user || {};
        const aliases = [u.username, u.userId, u.memberId, u.email, u.phone]
          .filter(Boolean)
          .map((value: unknown) => String(value).trim().toLowerCase());
        if (aliases.includes(lower)) {
          return { key: key.slice('qw_registered_account_'.length), record: parsed };
        }
      } catch {
        /* ignore malformed entries */
      }
    }
    return null;
  }

  /** Persists the session of an already stored account record. */
  private static openLocalSession(parsed: { user?: User }): User | null {
    const user = parsed?.user;
    if (!user || !user.username) return null;
    localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(user));
    return user;
  }

  static login(usernameInput: string, passwordInput: string): User | null {
    const cleanedUser = usernameInput.trim().toLowerCase();
    const cleanedPass = passwordInput.trim();

    // Check pre-seeded credentials: user1 / 123456 (case-insensitive username)
    if (cleanedUser === 'user1' && cleanedPass === '123456') {
      const user = INITIAL_USER;
      localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(user));
      this.ensureDataInitialized();
      return user;
    }

    // Check pre-seeded admin credentials: admin / admin123 or 123456
    if ((cleanedUser === 'admin' || cleanedUser === 'questraworld') && (cleanedPass === 'admin123' || cleanedPass === '123456' || cleanedPass === 'admin')) {
      const admin = INITIAL_ADMIN;
      localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(admin));
      this.ensureDataInitialized();
      return admin;
    }

    // Any other registered account in this browser, matched by username,
    // USER ID, member ID, email or mobile number.
    const found = this.findLocalAccount(usernameInput);
    if (found && found.record && found.record.password === cleanedPass) {
      return this.openLocalSession(found.record);
    }

    return null;
  }

  /**
   * Complete sign-in: the browser copy first, then the Supabase `signups`
   * table.
   *
   * An account created on another device, in another browser or before the
   * local storage was cleared lives only in the database — without this step
   * those investors were told their credentials were invalid. When the
   * database copy matches, the local account is rebuilt from it so the
   * dashboard has a full profile to work with.
   */
  static async loginWithServer(
    usernameInput: string,
    passwordInput: string
  ): Promise<{ user: User | null; reason: 'ok' | 'not-found' | 'wrong-password' }> {
    const local = this.login(usernameInput, passwordInput);
    if (local) return { user: local, reason: 'ok' };

    const identifier = (usernameInput || '').trim();
    const password = (passwordInput || '').trim();
    if (!identifier || !password) return { user: null, reason: 'not-found' };

    const server = await findServerSignup(identifier);
    if (!server || !server.username) return { user: null, reason: 'not-found' };
    if (String(server.password || '') !== password) {
      return { user: null, reason: 'wrong-password' };
    }

    const user = this.restoreAccountFromSignup(server);
    return { user, reason: user ? 'ok' : 'wrong-password' };
  }

  /**
   * Keeps a USER ID when it is still free, otherwise hands out the next
   * number in the sequence.
   */
  private static adoptUserId(preferred?: string): string {
    const wanted = String(preferred ?? '').trim();
    if (wanted && !this.userIdTaken(wanted)) {
      const wantedNum = Number(wanted);
      if (Number.isFinite(wantedNum) && wantedNum > this.highestUserId()) {
        localStorage.setItem('qw_last_user_id', String(wantedNum));
      }
      return wanted;
    }
    return this.claimUserId();
  }

  /** Rebuilds a complete local account from a Supabase signup row. */
  private static restoreAccountFromSignup(record: SignupRecord): User | null {
    const username = String(record.username || '').trim().toLowerCase();
    if (!username) return null;

    const joined =
      record.joinedDate ||
      new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const user: User = {
      id: 'usr-srv-' + String(record.id ?? Date.now()),
      username,
      fullName: record.fullName || username,
      fullNameBn: record.fullName || username,
      email: record.email || '',
      phone: record.phone || '',
      branch: 'Global Head Office (Financial District)',
      memberId: record.memberId || 'QW-' + Math.floor(1000 + Math.random() * 9000),
      userId: this.adoptUserId(record.userId),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      address: 'Dubai',
      city: 'Dubai',
      nidNo: '',
      role: 'investor',
      joinedDate: joined,
      e2eEncryptionKey: 'QW-AES256-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      twoFactorEnabled: false,
      nominee: { name: 'Authorized Nominee', relation: 'Family', phone: record.phone || '', nid: '' },
      transactionPin: record.transactionPin || undefined,
      referenceUsername: record.referenceUsername || ''
    };

    localStorage.setItem(
      'qw_registered_account_' + username,
      JSON.stringify({ user, password: String(record.password || '') })
    );
    localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(user));
    return user;
  }

  /**
   * Resolves a sponsor reference typed by a new investor — or carried by a
   * referral link — into the sponsor's real account.
   *
   * Accepts any of: username, USER ID, member ID or referral code. Returns the
   * canonical username plus display name, or `null` when nothing matches.
   */
  static resolveSponsor(input: string): { username: string; fullName: string } | null {
    const cleaned = (input || '').trim();
    if (!cleaned) return null;
    const lower = cleaned.toLowerCase();

    // Built-in seeded accounts (match by username, member ID or referral code).
    const builtIns: Array<{ user: User; aliases: Array<string | undefined> }> = [
      { user: INITIAL_USER, aliases: [INITIAL_USER.username, INITIAL_USER.memberId, INITIAL_USER.referralCode, INITIAL_USER.userId] },
      { user: INITIAL_ADMIN, aliases: [INITIAL_ADMIN.username, INITIAL_ADMIN.memberId, INITIAL_ADMIN.referralCode, INITIAL_ADMIN.userId, 'questraworld'] }
    ];
    for (const entry of builtIns) {
      if (entry.aliases.some(alias => alias && String(alias).toLowerCase() === lower)) {
        return { username: entry.user.username, fullName: entry.user.fullName };
      }
    }

    // Locally registered accounts.
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('qw_registered_account_')) continue;
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || '{}');
        const u = parsed?.user || {};
        const username = String(u.username || key.slice('qw_registered_account_'.length));
        if (username.toLowerCase() === lower) return { username, fullName: String(u.fullName || username) };
        const aliases = [u.userId, u.memberId, u.referralCode]
          .filter(Boolean)
          .map((value: unknown) => String(value).toLowerCase());
        if (aliases.includes(lower)) return { username, fullName: String(u.fullName || username) };
      } catch {
        // ignore malformed entries
      }
    }

    // Admin CRM registry (covers investor profiles that were created by admin).
    const investor = this.getAdminInvestors().find(
      inv => inv.username.toLowerCase() === lower || inv.memberId.toLowerCase() === lower
    );
    if (investor) return { username: investor.username, fullName: investor.fullName };

    return null;
  }

  // -------------------------------------------------------------------------
  // Sequential USER ID allocation.
  //
  // Every new registration receives a permanent numeric USER ID starting at
  // 6120 and increasing by one for each account (6120, 6121, 6122 …). The ID is
  // shown read-only on both registration forms and can be used as a referral
  // reference instead of a username.
  // -------------------------------------------------------------------------

  /** First USER ID handed out to a new registration. */
  static readonly USER_ID_START = 6120;

  /** Highest USER ID issued so far (floor is USER_ID_START - 1). */
  private static highestUserId(): number {
    const floor = StorageService.USER_ID_START - 1;
    const stored = parseInt(localStorage.getItem('qw_last_user_id') || '', 10);
    return Number.isFinite(stored) && stored > floor ? stored : floor;
  }

  /** The next USER ID that will be issued — a preview, it does not consume it. */
  static peekNextUserId(): string {
    return String(StorageService.highestUserId() + 1);
  }

  /** True when a USER ID has already been assigned to an account. */
  static userIdTaken(id: string | number | undefined): boolean {
    const target = String(id ?? '').trim();
    if (!target) return false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('qw_registered_account_')) continue;
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || '{}');
        const stored = parsed?.user?.userId;
        if (stored !== undefined && stored !== null && String(stored).trim() === target) return true;
      } catch {
        // ignore malformed entries
      }
    }
    return false;
  }

  /**
   * Claims the next sequential USER ID and persists the counter.
   *
   * `preferred` is the ID the form previewed to the investor. It is honoured
   * only when it is still the next free number, so two registrations can never
   * receive the same USER ID.
   */
  static claimUserId(preferred?: string | number): string {
    const preferredNum = Number(String(preferred ?? '').trim());
    const isSequential =
      Number.isInteger(preferredNum) &&
      preferredNum === StorageService.highestUserId() + 1 &&
      !StorageService.userIdTaken(preferredNum);

    if (isSequential) {
      localStorage.setItem('qw_last_user_id', String(preferredNum));
      return String(preferredNum);
    }

    const next = StorageService.highestUserId() + 1;
    localStorage.setItem('qw_last_user_id', String(next));
    return String(next);
  }

  static register(newUser: Partial<User>, password: string): User {
    // Every account receives its permanent sequential USER ID up front.
    const userIdStr = this.claimUserId(newUser.userId);
    // Resolve the typed reference (username / USER ID / member ID / referral
    // code) into the sponsor's real account before the record is created.
    const sponsor = this.resolveSponsor(newUser.referenceUsername || '');
    const user: User = {
      id: 'usr-' + Date.now(),
      username: newUser.username || 'investor_' + Math.floor(Math.random() * 1000),
      fullName: newUser.fullName || 'Valued Investor',
      fullNameBn: newUser.fullNameBn || newUser.fullName || 'Valued Investor',
      email: newUser.email || 'investor@questraworld.com',
      phone: newUser.phone || '+971 50 236 8800',
      branch: newUser.branch || 'Global Head Office (Financial District)',
      memberId: newUser.memberId || ('QW-' + Math.floor(1000 + Math.random() * 9000)),
      userId: userIdStr,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      address: newUser.address || 'Dubai',
      city: newUser.city || 'Dubai',
      nidNo: newUser.nidNo || '1990 0000 0000 00',
      role: 'investor',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      e2eEncryptionKey: 'QW-AES256-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      twoFactorEnabled: false,
      nominee: newUser.nominee || {
        name: 'Authorized Nominee',
        relation: 'Family',
        phone: '+971 50 236 8800',
        nid: '1995 0000 0000 00'
      },
      bankName: newUser.bankName,
      bankBranch: newUser.bankBranch,
      bankAccount: newUser.bankAccount,
      bankRoutingNumber: newUser.bankRoutingNumber,
      mfsNumber: newUser.mfsNumber,
      transactionPin: newUser.transactionPin,
      // Only a genuine sponsor reference is stored — never the member's own id.
      referenceUsername: sponsor?.username || newUser.referenceUsername || ''
    };

    localStorage.setItem(
      'qw_registered_account_' + user.username.toLowerCase(),
      JSON.stringify({ user, password: password.trim() })
    );
    localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(user));
    this.ensureDataInitialized();

    // Persist to the Supabase `signups` table (see ./registrations.ts). Best-effort:
    // the registration still succeeds locally when the database is unreachable.
    void submitSignupToServer({
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      password: password.trim(),
      transactionPin: user.transactionPin || '',
      referenceUsername: sponsor?.username || '',
      memberId: user.memberId,
      userId: user.userId,
      joinedDate: user.joinedDate
    });

    // If a valid sponsor reference was supplied, record the referral so the
    // sponsor sees this signup in their referral network.
    if (sponsor && sponsor.username.toLowerCase() !== user.username.toLowerCase()) {
      try {
        this.addReferralSignup({
          name: user.fullName,
          username: user.username,
          memberId: user.memberId,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          sponsorUsername: sponsor.username,
          sponsorName: sponsor.fullName,
          generation: 1,
          signupDate: user.joinedDate,
          status: 'pending',
          assetBooked: 'Not yet booked',
          investmentValue: 0,
          commissionEarned: 0,
          commissionRate: 0,
          payoutStatus: 'pending',
          rank: 'New Investor',
          location: user.city,
          kycVerified: false,
          notes: 'Registered via the public signup form with a reference username or referral link.'
        });
      } catch {
        /* non-fatal — the account is still created */
      }
    }

    return user;
  }

  /**
   * Returns true when an account can be found for the given username or
   * registered mobile number. Used by the public account-recovery flow.
   */
  static accountExists(identifier: string): boolean {
    const cleaned = identifier.trim().toLowerCase();
    if (!cleaned) return false;
    if (cleaned === 'user1' || cleaned === 'admin' || cleaned === 'questraworld') return true;
    if (localStorage.getItem('qw_registered_account_' + cleaned)) return true;

    // Fall back to matching a registered mobile number — but only when the
    // input actually looks like a phone number. Otherwise any username that
    // merely contains a digit would collide with an unrelated phone number.
    const stripSeparators = cleaned.replace(/[\s()+-]/g, '');
    if (!/^\d{5,}$/.test(stripSeparators)) return false;
    const digits = stripSeparators;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('qw_registered_account_')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || '{}');
          if (parsed?.user?.phone && String(parsed.user.phone).replace(/\D/g, '').includes(digits)) {
            return true;
          }
        } catch {
          // ignore malformed entries
        }
      }
    }
    return false;
  }

  static updateUser(updates: Partial<User>): User {
    const current = this.getUser() || INITIAL_USER;
    const updated: User = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(updated));

    // Also sync with admin investors CRM if matching
    const investors = this.getAdminInvestors();
    const idx = investors.findIndex(i => i.username.toLowerCase() === current.username.toLowerCase() || i.id === current.id);
    if (idx !== -1) {
      investors[idx] = {
        ...investors[idx],
        fullName: updated.fullName,
        fullNameBn: updated.fullNameBn || investors[idx].fullNameBn,
        phone: updated.phone,
        email: updated.email,
        nidNo: updated.nidNo,
        nomineeName: updated.nominee?.name || investors[idx].nomineeName,
        nomineeRelation: updated.nominee?.relation || investors[idx].nomineeRelation
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, encryptPayload(investors));
    }

    this.updateLastSync();
    return updated;
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  static ensureDataInitialized(): void {
    if (!localStorage.getItem(STORAGE_KEYS.SHARES)) {
      localStorage.setItem(STORAGE_KEYS.SHARES, encryptPayload(INITIAL_SHARES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INSTALLMENTS)) {
      localStorage.setItem(STORAGE_KEYS.INSTALLMENTS, encryptPayload(INITIAL_INSTALLMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, encryptPayload(INITIAL_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, encryptPayload(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, encryptPayload(INITIAL_TICKETS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_INVESTORS)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, encryptPayload(INITIAL_ADMIN_INVESTORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPOSIT_SLIPS)) {
      localStorage.setItem(STORAGE_KEYS.DEPOSIT_SLIPS, encryptPayload(INITIAL_DEPOSIT_SLIPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, encryptPayload(INITIAL_NOTICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SITE_TOURS)) {
      localStorage.setItem(STORAGE_KEYS.SITE_TOURS, encryptPayload(INITIAL_SITE_TOURS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VACATION_BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.VACATION_BOOKINGS, encryptPayload(INITIAL_VACATION_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, encryptPayload(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REFERRAL_SIGNUPS)) {
      localStorage.setItem(STORAGE_KEYS.REFERRAL_SIGNUPS, encryptPayload(INITIAL_REFERRAL_SIGNUPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOUBLE_PROFIT_PLANS)) {
      localStorage.setItem(STORAGE_KEYS.DOUBLE_PROFIT_PLANS, encryptPayload(INITIAL_DOUBLE_PROFIT_PLANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REFERRAL_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.REFERRAL_SETTINGS, encryptPayload(DEFAULT_REFERRAL_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CRYPTO_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.CRYPTO_SETTINGS, encryptPayload(DEFAULT_CRYPTO_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CMS_SECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.CMS_SECTIONS, encryptPayload(DEFAULT_CMS_SECTIONS));
    }
    // One-time migration: collapse the public homepage to the curated layout
    // (Hero registration + photo/video gallery sections only). Drops any
    // previously stored sections (features/projects/timeline/… /contact).
    if (!localStorage.getItem('qw_cms_sections_curated_v1')) {
      localStorage.setItem(STORAGE_KEYS.CMS_SECTIONS, encryptPayload(DEFAULT_CMS_SECTIONS));
      localStorage.setItem('qw_cms_sections_curated_v1', '1');
    }
    // One-time migration: permanently drop the "3D Renders & Concept Gallery"
    // section from the public homepage (also removed from the default layout).
    if (!localStorage.getItem('qw_cms_drop_renders_v1')) {
      try {
        const storedSections = decryptPayload<CmsSection[] | null>(
          localStorage.getItem(STORAGE_KEYS.CMS_SECTIONS),
          null
        );
        if (storedSections && storedSections.length) {
          localStorage.setItem(
            STORAGE_KEYS.CMS_SECTIONS,
            encryptPayload(storedSections.filter(s => s.id !== 'gallery-renders'))
          );
        }
      } catch {
        /* non-fatal — keep whatever data is present */
      }
      localStorage.setItem('qw_cms_drop_renders_v1', '1');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CMS_COLLECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.CMS_COLLECTIONS, encryptPayload(DEFAULT_CMS_COLLECTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CMS_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.CMS_SETTINGS, encryptPayload(DEFAULT_CMS_SETTINGS));
    }
    // One-time migration: apply the configurable 2-generation (10% / 5%) matrix
    // to referral data created before this feature existed.
    if (!localStorage.getItem('qw_referral_matrix_migrated_v2')) {
      try {
        const existing = decryptPayload<ReferralSignup[] | null>(
          localStorage.getItem(STORAGE_KEYS.REFERRAL_SIGNUPS),
          null
        );
        if (existing && existing.length) {
          const migrated = existing.map(item => {
            const inPlan = item.generation >= 1 && item.generation <= DEFAULT_REFERRAL_SETTINGS.generations;
            const rate = inPlan ? DEFAULT_REFERRAL_SETTINGS.rates[item.generation - 1] ?? 0 : 0;
            return {
              ...item,
              commissionRate: rate,
              commissionEarned: Math.round((item.investmentValue * rate) / 100)
            };
          });
          localStorage.setItem(STORAGE_KEYS.REFERRAL_SIGNUPS, encryptPayload(migrated));
        }
      } catch {
        /* non-fatal — keep whatever data is present */
      }
      localStorage.setItem('qw_referral_matrix_migrated_v2', '1');
    }
    // One-time migration: rebrand persisted records from "Questa World" to
    // "Questra World" (covers encrypted JSON payloads and plain string values).
    if (!localStorage.getItem('qw_brand_questra_v1')) {
      try {
        const rebrand = (text: string) =>
          text.replace(/questa/gi, m =>
            m === 'QUESTA' ? 'QUESTRA' : m.charAt(0) === 'Q' ? 'Questra' : 'questra'
          );
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key || !key.startsWith('qw_') || key === 'qw_brand_questra_v1') continue;
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          let updated: string | null = null;
          let decoded: string | null = null;
          try {
            decoded = decodeURIComponent(atob(raw));
          } catch {
            decoded = null;
          }
          if (decoded !== null) {
            // Base64 payload — rebrand inside the decoded JSON and re-encrypt.
            if (/questa/i.test(decoded)) {
              try {
                updated = encryptPayload(JSON.parse(rebrand(decoded)));
              } catch {
                /* not JSON — leave untouched */
              }
            }
          } else if (/questa/i.test(raw)) {
            // Plain string value — rebrand in place.
            updated = rebrand(raw);
          }
          if (updated !== null) localStorage.setItem(key, updated);
        }
      } catch {
        /* non-fatal — keep whatever data is present */
      }
      localStorage.setItem('qw_brand_questra_v1', '1');
    }
    // One-time content refresh: re-seed every demo dataset. Browsers that
    // visited an earlier build still hold the previous payload in
    // localStorage, which would otherwise keep old wording and placeholder
    // identities on screen forever. Real accounts registered by visitors
    // (qw_registered_account_*) are never touched.
    if (!localStorage.getItem('qw_content_refresh_v3')) {
      const reseed: Array<[string, unknown]> = [
        [STORAGE_KEYS.SHARES, INITIAL_SHARES],
        [STORAGE_KEYS.INSTALLMENTS, INITIAL_INSTALLMENTS],
        [STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS],
        [STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS],
        [STORAGE_KEYS.TICKETS, INITIAL_TICKETS],
        [STORAGE_KEYS.ADMIN_INVESTORS, INITIAL_ADMIN_INVESTORS],
        [STORAGE_KEYS.DEPOSIT_SLIPS, INITIAL_DEPOSIT_SLIPS],
        [STORAGE_KEYS.NOTICES, INITIAL_NOTICES],
        [STORAGE_KEYS.SITE_TOURS, INITIAL_SITE_TOURS],
        [STORAGE_KEYS.VACATION_BOOKINGS, INITIAL_VACATION_BOOKINGS],
        [STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS],
        [STORAGE_KEYS.REFERRAL_SIGNUPS, INITIAL_REFERRAL_SIGNUPS],
        [STORAGE_KEYS.DOUBLE_PROFIT_PLANS, INITIAL_DOUBLE_PROFIT_PLANS],
        [STORAGE_KEYS.CMS_SECTIONS, DEFAULT_CMS_SECTIONS],
        [STORAGE_KEYS.CMS_COLLECTIONS, DEFAULT_CMS_COLLECTIONS],
        [STORAGE_KEYS.CMS_SETTINGS, DEFAULT_CMS_SETTINGS]
      ];
      reseed.forEach(([key, value]) => {
        localStorage.setItem(key, encryptPayload(value));
      });
      // Refresh the session of a signed-in built-in account so its profile
      // shows the current data too.
      try {
        const session = decryptPayload<User | null>(localStorage.getItem(STORAGE_KEYS.USER), null);
        if (session && session.username === INITIAL_USER.username) {
          localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(INITIAL_USER));
        } else if (session && session.username === INITIAL_ADMIN.username) {
          localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(INITIAL_ADMIN));
        }
      } catch {
        /* non-fatal — keep whatever session is present */
      }
      localStorage.setItem('qw_content_refresh_v3', '1');
    }
    if (!localStorage.getItem(STORAGE_KEYS.LAST_SYNC)) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }
  }

  // --- SHARES CRUD ---
  static getShares(): ShareInvestment[] {
    this.ensureDataInitialized();
    return decryptPayload<ShareInvestment[]>(localStorage.getItem(STORAGE_KEYS.SHARES), INITIAL_SHARES);
  }

  static createShare(shareData: Partial<ShareInvestment>): ShareInvestment {
    const shares = this.getShares();
    const newShare: ShareInvestment = {
      id: shareData.id || 'share-' + Date.now(),
      projectName: shareData.projectName || 'Questra Royal Bay Suites & Residences',
      projectNameBn: shareData.projectNameBn || 'Questra Royal Bay Suites & Residences',
      location: shareData.location || "Waterfront District",
      locationBn: shareData.locationBn || "Waterfront District",
      suiteNo: shareData.suiteNo || `Suite #${Math.floor(200 + Math.random() * 300)}`,
      shareCategory: shareData.shareCategory || 'luxury_suite',
      shareUnits: shareData.shareUnits || 1,
      shareNumbers: shareData.shareNumbers || [`SH-${Math.floor(1000 + Math.random() * 9000)}`],
      unitCost: shareData.unitCost || 600000,
      totalInvestment: shareData.totalInvestment || 600000,
      paidAmount: shareData.paidAmount || 600000,
      monthlyDividendAmount: shareData.monthlyDividendAmount || 9250,
      totalDividendsEarned: shareData.totalDividendsEarned || 0,
      purchaseDate: shareData.purchaseDate || new Date().toISOString().split('T')[0],
      certificateNo: shareData.certificateNo || `QW-SH-CERT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      projectCompletionPercentage: shareData.projectCompletionPercentage || 95,
      annualRoiPercentage: shareData.annualRoiPercentage || 18.5,
      status: shareData.status || 'active'
    };
    const updated = [newShare, ...shares];
    localStorage.setItem(STORAGE_KEYS.SHARES, encryptPayload(updated));
    this.updateLastSync();
    return newShare;
  }

  static updateShare(id: string, updates: Partial<ShareInvestment>): ShareInvestment | null {
    const shares = this.getShares();
    const idx = shares.findIndex(s => s.id === id);
    if (idx === -1) return null;
    shares[idx] = { ...shares[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SHARES, encryptPayload(shares));
    this.updateLastSync();
    return shares[idx];
  }

  static deleteShare(id: string): boolean {
    const shares = this.getShares();
    const filtered = shares.filter(s => s.id !== id);
    if (filtered.length !== shares.length) {
      localStorage.setItem(STORAGE_KEYS.SHARES, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  // --- 12-MONTH DOUBLE PROFIT PLANS CRUD & MONTHLY DISBURSEMENT ---
  static getDoubleProfitPlans(): DoubleProfitPlan[] {
    this.ensureDataInitialized();
    return decryptPayload<DoubleProfitPlan[]>(localStorage.getItem(STORAGE_KEYS.DOUBLE_PROFIT_PLANS), INITIAL_DOUBLE_PROFIT_PLANS);
  }

  static createDoubleProfitPlan(plan: Partial<DoubleProfitPlan>): DoubleProfitPlan {
    const plans = this.getDoubleProfitPlans();
    const user = this.getUser() || INITIAL_USER;
    const principal = plan.principalAmount || 100000;
    const totalReturn = principal * 2; // Guaranteed 2x Double Profit in 12 Months
    const monthlyInstallment = Math.round(totalReturn / 12);

    const newPlan: DoubleProfitPlan = {
      id: plan.id || 'dplan-' + Date.now(),
      memberId: plan.memberId || user.memberId,
      memberName: plan.memberName || user.fullName,
      packageName: plan.packageName || `$${principal.toLocaleString()} 12-Month Double Return Plan`,
      packageNameBn: plan.packageNameBn || `$${principal.toLocaleString()} 12-Month Double Return Plan`,
      principalAmount: principal,
      totalReturnAmount: totalReturn,
      monthlyInstallmentAmount: monthlyInstallment,
      totalMonths: 12,
      paidInstallments: 0,
      remainingInstallments: 12,
      totalPaidOut: 0,
      startDate: new Date().toISOString().split('T')[0],
      nextPayoutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      agreementDeedNo: 'CZS-DP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      pdcCheckNumbers: Array.from({ length: 12 }, (_, i) => `IBBL-PDC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000) + i}`)
    };

    const updated = [newPlan, ...plans];
    localStorage.setItem(STORAGE_KEYS.DOUBLE_PROFIT_PLANS, encryptPayload(updated));

    // Also record transaction
    const tx: TransactionRecord = {
      id: 'tx-dp-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: `Double Profit Plan Activation - ${newPlan.packageName}`,
      titleBn: `Double Profit Plan Activation - ${newPlan.packageName}`,
      category: 'booking',
      amount: principal,
      type: 'debit',
      status: 'completed',
      method: 'Online Investment Wallet',
      referenceNo: newPlan.agreementDeedNo
    };
    const txs = this.getTransactions();
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, encryptPayload([tx, ...txs]));

    this.addAuditLog('DOUBLE_PROFIT_PLAN_CREATED', newPlan.packageName, `User ${newPlan.memberName} enrolled in $${principal.toLocaleString()} 12-month double return plan.`);
    this.updateLastSync();
    return newPlan;
  }

  static disburseDoubleProfitInstallment(planId: string): { success: boolean; installmentAmount: number; message: string } | null {
    const plans = this.getDoubleProfitPlans();
    const idx = plans.findIndex(p => p.id === planId);
    if (idx === -1) return null;

    const plan = plans[idx];
    if (plan.remainingInstallments <= 0 || plan.status === 'completed') {
      return { success: false, installmentAmount: 0, message: 'Plan is already fully disbursed.' };
    }

    const installmentAmt = plan.monthlyInstallmentAmount;
    plan.paidInstallments += 1;
    plan.remainingInstallments -= 1;
    plan.totalPaidOut += installmentAmt;
    if (plan.remainingInstallments === 0) {
      plan.status = 'completed';
    }

    // Set next payout date 30 days ahead
    plan.nextPayoutDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    localStorage.setItem(STORAGE_KEYS.DOUBLE_PROFIT_PLANS, encryptPayload(plans));

    // Record credit transaction to member's account
    const payoutTx: TransactionRecord = {
      id: 'tx-payout-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: `Monthly Double Profit Installment #${plan.paidInstallments}/12 - ${plan.packageName}`,
      titleBn: `Monthly Double Profit Installment #${plan.paidInstallments}/12 - ${plan.packageName}`,
      category: 'dividend',
      amount: installmentAmt,
      type: 'credit',
      status: 'completed',
      method: 'Monthly Auto Installment Credit',
      referenceNo: `DP-INS-${plan.paidInstallments}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    const currentTxs = this.getTransactions();
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, encryptPayload([payoutTx, ...currentTxs]));

    this.addAuditLog('DOUBLE_PROFIT_INSTALLMENT_DISBURSED', plan.packageName, `Disbursed installment #${plan.paidInstallments} of $${installmentAmt.toLocaleString()} to ${plan.memberName}`);
    this.updateLastSync();
    return { success: true, installmentAmount: installmentAmt, message: `Installment #${plan.paidInstallments} of $${installmentAmt.toLocaleString()} disbursed successfully!` };
  }

  static deleteDoubleProfitPlan(planId: string): boolean {
    const plans = this.getDoubleProfitPlans();
    const filtered = plans.filter(p => p.id !== planId);
    if (filtered.length !== plans.length) {
      localStorage.setItem(STORAGE_KEYS.DOUBLE_PROFIT_PLANS, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  // --- INSTALLMENT RECEIPTS (installments RECEIVED on invested amounts) ---
  /**
   * Builds the receipt schedule for every double-profit investment the member
   * holds. Each invested amount is paid back in 12 equal monthly installments,
   * so every plan expands into 12 receipt rows:
   *   • i <= paidInstallments        → received   (has receipt no + credit ref)
   *   • i === paidInstallments + 1   → processing (currently being credited)
   *   • i >  paidInstallments + 1    → upcoming   (scheduled in the future)
   *
   * The rows are derived (not stored) so they always stay in sync with the
   * plan's paid/remaining counters after an admin disbursement.
   */
  static getInstallmentReceipts(memberId?: string): InstallmentReceipt[] {
    const plans = this.getDoubleProfitPlans().filter(p => !memberId || p.memberId === memberId);
    const receipts: InstallmentReceipt[] = [];

    plans.forEach(plan => {
      const totalMonths = plan.totalMonths || 12;
      const baseDate = new Date(plan.startDate + 'T00:00:00');
      // Stable short code used for receipt / reference numbers (never changes
      // between renders so a printed receipt keeps the same number).
      const planCode = plan.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();

      for (let i = 1; i <= totalMonths; i++) {
        const creditDate = new Date(baseDate);
        creditDate.setMonth(baseDate.getMonth() + i);
        const scheduledDate = creditDate.toISOString().split('T')[0];
        const isReceived = i <= plan.paidInstallments;
        const isProcessing = i === plan.paidInstallments + 1;

        receipts.push({
          id: `${plan.id}-ir-${i}`,
          memberId: plan.memberId,
          planId: plan.id,
          investmentTitle: plan.packageName,
          principalAmount: plan.principalAmount,
          installmentNo: i,
          totalInstallments: totalMonths,
          amount: plan.monthlyInstallmentAmount,
          scheduledDate,
          receivedDate: isReceived ? scheduledDate : undefined,
          status: isReceived ? 'received' : isProcessing ? 'processing' : 'upcoming',
          creditMethod: isReceived ? 'Questra Payout Bank (HSBC)' : undefined,
          referenceNo: isReceived
            ? `DP-INS-${planCode}-${String(i).padStart(2, '0')}`
            : undefined,
          receiptNo: isReceived
            ? `IR-${creditDate.getFullYear()}-${planCode}-${String(i).padStart(2, '0')}`
            : undefined,
          planStatus: plan.status
        });
      }
    });

    // Newest scheduled installment first so the latest receipts are on top.
    return receipts.sort((a, b) =>
      a.scheduledDate === b.scheduledDate
        ? b.installmentNo - a.installmentNo
        : (a.scheduledDate < b.scheduledDate ? 1 : -1)
    );
  }

  // --- INSTALLMENTS CRUD ---
  static getInstallments(): InstallmentRecord[] {
    this.ensureDataInitialized();
    return decryptPayload<InstallmentRecord[]>(localStorage.getItem(STORAGE_KEYS.INSTALLMENTS), INITIAL_INSTALLMENTS);
  }

  static payInstallment(
    installmentId: string,
    method: 'PayPal' | 'Wise' | 'Stripe' | 'Bank Transfer' | 'Card' | 'USDT (TRC20)',
    txId: string
  ): { success: boolean; transaction: TransactionRecord } {
    const installments = this.getInstallments();
    const instIndex = installments.findIndex(i => i.id === installmentId);
    if (instIndex === -1) {
      throw new Error('Installment not found');
    }

    const inst = installments[instIndex];
    const receiptNo = 'REC-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const paidDate = new Date().toISOString().split('T')[0];

    installments[instIndex] = {
      ...inst,
      status: 'paid',
      paidDate,
      paymentMethod: method,
      transactionId: txId || 'TX-' + Math.floor(100000 + Math.random() * 900000),
      receiptNo
    };

    localStorage.setItem(STORAGE_KEYS.INSTALLMENTS, encryptPayload(installments));

    // Add transaction record
    const newTx: TransactionRecord = {
      id: 'tx-' + Date.now(),
      date: paidDate,
      title: `Installment #${inst.installmentNo} Payment - Royal Bay Suite Share`,
      titleBn: `Installment #${inst.installmentNo} Payment - Royal Bay Suite Share`,
      category: 'installment',
      amount: inst.amount,
      type: 'debit',
      status: 'completed',
      method: `${method} (${txId || 'Online'})`,
      referenceNo: receiptNo
    };

    const transactions = [newTx, ...this.getTransactions()];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, encryptPayload(transactions));

    // Add notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'Payment Successful',
      titleBn: 'Payment Successful',
      message: `$${inst.amount.toLocaleString()} received via ${method}. Receipt: ${receiptNo}`,
      messageBn: `$${inst.amount.toLocaleString()} received via ${method}. Receipt: ${receiptNo}`,
      date: paidDate,
      read: false,
      type: 'installment',
      actionUrl: 'installment_receipts'
    };
    const notifications = [newNotif, ...this.getNotifications()];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, encryptPayload(notifications));

    this.updateLastSync();
    return { success: true, transaction: newTx };
  }

  // --- TRANSACTIONS CRUD ---
  static getTransactions(): TransactionRecord[] {
    this.ensureDataInitialized();
    return decryptPayload<TransactionRecord[]>(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS), INITIAL_TRANSACTIONS);
  }

  static addTransaction(tx: Partial<TransactionRecord>): TransactionRecord {
    const list = this.getTransactions();
    const newTx: TransactionRecord = {
      id: tx.id || 'tx-' + Date.now(),
      date: tx.date || new Date().toISOString().split('T')[0],
      title: tx.title || 'Ledger Transaction',
      titleBn: tx.titleBn || 'Ledger Transaction',
      category: tx.category || 'installment',
      amount: tx.amount || 0,
      type: tx.type || 'credit',
      status: tx.status || 'completed',
      method: tx.method || 'System Entry',
      referenceNo: tx.referenceNo || 'TXN-' + Math.floor(100000 + Math.random() * 900000)
    };
    const updated = [newTx, ...list];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, encryptPayload(updated));
    this.updateLastSync();
    return newTx;
  }

  static deleteTransaction(id: string): boolean {
    const list = this.getTransactions();
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  // --- ADMIN INVESTORS CRM CRUD ---
  static getAdminInvestors(): AdminInvestor[] {
    this.ensureDataInitialized();
    return decryptPayload<AdminInvestor[]>(localStorage.getItem(STORAGE_KEYS.ADMIN_INVESTORS), INITIAL_ADMIN_INVESTORS);
  }

  static createAdminInvestor(inv: Partial<AdminInvestor>): AdminInvestor {
    const list = this.getAdminInvestors();
    const newInv: AdminInvestor = {
      id: inv.id || 'usr-' + Date.now(),
      username: inv.username || 'member_' + Math.floor(100 + Math.random() * 900),
      fullName: inv.fullName || 'New Investor',
      fullNameBn: inv.fullNameBn,
      phone: inv.phone || '+971 50 236 8800',
      email: inv.email || 'investor@questraworld.com',
      memberId: inv.memberId || `QW-${inv.branch?.includes('Singapore') ? 'INT' : 'GLB'}-${Math.floor(1000 + Math.random() * 9000)}`,
      branch: inv.branch || 'Global Head Office',
      rank: inv.rank || 'Associate Member',
      kycStatus: inv.kycStatus || 'pending',
      nidNo: inv.nidNo || '1990 0000 0000 00',
      totalInvested: inv.totalInvested || 0,
      commissionBalance: inv.commissionBalance || 0,
      dividendBalance: inv.dividendBalance || 0,
      status: inv.status || 'active',
      joinedDate: inv.joinedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      nomineeName: inv.nomineeName || 'N/A',
      nomineeRelation: inv.nomineeRelation || 'Spouse'
    };
    const updated = [newInv, ...list];
    localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, encryptPayload(updated));
    this.addAuditLog('CREATE_INVESTOR', `${newInv.memberId} (${newInv.fullName})`, 'New investor profile created via Admin CRM.');
    this.updateLastSync();
    return newInv;
  }

  static updateAdminInvestor(id: string, updates: Partial<AdminInvestor>): AdminInvestor | null {
    const list = this.getAdminInvestors();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, encryptPayload(list));
    this.addAuditLog('UPDATE_INVESTOR', `${list[idx].memberId} (${list[idx].fullName})`, 'Investor details updated via Admin CRM.');
    this.updateLastSync();
    return list[idx];
  }

  static deleteAdminInvestor(id: string): boolean {
    const list = this.getAdminInvestors();
    const target = list.find(i => i.id === id);
    const filtered = list.filter(i => i.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, encryptPayload(filtered));
      if (target) {
        this.addAuditLog('DELETE_INVESTOR', `${target.memberId} (${target.fullName})`, 'Investor profile deleted from system.');
      }
      this.updateLastSync();
      return true;
    }
    return false;
  }

  static adjustInvestorWallet(id: string, type: 'commission' | 'dividend', amount: number, note?: string): boolean {
    const list = this.getAdminInvestors();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return false;
    if (type === 'commission') {
      list[idx].commissionBalance = Math.max(0, list[idx].commissionBalance + amount);
    } else {
      list[idx].dividendBalance = Math.max(0, list[idx].dividendBalance + amount);
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, encryptPayload(list));
    this.addAuditLog('WALLET_ADJUSTMENT', `${list[idx].memberId} (${list[idx].fullName})`, `Adjusted ${type} balance by $${amount.toLocaleString()}. Note: ${note || 'Admin adjustment'}`);
    this.updateLastSync();
    return true;
  }

  // --- DEPOSIT SLIPS CRUD ---
  static getDepositSlips(): AdminDepositSlip[] {
    this.ensureDataInitialized();
    return decryptPayload<AdminDepositSlip[]>(localStorage.getItem(STORAGE_KEYS.DEPOSIT_SLIPS), INITIAL_DEPOSIT_SLIPS);
  }

  static createDepositSlip(slip: Partial<AdminDepositSlip>): AdminDepositSlip {
    const list = this.getDepositSlips();
    const user = this.getUser() || INITIAL_USER;
    const newSlip: AdminDepositSlip = {
      id: slip.id || 'slip-' + Date.now(),
      slipNo: slip.slipNo || 'SLIP-' + Math.floor(100000 + Math.random() * 900000),
      memberUsername: slip.memberUsername || user.username,
      memberName: slip.memberName || user.fullName,
      memberId: slip.memberId || user.memberId,
      bookingId: slip.bookingId || 'share-royal-bay-204',
      projectName: slip.projectName || 'Questra Royal Bay (Suites & Residences)',
      bankName: slip.bankName || 'HSBC',
      branchName: slip.branchName || 'Central Branch',
      amount: slip.amount || 35000,
      depositDate: slip.depositDate || new Date().toISOString().split('T')[0],
      transactionId: slip.transactionId || 'DEP-' + Math.floor(100000 + Math.random() * 900000),
      slipImageUrl: slip.slipImageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      notes: slip.notes || 'Offline bank deposit voucher submitted.',
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newSlip, ...list];
    localStorage.setItem(STORAGE_KEYS.DEPOSIT_SLIPS, encryptPayload(updated));
    this.addAuditLog('SUBMIT_SLIP', `${newSlip.slipNo} (${newSlip.memberName})`, `Deposit slip of $${newSlip.amount.toLocaleString()} submitted for verification.`);
    this.updateLastSync();
    return newSlip;
  }

  static updateDepositSlip(id: string, updates: Partial<AdminDepositSlip>): AdminDepositSlip | null {
    const list = this.getDepositSlips();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.DEPOSIT_SLIPS, encryptPayload(list));
    this.updateLastSync();
    return list[idx];
  }

  static deleteDepositSlip(id: string): boolean {
    const list = this.getDepositSlips();
    const filtered = list.filter(s => s.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.DEPOSIT_SLIPS, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  static approveDepositSlip(id: string): boolean {
    const slips = this.getDepositSlips();
    const idx = slips.findIndex(s => s.id === id);
    if (idx === -1) return false;
    const slip = slips[idx];
    slips[idx].status = 'approved';
    localStorage.setItem(STORAGE_KEYS.DEPOSIT_SLIPS, encryptPayload(slips));

    // Update installment if corresponding
    const installments = this.getInstallments();
    const pendingInst = installments.find(i => i.status === 'due') || installments[0];
    if (pendingInst) {
      const isCrypto = /usdt/i.test(slip.bankName) || /crypto/i.test(slip.branchName);
      const payMethod: 'USDT (TRC20)' | 'Bank Transfer' = isCrypto ? 'USDT (TRC20)' : 'Bank Transfer';
      this.payInstallment(pendingInst.id, payMethod, slip.transactionId);
    }

    this.addAuditLog('APPROVE_DEPOSIT_SLIP', `${slip.slipNo} (${slip.memberName})`, `Approved $${slip.amount.toLocaleString()}. Official Money Receipt generated.`, 'success');
    this.updateLastSync();
    return true;
  }

  static rejectDepositSlip(id: string, reason: string): boolean {
    const slips = this.getDepositSlips();
    const idx = slips.findIndex(s => s.id === id);
    if (idx === -1) return false;
    const slip = slips[idx];
    slips[idx].status = 'rejected';
    slips[idx].notes = `Rejected: ${reason}`;
    localStorage.setItem(STORAGE_KEYS.DEPOSIT_SLIPS, encryptPayload(slips));
    this.addAuditLog('REJECT_DEPOSIT_SLIP', `${slip.slipNo} (${slip.memberName})`, `Rejected. Reason: ${reason}`, 'warning');
    this.updateLastSync();
    return true;
  }

  // --- NOTICES CMS CRUD ---
  static getNotices(): NoticeItem[] {
    this.ensureDataInitialized();
    return decryptPayload<NoticeItem[]>(localStorage.getItem(STORAGE_KEYS.NOTICES), INITIAL_NOTICES);
  }

  static createNotice(notice: Partial<NoticeItem>): NoticeItem {
    const list = this.getNotices();
    const newNotice: NoticeItem = {
      id: notice.id || 'ntc-' + Date.now(),
      title: notice.title || 'Official Announcement',
      category: notice.category || 'General',
      content: notice.content || '',
      date: notice.date || new Date().toLocaleDateString('en-GB'),
      priority: notice.priority || 'normal',
      status: notice.status || 'published',
      documentUrl: notice.documentUrl
    };
    const updated = [newNotice, ...list];
    localStorage.setItem(STORAGE_KEYS.NOTICES, encryptPayload(updated));
    this.addAuditLog('PUBLISH_NOTICE', newNotice.title, `Published circular in category: ${newNotice.category}`);
    this.updateLastSync();
    return newNotice;
  }

  static updateNotice(id: string, updates: Partial<NoticeItem>): NoticeItem | null {
    const list = this.getNotices();
    const idx = list.findIndex(n => n.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.NOTICES, encryptPayload(list));
    this.updateLastSync();
    return list[idx];
  }

  static deleteNotice(id: string): boolean {
    const list = this.getNotices();
    const filtered = list.filter(n => n.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  // --- PROJECT TOURS CRUD ---
  static getSiteTours(): AdminSiteTourBooking[] {
    this.ensureDataInitialized();
    return decryptPayload<AdminSiteTourBooking[]>(localStorage.getItem(STORAGE_KEYS.SITE_TOURS), INITIAL_SITE_TOURS);
  }

  static createSiteTour(tour: Partial<AdminSiteTourBooking>): AdminSiteTourBooking {
    const list = this.getSiteTours();
    const newTour: AdminSiteTourBooking = {
      id: tour.id || 'tour-' + Date.now(),
      clientName: tour.clientName || 'Valued Client',
      phone: tour.phone || '+971 50 000 0000',
      preferredDate: tour.preferredDate || 'Friday, Upcoming',
      timeSlot: tour.timeSlot || 'Morning (09:00 AM)',
      projectInterested: tour.projectInterested || "Questra Royal Bay (Suites & Residences)",
      pickupLocation: tour.pickupLocation || 'Financial District Global Head Office',
      guestsCount: tour.guestsCount || 2,
      assignedBus: tour.assignedBus,
      coordinator: tour.coordinator,
      status: tour.status || 'pending',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const updated = [newTour, ...list];
    localStorage.setItem(STORAGE_KEYS.SITE_TOURS, encryptPayload(updated));
    this.updateLastSync();
    return newTour;
  }

  static updateSiteTour(id: string, updates: Partial<AdminSiteTourBooking>): AdminSiteTourBooking | null {
    const list = this.getSiteTours();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SITE_TOURS, encryptPayload(list));
    this.updateLastSync();
    return list[idx];
  }

  static deleteSiteTour(id: string): boolean {
    const list = this.getSiteTours();
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.SITE_TOURS, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  // --- VACATION BOOKINGS CRUD ---
  static getVacationBookings(): VacationBooking[] {
    this.ensureDataInitialized();
    return decryptPayload<VacationBooking[]>(localStorage.getItem(STORAGE_KEYS.VACATION_BOOKINGS), INITIAL_VACATION_BOOKINGS);
  }

  static createVacationBooking(booking: Partial<VacationBooking>): VacationBooking {
    const list = this.getVacationBookings();
    const user = this.getUser() || INITIAL_USER;
    const newBooking: VacationBooking = {
      id: booking.id || 'vac-' + Date.now(),
      memberId: booking.memberId || user.memberId,
      memberName: booking.memberName || user.fullName,
      checkInDate: booking.checkInDate || '2026-11-12',
      checkOutDate: booking.checkOutDate || '2026-11-15',
      guestsCount: booking.guestsCount || 2,
      roomType: booking.roomType || 'Royal Suite (Ocean Front, 6th Floor)',
      specialRequest: booking.specialRequest,
      bookingStatus: 'confirmed',
      confirmationCode: `RB-VAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newBooking, ...list];
    localStorage.setItem(STORAGE_KEYS.VACATION_BOOKINGS, encryptPayload(updated));
    this.updateLastSync();
    return newBooking;
  }

  static updateVacationBooking(id: string, updates: Partial<VacationBooking>): VacationBooking | null {
    const list = this.getVacationBookings();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.VACATION_BOOKINGS, encryptPayload(list));
    this.updateLastSync();
    return list[idx];
  }

  static deleteVacationBooking(id: string): boolean {
    const list = this.getVacationBookings();
    const filtered = list.filter(b => b.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.VACATION_BOOKINGS, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  // --- SECURITY SETTINGS (login password / T-PIN / 2FA) ---
  static getSecuritySettings(): { password: string; transactionPin: string; twoFactorEnabled: boolean } {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall through to defaults
      }
    }
    const user = this.getUser();
    return {
      password: '123456',
      transactionPin: '8842',
      twoFactorEnabled: user?.twoFactorEnabled ?? false
    };
  }

  static updateSecuritySettings(updates: { password?: string; transactionPin?: string; twoFactorEnabled?: boolean }): void {
    const current = this.getSecuritySettings();
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify({ ...current, ...updates }));
    this.updateLastSync();
  }

  // --- SUPPORT TICKETS CRUD ---
  static getTickets(): SupportTicket[] {
    this.ensureDataInitialized();
    return decryptPayload<SupportTicket[]>(localStorage.getItem(STORAGE_KEYS.TICKETS), INITIAL_TICKETS);
  }

  static createTicket(subject: string, category: SupportTicket['category'], messageText: string, priority: SupportTicket['priority'] = 'medium'): SupportTicket {
    const user = this.getUser() || INITIAL_USER;
    const newTicket: SupportTicket = {
      id: 'tkt-' + Date.now(),
      ticketNo: 'QW-TKT-' + Math.floor(1000 + Math.random() * 9000),
      subject,
      category,
      priority,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      messages: [
        {
          sender: 'user',
          senderName: user.fullName,
          text: messageText,
          timestamp: 'Just now'
        }
      ]
    };

    const tickets = [newTicket, ...this.getTickets()];
    localStorage.setItem(STORAGE_KEYS.TICKETS, encryptPayload(tickets));
    this.updateLastSync();
    return newTicket;
  }

  static replyTicket(ticketId: string, replyText: string, sender: 'user' | 'support', senderName: string): SupportTicket | null {
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;
    tickets[idx].messages.push({
      sender,
      senderName,
      text: replyText,
      timestamp: 'Just now'
    });
    tickets[idx].updatedAt = new Date().toISOString().split('T')[0];
    if (sender === 'support') {
      tickets[idx].status = 'in_progress';
    }
    localStorage.setItem(STORAGE_KEYS.TICKETS, encryptPayload(tickets));
    this.updateLastSync();
    return tickets[idx];
  }

  static updateTicketStatus(ticketId: string, status: SupportTicket['status'], priority?: SupportTicket['priority']): SupportTicket | null {
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;
    tickets[idx].status = status;
    if (priority) tickets[idx].priority = priority;
    tickets[idx].updatedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.TICKETS, encryptPayload(tickets));
    this.updateLastSync();
    return tickets[idx];
  }

  static deleteTicket(ticketId: string): boolean {
    const tickets = this.getTickets();
    const filtered = tickets.filter(t => t.id !== ticketId);
    if (filtered.length !== tickets.length) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, encryptPayload(filtered));
      this.updateLastSync();
      return true;
    }
    return false;
  }

  // --- AUDIT LOGS CRUD ---
  static getAuditLogs(): AdminAuditLog[] {
    this.ensureDataInitialized();
    return decryptPayload<AdminAuditLog[]>(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS), INITIAL_AUDIT_LOGS);
  }

  static addAuditLog(action: string, target: string, details: string, status: 'success' | 'warning' | 'info' = 'info'): AdminAuditLog {
    const user = this.getUser() || INITIAL_ADMIN;
    const newLog: AdminAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: 'Just now',
      adminUser: user.fullName,
      action,
      target,
      details,
      status
    };
    const list = [newLog, ...this.getAuditLogs()];
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, encryptPayload(list));
    return newLog;
  }

  // --- NOTIFICATIONS ---
  static getNotifications(): AppNotification[] {
    this.ensureDataInitialized();
    return decryptPayload<AppNotification[]>(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS), INITIAL_NOTIFICATIONS);
  }

  static markNotificationsAsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, encryptPayload(notifs));
  }

  // --- REFERRAL & NETWORK SIGNUPS CRUD ---
  static getReferralSignups(): ReferralSignup[] {
    this.ensureDataInitialized();
    return decryptPayload<ReferralSignup[]>(localStorage.getItem(STORAGE_KEYS.REFERRAL_SIGNUPS), INITIAL_REFERRAL_SIGNUPS);
  }

  static addReferralSignup(data: Omit<ReferralSignup, 'id'>): ReferralSignup {
    const list = this.getReferralSignups();
    const newSignup: ReferralSignup = {
      ...data,
      id: 'ref-' + Date.now()
    };
    const updated = [newSignup, ...list];
    localStorage.setItem(STORAGE_KEYS.REFERRAL_SIGNUPS, encryptPayload(updated));
    this.addAuditLog(
      'NEW_REFERRAL_SIGNUP',
      `${newSignup.name} (@${newSignup.username})`,
      `New referral signup recorded under sponsor ${newSignup.sponsorUsername}. Asset: ${newSignup.assetBooked}. Commission: $${newSignup.commissionEarned.toLocaleString()}`,
      'success'
    );
    this.updateLastSync();
    return newSignup;
  }

  static updateReferralSignup(id: string, updates: Partial<ReferralSignup>): ReferralSignup | null {
    const list = this.getReferralSignups();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.REFERRAL_SIGNUPS, encryptPayload(list));
    this.updateLastSync();
    return list[idx];
  }

  static deleteReferralSignup(id: string): boolean {
    const list = this.getReferralSignups();
    const filtered = list.filter(item => item.id !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_KEYS.REFERRAL_SIGNUPS, encryptPayload(filtered));
    this.updateLastSync();
    return true;
  }

  // --- REFERRAL COMMISSION SETTINGS (admin-configurable) ---
  static getReferralSettings(): ReferralSettings {
    this.ensureDataInitialized();
    const saved = decryptPayload<ReferralSettings | null>(
      localStorage.getItem(STORAGE_KEYS.REFERRAL_SETTINGS),
      null
    );
    if (!saved || !Array.isArray(saved.rates) || !saved.rates.length) {
      return { ...DEFAULT_REFERRAL_SETTINGS, rates: [...DEFAULT_REFERRAL_SETTINGS.rates] };
    }
    const generations = Math.max(1, Math.min(10, Math.round(Number(saved.generations) || DEFAULT_REFERRAL_SETTINGS.generations)));
    const rates = Array.from({ length: generations }, (_, i) => {
      const v = Number(saved.rates[i]);
      return Number.isFinite(v) && v >= 0 ? v : 0;
    });
    return { generations, rates, updatedAt: saved.updatedAt };
  }

  static updateReferralSettings(settings: Partial<ReferralSettings>): ReferralSettings {
    const current = this.getReferralSettings();
    const generations = Math.max(1, Math.min(10, Math.round(Number(settings.generations ?? current.generations))));
    const sourceRates = settings.rates ?? current.rates;
    const rates = Array.from({ length: generations }, (_, i) => {
      const v = Number(sourceRates[i]);
      return Number.isFinite(v) && v >= 0 ? v : 0;
    });
    const next: ReferralSettings = { generations, rates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.REFERRAL_SETTINGS, encryptPayload(next));
    this.addAuditLog(
      'REFERRAL_SETTINGS_UPDATED',
      'Commission Matrix',
      `Active generations: ${generations}. Rates: ${rates.map((r, i) => `Gen ${i + 1} ${r}%`).join(', ')}.`,
      'success'
    );
    this.updateLastSync();
    return next;
  }

  /** Commission percentage configured for a given generation (0 when beyond the active plan). */
  static getGenerationRate(generation: number): number {
    const s = this.getReferralSettings();
    if (generation < 1 || generation > s.generations) return 0;
    return s.rates[generation - 1] ?? 0;
  }

  /** Deepest generation currently present in the referral network. */
  static getMaxReferralGeneration(): number {
    const list = this.getReferralSignups();
    return list.reduce((max, s) => Math.max(max, s.generation || 1), 1);
  }

  /**
   * Re-applies the active commission matrix to every referral signup.
   * Members on generations beyond the active plan are set to 0% until the
   * admin increases the number of generations.
   */
  static recalcReferralCommissions(): { processed: number; settings: ReferralSettings } {
    const settings = this.getReferralSettings();
    const list = this.getReferralSignups();
    const next = list.map(item => {
      const rate = item.generation >= 1 && item.generation <= settings.generations
        ? settings.rates[item.generation - 1] ?? 0
        : 0;
      return {
        ...item,
        commissionRate: rate,
        commissionEarned: Math.round((item.investmentValue * rate) / 100)
      };
    });
    localStorage.setItem(STORAGE_KEYS.REFERRAL_SIGNUPS, encryptPayload(next));
    this.addAuditLog(
      'REFERRAL_NETWORK_RECALCULATED',
      'Commission Matrix',
      `Recomputed commissions for ${next.length} signup(s) using ${settings.generations} generation(s).`,
      'success'
    );
    this.updateLastSync();
    return { processed: next.length, settings };
  }

  // --- CRYPTO (USDT / TRC20) PAYMENT SETTINGS ---
  static getCryptoPaymentSettings(): CryptoPaymentSettings {
    this.ensureDataInitialized();
    const saved = decryptPayload<CryptoPaymentSettings | null>(
      localStorage.getItem(STORAGE_KEYS.CRYPTO_SETTINGS),
      null
    );
    if (!saved) {
      return { ...DEFAULT_CRYPTO_SETTINGS };
    }
    return {
      enabled: saved.enabled !== false,
      network: saved.network || DEFAULT_CRYPTO_SETTINGS.network,
      walletAddress: saved.walletAddress || DEFAULT_CRYPTO_SETTINGS.walletAddress,
      bdtPerUsdt: Number(saved.bdtPerUsdt) > 0 ? Number(saved.bdtPerUsdt) : DEFAULT_CRYPTO_SETTINGS.bdtPerUsdt,
      instructions: saved.instructions || DEFAULT_CRYPTO_SETTINGS.instructions,
      updatedAt: saved.updatedAt
    };
  }

  static updateCryptoPaymentSettings(settings: Partial<CryptoPaymentSettings>): CryptoPaymentSettings {
    const current = this.getCryptoPaymentSettings();
    const next: CryptoPaymentSettings = {
      enabled: settings.enabled ?? current.enabled,
      network: (settings.network ?? current.network).trim() || DEFAULT_CRYPTO_SETTINGS.network,
      walletAddress: (settings.walletAddress ?? current.walletAddress).trim(),
      bdtPerUsdt: Number(settings.bdtPerUsdt ?? current.bdtPerUsdt) > 0
        ? Number(settings.bdtPerUsdt ?? current.bdtPerUsdt)
        : current.bdtPerUsdt,
      instructions: settings.instructions ?? current.instructions,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CRYPTO_SETTINGS, encryptPayload(next));
    this.addAuditLog(
      'CRYPTO_SETTINGS_UPDATED',
      'USDT / TRC20',
      `Crypto payments ${next.enabled ? 'enabled' : 'disabled'}. Network: ${next.network}. Wallet: ${next.walletAddress}. Rate: $${next.bdtPerUsdt}/USDT.`,
      'success'
    );
    this.updateLastSync();
    return next;
  }

  /** Convert a fiat amount into USDT using the admin-configured rate. */
  static bdtToUsdt(amountBDT: number): number {
    const rate = this.getCryptoPaymentSettings().bdtPerUsdt || DEFAULT_CRYPTO_SETTINGS.bdtPerUsdt;
    return Math.round((amountBDT / rate) * 100) / 100;
  }

  /**
   * Records a manual crypto (USDT / TRC20) payment as a PENDING deposit slip
   * awaiting admin verification. It never auto-marks an installment as paid.
   */
  static submitCryptoDeposit(input: {
    amountBDT: number;
    txHash: string;
    installmentId?: string;
    bookingId?: string;
  }): AdminDepositSlip {
    const settings = this.getCryptoPaymentSettings();
    const usdtAmount = this.bdtToUsdt(input.amountBDT);
    const slip = this.createDepositSlip({
      bookingId: input.bookingId || 'share-royal-bay-204',
      projectName: input.installmentId ? 'Installment Payment (USDT / TRC20)' : 'Share Booking (USDT / TRC20)',
      bankName: `USDT · ${settings.network}`,
      branchName: 'Crypto · Manual Verification',
      amount: input.amountBDT,
      transactionId: input.txHash,
      slipImageUrl: '',
      notes: `Crypto payment: ${usdtAmount} USDT (${settings.network}) sent to ${settings.walletAddress}. TxID: ${input.txHash}. Awaiting manual verification by the finance desk.`
    });
    this.updateDepositSlip(slip.id, { status: 'pending' });
    this.addAuditLog(
      'CRYPTO_DEPOSIT_SUBMITTED',
      `${slip.slipNo} (${slip.memberName})`,
      `USDT (${settings.network}) deposit of ${usdtAmount} USDT (≈$${input.amountBDT.toLocaleString()}) submitted. TxID: ${input.txHash}. Awaiting manual approval.`,
      'info'
    );
    return slip;
  }

  // ==================================================================
  // HOMEPAGE CMS (sections, collections, global settings) — full CRUD
  // ==================================================================
  static getCmsSections(): CmsSection[] {
    this.ensureDataInitialized();
    const saved = decryptPayload<CmsSection[] | null>(
      localStorage.getItem(STORAGE_KEYS.CMS_SECTIONS),
      null
    );
    const list = Array.isArray(saved) && saved.length ? saved : DEFAULT_CMS_SECTIONS;
    // Merge with defaults so newly shipped sections always appear.
    const byId = new Map(list.map(s => [s.id, s]));
    const merged = DEFAULT_CMS_SECTIONS.map(def => ({ ...def, ...(byId.get(def.id) || {}) }));
    // Keep any custom sections the admin added that aren't in defaults.
    const custom = list.filter(s => !DEFAULT_CMS_SECTIONS.some(d => d.id === s.id));
    return [...merged, ...custom].sort((a, b) => a.order - b.order);
  }

  static saveCmsSections(sections: CmsSection[]): CmsSection[] {
    const normalized = sections.map((s, i) => ({ ...s, order: Number.isFinite(s.order) ? s.order : i }));
    localStorage.setItem(STORAGE_KEYS.CMS_SECTIONS, encryptPayload(normalized));
    this.updateLastSync();
    return normalized.sort((a, b) => a.order - b.order);
  }

  static updateCmsSection(id: string, updates: Partial<CmsSection>): CmsSection | null {
    const list = this.getCmsSections();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, id, updatedAt: new Date().toISOString() };
    this.saveCmsSections(list);
    this.addAuditLog(
      'CMS_SECTION_UPDATED',
      list[idx].label,
      `Homepage section "${list[idx].label}" content updated.`,
      'success'
    );
    return list[idx];
  }

  static toggleCmsSection(id: string): CmsSection | null {
    const list = this.getCmsSections();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], visible: !list[idx].visible, updatedAt: new Date().toISOString() };
    this.saveCmsSections(list);
    this.addAuditLog(
      list[idx].visible ? 'CMS_SECTION_SHOWN' : 'CMS_SECTION_HIDDEN',
      list[idx].label,
      `Homepage section "${list[idx].label}" is now ${list[idx].visible ? 'visible' : 'hidden'}.`,
      'info'
    );
    return list[idx];
  }

  /** Move a homepage section up (-1) or down (+1) in the render order. */
  static moveCmsSection(id: string, direction: -1 | 1): CmsSection[] {
    const list = this.getCmsSections();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return list;
    const target = idx + direction;
    if (target < 0 || target >= list.length) return list;
    const reordered = [...list];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    const normalized = reordered.map((s, i) => ({ ...s, order: i }));
    this.saveCmsSections(normalized);
    return normalized;
  }

  static resetCmsSections(): CmsSection[] {
    localStorage.setItem(STORAGE_KEYS.CMS_SECTIONS, encryptPayload(DEFAULT_CMS_SECTIONS));
    this.addAuditLog('CMS_RESET', 'Homepage Sections', 'Homepage sections reset to defaults.', 'warning');
    this.updateLastSync();
    return [...DEFAULT_CMS_SECTIONS];
  }

  static getCmsCollections(): CmsCollectionItem[] {
    this.ensureDataInitialized();
    return decryptPayload<CmsCollectionItem[]>(
      localStorage.getItem(STORAGE_KEYS.CMS_COLLECTIONS),
      DEFAULT_CMS_COLLECTIONS
    );
  }

  static getCmsCollection(key: CmsCollectionKey): CmsCollectionItem[] {
    return this.getCmsCollections()
      .filter(item => item.collection === key)
      .sort((a, b) => a.order - b.order);
  }

  static saveCmsCollections(items: CmsCollectionItem[]): CmsCollectionItem[] {
    localStorage.setItem(STORAGE_KEYS.CMS_COLLECTIONS, encryptPayload(items));
    this.updateLastSync();
    return items;
  }

  static addCmsItem(item: Partial<CmsCollectionItem>): CmsCollectionItem {
    const list = this.getCmsCollections();
    const collection = (item.collection || 'features') as CmsCollectionKey;
    const sameCollection = list.filter(i => i.collection === collection);
    const nextOrder = sameCollection.length
      ? Math.max(...sameCollection.map(i => i.order)) + 1
      : 0;
    const newItem: CmsCollectionItem = {
      id: item.id || 'cms-' + Date.now(),
      collection,
      title: item.title || 'Untitled',
      subtitle: item.subtitle || '',
      body: item.body || '',
      imageUrl: item.imageUrl,
      badge: item.badge,
      order: Number.isFinite(item.order) ? (item.order as number) : nextOrder,
      updatedAt: new Date().toISOString()
    };
    this.saveCmsCollections([...list, newItem]);
    this.addAuditLog('CMS_CONTENT_ADDED', newItem.title, `New "${collection}" content item added.`, 'success');
    return newItem;
  }

  static updateCmsItem(id: string, updates: Partial<CmsCollectionItem>): CmsCollectionItem | null {
    const list = this.getCmsCollections();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, id, updatedAt: new Date().toISOString() };
    this.saveCmsCollections(list);
    this.addAuditLog('CMS_CONTENT_UPDATED', list[idx].title, `Content item updated in "${list[idx].collection}".`, 'success');
    return list[idx];
  }

  static deleteCmsItem(id: string): boolean {
    const list = this.getCmsCollections();
    const filtered = list.filter(i => i.id !== id);
    if (filtered.length === list.length) return false;
    this.saveCmsCollections(filtered);
    this.addAuditLog('CMS_CONTENT_DELETED', id, 'A CMS content item was deleted.', 'warning');
    return true;
  }

  static moveCmsItem(id: string, direction: -1 | 1): CmsCollectionItem[] {
    const list = this.getCmsCollections();
    const item = list.find(i => i.id === id);
    if (!item) return list;
    const siblings = list
      .filter(i => i.collection === item.collection)
      .sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex(i => i.id === id);
    const target = idx + direction;
    if (target < 0 || target >= siblings.length) return list;
    [siblings[idx], siblings[target]] = [siblings[target], siblings[idx]];
    const reorderedSiblings = siblings.map((s, i) => ({ ...s, order: i }));
    const others = list.filter(i => i.collection !== item.collection);
    const next = [...others, ...reorderedSiblings];
    this.saveCmsCollections(next);
    return next;
  }

  static resetCmsCollection(key: CmsCollectionKey): CmsCollectionItem[] {
    const list = this.getCmsCollections();
    const others = list.filter(i => i.collection !== key);
    const defaults = DEFAULT_CMS_COLLECTIONS.filter(i => i.collection === key);
    this.saveCmsCollections([...others, ...defaults]);
    this.addAuditLog('CMS_RESET', `Collection: ${key}`, `"${key}" content reset to defaults.`, 'warning');
    return [...defaults];
  }

  static getCmsSiteSettings(): CmsSiteSettings {
    this.ensureDataInitialized();
    const saved = decryptPayload<CmsSiteSettings | null>(
      localStorage.getItem(STORAGE_KEYS.CMS_SETTINGS),
      null
    );
    if (!saved) return { ...DEFAULT_CMS_SETTINGS };
    return {
      brandName: saved.brandName || DEFAULT_CMS_SETTINGS.brandName,
      legalName: saved.legalName || DEFAULT_CMS_SETTINGS.legalName,
      tagline: saved.tagline || DEFAULT_CMS_SETTINGS.tagline,
      supportPhone: saved.supportPhone || DEFAULT_CMS_SETTINGS.supportPhone,
      supportEmail: saved.supportEmail || DEFAULT_CMS_SETTINGS.supportEmail,
      corporateAddress: saved.corporateAddress || DEFAULT_CMS_SETTINGS.corporateAddress,
      footerNote: saved.footerNote || DEFAULT_CMS_SETTINGS.footerNote,
      copyrightText: saved.copyrightText || DEFAULT_CMS_SETTINGS.copyrightText,
      updatedAt: saved.updatedAt
    };
  }

  static updateCmsSiteSettings(settings: Partial<CmsSiteSettings>): CmsSiteSettings {
    const current = this.getCmsSiteSettings();
    const next: CmsSiteSettings = {
      brandName: (settings.brandName ?? current.brandName).trim() || DEFAULT_CMS_SETTINGS.brandName,
      legalName: (settings.legalName ?? current.legalName).trim() || DEFAULT_CMS_SETTINGS.legalName,
      tagline: (settings.tagline ?? current.tagline).trim(),
      supportPhone: (settings.supportPhone ?? current.supportPhone).trim(),
      supportEmail: (settings.supportEmail ?? current.supportEmail).trim(),
      corporateAddress: (settings.corporateAddress ?? current.corporateAddress).trim(),
      footerNote: (settings.footerNote ?? current.footerNote).trim(),
      copyrightText: (settings.copyrightText ?? current.copyrightText).trim() || DEFAULT_CMS_SETTINGS.copyrightText,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CMS_SETTINGS, encryptPayload(next));
    this.addAuditLog('CMS_SETTINGS_UPDATED', 'Global Settings', `Brand: ${next.brandName}. Legal: ${next.legalName}.`, 'success');
    this.updateLastSync();
    return next;
  }

  static updateLastSync(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  static getLastSync(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toISOString();
  }
}
