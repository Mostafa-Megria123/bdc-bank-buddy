import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
const bdcLogo = '/assets/bdc-logo.png';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/announcements', label: t('announcements') },
    { path: '/faqs', label: t('faqs') },
    { path: '/about', label: t('about') },
    { path: '/my-reservations', label: t('myReservations') }
  ];

  return (
    <nav className="bg-background shadow-soft border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src={bdcLogo}
              alt="BDC"
              className="h-8 w-auto hover:opacity-80 transition-opacity"
            />
            <span className="ml-2 text-xl font-bold text-foreground">
              {language === 'ar' ? 'بنك القاهرة' : 'BDC'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 rtl:space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-gradient-primary text-white'
                      : 'text-secondary hover:text-primary hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rtl:space-x-reverse"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'عربي' : 'English'}</span>
            </Button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  {t('resetPassword')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="p-1"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background border-t animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-gradient-primary text-white'
                      : 'text-secondary hover:text-primary hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="px-4 py-3 border-t space-y-2">
              {isLoggedIn ? (
                <>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('resetPassword')}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsLoggedIn(false)}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      {t('register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};