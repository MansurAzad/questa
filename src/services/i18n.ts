import { Language } from '../types';

export const translations = {
  en: {
    // Brand
    brandName: 'Questra World',
    brandTagline: 'Secure Real Estate & Fractional Investment',
    
    // Nav
    navHome: 'Home',
    navProjects: 'Our Projects',
    navTimeline: 'Project Timeline',
    navCalculator: 'ROI Calculator',
    navLegal: 'Legal & Verification',
    navAbout: 'About Us',
    navNews: 'Notice Board',
    navGallery: 'Media Gallery',
    navSiteVisit: 'Free Site Visit',
    navContact: 'Contact',
    navPortal: 'Investor Portal',
    navLogin: 'Investor Login',
    navLogout: 'Sign Out',
    
    // Timeline
    timelineTitle: 'Construction Progress & Milestone Tracker',
    timelineSubtitle: 'Real-time verified engineering progress, on-site civil works, and handover schedules.',
    overallProgress: 'Overall Project Progress',
    expectedHandover: 'Expected Handover',
    filterAllMilestones: 'All Milestones',
    filterCompleted: 'Completed',
    filterActive: 'In Progress',
    filterUpcoming: 'Upcoming',
    inspectionVerified: 'Quality & Structural Assurance',
    
    // Hero
    heroBadge: 'Beachfront Hospitality & Commercial Real Estate',
    heroTitle1: 'Build Generational Wealth with',
    heroTitleHighlight: '100% Legally Verified',
    heroTitle2: 'Real Estate Worldwide',
    heroSubtitle: 'Earn guaranteed monthly dividends from luxury 5-star hotel suite shares and premium commercial unit ownership with full land-registry legal security.',
    heroCtaExplore: 'Explore Projects',
    heroCtaPortal: 'Open Investor Portal',
    heroCtaLoginDemo: 'Quick Demo (user1)',
    statInvestors: 'Satisfied Investors',
    statAcres: 'Luxury Suites & Commercial Units',
    statClearance: 'Dispute Free Title',
    statYield: 'Projected Annual Yield',

    // Public Sections
    sectionProjectsTitle: 'Featured Landmark Developments',
    sectionProjectsSubtitle: 'Strategically located high-yield hospitality and commercial assets.',
    viewPlotMap: 'Explore Our Projects',
    bookNow: 'Enquire / Book',
    allotmentGuarantee: 'Guaranteed Registered Share Ownership',
    
    // Calculator
    calcTitle: 'Investment & Installment Calculator',
    calcSubtitle: 'Calculate monthly installment payments and projected 5-year capital appreciation.',
    calcPlotType: 'Select Asset Type',
    calcPlot3Katha: '1 Hotel Suite Share',
    calcPlot5Katha: '1 Commercial Unit Share',
    calcHotelShare: '1 Luxury Hotel Suite Share',
    calcTenure: 'Installment Tenure (Months)',
    calcDownPayment: 'Down Payment (USD)',
    calcMonthlyInstallment: 'Monthly Installment',
    calcEstimatedValuation: 'Estimated 5-Yr Valuation',
    
    // Auth
    authModalTitle: 'Investor Access Portal',
    authModalSubtitle: 'Sign in to access your investment portfolio, payment passbook, and digital share certificates.',
    tabLogin: 'Sign In',
    tabRegister: 'New Investor Registration',
    usernameLabel: 'User Name / Member ID',
    passwordLabel: 'Password',
    rememberMe: 'Remember this device',
    btnSignIn: 'Sign In to Dashboard',
    btnRegister: 'Create Investor Account',
    demoNotice: 'Quick Test: Use preloaded credentials: User Name: user1 | Password: 123456',
    btnFillDemo: 'Fill user1 Credentials',
    
    // Dashboard Common
    dashGreeting: 'Assalamu Alaikum',
    dashMemberNo: 'Member ID',
    dashBranch: 'Branch Office',
    dashOverview: 'Overview',
    dashProfile: 'My Profile & KYC',
    dashShares: 'Hotel Shares',
    dashVacation: 'Claim 7-Day Resort Stay',
    dashSiteProgress: 'Site Cam & Drone Updates',
    dashInstallments: 'Installments & Pay',
    dashSlipUpload: 'Deposit Slip Upload',
    dashDividends: 'Dividend & Payouts',
    dashMemberTransfer: 'Member Fund Transfer',
    dashTransactions: 'Ledger & Passbook',
    dashCertificates: 'Digital Documents',
    dashTaxCert: 'Tax Certificate & Statement',
    dashAnalytics: 'Analytics & Yield',
    dashAffiliate: 'Referral & Network',
    dashReferralTree: 'Generation Tree & Team',
    dashSupport: 'Support Desk',
    dashSecurity: 'Security & T-PIN',

    // Dashboard Overview
    overviewTotalInvested: 'Total Portfolio Value',
    overviewTotalPaid: 'Total Amount Paid',
    overviewRemainingDue: 'Remaining Due',
    overviewDividendsReceived: 'Cumulative Dividends',
    nextInstallmentDue: 'Next Installment Due',
    daysRemaining: 'days remaining',
    payNow: 'Pay Now',
    paymentProgress: 'Overall Payment Progress',

    // Installments
    installmentsTitle: 'Installment Schedule & Online Payment',
    installmentsSubtitle: 'Track scheduled installments, upload payment slips, or pay instantly with PayPal / Cards / Bank.',
    thInstallmentNo: 'No.',
    thDueDate: 'Due Date',
    thAmount: 'Amount (USD)',
    thStatus: 'Status',
    thAction: 'Receipt / Action',
    statusPaid: 'PAID',
    statusDue: 'DUE NOW',
    statusUpcoming: 'UPCOMING',
    btnDownloadReceipt: 'Download Receipt',
    btnPayOnline: 'Pay Online',

    // Payment Gateway Modal
    modalPayTitle: 'Secure Payment Gateway',
    modalPayDesc: 'Authorized payment integration for Questra World installment clearance.',
    selectPaymentMethod: 'Select Payment Channel',
    PayPalWallet: 'PayPal Merchant Pay',
    nagadWallet: 'Wise Direct',
    bankTransfer: 'HSBC / Standard Chartered / Citi',
    cardPay: 'Visa / MasterCard',
    inputTxId: 'Enter Transaction ID / Reference',
    btnConfirmPayment: 'Verify & Confirm Payment',

    // Digital Documents
    docsTitle: 'Digital Share Certificates & Documents',
    docsSubtitle: 'End-to-end encrypted authenticated legal documents and share certificates.',
    btnViewDoc: 'View Document',
    btnPrintDoc: 'Print / Save PDF',
    verifiedStamp: 'GOVT. SUB-REGISTRY & RJSC COMPLIANT',

    // Glance Widget
    glanceTitle: 'Questra World Portfolio Glance',
    glanceDividend: 'Monthly Dividend',
    glanceSynced: 'Cloud Synced',
    glanceOffline: 'Offline Mode (Encrypted)',

    // Push Notifications
    notificationsTitle: 'Live Investment Alerts',
    markAllRead: 'Mark all as read',
    noNotifications: 'No unread alerts'
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations.en[key] || key;
}

export function formatBDT(amount: number, _lang: Language): string {
  return '$' + amount.toLocaleString('en-US');
}
