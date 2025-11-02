import React from 'react';
import { useLanguage } from '@/contexts/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from "@/lib/image-resolver";
import { AnnouncementGridItem } from "@/types/announcement";

const Announcements = () => {
  const { language, t, tString } = useLanguage();
  const announcementsData = t('announcementsPage.list');
  const announcements: AnnouncementGridItem[] = Array.isArray(announcementsData) ? (announcementsData as unknown as AnnouncementGridItem[]) : [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-24 px-5 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              {tString('announcementsPage.sectionTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {tString('announcementsPage.sectionSubtitle')}
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
                    src={resolveImageUrl(announcement.image)}
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
                        {tString('common.readMore')}
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
                {tString('announcementsPage.cta.title')}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                {tString('announcementsPage.cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                  placeholder={tString('common.enterYourEmail')}
                    className="flex-1 px-6 py-4 rounded-xl text-foreground bg-background/95 backdrop-blur-md border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg"
                  />
                  <Button className="bg-background text-primary hover:bg-background/90 px-8 py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                  {tString('common.subscribe')}
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