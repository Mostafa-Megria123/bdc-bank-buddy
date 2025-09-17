import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type CarouselItem } from '@/components/Carousel';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ArrowRight, ArrowLeft, Calendar, Home, Download } from 'lucide-react';

interface Project {
  id: string;
  image: string;
  name: string;
  type: string;
  description: string;
  displayStartDate: string;
  displayEndDate: string;
  unitsAvailable: number;
  link: string;
}

interface Ad {
  id: string;
  title: string;
  image: string;
  link: string;
}

const Index = () => {
  const { language, t, tString } = useLanguage();

  const rawAnnouncements = t('announcementsPage.list');
  const announcements: CarouselItem[] = Array.isArray(rawAnnouncements)
    ? (rawAnnouncements.slice(0, 2) as unknown as CarouselItem[])
    : [];

  const rawProjects = t('projects.list');
  const projects: Project[] = Array.isArray(rawProjects) ? (rawProjects as unknown as Project[]) : [];

  const rawAds = t('ads.list');
  const ads: Ad[] = Array.isArray(rawAds) ? (rawAds as unknown as Ad[]) : [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <HeroCarousel autoPlay={true} autoPlayInterval={6000} />

      {/* Announcements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {tString('announcementsPage.sectionTitle')}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
          </div>
          
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                {announcements.map((a, index) => (
                  <Card 
                    key={a.id}
                    className="overflow-hidden hover:shadow-brand transition-all duration-500 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative overflow-hidden h-48">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-[#6d6f74] mb-2 line-clamp-2">{a.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{a.description}</p>
                      {a.link && (
                        <Link to={String(a.link)} className="w-full block">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full group-hover:bg-gradient-primary group-hover:text-white group-hover:border-transparent transition-all duration-300"
                          >
                            {tString('common.viewDetails')}
                            {language === 'ar' ? (
                              <ArrowLeft className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {tString('projects.sectionTitle')}
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
                        {tString('projects.display.dateRange')
                          .replace('{start}', project.displayStartDate)
                          .replace('{end}', project.displayEndDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {tString('projects.display.unitsAvailable').replace('{count}', project.unitsAvailable.toString())}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={project.link} className="flex-1">
                      <Button 
                        className="w-full bg-gradient-primary hover:opacity-90"
                      >
                        {tString('common.viewDetails')}
                        {language === 'ar' ? (
                          <ArrowLeft className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      {tString('common.termsAndConditions')}
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
              {tString('ads.sectionTitle')}
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
                      {tString('common.viewDetails')}
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
