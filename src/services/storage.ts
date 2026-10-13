import {
  User,
  ShareInvestment,
  InstallmentRecord,
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

// Pre-seeded user data matching user's requested login: Ziabulctg1 / 123456
export const INITIAL_USER: User = {
  id: 'usr-ctg-8842',
  username: 'Ziabulctg1',
  fullName: 'Ziabul Hoque Chowdhury',
  fullNameBn: 'Ziabul Hoque Chowdhury',
  referralCode: 'QW-8842',
  email: 'ziabul.ctg@gmail.com',
  phone: '+880 1819-745239',
  branch: 'Chattogram Office (Salma Centre, Muradpur)',
  memberId: 'QW-CTG-8842',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  address: 'House #42, Road #3, South Agrabad C/A',
  city: 'Chattogram',
  nidNo: '1984 1592 7831 44',
  role: 'investor',
  joinedDate: '15 March 2024',
  e2eEncryptionKey: 'QW-AES256-GCM-e8b2a19f9301ac77',
  twoFactorEnabled: true,
  nominee: {
    name: 'Mrs. Taslima Ziabul',
    relation: 'Spouse',
    phone: '+880 1819-745240',
    nid: '1988 2419 8832 91'
  },
  bankName: 'The City Bank Limited',
  bankBranch: 'Agrabad Commercial Branch, Chattogram',
  bankAccount: '1102948192001',
  bankRoutingNumber: '225150921',
  mfsNumber: '01819745239'
};

export const INITIAL_ADMIN: User = {
  id: 'usr-admin-001',
  username: 'admin',
  fullName: 'Md. Ripon Hossain (Super Admin)',
  fullNameBn: 'Md. Ripon Hossain (Super Admin)',
  email: 'admin@questaworld.com',
  phone: '+880 1819-001122',
  branch: 'Corporate Head Office (Mirpur-12, Dhaka)',
  memberId: 'QW-HQ-001',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  address: 'Questa World Tower, Pallabi, Mirpur-12',
  city: 'Dhaka',
  nidNo: '1975 1209 8832 01',
  role: 'admin',
  joinedDate: '01 January 2020',
  e2eEncryptionKey: 'QW-ADMIN-ROOT-KEY-990182',
  twoFactorEnabled: true,
  nominee: {
    name: 'H. M. Ziaur Rahman',
    relation: 'Managing Director Partner',
    phone: '+880 1819-001123',
    nid: '1978 4429 8812 02'
  }
};

export const INITIAL_SHARES: ShareInvestment[] = [
  {
    id: 'share-royal-bay-204',
    projectName: 'Questa Royal Bay Hotel & Suites - Cox\'s Bazar',
    projectNameBn: 'Questa Royal Bay Hotel & Suites - Cox\'s Bazar',
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
    paymentMethod: 'bKash',
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
    transactionId: 'CBL-FT-491028',
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
    paymentMethod: 'Nagad',
    transactionId: 'NG8812048B',
    receiptNo: 'REC-2026-07-109'
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-101',
    date: '2026-10-01',
    title: 'Hotel Suite Monthly Dividend Distribution (September)',
    titleBn: 'Hotel Suite Monthly Dividend Distribution (September)',
    category: 'dividend',
    amount: 18500,
    type: 'credit',
    status: 'completed',
    method: 'City Bank Auto-Credit',
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
    method: 'bKash Gateway',
    referenceNo: 'BK9X88291A'
  },
  {
    id: 'tx-103',
    date: '2026-09-01',
    title: 'Hotel Suite Monthly Dividend Distribution (August)',
    titleBn: 'Hotel Suite Monthly Dividend Distribution (August)',
    category: 'dividend',
    amount: 18500,
    type: 'credit',
    status: 'completed',
    method: 'City Bank Auto-Credit',
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
    method: 'City Bank Online Transfer',
    referenceNo: 'CBL-FT-491028'
  },
  {
    id: 'tx-105',
    date: '2026-08-15',
    title: 'Associate Referral Commission (Chattogram Client Share Booking)',
    titleBn: 'Associate Referral Commission (Chattogram Client Share Booking)',
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
    title: 'Installment Due Reminder',
    titleBn: 'Installment Due Reminder',
    message: 'Your monthly installment of ৳35,000 for your Royal Bay suite share is due on 25 October 2026.',
    messageBn: 'Your monthly installment of ৳35,000 for your Royal Bay suite share is due on 25 October 2026.',
    date: '2026-10-08',
    read: false,
    type: 'installment',
    actionUrl: 'installments'
  },
  {
    id: 'notif-2',
    title: 'Monthly Dividend Disbursed',
    titleBn: 'Monthly Dividend Disbursed',
    message: '৳18,500 has been credited to your linked City Bank account for Cox\'s Bazar Royal Bay shares.',
    messageBn: '৳18,500 has been credited to your linked City Bank account for Cox\'s Bazar Royal Bay shares.',
    date: '2026-10-01',
    read: false,
    type: 'dividend',
    actionUrl: 'transactions'
  },
  {
    id: 'notif-3',
    title: 'Questa Royal Bay Construction Milestone',
    titleBn: 'Questa Royal Bay Construction Milestone',
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
        senderName: 'Ziabul Hoque',
        text: 'Dear Questa World Support, kindly provide the certified copy of my Royal Bay suite share certificate for my bank file.',
        timestamp: '2026-09-15 11:30 AM'
      },
      {
        sender: 'support',
        senderName: 'Md. Kamrul Hasan (Legal Officer)',
        text: 'Assalamu Alaikum Mr. Ziabul. Your certified copy is generated. You can view the authenticated digital copy in the Digital Certificates section.',
        timestamp: '2026-09-17 03:45 PM'
      }
    ]
  }
];

