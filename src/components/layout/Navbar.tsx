import React, { useState } from 'react';
import {
  Globe,
  Moon,
  Sun,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  Compass,
  CheckCircle2,
  CloudCheck,
  TrendingUp,
  LayoutDashboard,
  Camera
} from 'lucide-react';
import { User, Language, Theme, AppNotification } from '../../types';
import { translations, getTranslation, formatBDT } from '../../services/i18n';
import { getDashboardNavItems, DashboardTab } from '../dashboard/dashboardNav';

interface NavbarProps {
  user: User | null;
  language: Language;
  theme: Theme;
  onThemeToggle: () => void;
  notifications: AppNotification[];
  onMarkNotificationsRead: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isCloudSynced: boolean;
  dashboardTab: DashboardTab;
  onDashboardTabChange: (tab: DashboardTab) => void;
  onChangeAvatar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  language,
  theme,
  onThemeToggle,
  notifications,
  onMarkNotificationsRead,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
  isCloudSynced,
  dashboardTab,
  onDashboardTabChange,
  onChangeAvatar
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const t = (key: keyof typeof translations.en) => getTranslation(language, key);

  const isDashboard = activeView === 'dashboard';
  const dashboardNavItems = getDashboardNavItems(language);

  const navLinks = [
    { id: 'home', label: t('navHome') },
    { id: 'gallery', label: 'Site Photos' },
    { id: 'gallery-videos', label: 'Video Tours' },
    { id: 'gallery-renders', label: '3D Renders' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <img
                src="/questra-logo.jpeg"
                alt="Questra World logo"
                className="w-10 h-10 rounded-xl object-cover shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform bg-white ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div>
                <span className="font-extrabold tracking-tight text-lg sm:text-xl text-slate-900 dark:text-white block leading-tight">
                  Questra <span className="text-amber-600 dark:text-amber-500">World</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-600 dark:text-slate-300 block -mt-0.5">
                  Real Estate & Investment
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links - HIDE IN USER DASHBOARD */}
          {activeView !== 'dashboard' && (
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeView === link.id
                      ? 'text-amber-700 dark:text-amber-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Action Items: Lang, Theme, Sync, Notifications, Glance Widget, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Cloud Sync State Indicator */}
            <div
              title={isCloudSynced ? 'End-to-End Encrypted Cloud Synced' : 'Offline Cached'}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <span className={`w-2 h-2 rounded-full ${isCloudSynced ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[11px] font-mono">
                {isCloudSynced ? 'SYNCED' : 'OFFLINE'}
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>



            {/* Notification Bell - REMOVED / HIDDEN IN USER DASHBOARD */}
            {activeView !== 'dashboard' && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen && unreadCount > 0) {
                      onMarkNotificationsRead();
                    }
                  }}
                  className="relative p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                        {t('notificationsTitle')}
                      </span>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">
                          {t('noNotifications')}
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                                { n.title}
                              </span>
                              <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                                {n.date}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                              { n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Session / Auth Action */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-colors bg-white dark:bg-slate-800 text-left"
                >
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                  />
                  <div className="hidden sm:block">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block leading-tight truncate max-w-[100px]">
                      {user.username}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono block">
                      {user.memberId}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden ${
                      isDashboard
                        ? 'w-72 max-w-[calc(100vw-1.5rem)]'
                        : 'w-60 max-w-[calc(100vw-1.5rem)]'
                    }`}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono mt-0.5 truncate">
                        {user.branch}
                      </p>
                    </div>

                    {/* Investor Dashboard Menu (shown only while in the dashboard) */}
                    {isDashboard && (
                      <div className="py-1 border-b border-slate-100 dark:border-slate-700">
                        <div className="px-4 py-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            { 'Dashboard Menu'}
                          </span>
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                            {user.memberId}
                          </span>
                        </div>
                        <div className="max-h-[52vh] overflow-y-auto overscroll-contain">
                          {dashboardNavItems.map(item => {
                            const Icon = item.icon;
                            const active = dashboardTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  onDashboardTabChange(item.id);
                                  setUserDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs transition-colors text-left ${
                                  active
                                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-semibold'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                              >
                                <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-600' : 'text-slate-400'}`} />
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Change Profile Picture */}
                    <button
                      onClick={() => {
                        onChangeAvatar();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-100 dark:border-slate-700"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>{ 'Change Profile Picture'}</span>
                    </button>

                    {!isDashboard && (
                      <button
                        onClick={() => {
                          onNavigate('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t('navPortal')}</span>
                      </button>
                    )}

                    {isDashboard && (
                      <button
                        onClick={() => {
                          onNavigate('home');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                      >
                        <Compass className="w-3.5 h-3.5 text-slate-500" />
                        <span>{ 'Back to Website'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors text-left font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      <span>{ 'Admin 360° Control'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left border-t border-slate-100 dark:border-slate-700"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('navLogout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{t('navLogin')}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Trigger (Public site only) */}
            {activeView !== 'dashboard' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeView === link.id
                  ? 'bg-amber-50 text-amber-700 dark:bg-slate-800 dark:text-amber-400 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}

          {user && (
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-amber-600 text-white flex items-center justify-between"
            >
              <span>{t('navPortal')}</span>
              <span className="text-xs bg-amber-700/60 px-2 py-0.5 rounded font-mono">
                {user.memberId}
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
