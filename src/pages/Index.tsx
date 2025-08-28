import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveCarousel } from '@/components/Carousel';
import { ArrowRight, ArrowLeft, Calendar, MapPin, Home, Download } from 'lucide-react';
import heroBuilding from '@/assets/hero-building.jpg';
import announcement1 from '@/assets/announcement-1.jpg';
import project1 from '@/assets/project-1.jpg';

const Index = () => {
  const { language, t } = useLanguage();

  // Mock data for announcements carousel
  const announcements = [
    {
      id: '1',
      image: announcement1,
      title: language === 'ar' 
        ? 'إعلان مشروع الأحلام السكني الجديد'
        : 'New Dream Residential Project Announcement',
      description: language === 'ar'
        ? 'مشروع سكني متميز يوفر وحدات سكنية فاخرة بأسعار تنافسية في قلب القاهرة الجديدة.'
        : 'Distinguished residential project offering luxury housing units at competitive prices in the heart of New Cairo.',
      link: '/announcements/1'
    },
    {
      id: '2',  
      image: announcement1,
      title: language === 'ar'
        ? 'بدء الحجز لمشروع الكورنيش'
        : 'Corniche Project Reservations Now Open',
      description: language === 'ar'
        ? 'ابدأ رحلتك نحو الحياة المثالية مع وحدات سكنية تطل على النيل مباشرة.'
        : 'Start your journey to perfect living with residential units directly overlooking the Nile.',
      link: '/announcements/2'
    }
  ];

  // Mock data for projects
  const projects = [
    {
      id: '1',
      image: project1,
      name: language === 'ar' ? 'مشروع النخيل الذهبي' : 'Golden Palm Project',
      type: language === 'ar' ? 'سكني' : 'Residential',
      description: language === 'ar'
        ? 'مجمع سكني فاخر يضم شقق ودوبلكس وفيلات مع مساحات خضراء واسعة.'
        : 'Luxury residential complex featuring apartments, duplexes and villas with vast green spaces.',
      displayStartDate: '2024-01-15',
      displayEndDate: '2024-12-31',
      unitsAvailable: 250,
      link: '/projects/1'
    },
    {
      id: '2',
      image: project1,
      name: language === 'ar' ? 'كمبوند الواحة' : 'Oasis Compound',
      type: language === 'ar' ? 'سكني وتجاري' : 'Residential & Commercial',
      description: language === 'ar'
        ? 'مشروع متكامل يجمع بين السكن والتسوق والترفيه في موقع استراتيجي.'
        : 'Integrated project combining residential, shopping and entertainment in a strategic location.',
      displayStartDate: '2024-02-01',
      displayEndDate: '2024-11-30',
      unitsAvailable: 180,
      link: '/projects/2'
    }
  ];

  // Mock data for ads
  const ads = [
    {
      id: '1',
      title: language === 'ar' ? 'عروض خاصة للدفع المقدم' : 'Special Down Payment Offers',
      image: project1,
      order: 1,
      link: '/projects/special-offers'
    },
    {
      id: '2',
      title: language === 'ar' ? 'فرصة استثمارية ذهبية' : 'Golden Investment Opportunity',
      image: announcement1,
      order: 2,
      link: '/projects/investment'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBuilding})` }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            {t('welcomeTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
            {t('welcomeSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-white text-bdc-orange hover:bg-white/90 shadow-brand text-lg px-8 py-4"
            >
              {language === 'ar' ? 'استكشف مشاريعنا' : 'Explore Our Projects'}
              {language === 'ar' ? (
                <ArrowLeft className="ml-2 h-5 w-5" />
              ) : (
                <ArrowRight className="ml-2 h-5 w-5" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-bdc-orange text-lg px-8 py-4"
            >
              {t('learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('latestAnnouncements')}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-pulse"></div>
            <ResponsiveCarousel 
              items={announcements}
              className="animate-fade-in hover-scale"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('latestProjects')}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                className="overflow-hidden hover:shadow-brand transition-all duration-500 group animate-fade-in hover:scale-[1.02] hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.type}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {language === 'ar' 
                          ? `العرض من ${project.displayStartDate} إلى ${project.displayEndDate}`
                          : `Display from ${project.displayStartDate} to ${project.displayEndDate}`
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {language === 'ar' 
                          ? `${project.unitsAvailable} وحدة متاحة`
                          : `${project.unitsAvailable} units available`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      {t('viewDetails')}
                      {language === 'ar' ? (
                        <ArrowLeft className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ads Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'ar' ? 'العروض الخاصة' : 'Special Offers'}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ads.map((ad, index) => (
              <Card 
                key={ad.id} 
                className="overflow-hidden hover:shadow-brand transition-all duration-500 group cursor-pointer animate-fade-in hover:scale-105 hover:-rotate-1"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-white text-bdc-orange hover:bg-white/90">
                      {t('viewDetails')}
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground text-center">
                    {ad.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
