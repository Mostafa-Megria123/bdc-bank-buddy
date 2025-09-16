import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/useLanguage';
import { Phone, Mail, MapPin } from 'lucide-react';
const bdcLogo = '/assets/bdc_logo_transparent.png';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  const quickLinks = [
    { path: '/', label: String(t('nav.home')) },
    { path: '/announcements', label: String(t('nav.announcements')) },
    { path: '/faqs', label: String(t('nav.faqs')) },
    { path: '/about', label: String(t('nav.about')) }
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
                className="h-8 w-auto"
              />
            </div>
            <p className="text-white/80 text-sm">{String(t('footer.tagline'))}</p>
          </div>

          {/* Site Map */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{String(t('footer.siteMap'))}</h3>
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
            <h3 className="text-lg font-semibold">{String(t('footer.contactUs'))}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{String(t('footer.hotline'))}</p>
                  <p className="text-white/80 text-sm">19977</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{String(t('footer.executorDept'))}</p>
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
            <h3 className="text-lg font-semibold">{String(t('footer.additionalInfoTitle'))}</h3>
            <div className="space-y-2">
              <p className="text-white/80 text-sm">{String(t('footer.workingHoursDays'))}</p>
              <p className="text-white/80 text-sm">{String(t('footer.workingHoursTime'))}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-sm">
              {String(t('footer.copyright'))}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link
                to="/privacy"
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {String(t('footer.privacyPolicy'))}
              </Link>
              <Link
                to="/terms"
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {String(t('common.termsAndConditions'))}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};