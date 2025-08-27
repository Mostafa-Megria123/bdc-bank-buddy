import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    announcements: 'Announcements',
    faqs: 'FAQs',
    about: 'About',
    myReservations: 'My Reservation Requests',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    resetPassword: 'Reset Password',
    
    // Home Page
    welcomeTitle: 'Welcome to BDC',
    welcomeSubtitle: 'Your trusted partner in real estate development',
    latestProjects: 'Latest Projects',
    latestAnnouncements: 'Latest Announcements',
    viewDetails: 'View Details',
    learnMore: 'Learn More',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    
    // Footer
    contactUs: 'Contact Us',
    siteMap: 'Site Map',
    copyright: '© 2024 BDC. All rights reserved.',
    hotline: 'Hotline'
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    announcements: 'الإعلانات',
    faqs: 'الأسئلة الشائعة',
    about: 'حولنا',
    myReservations: 'طلبات الحجز الخاصة بي',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    logout: 'تسجيل الخروج',
    resetPassword: 'إعادة تعيين كلمة المرور',
    
    // Home Page
    welcomeTitle: 'مرحباً بكم في بنك القاهرة',
    welcomeSubtitle: 'شريككم الموثوق في التطوير العقاري',
    latestProjects: 'أحدث المشاريع',
    latestAnnouncements: 'أحدث الإعلانات',
    viewDetails: 'عرض التفاصيل',
    learnMore: 'اعرف أكثر',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    back: 'السابق',
    next: 'التالي',
    previous: 'السابق',
    loading: 'جاري التحميل...',
    
    // Footer
    contactUs: 'اتصل بنا',
    siteMap: 'خريطة الموقع',
    copyright: '© 2024 بنك القاهرة. جميع الحقوق محفوظة.',
    hotline: 'الخط الساخن'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};