import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight, Calendar, MapPin, User, Share2, Download } from 'lucide-react';

// Import images properly
const announcement1 = '/assets/announcement-1.jpg';
const heroBuilding = '/assets/hero-building.jpg';
const project1 = '/assets/project-1.jpg';

type LegacyAnnouncement = {
  id: string;
  title: string;
  date: string;
  content: string;
  images?: string[];
  links?: { label: string; url: string }[];
  author?: string;
  category?: string;
  location?: string;
};

type Announcement = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  publishDate: string;
  image: string;
  content: string;
  contentAr: string;
  author: string;
  authorAr: string;
  category: string;
  categoryAr: string;
  location: string;
  locationAr: string;
  gallery?: string[];
  downloadLinks?: { label: string; labelAr: string; url: string }[];
};

// Enhanced mock data for announcements
const announcementsData: Announcement[] = [
  {
    id: '1',
    title: 'New Dream Residential Project Announcement',
    titleAr: 'إعلان مشروع الأحلام السكني الجديد',
    description: 'Distinguished residential project offering luxury housing units at competitive prices in the heart of New Cairo.',
    descriptionAr: 'مشروع سكني متميز يوفر وحدات سكنية فاخرة بأسعار تنافسية في قلب القاهرة الجديدة.',
    publishDate: '2024-01-15',
    image: heroBuilding,
    content: `We are excited to announce the launch of our latest residential project, "Dream Homes", located in the prestigious area of New Cairo. This exceptional development offers a perfect blend of modern architecture, luxury amenities, and strategic location.

The project features:
- Spacious apartments ranging from 100 to 300 square meters
- Modern duplex units with private gardens
- Luxury villas with swimming pools
- 24/7 security and concierge services
- Green spaces and recreational areas
- Shopping center and medical facilities within the compound
- Easy access to major highways and business districts

Our commitment to quality construction and attention to detail ensures that every unit meets the highest standards of comfort and elegance. The project is designed to cater to modern families seeking a premium lifestyle in a secure and well-planned community.

Investment opportunities are available with flexible payment plans and attractive financing options. Early bird discounts are offered for the first 100 bookings.`,
    contentAr: `نحن متحمسون للإعلان عن إطلاق مشروعنا السكني الأحدث "منازل الأحلام" الواقع في المنطقة المرموقة بالقاهرة الجديدة. يقدم هذا التطوير الاستثنائي مزيجاً مثالياً من العمارة الحديثة والمرافق الفاخرة والموقع الاستراتيجي.

يتميز المشروع بـ:
- شقق واسعة تتراوح من 100 إلى 300 متر مربع
- وحدات دوبلكس حديثة مع حدائق خاصة
- فيلات فاخرة مع حمامات سباحة
- خدمات الأمن والبواب على مدار 24/7
- المساحات الخضراء والمناطق الترفيهية
- مركز تسوق ومرافق طبية داخل المجمع
- سهولة الوصول إلى الطرق السريعة الرئيسية والمناطق التجارية

التزامنا بالبناء عالي الجودة والاهتمام بالتفاصيل يضمن أن كل وحدة تلبي أعلى معايير الراحة والأناقة. تم تصميم المشروع لتلبية احتياجات العائلات الحديثة التي تسعى لنمط حياة راقٍ في مجتمع آمن ومخطط جيداً.

تتوفر فرص استثمارية مع خطط دفع مرنة وخيارات تمويل جذابة. تُقدم خصومات للحجز المبكر للـ 100 حجز الأولى.`,
    author: 'BDC Development Team',
    authorAr: 'فريق التطوير في بنك القاهرة',
    category: 'New Projects',
    categoryAr: 'مشاريع جديدة',
    location: 'New Cairo',
    locationAr: 'القاهرة الجديدة',
    gallery: [heroBuilding, announcement1, project1],
    downloadLinks: [
      { label: 'Project Brochure', labelAr: 'كتيب المشروع', url: '#' },
      { label: 'Floor Plans', labelAr: 'مخططات الطوابق', url: '#' }
    ]
  },
  {
    id: '2',
    title: 'Corniche Project Reservations Now Open',
    titleAr: 'بدء الحجز لمشروع الكورنيش',
    description: 'Start your journey to perfect living with residential units directly overlooking the Nile.',
    descriptionAr: 'ابدأ رحلتك نحو الحياة المثالية مع وحدات سكنية تطل على النيل مباشرة.',
    publishDate: '2024-01-10',
    image: project1,
    content: `The prestigious Corniche project offers an unparalleled living experience with breathtaking Nile views. Located on the banks of the historic Nile River, this luxury development combines modern amenities with timeless elegance.

Project highlights include:
- Panoramic Nile views from every unit
- Premium finishes and smart home technology
- Private balconies and terraces
- Infinity pool overlooking the river
- World-class spa and fitness center
- Gourmet restaurants and cafes
- Marina for private boats
- Landscaped gardens and walking paths

This exclusive project offers limited units, ensuring privacy and exclusivity for residents. Each apartment is carefully designed to maximize river views and natural light, creating a serene living environment in the heart of the city.

Flexible payment plans are available with up to 7 years financing. Special launch prices are valid for a limited time only.`,
    contentAr: `يوفر مشروع الكورنيش المرموق تجربة معيشية لا مثيل لها مع إطلالات خلابة على النيل. يقع على ضفاف نهر النيل التاريخي، ويجمع هذا التطوير الفاخر بين المرافق الحديثة والأناقة الخالدة.

تشمل أبرز ملامح المشروع:
- إطلالات بانورامية على النيل من كل وحدة
- تشطيبات فاخرة وتقنية المنزل الذكي
- شرفات وتراسات خاصة
- حمام سباحة لانهائي يطل على النهر
- مركز سبا ولياقة بدنية عالمي المستوى
- مطاعم وكافيهات راقية
- مارينا للقوارب الخاصة
- حدائق منسقة ومسارات للمشي

يوفر هذا المشروع الحصري وحدات محدودة، مما يضمن الخصوصية والحصرية للسكان. تم تصميم كل شقة بعناية لتعظيم إطلالات النهر والضوء الطبيعي، مما يخلق بيئة معيشية هادئة في قلب المدينة.

خطط دفع مرنة متاحة مع تمويل يصل إلى 7 سنوات. أسعار الإطلاق الخاصة سارية لفترة محدودة فقط.`,
    author: 'Corniche Development',
    authorAr: 'تطوير الكورنيش',
    category: 'Luxury Projects',
    categoryAr: 'مشاريع فاخرة',
    location: 'Nile Corniche',
    locationAr: 'كورنيش النيل',
    gallery: [announcement1, project1],
    downloadLinks: [
      { label: 'Virtual Tour', labelAr: 'جولة افتراضية', url: '#' },
      { label: 'Price List', labelAr: 'قائمة الأسعار', url: '#' }
    ]
  },
  // Add more announcements as needed...
];

