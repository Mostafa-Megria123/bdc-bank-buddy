import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import announcement1 from '@/assets/announcement-1.jpg';

const Announcements = () => {
  const { language } = useLanguage();

  // Mock data for announcements
  const announcements = [
    {
      id: '1',
      image: announcement1,
      title: language === 'ar' 
        ? 'إعلان مشروع الأحلام السكني الجديد'
        : 'New Dream Residential Project Announcement',
      description: language === 'ar'
        ? 'مشروع سكني متميز يوفر وحدات سكنية فاخرة بأسعار تنافسية في قلب القاهرة الجديدة. يضم المشروع شقق ودوبلكس وفيلات بمساحات متنوعة تناسب جميع الاحتياجات، مع توفير كافة الخدمات والمرافق اللازمة للحياة العصرية.'
        : 'Distinguished residential project offering luxury housing units at competitive prices in the heart of New Cairo. The project includes apartments, duplexes and villas with various spaces to suit all needs, providing all necessary services and facilities for modern living.',
      publishDate: '2024-01-15',
      link: '/announcements/1'
    },
    {
      id: '2',  
      image: announcement1,
      title: language === 'ar'
        ? 'بدء الحجز لمشروع الكورنيش'
        : 'Corniche Project Reservations Now Open',
      description: language === 'ar'
        ? 'ابدأ رحلتك نحو الحياة المثالية مع وحدات سكنية تطل على النيل مباشرة. مشروع الكورنيش يوفر تجربة سكنية استثنائية مع إطلالات بانورامية خلابة على النيل، وتصميمات معمارية حديثة تجمع بين الفخامة والراحة.'
        : 'Start your journey to perfect living with residential units directly overlooking the Nile. The Corniche project provides an exceptional residential experience with stunning panoramic Nile views, and modern architectural designs combining luxury and comfort.',
      publishDate: '2024-01-10',
      link: '/announcements/2'
    },
    {
      id: '3',
      image: announcement1,
      title: language === 'ar'
        ? 'عروض خاصة للدفع المقدم'
        : 'Special Down Payment Offers',
      description: language === 'ar'
        ? 'استفد من عروضنا الخاصة للدفع المقدم مع تسهيلات دفع مميزة وخصومات حصرية للعملاء الجدد. عروض محدودة الوقت لا تفوتها!'
        : 'Take advantage of our special down payment offers with exceptional payment facilities and exclusive discounts for new customers. Limited time offers, don\'t miss out!',
      publishDate: '2024-01-05',
      link: '/announcements/3'
    },
    {
      id: '4',
      image: announcement1,
      title: language === 'ar'
        ? 'افتتاح فرع جديد في الإسكندرية'
        : 'New Branch Opening in Alexandria',
      description: language === 'ar'
        ? 'نعلن عن افتتاح فرعنا الجديد في الإسكندرية لخدمة عملائنا في المحافظة. الفرع الجديد يوفر جميع الخدمات العقارية والاستشارات المتخصصة.'
        : 'We announce the opening of our new branch in Alexandria to serve our customers in the governorate. The new branch provides all real estate services and specialized consultations.',
      publishDate: '2023-12-28',
      link: '/announcements/4'
    },
    {
      id: '5',
      image: announcement1,
      title: language === 'ar'
        ? 'ورشة عمل حول الاستثمار العقاري'
        : 'Real Estate Investment Workshop',
      description: language === 'ar'
        ? 'انضم إلينا في ورشة العمل المجانية حول أسس الاستثمار العقاري الناجح. سيقدم الورشة نخبة من الخبراء في مجال العقارات والاستثمار.'
        : 'Join us for a free workshop on the fundamentals of successful real estate investment. The workshop will be presented by a select group of experts in real estate and investment.',
      publishDate: '2023-12-20',
      link: '/announcements/5'
    },
    {
      id: '6',
      image: announcement1,
      title: language === 'ar'
        ? 'تطبيق الهاتف المحمول الجديد'
        : 'New Mobile Application',
      description: language === 'ar'
        ? 'حمّل تطبيق بنك القاهرة للتنمية والائتمان العقاري الجديد واستمتع بتصفح المشاريع وإدارة حجوزاتك بسهولة من هاتفك المحمول.'
        : 'Download the new BDC mobile application and enjoy browsing projects and managing your reservations easily from your mobile phone.',
      publishDate: '2023-12-15',
      link: '/announcements/6'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            {language === 'ar' ? 'الإعلانات' : 'Announcements'}
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            {language === 'ar' 
              ? 'تابع أحدث إعلاناتنا ومشاريعنا العقارية الجديدة'
              : 'Follow our latest announcements and new real estate projects'
            }
          </p>
        </div>
      </section>

      {/* Announcements Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((announcement, index) => (
              <Card 
                key={announcement.id} 
                className="overflow-hidden hover:shadow-brand transition-all duration-500 group animate-fade-in hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center text-sm text-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {announcement.publishDate}
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {announcement.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {announcement.description}
                  </p>
                  
                  <Link to={announcement.link}>
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 group-hover:shadow-lg"
                    >
                      {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                      {language === 'ar' ? (
                        <ArrowLeft className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      ) : (
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-primary text-white animate-fade-in">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'ar' ? 'لا تفوت الفرصة!' : "Don't Miss Out!"}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {language === 'ar'
                  ? 'اشترك في نشرتنا الإخبارية لتكون أول من يعلم بالإعلانات والعروض الجديدة'
                  : 'Subscribe to our newsletter to be the first to know about new announcements and offers'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="flex-1 px-4 py-3 rounded-lg text-foreground bg-white/90 backdrop-blur-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button className="bg-white text-primary hover:bg-white/90 px-6 py-3 font-semibold">
                  {language === 'ar' ? 'اشتراك' : 'Subscribe'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Announcements;