import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from '@/contexts/useLanguage';
import { ArrowLeft, ArrowRight, Calendar, MapPin, User, Share2, Download } from 'lucide-react';

// Import images properly
const announcement1 = '/assets/announcement-1.jpg';
const heroBuilding = '/assets/hero-building.jpg';
const project1 = '/assets/project-1.jpg';

type Announcement = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  publishDate: string;
  image: string;
  contentKey: string;
  authorKey: string;
  categoryKey: string;
  locationKey: string;
  gallery?: string[];
  downloadLinks?: { labelKey: string; url: string }[];
};

// Enhanced mock data for announcements
const announcementsData: Announcement[] = [
  {
    id: '1',
    titleKey: 'announcementDetails.details.1.title',
    descriptionKey: 'announcementDetails.details.1.description',
    publishDate: '2024-01-15',
    image: heroBuilding,
    contentKey: 'announcementDetails.details.1.content',
    authorKey: 'announcementDetails.details.1.author',
    categoryKey: 'announcementDetails.details.1.category',
    locationKey: 'announcementDetails.details.1.location',
    gallery: [heroBuilding, announcement1, project1],
    downloadLinks: [
      { labelKey: 'announcementDetails.details.downloads.projectBrochure', url: '#' },
      { labelKey: 'announcementDetails.details.downloads.floorPlans', url: '#' }
    ]
  },
  {
    id: '2',
    titleKey: 'announcementDetails.details.2.title',
    descriptionKey: 'announcementDetails.details.2.description',
    publishDate: '2024-01-10',
    image: project1,
    contentKey: 'announcementDetails.details.2.content',
    authorKey: 'announcementDetails.details.2.author',
    categoryKey: 'announcementDetails.details.2.category',
    locationKey: 'announcementDetails.details.2.location',
    gallery: [announcement1, project1],
    downloadLinks: [
      { labelKey: 'announcementDetails.details.downloads.virtualTour', url: '#' },
      { labelKey: 'announcementDetails.details.downloads.priceList', url: '#' }
    ]
  },
  {
    id: '3',
    titleKey: 'announcementDetails.details.3.title',
    descriptionKey: 'announcementDetails.details.3.description',
    publishDate: '2024-01-05',
    image: announcement1,
    contentKey: 'announcementDetails.details.3.content',
    authorKey: 'announcementDetails.details.3.author',
    categoryKey: 'announcementDetails.details.3.category',
    locationKey: 'announcementDetails.details.3.location',
    gallery: [announcement1, project1],
    downloadLinks: []
  },
  {
    id: '4',
    titleKey: 'announcementDetails.details.4.title',
    descriptionKey: 'announcementDetails.details.4.description',
    publishDate: '2023-12-28',
    image: announcement1,
    contentKey: 'announcementDetails.details.4.content',
    authorKey: 'announcementDetails.details.4.author',
    categoryKey: 'announcementDetails.details.4.category',
    locationKey: 'announcementDetails.details.4.location',
    gallery: [announcement1, project1],
    downloadLinks: []
  },
  {
    id: '5',
    titleKey: 'announcementDetails.details.5.title',
    descriptionKey: 'announcementDetails.details.5.description',
    publishDate: '2023-12-20',
    image: announcement1,
    contentKey: 'announcementDetails.details.5.content',
    authorKey: 'announcementDetails.details.5.author',
    categoryKey: 'announcementDetails.details.5.category',
    locationKey: 'announcementDetails.details.5.location',
    gallery: [announcement1, project1],
    downloadLinks: []
  },
  {
    id: '6',
    titleKey: 'announcementDetails.details.6.title',
    descriptionKey: 'announcementDetails.details.6.description',
    publishDate: '2023-12-15',
    image: announcement1,
    contentKey: 'announcementDetails.details.6.content',
    authorKey: 'announcementDetails.details.6.author',
    categoryKey: 'announcementDetails.details.6.category',
    locationKey: 'announcementDetails.details.6.location',
    gallery: [announcement1, project1],
    downloadLinks: []
  }
];

export const AnnouncementDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language, t, tString } = useLanguage();
  
  const announcement = announcementsData.find(a => a.id === id);
  
  if (!announcement) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {tString('announcementDetails.notFound')}
          </h2>
          <Button onClick={() => navigate('/announcements')}>
            {tString('announcementDetails.backToAnnouncements')}
          </Button>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tString(announcement.titleKey),
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="w-full h-full bg-muted/20">
          <img
            src={announcement.image}
            alt={tString(announcement.titleKey)}
            className="w-full h-full object-cover animate-fade-in"
            onError={(e) => {
              if (process.env.NODE_ENV !== 'production') {
                console.log('Image failed to load:', announcement.image);
              }
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-10">
          <Button
            variant="outline"
            onClick={() => navigate('/announcements')}
            className="bg-background/90 backdrop-blur-md border-border/50 hover:bg-background hover-scale"
          >
            {language === 'ar' ? (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                {tString('announcementDetails.backToAnnouncements')}
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tString('announcementDetails.backToAnnouncements')}
              </>
            )}
          </Button>
        </div>

        {/* Share Button */}
        <div className="absolute top-8 right-8 z-10">
          <Button
            variant="outline"
            onClick={handleShare}
            className="bg-background/90 backdrop-blur-md border-border/50 hover:bg-background hover-scale"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-primary px-4 py-2 rounded-full text-sm font-medium">
                {tString(announcement.categoryKey)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {announcement.publishDate}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {tString(announcement.locationKey)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                {tString(announcement.authorKey)}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {tString(announcement.titleKey)}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {tString(announcement.descriptionKey)}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-elegant animate-fade-in bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12">
              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-12">
                {tString(announcement.contentKey)
                  .split('\n\n')
                  .map((paragraph, idx) => (
                    <p key={idx} className="mb-6 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Gallery Section */}
              {announcement.gallery && announcement.gallery.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-8 text-foreground">
                    {tString('announcementDetails.gallery')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {announcement.gallery.map((image, idx) => (
                      <div key={idx} className="group overflow-hidden rounded-xl bg-muted/20">
                        <img
                          src={image}
                          alt={`${tString('announcementDetails.galleryImage')} ${idx + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 hover-scale"
                          onError={(e) => {
                            if (process.env.NODE_ENV !== 'production') {
                              console.log('Gallery image failed to load:', image);
                            }
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Links */}
              {announcement.downloadLinks && announcement.downloadLinks.length > 0 && (
                <div className="bg-muted/50 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    {tString('announcementDetails.downloads')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {announcement.downloadLinks.map((link, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        asChild
                        className="justify-start h-auto p-6 hover-scale"
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">
                              {tString(link.labelKey)}
                            </div>
                          </div>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 bg-gradient-primary text-white overflow-hidden animate-fade-in">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {tString('announcementDetails.ctaTitle')}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {tString('announcementDetails.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white text-primary border-white hover:bg-white/90 px-8 py-3 hover-scale"
                >
                  {tString('announcementDetails.contactUs')}
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-3 hover-scale"
                  onClick={() => navigate('/announcements')}
                >
                  {tString('announcementDetails.moreAnnouncements')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};