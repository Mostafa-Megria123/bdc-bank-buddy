import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, MapPin } from 'lucide-react';
import bdcLogo from '@/assets/bdc-logo.png';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  const quickLinks = [
    { path: '/', label: t('home') },
    { path: '/announcements', label: t('announcements') },
    { path: '/faqs', label: t('faqs') },
    { path: '/about', label: t('about') }
  ];

  return (
    <footer className="bg-bdc-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src={bdcLogo}
                alt="BDC"
                className="h-8 w-auto brightness-0 invert"
              />
              <span className="ml-2 text-xl font-bold">
                {language === 'ar' ? 'بنك القاهرة' : 'BDC'}
              </span>
            </div>
            <p className="text-white/80 text-sm">
              {language === 'ar' 
                ? 'شريككم الموثوق في التطوير العقاري وتحقيق أحلامكم السكنية.'
                : 'Your trusted partner in real estate development and achieving your residential dreams.'
              }
            </p>
          </div>

          {/* Site Map */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('siteMap')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('contactUs')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{t('hotline')}</p>
                  <p className="text-white/80 text-sm">19977</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {language === 'ar' 
                      ? 'قسم المنفذ والأمين'
                      : 'Executor & Trustee Dept.'
                    }
                  </p>
                  <p className="text-white/80 text-sm">+20 2 2770 8888</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-white/80 text-sm">info@bdc-egypt.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === 'ar' ? 'معلومات إضافية' : 'Additional Info'}
            </h3>
            <div className="space-y-2">
              <p className="text-white/80 text-sm">
                {language === 'ar' 
                  ? 'ساعات العمل: الأحد - الخميس'
                  : 'Working Hours: Sunday - Thursday'
                }
              </p>
              <p className="text-white/80 text-sm">
                {language === 'ar' 
                  ? '9:00 ص - 3:00 م'
                  : '9:00 AM - 3:00 PM'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-sm">
              {t('copyright')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link
                to="/privacy"
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link
                to="/terms"
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};