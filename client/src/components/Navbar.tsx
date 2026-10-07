import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Bot,
  FileText,
  TrendingUp,
  CloudSun,
  Bell,
  User,
  LogOut,
  Globe,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/ai-copilot', label: t('navAICopilot'), icon: Bot, highlight: true },
    { to: '/schemes', label: t('navSchemes'), icon: FileText },
    { to: '/market-prices', label: t('navMarketPrices'), icon: TrendingUp },
    { to: '/weather', label: t('navWeather'), icon: CloudSun },
  ];

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-kisan-700 to-kisan-500 flex items-center justify-center text-white shadow-md shadow-kisan-700/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-1.5">
                  <span>Kisan Mitra</span>
                  <span className="text-kisan-600 bg-kisan-50 text-xs sm:text-sm px-2 py-0.5 rounded-full border border-kisan-200 font-semibold">
                    AI
                  </span>
                </span>
                <span className="text-[11px] font-medium text-stone-500 -mt-0.5">
                  {language === 'hi' ? 'किसान मित्र • डिजिटल सलाहकार' : language === 'te' ? 'రైతు మిత్ర • వ్యవసాయ సలహాదారు' : 'Empowering Indian Agriculture'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-kisan-50 text-kisan-800 shadow-sm'
                        : link.highlight
                        ? 'text-kisan-700 bg-kisan-50/50 hover:bg-kisan-100 hover:text-kisan-800'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-kisan-600' : ''}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right utilities: Language, Notifications, Profile / Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors"
                  aria-label="Select Language"
                >
                  <Globe className="w-4 h-4 text-kisan-600" />
                  <span>
                    {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'తెలుగు'}
                  </span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => handleLangChange('en')}
                      className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between hover:bg-stone-50 ${
                        language === 'en' ? 'text-kisan-700 font-bold bg-kisan-50' : 'text-stone-700'
                      }`}
                    >
                      <span>English</span>
                      {language === 'en' && <span className="text-kisan-600">✓</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLangChange('hi')}
                      className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between hover:bg-stone-50 ${
                        language === 'hi' ? 'text-kisan-700 font-bold bg-kisan-50' : 'text-stone-700'
                      }`}
                    >
                      <span>हिन्दी (Hindi)</span>
                      {language === 'hi' && <span className="text-kisan-600">✓</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLangChange('te')}
                      className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between hover:bg-stone-50 ${
                        language === 'te' ? 'text-kisan-700 font-bold bg-kisan-50' : 'text-stone-700'
                      }`}
                    >
                      <span>తెలుగు (Telugu)</span>
                      {language === 'te' && <span className="text-kisan-600">✓</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications Icon (Authenticated) */}
              {isAuthenticated && (
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-amber-600 rounded-full ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Avatar / Profile / Login */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-kisan-700 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[100px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-stone-500 leading-tight truncate max-w-[100px]">
                        {user.district}
                      </span>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title={t('navLogout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    {t('navLogin')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-kisan-600 hover:bg-kisan-700 shadow-sm transition-colors"
                  >
                    {t('navRegister')}
                  </Link>
                </div>
              )}

              {/* Mobile hamburger menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold ${
                    isActive
                      ? 'bg-kisan-50 text-kisan-800'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-kisan-600' : 'text-stone-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-stone-700 hover:bg-stone-50"
                >
                  <User className="w-5 h-5 text-stone-500" />
                  <span>{t('navProfile')}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('navLogout')}</span>
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Farmer Mobile Bottom Navigation Bar for smartphones */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
            location.pathname === '/' ? 'text-kisan-700' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{t('navDashboard')}</span>
        </Link>
        <Link
          to="/weather"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
            location.pathname === '/weather' ? 'text-kisan-700' : 'text-stone-500'
          }`}
        >
          <CloudSun className="w-5 h-5" />
          <span>{t('navWeather')}</span>
        </Link>
        <Link
          to="/ai-copilot"
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-kisan-700 to-kisan-500 text-white flex items-center justify-center shadow-lg shadow-kisan-700/30 border-2 border-white">
            <Bot className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-kisan-700 mt-1">AI Copilot</span>
        </Link>
        <Link
          to="/market-prices"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
            location.pathname === '/market-prices' ? 'text-kisan-700' : 'text-stone-500'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>{t('navMarketPrices')}</span>
        </Link>
        <Link
          to="/schemes"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
            location.pathname === '/schemes' ? 'text-kisan-700' : 'text-stone-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>{t('navSchemes')}</span>
        </Link>
      </nav>
    </>
  );
};