interface AnnouncementDetailsProps {
  announcement?: Announcement | LegacyAnnouncement;
}

export const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({ 
  announcement: propAnnouncement 
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  
  // Find announcement by ID if not provided as prop
  const foundAnnouncement = propAnnouncement || announcementsData.find(a => a.id === id);
  
  if (!foundAnnouncement) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'الإعلان غير موجود' : 'Announcement Not Found'}
          </h2>
          <Button onClick={() => navigate('/announcements')}>
            {language === 'ar' ? 'العودة للإعلانات' : 'Back to Announcements'}
          </Button>
        </Card>
      </div>
    );
  }

  // Check if it's legacy format and convert
  const isLegacy = 'date' in foundAnnouncement;
  const announcement = isLegacy ? {
    ...foundAnnouncement as LegacyAnnouncement,
    titleAr: foundAnnouncement.title,
    description: foundAnnouncement.content.substring(0, 200) + '...',
    descriptionAr: foundAnnouncement.content.substring(0, 200) + '...',
    publishDate: foundAnnouncement.date,
    image: foundAnnouncement.images?.[0] || heroBuilding,
    contentAr: foundAnnouncement.content,
    authorAr: foundAnnouncement.author || 'فريق بنك القاهرة',
    categoryAr: foundAnnouncement.category || 'عام',
    locationAr: foundAnnouncement.location || 'القاهرة',
    gallery: foundAnnouncement.images?.slice(1) || [],
    downloadLinks: foundAnnouncement.links?.map(link => ({
      label: link.label,
      labelAr: link.label,
      url: link.url
    })) || []
  } as Announcement : foundAnnouncement as Announcement;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: language === 'ar' ? announcement.titleAr : announcement.title,
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
            alt={language === 'ar' ? announcement.titleAr : announcement.title}
            className="w-full h-full object-cover animate-fade-in"
            onError={(e) => {
              console.log('Image failed to load:', announcement.image);
              e.currentTarget.src = '/placeholder.svg';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', announcement.image);
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
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة للإعلانات
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Announcements
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
                {language === 'ar' ? announcement.categoryAr : announcement.category}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {announcement.publishDate}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {language === 'ar' ? announcement.locationAr : announcement.location}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                {language === 'ar' ? announcement.authorAr : announcement.author}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {language === 'ar' ? announcement.titleAr : announcement.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {language === 'ar' ? announcement.descriptionAr : announcement.description}
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
                {(language === 'ar' ? announcement.contentAr : announcement.content)
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
                    {language === 'ar' ? 'معرض الصور' : 'Gallery'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {announcement.gallery.map((image, idx) => (
                      <div key={idx} className="group overflow-hidden rounded-xl bg-muted/20">
                        <img
                          src={image}
                          alt={`${language === 'ar' ? 'صورة المعرض' : 'Gallery image'} ${idx + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 hover-scale"
                          onError={(e) => {
                            console.log('Gallery image failed to load:', image);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                          onLoad={() => {
                            console.log('Gallery image loaded:', image);
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
                    {language === 'ar' ? 'التحميلات' : 'Downloads'}
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
                              {language === 'ar' ? link.labelAr : link.label}
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
                {language === 'ar' ? 'مهتم بهذا المشروع؟' : 'Interested in This Project?'}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {language === 'ar'
                  ? 'تواصل معنا الآن للحصول على مزيد من المعلومات والعروض الخاصة'
                  : 'Contact us now for more information and special offers'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white text-primary border-white hover:bg-white/90 px-8 py-3 hover-scale"
                >
                  {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-3 hover-scale"
                  onClick={() => navigate('/announcements')}
                >
                  {language === 'ar' ? 'إعلانات أخرى' : 'More Announcements'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};