export const PUBLIC_PROJECTS: ProjectInfo[] = [
  {
    id: 'questa-royal-bay',
    name: 'Questa Royal Bay Luxury Hotel & Suites',
    nameBn: 'Questa Royal Bay Luxury Hotel & Suites',
    tagline: '5-Star Hospitality Fractional Ownership & Monthly Profit Sharing',
    taglineBn: '5-Star Hospitality Fractional Ownership & Monthly Profit Sharing',
    category: 'hospitality',
    location: 'Marine Drive Road, Inani, Cox\'s Bazar',
    locationBn: 'Marine Drive Road, Inani, Cox\'s Bazar',
    size: '320 Keys Luxury Beachfront Resort',
    startingPrice: '৳6,00,000 / Suite Share',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    description: 'A landmark beachfront hospitality venture providing secure fractional share investment with guaranteed legal deed, lifetime vacation privileges (7 days free stay annually), and high-yield monthly revenue distribution.',
    features: [
      '18.5% to 22% Projected Annual Dividend Payout',
      'Monthly Auto-Transfer to Any Bangladeshi Bank Account',
      'Sub-Registry Fractional Ownership Deed Provided',
      '7 Days Free Annual Stay for Family with VIP Access',
      'Professional International Hotel Management Operator'
    ],
    featuresBn: [
      '18.5% to 22% Projected Annual Dividend Payout',
      'Monthly Auto-Transfer to Any Bangladeshi Bank Account',
      'Sub-Registry Fractional Ownership Deed Provided',
      '7 Days Free Annual Stay for Family with VIP Access',
      'Professional International Hotel Management Operator'
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
    id: 'questa-commercial-center',
    name: 'Questa World Commercial Center - Mirpur',
    nameBn: 'Questa World Commercial Center - Mirpur',
    tagline: 'Prime Commercial Retail & Office Tower in Pallabi',
    taglineBn: 'Prime Commercial Retail & Office Tower in Pallabi',
    category: 'commercial',
    location: 'Section 12, Pallabi, Mirpur, Dhaka',
    locationBn: 'Section 12, Pallabi, Mirpur, Dhaka',
    size: '14 Storied Modern Commercial Hub',
    startingPrice: '৳15,00,000 / Floor Share',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    description: 'Strategically positioned next to the Pallabi Metro Station, Questa World Commercial Center is designed for corporate headquarters, banking institutions, and premium brand showrooms with triple-level basement parking.',
    features: [
      'Direct 2-Minute Walk from Pallabi MRT Metro Station',
      'High Footfall Commercial Hotspot',
      'Central VRF Air Conditioning & High-Speed Elevators',
      'Guaranteed Rental Yield Agreement Option'
    ],
    featuresBn: [
      'Direct 2-Minute Walk from Pallabi MRT Metro Station',
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
        title: 'Mirpur Metro Station Skywalk & Showroom Handover',
        titleBn: 'Mirpur Metro Station Skywalk & Showroom Handover',
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
    username: 'Ziabulctg1',
    fullName: 'Ziabul Hoque Chowdhury',
    fullNameBn: 'Ziabul Hoque Chowdhury',
    phone: '+880 1819-745239',
    email: 'ziabul.ctg@gmail.com',
    memberId: 'QW-CTG-8842',
    branch: 'Chattogram Office (Salma Centre)',
    rank: 'Gold Senior Associate',
    kycStatus: 'verified',
    nidNo: '1984 1592 7831 44',
    totalInvested: 4700000,
    commissionBalance: 25000,
    dividendBalance: 74000,
    status: 'active',
    joinedDate: '15 March 2024',
    nomineeName: 'Mrs. Taslima Ziabul',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-ctg-101',
    username: 'anwar_ctg',
    fullName: 'Md. Anwar Hossain',
    fullNameBn: 'Md. Anwar Hossain',
    phone: '+880 1819-334455',
    email: 'anwar.ctg@yahoo.com',
    memberId: 'QW-CTG-9021',
    branch: 'Chattogram Office',
    rank: 'Associate Member',
    kycStatus: 'verified',
    nidNo: '1979 4819 0012 33',
    totalInvested: 3500000,
    commissionBalance: 15000,
    dividendBalance: 32000,
    status: 'active',
    joinedDate: '15 August 2026',
    nomineeName: 'Salma Anwar',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-dhk-102',
    username: 'tanvir_engr',
    fullName: 'Engr. Tanvir Ahmed',
    fullNameBn: 'Engr. Tanvir Ahmed',
    phone: '+880 1711-223344',
    email: 'tanvir.ahmed@buet.ac.bd',
    memberId: 'QW-DHK-5512',
    branch: 'Dhaka Principal Branch',
    rank: 'Silver Associate',
    kycStatus: 'verified',
    nidNo: '1986 2819 0451 90',
    totalInvested: 5200000,
    commissionBalance: 42000,
    dividendBalance: 92500,
    status: 'active',
    joinedDate: '01 June 2024',
    nomineeName: 'Farhana Ahmed',
    nomineeRelation: 'Spouse'
  },
  {
    id: 'usr-dhk-103',
    username: 'farhana_doc',
    fullName: 'Dr. Farhana Yasmin',
    fullNameBn: 'Dr. Farhana Yasmin',
    phone: '+880 1712-998877',
    email: 'farhana.dr@dmc.edu.bd',
    memberId: 'QW-DHK-6623',
    branch: 'Dhaka Corporate Office',
    rank: 'Associate Member',
    kycStatus: 'verified',
    nidNo: '1991 3329 8812 40',
    totalInvested: 2500000,
    commissionBalance: 12000,
    dividendBalance: 45000,
    status: 'active',
    joinedDate: '28 September 2026',
    nomineeName: 'Kabir Yasmin',
    nomineeRelation: 'Brother'
  },
  {
    id: 'usr-syl-104',
    username: 'mashiur_kazi',
    fullName: 'Kazi Mashiur Rahman',
    fullNameBn: 'Kazi Mashiur Rahman',
    phone: '+880 1611-445566',
    email: 'mashiur.kazi@gmail.com',
    memberId: 'QW-DHK-7789',
    branch: 'Sylhet Regional Branch',
    rank: 'Associate Member',
    kycStatus: 'pending',
    nidNo: '1982 7712 9940 11',
    totalInvested: 4800000,
    commissionBalance: 0,
    dividendBalance: 0,
    status: 'active',
    joinedDate: '10 October 2026',
    nomineeName: 'Nasreen Kazi',
    nomineeRelation: 'Spouse'
  }
];

export const INITIAL_DEPOSIT_SLIPS: AdminDepositSlip[] = [
  {
    id: 'slip-01',
    slipNo: 'CBL-DEP-741982',
    memberUsername: 'Ziabulctg1',
    memberName: 'Ziabul Hoque Chowdhury',
    memberId: 'QW-CTG-8842',
    bookingId: 'share-royal-bay-204',
    projectName: 'Questa Royal Bay (Hotel & Suites)',
    bankName: 'The City Bank Ltd',
    branchName: 'Agrabad Commercial Branch, Ctg',
    amount: 35000,
    depositDate: '2026-09-22',
    transactionId: 'CBL-FT-491028',
    slipImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    notes: 'Installment #24 Cash Deposit at Bank counter verified.',
    status: 'approved',
    submittedAt: '22 Sep 2026, 02:40 PM'
  },
  {
    id: 'slip-02',
    slipNo: 'SLIP-RB-8820',
    memberUsername: 'anwar_ctg',
    memberName: 'Md. Anwar Hossain',
    memberId: 'QW-CTG-9021',
    bookingId: 'share-royal-bay-204',
    projectName: 'Questa Royal Bay (Hotel & Suites)',
    bankName: 'Islami Bank Bangladesh Ltd',
    branchName: 'Khatungonj Corporate Branch',
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
    slipNo: 'SLIP-HOTEL-4412',
    memberUsername: 'tanvir_engr',
    memberName: 'Engr. Tanvir Ahmed',
    memberId: 'QW-DHK-5512',
    bookingId: 'share-royal-bay-204',
    projectName: "Questa Royal Bay Cox's Bazar",
    bankName: 'Dutch-Bangla Bank Ltd',
    branchName: 'Uttara Branch, Dhaka',
    amount: 50000,
    depositDate: '2026-10-08',
    transactionId: 'DBBL-NPSB-88310',
    slipImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    notes: 'Fractional Suite 2nd downpayment bank deposit slip.',
    status: 'pending',
    submittedAt: '08 Oct 2026, 04:30 PM'
  }
];

export const INITIAL_SITE_TOURS: AdminSiteTourBooking[] = [
  {
    id: 'tour-01',
    clientName: 'Alhajj Mustafizur Rahman (accompanied by son)',
    phone: '+880 1715-889900',
    preferredDate: 'Friday, 17 Oct 2026',
    timeSlot: 'Morning (08:30 AM)',
    projectInterested: 'Questa Royal Bay (Hotel & Suites), Cox\'s Bazar',
    pickupLocation: 'Mirpur-12 Corporate Head Office, Dhaka',
    guestsCount: 4,
    assignedBus: 'AC Microbus #01 (Dhaka Metro-Cha 11-8842)',
    coordinator: 'Engr. Masum Billah (Assistant General Manager)',
    status: 'confirmed',
    createdAt: '09 Oct 2026'
  },
  {
    id: 'tour-02',
    clientName: 'Dr. Shahabuddin & Family',
    phone: '+880 1819-223344',
    preferredDate: 'Saturday, 18 Oct 2026',
    timeSlot: 'Morning (09:00 AM)',
    projectInterested: 'Questa Commercial Center (Mirpur, Dhaka)',
    pickupLocation: 'Dhanmondi 27 (Rapa Plaza Point)',
    guestsCount: 3,
    status: 'pending',
    createdAt: '10 Oct 2026'
  },
  {
    id: 'tour-03',
    clientName: 'Farhana Afroze (Expatriate returning)',
    phone: '+880 1912-334455',
    preferredDate: 'Friday, 24 Oct 2026',
    timeSlot: 'Morning (09:30 AM)',
    projectInterested: 'Questa Royal Bay Cox\'s Bazar (Resort Tour)',
    pickupLocation: 'Chattogram Office (Salma Centre)',
    guestsCount: 2,
    status: 'pending',
    createdAt: '10 Oct 2026'
  }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'ntc-01',
    title: 'Questa Royal Bay Hotel & Suites — New Share Unit Release & Dividend Schedule Notice',
    category: 'Share Release & Dividend',
    content: 'All respected shareholders are hereby informed that on 25 October 2026 at 10:00 AM at the Head Office, the new share unit release and monthly dividend distribution schedule for Royal Bay Hotel & Suites will be announced.',
    date: '08 October 2026',
    priority: 'high',
    status: 'published'
  },
  {
    id: 'ntc-02',
    title: 'Questa Royal Bay Hotel Cox\'s Bazar 3rd Quarterly Dividend Distribution Completed',
    category: 'Dividend Distribution',
    content: 'The September 2026 dividends for all respected shareholders of the Cox\'s Bazar Royal Bay Hotel & Suites project have been successfully credited to their linked bank accounts.',
    date: '01 October 2026',
    priority: 'normal',
    status: 'published'
  },
  {
    id: 'ntc-03',
    title: 'Friday & Saturday Family Site Visit AC Bus Pickup Schedule',
    category: 'Site Visit Schedule',
    content: 'Every Friday and Saturday, air-conditioned microbuses will depart from Mirpur-12 and Agrabad for family visits to the Cox\'s Bazar Royal Bay Hotel & Suites and Mirpur Commercial Center projects.',
    date: '26 September 2026',
    priority: 'normal',
    status: 'published'
  }
];

export const INITIAL_VACATION_BOOKINGS: VacationBooking[] = [
  {
    id: 'vac-01',
    memberId: 'QW-CTG-8842',
    memberName: 'Ziabul Hoque Chowdhury',
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
    adminUser: 'Ripon Hossain (Super Admin)',
    action: 'APPROVE_DEPOSIT_SLIP',
    target: 'Deposit Slip #SLIP-RB-8820 (Md. Anwar)',
    details: 'Credited ৳35,000 to Royal Bay suite share Installment #02. Official Money Receipt #MR-2026-10-881 generated.',
    status: 'success'
  },
  {
    id: 'log-02',
    timestamp: 'Yesterday, 05:20 PM',
    adminUser: 'Ripon Hossain (Super Admin)',
    action: 'PROMOTED_MLM_RANK',
    target: 'Ziabulctg1 (QW-CTG-8842)',
    details: 'Rank upgraded to Gold Senior Associate upon reaching ৳40 Lac team sales volume milestone.',
    status: 'info'
  },
  {
    id: 'log-03',
    timestamp: '08 Oct 2026, 02:15 PM',
    adminUser: 'Ripon Hossain (Super Admin)',
    action: 'SHARE_TRANSFER_LOGGED',
    target: 'Share Transfer SH-TR-2026-084',
    details: 'Suite share ownership transfer application received from Ziabul Hoque Chowdhury.',
    status: 'warning'
  }
];

export const INITIAL_DOUBLE_PROFIT_PLANS: DoubleProfitPlan[] = [
  {
    id: 'dplan-8842-1',
    memberId: 'QW-CTG-8842',
    memberName: 'Ziabul Hoque Chowdhury',
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
    memberId: 'QW-CTG-9021',
    memberName: 'Md. Anwar Hossain',
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
    name: 'Md. Anwar Hossain',
    nameBn: 'Md. Anwar Hossain',
    username: 'anwar_ctg',
    memberId: 'QW-CTG-9021',
    email: 'anwar.ctg@yahoo.com',
    phone: '+880 1819-334455',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'Ziabulctg1',
    sponsorName: 'Ziabul Hoque Chowdhury',
    generation: 1,
    signupDate: '15 Aug 2026',
    signupTime: '02:40 PM',
    status: 'active',
    assetBooked: 'Questa Royal Bay (Suite Share #168)',
    investmentValue: 3500000,
    commissionEarned: 350000,
    commissionRate: 10,
    payoutStatus: 'credited',
    rank: 'Associate Member',
    location: 'Chattogram (Panchlaish)',
    kycVerified: true,
    notes: 'Down payment of ৳10 Lac verified. Monthly installment ongoing.'
  },
  {
    id: 'ref-102',
    name: 'Engr. Tanvir Ahmed Chowdhury',
    nameBn: 'Engr. Tanvir Ahmed Chowdhury',
    username: 'tanvir_eng',
    memberId: 'QW-CTG-9104',
    email: 'tanvir.engr@gmail.com',
    phone: '+880 1711-889900',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'Ziabulctg1',
    sponsorName: 'Ziabul Hoque Chowdhury',
    generation: 1,
    signupDate: '04 Sep 2026',
    signupTime: '11:15 AM',
    status: 'active',
    assetBooked: "Questa Royal Bay Cox's Bazar (1 Suite Share)",
    investmentValue: 600000,
    commissionEarned: 60000,
    commissionRate: 10,
    payoutStatus: 'credited',
    rank: 'Executive Associate',
    location: 'Dhaka (Uttara Sector 7)',
    kycVerified: true,
    notes: 'Hotel suite share booked with one-time full settlement.'
  },
  {
    id: 'ref-103',
    name: 'Dr. Farhana Yasmin',
    nameBn: 'Dr. Farhana Yasmin',
    username: 'dr_farhana',
    memberId: 'QW-CTG-9218',
    email: 'farhana.dr@hospital.com',
    phone: '+880 1912-776655',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'Ziabulctg1',
    sponsorName: 'Ziabul Hoque Chowdhury',
    generation: 1,
    signupDate: '28 Sep 2026',
    signupTime: '04:50 PM',
    status: 'active',
    assetBooked: 'Questa Commercial Center (Shop #304)',
    investmentValue: 2500000,
    commissionEarned: 250000,
    commissionRate: 10,
    payoutStatus: 'credited',
    rank: 'Associate Member',
    location: 'Chattogram (Nasirabad H/S)',
    kycVerified: true,
    notes: 'Commercial space in Mirpur-12 tower. Possession target 2027.'
  },
  {
    id: 'ref-201',
    name: 'Kazi Mashiur Rahman',
    nameBn: 'Kazi Mashiur Rahman',
    username: 'mashiur_kazi',
    memberId: 'QW-CTG-9355',
    email: 'mashiur.kazi@outlook.com',
    phone: '+880 1611-445566',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'anwar_ctg',
    sponsorName: 'Md. Anwar Hossain',
    generation: 2,
    signupDate: '10 Oct 2026',
    signupTime: '01:20 PM',
    status: 'active',
    assetBooked: 'Questa Commercial Center (Office #92)',
    investmentValue: 4800000,
    commissionEarned: 240000,
    commissionRate: 5,
    payoutStatus: 'available',
    rank: 'Associate Member',
    location: 'Cumilla Cantonment',
    kycVerified: true,
    notes: 'Secondary generation referral through Md. Anwar Hossain.'
  },
  {
    id: 'ref-202',
    name: 'Saiful Islam Sumon',
    nameBn: 'Saiful Islam Sumon',
    username: 'saiful_sumon',
    memberId: 'QW-CTG-9410',
    email: 'saiful.sumon@gmail.com',
    phone: '+880 1822-112233',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'tanvir_eng',
    sponsorName: 'Engr. Tanvir Ahmed Chowdhury',
    generation: 2,
    signupDate: '14 Oct 2026',
    signupTime: '06:10 PM',
    status: 'active',
    assetBooked: "Questa Royal Bay Cox's Bazar (2 Suite Shares)",
    investmentValue: 1200000,
    commissionEarned: 60000,
    commissionRate: 5,
    payoutStatus: 'available',
    rank: 'Associate Member',
    location: 'Chattogram (Agrabad)',
    kycVerified: true,
    notes: 'Referred by Engr. Tanvir Ahmed. 2 Shares booked.'
  },
  {
    id: 'ref-301',
    name: 'Rubel Hossain',
    nameBn: 'Rubel Hossain',
    username: 'rubel_agrabad',
    memberId: 'QW-CTG-9502',
    email: 'rubel.ctg99@gmail.com',
    phone: '+880 1515-998877',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    sponsorUsername: 'mashiur_kazi',
    sponsorName: 'Kazi Mashiur Rahman',
    generation: 3,
    signupDate: '22 Oct 2026',
    signupTime: '10:05 AM',
    status: 'pending',
    assetBooked: 'Questa Commercial Center (Shop #21)',
    investmentValue: 2200000,
    commissionEarned: 0,
    commissionRate: 0,
    payoutStatus: 'pending',
    rank: 'Member (In Review)',
    location: 'Chattogram (GEC Circle)',
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
    'Send the exact USDT (TRC20) amount to the Questa World wallet address above, then paste the on-chain Transaction Hash (TxID). All crypto deposits are verified manually by the Questa World finance desk.'
};

// ---------------------------------------------------------------------------
// HOMEPAGE CMS DEFAULTS
// ---------------------------------------------------------------------------
export const DEFAULT_CMS_SETTINGS: CmsSiteSettings = {
  brandName: 'Questa World',
  legalName: 'Questa World Limited',
  tagline: 'Official Investor Portal · Cox\'s Bazar & Mirpur, Dhaka',
  supportPhone: '+880 1819-001122',
  supportEmail: 'support@questaworld.com',
  corporateAddress: 'Questa World Tower, Pallabi, Mirpur-12, Dhaka, Bangladesh',
  footerNote:
    'Government-registered real estate & hospitality investment enterprise. 100% legally verified ownership with notarized deeds and end-to-end encrypted records.',
  copyrightText: '© {year} Questa World Limited. All rights reserved.'
};

export const DEFAULT_CMS_SECTIONS: CmsSection[] = [
  {
    id: 'hero',
    label: 'Hero & Registration',
    kind: 'standard',
    title: 'New Investor Registration',
    subtitle: 'Create your secure Questa World account',
    body: 'Featured Scheme: Invest Any Amount, Get 2X Back in 12 Months — Paid in 12 Monthly Installments!',
    ctaLabel: 'Explore Projects',
    visible: true,
    order: 0
  },
  {
    id: 'features',
    label: 'Why Choose Questa World',
    kind: 'collection',
    collectionKey: 'features',
    title: 'Why Investors Choose Questa World',
    subtitle: 'A transparent, legally secured and high-yield investment platform.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 1
  },
  {
    id: 'projects',
    label: 'Featured Projects',
    kind: 'standard',
    title: 'Featured Hospitality & Commercial Investments',
    subtitle:
      'Secure high-yield investments in strategically located hospitality and commercial assets.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 2
  },
  {
    id: 'timeline',
    label: 'Project Timeline',
    kind: 'standard',
    title: 'Civil Progress & Milestones',
    subtitle: 'Track transparent construction progress across every Questa World development.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 3
  },
  {
    id: 'about',
    label: 'About Questa World',
    kind: 'standard',
    title: 'Building Generations of Trust & Wealth',
    subtitle:
      'Questa World Limited is a government-registered real estate and hospitality investment enterprise headquartered in Dhaka, with regional offices in Chattogram.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 4
  },
  {
    id: 'gallery',
    label: 'Media Gallery',
    kind: 'standard',
    title: 'Live On-Site Development Progress',
    subtitle:
      'Witness transparent ground reality — deep piling, RCC superstructures, façade works, interior fitouts, and structural milestones.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 5
  },
  {
    id: 'news',
    label: 'Notice Board',
    kind: 'standard',
    title: 'Company Notices & Announcements',
    subtitle:
      'Stay updated with official company notices, AGM circulars, dividend distributions, and handover alerts.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 6
  },
  {
    id: 'site-visit',
    label: 'Site Visit Booking',
    kind: 'standard',
    title: 'Book a Free Site Visit',
    subtitle:
      'Visit our projects with complimentary AC microbus transport from Dhaka and Chattogram.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 7
  },
  {
    id: 'calculator',
    label: 'Investment Calculator',
    kind: 'standard',
    title: 'Plan Your Returns',
    subtitle:
      'Estimate your monthly dividends from hotel share ownership or calculate your 2X return from the 12-Month Double Profit Scheme.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 8
  },
  {
    id: 'legal',
    label: 'Legal & Security',
    kind: 'standard',
    title: 'Zero-Risk Real Estate & Ownership Security',
    subtitle:
      'Every share and floor unit is backed by ironclad registered deeds, verified ownership, and transparent registration.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 9
  },
  {
    id: 'testimonials',
    label: 'Investor Testimonials',
    kind: 'collection',
    collectionKey: 'testimonials',
    title: 'Trusted by Investors Nationwide',
    subtitle: 'Real experiences from Questa World shareholders.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 10
  },
  {
    id: 'faqs',
    label: 'Frequently Asked Questions',
    kind: 'collection',
    collectionKey: 'faqs',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know before you invest.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 11
  },
  {
    id: 'contact',
    label: 'Contact Us',
    kind: 'standard',
    title: 'Contact Our Investment Team',
    subtitle:
      'Have questions about Questa World shares, installments, or the 12-Month Double Profit scheme? Reach out and our team will guide you.',
    body: '',
    ctaLabel: '',
    visible: true,
    order: 12
  }
];

export const DEFAULT_CMS_COLLECTIONS: CmsCollectionItem[] = [
  // Features
  { id: 'feat-1', collection: 'features', title: '100% Legal Ownership', subtitle: 'Registered Deeds', body: 'Every share is backed by notarized, sub-registry verified ownership documents.', badge: 'Legal', order: 0 },
  { id: 'feat-2', collection: 'features', title: '12-Month Double Profit', subtitle: '2X Return Scheme', body: 'Invest any amount and receive double back across 12 equal monthly installments.', badge: '2X', order: 1 },
  { id: 'feat-3', collection: 'features', title: '18.5% Annual ROI', subtitle: 'Hotel Share Yield', body: 'Industry-leading dividend yield from premium hotel suite share ownership.', badge: 'ROI', order: 2 },
  { id: 'feat-4', collection: 'features', title: 'End-to-End Encryption', subtitle: 'Bank-Grade Security', body: 'AES-256 encrypted records protect every transaction and personal document.', badge: 'Secure', order: 3 },
  { id: 'feat-5', collection: 'features', title: 'Bank PDC Protection', subtitle: 'Post-Dated Cheques', body: 'All double-profit investments are secured by post-dated bank cheques.', badge: 'Protected', order: 4 },
  { id: 'feat-6', collection: 'features', title: 'Dedicated Support Desk', subtitle: 'Investor Care', body: 'A branch-based support team guides you through every step of your investment.', badge: 'Support', order: 5 },

  // Testimonials
  { id: 'tst-1', collection: 'testimonials', title: 'Md. Rafiqul Islam', subtitle: 'Investor · Dhaka', body: 'The double profit scheme gave me exactly what was promised — 2X returned over 12 months, paid on time every month.', order: 0 },
  { id: 'tst-2', collection: 'testimonials', title: 'Farzana Akter', subtitle: 'Investor · Chattogram', body: 'Transparent paperwork, verified deeds, and a support team that actually responds. Truly professional.', order: 1 },
  { id: 'tst-3', collection: 'testimonials', title: 'Engr. Sajid Hossain', subtitle: 'Investor · Sylhet', body: 'I visited the site myself before investing. The construction progress matched every update on the portal.', order: 2 },

  // FAQs
  { id: 'faq-1', collection: 'faqs', title: 'How does the 12-Month Double Profit scheme work?', body: 'You invest any amount and receive double that amount back, paid across 12 equal monthly installments, secured by post-dated bank cheques and a notarized deed.', order: 0 },
  { id: 'faq-2', collection: 'faqs', title: 'What legal documents do I receive?', body: 'Every investor receives a registered share/ownership deed, a notarized agreement, and official money receipts for each payment.', order: 1 },
  { id: 'faq-3', collection: 'faqs', title: 'What payment methods are accepted?', body: 'We accept bank transfers, mobile financial services, and manual USDT (TRC20) crypto payments verified by our finance desk.', order: 2 },
  { id: 'faq-4', collection: 'faqs', title: 'Can I visit the project before investing?', body: 'Absolutely. We offer complimentary AC microbus site tours from Dhaka and Chattogram every weekend.', order: 3 },
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
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (!saved) {
      // Default to null until logged in or preloaded
      return null;
    }
    return decryptPayload<User | null>(saved, null);
  }

  static login(usernameInput: string, passwordInput: string): User | null {
    const cleanedUser = usernameInput.trim().toLowerCase();
    const cleanedPass = passwordInput.trim();

    // Check pre-seeded credentials: Ziabulctg1 / 123456 (case-insensitive username)
    if (cleanedUser === 'ziabulctg1' && cleanedPass === '123456') {
      const user = INITIAL_USER;
      localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(user));
      this.ensureDataInitialized();
      return user;
    }

    // Check pre-seeded admin credentials: admin / admin123 or 123456
    if ((cleanedUser === 'admin' || cleanedUser === 'questaworld') && (cleanedPass === 'admin123' || cleanedPass === '123456' || cleanedPass === 'admin')) {
      const admin = INITIAL_ADMIN;
      localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(admin));
      this.ensureDataInitialized();
      return admin;
    }

    // Check if another custom registered user exists in localStorage
    const customUserJson = localStorage.getItem('qw_registered_account_' + cleanedUser);
    if (customUserJson) {
      const parsed = JSON.parse(customUserJson);
      if (parsed.password === cleanedPass) {
        localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(parsed.user));
        return parsed.user;
      }
    }

    return null;
  }

  static register(newUser: Partial<User>, password: string): User {
    const user: User = {
      id: 'usr-' + Date.now(),
      username: newUser.username || 'investor_' + Math.floor(Math.random() * 1000),
      fullName: newUser.fullName || 'Valued Investor',
      fullNameBn: newUser.fullNameBn || newUser.fullName || 'Valued Investor',
      email: newUser.email || 'investor@questaworld.com',
      phone: newUser.phone || '+880 1700-000000',
      branch: newUser.branch || 'Dhaka Head Office (Mirpur)',
      memberId: 'QW-' + Math.floor(1000 + Math.random() * 9000),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      address: newUser.address || 'Dhaka, Bangladesh',
      city: newUser.city || 'Dhaka',
      nidNo: newUser.nidNo || '1990 0000 0000 00',
      role: 'investor',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      e2eEncryptionKey: 'QW-AES256-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      twoFactorEnabled: false,
      nominee: newUser.nominee || {
        name: 'Authorized Nominee',
        relation: 'Family',
        phone: '+880 1700-000000',
        nid: '1995 0000 0000 00'
      },
      bankName: newUser.bankName,
      bankBranch: newUser.bankBranch,
      bankAccount: newUser.bankAccount,
      bankRoutingNumber: newUser.bankRoutingNumber,
      mfsNumber: newUser.mfsNumber
    };

    localStorage.setItem(
      'qw_registered_account_' + user.username.toLowerCase(),
      JSON.stringify({ user, password })
    );
    localStorage.setItem(STORAGE_KEYS.USER, encryptPayload(user));
    this.ensureDataInitialized();
    return user;
  }

  /**
   * Returns true when an account can be found for the given username or
   * registered mobile number. Used by the public account-recovery flow.
   */
  static accountExists(identifier: string): boolean {
    const cleaned = identifier.trim().toLowerCase();
    if (!cleaned) return false;
    if (cleaned === 'ziabulctg1' || cleaned === 'admin' || cleaned === 'questaworld') return true;
    if (localStorage.getItem('qw_registered_account_' + cleaned)) return true;

    // Fall back to matching a registered mobile number (digits only).
    const digits = cleaned.replace(/\D/g, '');
    if (!digits) return false;
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
      projectName: shareData.projectName || 'Questa Royal Bay Hotel & Suites',
      projectNameBn: shareData.projectNameBn || 'Questa Royal Bay Hotel & Suites',
      location: shareData.location || "Cox's Bazar",
      locationBn: shareData.locationBn || "Cox's Bazar",
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
      packageName: plan.packageName || `৳${principal.toLocaleString()} 12-Month Double Return Plan`,
      packageNameBn: plan.packageNameBn || `৳${principal.toLocaleString()} 12-Month Double Return Plan`,
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

    this.addAuditLog('DOUBLE_PROFIT_PLAN_CREATED', newPlan.packageName, `User ${newPlan.memberName} enrolled in ৳${principal.toLocaleString()} 12-month double return plan.`);
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

    this.addAuditLog('DOUBLE_PROFIT_INSTALLMENT_DISBURSED', plan.packageName, `Disbursed installment #${plan.paidInstallments} of ৳${installmentAmt.toLocaleString()} to ${plan.memberName}`);
    this.updateLastSync();
    return { success: true, installmentAmount: installmentAmt, message: `Installment #${plan.paidInstallments} of ৳${installmentAmt.toLocaleString()} disbursed successfully!` };
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

  // --- INSTALLMENTS CRUD ---
  static getInstallments(): InstallmentRecord[] {
    this.ensureDataInitialized();
    return decryptPayload<InstallmentRecord[]>(localStorage.getItem(STORAGE_KEYS.INSTALLMENTS), INITIAL_INSTALLMENTS);
  }

  static payInstallment(
    installmentId: string,
    method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Card' | 'USDT (TRC20)',
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
      message: `৳${inst.amount.toLocaleString()} received via ${method}. Receipt: ${receiptNo}`,
      messageBn: `৳${inst.amount.toLocaleString()} received via ${method}. Receipt: ${receiptNo}`,
      date: paidDate,
      read: false,
      type: 'installment',
      actionUrl: 'installments'
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
      phone: inv.phone || '+880 1700-000000',
      email: inv.email || 'investor@example.com',
      memberId: inv.memberId || `QW-${inv.branch?.includes('Ctg') ? 'CTG' : 'DHK'}-${Math.floor(1000 + Math.random() * 9000)}`,
      branch: inv.branch || 'Corporate Head Office, Dhaka',
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
    this.addAuditLog('WALLET_ADJUSTMENT', `${list[idx].memberId} (${list[idx].fullName})`, `Adjusted ${type} balance by ৳${amount.toLocaleString()}. Note: ${note || 'Admin adjustment'}`);
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
      projectName: slip.projectName || 'Questa Royal Bay (Hotel & Suites)',
      bankName: slip.bankName || 'The City Bank Ltd',
      branchName: slip.branchName || 'Agrabad Branch',
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
    this.addAuditLog('SUBMIT_SLIP', `${newSlip.slipNo} (${newSlip.memberName})`, `Deposit slip of ৳${newSlip.amount.toLocaleString()} submitted for verification.`);
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

    this.addAuditLog('APPROVE_DEPOSIT_SLIP', `${slip.slipNo} (${slip.memberName})`, `Approved ৳${slip.amount.toLocaleString()}. Official Money Receipt generated.`, 'success');
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

  // --- SITE TOURS CRUD ---
  static getSiteTours(): AdminSiteTourBooking[] {
    this.ensureDataInitialized();
    return decryptPayload<AdminSiteTourBooking[]>(localStorage.getItem(STORAGE_KEYS.SITE_TOURS), INITIAL_SITE_TOURS);
  }

  static createSiteTour(tour: Partial<AdminSiteTourBooking>): AdminSiteTourBooking {
    const list = this.getSiteTours();
    const newTour: AdminSiteTourBooking = {
      id: tour.id || 'tour-' + Date.now(),
      clientName: tour.clientName || 'Valued Client',
      phone: tour.phone || '+880 1700-000000',
      preferredDate: tour.preferredDate || 'Friday, Upcoming',
      timeSlot: tour.timeSlot || 'Morning (09:00 AM)',
      projectInterested: tour.projectInterested || "Questa Royal Bay (Hotel & Suites), Cox's Bazar",
      pickupLocation: tour.pickupLocation || 'Mirpur-12 Corporate Head Office',
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
      `New referral signup recorded under sponsor ${newSignup.sponsorUsername}. Asset: ${newSignup.assetBooked}. Commission: ৳${newSignup.commissionEarned.toLocaleString()}`,
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
      `Crypto payments ${next.enabled ? 'enabled' : 'disabled'}. Network: ${next.network}. Wallet: ${next.walletAddress}. Rate: ৳${next.bdtPerUsdt}/USDT.`,
      'success'
    );
    this.updateLastSync();
    return next;
  }

  /** Convert a BDT amount into USDT using the admin-configured rate. */
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
      `USDT (${settings.network}) deposit of ${usdtAmount} USDT (≈৳${input.amountBDT.toLocaleString()}) submitted. TxID: ${input.txHash}. Awaiting manual approval.`,
      'info'
    );
    return slip;
  }

  // ==================================================================
  // HOMEPAGE CMS (sections, collections, site settings) — full CRUD
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
    this.addAuditLog('CMS_SETTINGS_UPDATED', 'Site Settings', `Brand: ${next.brandName}. Legal: ${next.legalName}.`, 'success');
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
