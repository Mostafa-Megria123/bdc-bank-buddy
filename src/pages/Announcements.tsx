import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
const announcement1 = '/assets/announcement-1.jpg';

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
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8 leading-tight">
              {language === 'ar' ? 'الإعلانات' : 'Announcements'}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'تابع أحدث إعلاناتنا ومشاريعنا العقارية الجديدة'
                : 'Follow our latest announcements and new real estate projects'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Announcements Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {announcements.map((announcement, index) => (
              <Card 
                key={announcement.id} 
                className="group overflow-hidden border-0 shadow-elegant hover:shadow-elegant-lg transition-all duration-700 animate-fade-in hover-scale bg-card/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4">
                    <div className="bg-background/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                      <div className="flex items-center text-sm font-medium text-foreground">
                        <Calendar className="h-3 w-3 mr-2" />
                        {announcement.publishDate}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 backdrop-blur-md rounded-lg p-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {announcement.title}
                  </h3>
                  
                  <Link to={announcement.link} className="block">
                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-brand transition-all duration-500 text-lg py-6 story-link group/button"
                    >
                      <span className="flex items-center justify-center">
                        {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                        {language === 'ar' ? (
                          <ArrowLeft className="mr-3 h-5 w-5 group-hover/button:-translate-x-1 transition-transform duration-300" />
                        ) : (
                          <ArrowRight className="ml-3 h-5 w-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                        )}
                      </span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 shadow-elegant animate-fade-in">
            <div className="relative bg-gradient-primary p-12 md:p-16">
              <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
              <div className="relative text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {language === 'ar' ? 'لا تفوت الفرصة!' : "Don't Miss Out!"}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                  {language === 'ar'
                    ? 'اشترك في نشرتنا الإخبارية لتكون أول من يعلم بالإعلانات والعروض الجديدة'
                    : 'Subscribe to our newsletter to be the first to know about new announcements and offers'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    className="flex-1 px-6 py-4 rounded-xl text-foreground bg-background/95 backdrop-blur-md border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg"
                  />
                  <Button className="bg-background text-primary hover:bg-background/90 px-8 py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                    {language === 'ar' ? 'اشتراك' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Announcements;