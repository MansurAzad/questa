import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  Language,
  Theme,
  ShareInvestment,
  InstallmentRecord,
  TransactionRecord,
  SupportTicket,
  AppNotification,
  DoubleProfitPlan
} from './types';
import { StorageService, INITIAL_USER, INITIAL_ADMIN } from './services/storage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/public/HeroSection';
import { ProjectsExplorer } from './components/public/ProjectsExplorer';
import { InvestmentCalculator } from './components/public/InvestmentCalculator';
import { LegalSecurity } from './components/public/LegalSecurity';
import { ProjectTimeline } from './components/public/ProjectTimeline';
import { AboutUs } from './components/public/AboutUs';
import { NoticeBoard } from './components/public/NoticeBoard';
import { MediaGallery } from './components/public/MediaGallery';
import { CompanyAchievements } from './components/public/CompanyAchievements';
import { GlobalConferences } from './components/public/GlobalConferences';
import { SuccessStories } from './components/public/SuccessStories';
import { SiteVisitBooking } from './components/public/SiteVisitBooking';
import { ContactUs } from './components/public/ContactUs';
import { ProjectDetailModal } from './components/public/ProjectDetailModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardTab } from './components/dashboard/dashboardNav';
import { AvatarChangeModal } from './components/dashboard/AvatarChangeModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProjectInfo } from './types';
import { CmsSection, CmsCollectionItem, CmsSiteSettings } from './types/cms';
import { CmsCollectionSection } from './components/public/CmsCollectionSection';
import { readReferralParam } from './utils/referral';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('qw_theme_preference');
    return (saved as Theme) || 'light';
  });

  // English-only: language is locked to English
  const language: Language = 'en';

  // User state - do NOT auto-login; only restore existing session if present
  const [user, setUser] = useState<User | null>(() => {
    const existing = StorageService.getUser();
    return existing || null;
  });

  // Active view: 'home' | 'projects' | 'calculator' | 'legal' | 'about' | 'dashboard'
  const [activeView, setActiveView] = useState<string>('home');

  // Investor dashboard active tab (menu hosted in the header profile dropdown)
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');

  // Domain data
  const [shares, setShares] = useState<ShareInvestment[]>(() => StorageService.getShares());
  const [installments, setInstallments] = useState<InstallmentRecord[]>(() => StorageService.getInstallments());
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => StorageService.getTransactions());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getTickets());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => StorageService.getNotifications());
  const [doubleProfitPlans, setDoubleProfitPlans] = useState<DoubleProfitPlan[]>(() => StorageService.getDoubleProfitPlans());

  // Homepage CMS content (sections, collection items, global settings)
  const [cmsSections, setCmsSections] = useState<CmsSection[]>(() => StorageService.getCmsSections());
  const [cmsCollections, setCmsCollections] = useState<CmsCollectionItem[]>(() => StorageService.getCmsCollections());
  const [cmsSettings, setCmsSettings] = useState<CmsSiteSettings>(() => StorageService.getCmsSiteSettings());

  // UI state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectInfo | null>(null);

  // Referral link support: ?ref=<username|USER ID|code> carried in the URL.
  // The sponsor is resolved to a real account so the signup form (and the
  // register tab in the auth modal) can be pre-filled automatically.
  const referralRef = useMemo(() => readReferralParam(), []);
  const initialReferenceUsername = useMemo(
    () => StorageService.resolveSponsor(referralRef)?.username || referralRef,
    [referralRef]
  );

  // Sync theme to HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('qw_theme_preference', theme);
  }, [theme]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsCloudSynced(true);
    const handleOffline = () => setIsCloudSynced(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshAllData = () => {
    setShares(StorageService.getShares());
    setInstallments(StorageService.getInstallments());
    setTransactions(StorageService.getTransactions());
    setTickets(StorageService.getTickets());
    setNotifications(StorageService.getNotifications());
    setDoubleProfitPlans(StorageService.getDoubleProfitPlans());
    setIsCloudSynced(true);
  };

  // Re-read CMS content whenever the visitor returns to the public homepage so
  // admin edits are reflected immediately without a reload.
  useEffect(() => {
    if (activeView !== 'admin') {
      setCmsSections(StorageService.getCmsSections());
      setCmsCollections(StorageService.getCmsCollections());
      setCmsSettings(StorageService.getCmsSiteSettings());
    }
  }, [activeView]);

  const handleLogout = () => {
    StorageService.logout();
    setUser(null);
    setActiveView('home');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    refreshAllData();
    // Route by role
    if (loggedInUser.role === 'admin') {
      setActiveView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveView('dashboard');
  };

  const handleAvatarUpdated = (newAvatarUrl: string) => {
    setUser(prev => (prev ? { ...prev, avatar: newAvatarUrl } : prev));
  };

  const handleDashboardTabChange = (tab: DashboardTab) => {
    setDashboardTab(tab);
    if (activeView !== 'dashboard') setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip">
      
      {/* Top Navigation (hidden on the admin dashboard — it has its own admin header) */}
      {activeView !== 'admin' && (
        <Navbar
          user={user}
          language={language}
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          notifications={notifications}
          onMarkNotificationsRead={() => {
            StorageService.markNotificationsAsRead();
            setNotifications(StorageService.getNotifications());
          }}
          activeView={activeView}
          onNavigate={view => {
            if (view === 'dashboard' && !user) {
              setAuthModalOpen(true);
            } else if (view === 'admin') {
              if (user?.role === 'admin') {
                setActiveView('admin');
              } else if (user) {
                setActiveView('dashboard');
              } else {
                setAuthModalOpen(true);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (['gallery', 'gallery-videos'].includes(view)) {
              setActiveView('home');
              setTimeout(() => {
                const el = document.getElementById(view);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }, 60);
            } else {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          isCloudSynced={isCloudSynced}
          dashboardTab={dashboardTab}
          onDashboardTabChange={handleDashboardTabChange}
          onChangeAvatar={() => setAvatarModalOpen(true)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* ROUTE 0: ADMIN DASHBOARD 360° (/admin) */}
        {activeView === 'admin' ? (
          <AdminDashboard
            currentUser={user?.role === 'admin' ? user : INITIAL_ADMIN}
            language={language}
            onLogout={handleLogout}
            onSwitchToUserPortal={() => {
              if (!user) {
                setAuthModalOpen(true);
                return;
              }
              setActiveView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchToPublic={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeView === 'dashboard' ? (
          /* ROUTE 1: INVESTOR DASHBOARD (/user) */
          user ? (
            <DashboardLayout
              user={user}
              language={language}
              shares={shares}
              installments={installments}
              transactions={transactions}
              tickets={tickets}
              doubleProfitPlans={doubleProfitPlans}
              activeTab={dashboardTab}
              onTabChange={handleDashboardTabChange}
              onChangeAvatar={() => setAvatarModalOpen(true)}
              onRefreshData={refreshAllData}
              onUserUpdated={(updated) => setUser(updated)}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Investor Authentication Required
              </h3>
              <p className="text-xs text-slate-500">
                Please log in with the provided credentials <strong>user1 / 123456</strong> to access your real estate portfolio.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
              >
                Sign In as user1
              </button>
            </div>
          )
        ) : (
          /* ROUTE 2: PUBLIC HOMEPAGE PAGES (CMS-driven sections) */
          <>
            {(() => {
              const sec = (id: string) => cmsSections.find(s => s.id === id);
              const ordered = [...cmsSections].filter(s => s.visible).sort((a, b) => a.order - b.order);

              return ordered.map(section => {
                if (section.kind === 'collection' && section.collectionKey) {
                  const items = cmsCollections
                    .filter(i => i.collection === section.collectionKey)
                    .sort((a, b) => a.order - b.order);
                  return <CmsCollectionSection key={section.id} section={section} items={items} />;
                }

                switch (section.id) {
                  case 'hero':
                    return (
                      <HeroSection
                        key={section.id}
                        language={language}
                        user={user}
                        onOpenAuth={() => setAuthModalOpen(true)}
                        onExploreProjects={() => {
                          const el = document.getElementById('projects');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        onOpenPortal={() => setActiveView('dashboard')}
                        onRegisterSuccess={handleLoginSuccess}
                        initialReferenceUsername={initialReferenceUsername}
                        cmsTitle={sec('hero')?.title}
                        cmsSubtitle={sec('hero')?.subtitle}
                        cmsBanner={sec('hero')?.body}
                        cmsKicker={cmsSettings.tagline}
                        brandName={cmsSettings.brandName}
                      />
                    );
                  case 'projects':
                    return (
                      <ProjectsExplorer
                        key={section.id}
                        language={language}
                        onSelectProject={() => setActiveView('calculator')}
                        onOpenMasterPlan={() => {
                          const el = document.getElementById('projects');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        onViewDetails={proj => {
                          setSelectedProjectModal(proj);
                          setProjectModalOpen(true);
                        }}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                      />
                    );
                  case 'timeline':
                    return (
                      <ProjectTimeline
                        key={section.id}
                        language={language}
                        onSelectProjectForBooking={() => {
                          setActiveView('calculator');
                          const el = document.getElementById('calculator');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                      />
                    );
                  case 'about':
                    return (
                      <AboutUs
                        key={section.id}
                        language={language}
                        onBookSiteVisit={() => {
                          const el = document.getElementById('project-visit');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        onOpenProjects={() => {
                          const el = document.getElementById('projects');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                        cmsBody={section.body}
                      />
                    );
                  case 'gallery':
                    return (
                      <MediaGallery
                        key={section.id}
                        language={language}
                        sectionId="gallery"
                        tone="light"
                        badge="Project Media"
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                        cmsBody={section.body}
                        filter={{ kind: 'photo', category: 'development' }}
                      />
                    );
                  case 'gallery-videos':
                    return (
                      <MediaGallery
                        key={section.id}
                        language={language}
                        sectionId="gallery-videos"
                        tone="muted"
                        badge="Video Tours"
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                        cmsBody={section.body}
                        filter={{ kind: 'video' }}
                      />
                    );
                  case 'news':
                    return (
                      <NoticeBoard
                        key={section.id}
                        language={language}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                      />
                    );
                  case 'achievements':
                    return (
                      <CompanyAchievements
                        key={section.id}
                        language={language}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                        cmsBody={section.body}
                      />
                    );
                  case 'conferences':
                    return (
                      <GlobalConferences
                        key={section.id}
                        language={language}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                        cmsBody={section.body}
                      />
                    );
                  case 'success-stories':
                    return (
                      <SuccessStories
                        key={section.id}
                        language={language}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                        cmsBody={section.body}
                      />
                    );
                  case 'project-visit':
                    return (
                      <SiteVisitBooking
                        key={section.id}
                        language={language}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                      />
                    );
                  case 'calculator':
                    return (
                      <InvestmentCalculator
                        key={section.id}
                        language={language}
                        onEnquire={() => {
                          if (!user) setAuthModalOpen(true);
                          else setActiveView('dashboard');
                        }}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                      />
                    );
                  case 'legal':
                    return (
                      <LegalSecurity
                        key={section.id}
                        language={language}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                      />
                    );
                  case 'contact':
                    return (
                      <ContactUs
                        key={section.id}
                        language={language}
                        cmsTitle={section.title}
                        cmsSubtitle={section.subtitle}
                        cmsPhone={cmsSettings.supportPhone}
                        cmsEmail={cmsSettings.supportEmail}
                        cmsAddress={cmsSettings.corporateAddress}
                      />
                    );
                  default:
                    return null;
                }
              });
            })()}
          </>
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        language={language}
        initialReferenceUsername={initialReferenceUsername}
      />

      {/* Profile Picture Change Modal */}
      {user && (
        <AvatarChangeModal
          isOpen={avatarModalOpen}
          onClose={() => setAvatarModalOpen(false)}
          user={user}
          language={language}
          onAvatarUpdated={handleAvatarUpdated}
        />
      )}

      {/* Project Detail Specifications Modal */}
      <ProjectDetailModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        project={selectedProjectModal}
        language={language}
        onBookNow={() => {
          setProjectModalOpen(false);
          setActiveView('calculator');
          const el = document.getElementById('calculator');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onBookTour={() => {
          setProjectModalOpen(false);
          const el = document.getElementById('project-visit');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Footer (public chrome — hidden on the admin dashboard, which has its own admin shell) */}
      {activeView !== 'admin' && (
        <Footer
          language={language}
          settings={cmsSettings}
          user={user}
          onNavigate={view => {
            if (view === 'dashboard' && !user) {
              setAuthModalOpen(true);
            } else if (['gallery', 'gallery-videos'].includes(view)) {
              setActiveView('home');
              setTimeout(() => {
                const el = document.getElementById(view);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }, 60);
            } else {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      )}

    </div>
  );
}
