import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  User,
  Share2,
  Download,
  Search,
} from "lucide-react";
import { Lightbox } from "@/components/ui/lightBox";
// import { Announcement } from "@/types/announcement";

// Import images properly
import announcement1 from "@/assets/announcement-1.jpg";
import heroBuilding from "@/assets/hero-building.jpg";
import project1 from "@/assets/project-1.jpg";

export type Announcement = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  publishDate: string;
  contentKey: string;
  authorKey: string;
  typeKey: string;
  categoryKey: string;
  locationKey: string;
  gallery?: string[];
  projectBrochureUrl?: string;
  floorPlansUrl?: string;
};

// Enhanced mock data for announcements
const announcementsData: Announcement[] = [
  {
    id: "1",
    titleKey: "announcementDetails.details.1.title",
    descriptionKey: "announcementDetails.details.1.description",
    publishDate: "2024-01-15",
    contentKey: "announcementDetails.details.1.content",
    authorKey: "announcementDetails.details.1.author",
    typeKey: "announcementDetails.details.1.type",
    categoryKey: "announcementDetails.details.categories.residential",
    locationKey: "announcementDetails.details.1.location",
    gallery: [heroBuilding, announcement1, project1],
    projectBrochureUrl: "/path/to/brochure-1.pdf",
    floorPlansUrl: "/path/to/floor-plans-1.pdf",
  },
  {
    id: "2",
    titleKey: "announcementDetails.details.2.title",
    descriptionKey: "announcementDetails.details.2.description",
    publishDate: "2024-01-10",
    contentKey: "announcementDetails.details.2.content",
    authorKey: "announcementDetails.details.2.author",
    typeKey: "announcementDetails.details.2.type",
    categoryKey: "announcementDetails.details.categories.residential",
    locationKey: "announcementDetails.details.2.location",
    gallery: [announcement1, project1],
    projectBrochureUrl: "/path/to/brochure-2.pdf",
  },
  {
    id: "3",
    titleKey: "announcementDetails.details.3.title",
    descriptionKey: "announcementDetails.details.3.description",
    publishDate: "2024-01-05",
    contentKey: "announcementDetails.details.3.content",
    authorKey: "announcementDetails.details.3.author",
    typeKey: "announcementDetails.details.3.type",
    categoryKey: "announcementDetails.details.categories.commercial",
    locationKey: "announcementDetails.details.3.location",
    gallery: [announcement1, project1],
  },
  {
    id: "4",
    titleKey: "announcementDetails.details.4.title",
    descriptionKey: "announcementDetails.details.4.description",
    publishDate: "2023-12-28",
    contentKey: "announcementDetails.details.4.content",
    authorKey: "announcementDetails.details.4.author",
    typeKey: "announcementDetails.details.4.type",
    categoryKey: "announcementDetails.details.categories.administrative",
    locationKey: "announcementDetails.details.4.location",
    gallery: [announcement1, project1],
  },
  {
    id: "5",
    titleKey: "announcementDetails.details.5.title",
    descriptionKey: "announcementDetails.details.5.description",
    publishDate: "2023-12-20",
    contentKey: "announcementDetails.details.5.content",
    authorKey: "announcementDetails.details.5.author",
    typeKey: "announcementDetails.details.5.type",
    categoryKey: "announcementDetails.details.categories.openSpace",
    locationKey: "announcementDetails.details.5.location",
    gallery: [announcement1, project1],
  },
  {
    id: "6",
    titleKey: "announcementDetails.details.6.title",
    descriptionKey: "announcementDetails.details.6.description",
    publishDate: "2023-12-15",
    contentKey: "announcementDetails.details.6.content",
    authorKey: "announcementDetails.details.6.author",
    typeKey: "announcementDetails.details.6.type",
    categoryKey: "announcementDetails.details.categories.garage",
    locationKey: "announcementDetails.details.6.location",
    gallery: [announcement1, project1],
  },
];

export const AnnouncementDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language, tString } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = React.useState(0);

  const announcement = announcementsData.find((a) => a.id === id);

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {tString("announcementDetails.notFound")}
          </h2>
          <Button onClick={() => navigate("/announcements")}>
            {tString("announcementDetails.backToAnnouncements")}
          </Button>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tString(announcement.titleKey),
        text: tString(announcement.descriptionKey),
        url: window.location.href,
      });
    }
  };

  const openLightbox = (index: number) => {
    setLightboxStartIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="w-full h-full bg-muted/20">
          <img
            src={announcement.gallery?.[0] || "/placeholder.svg"}
            alt={tString(announcement.titleKey)}
            className="w-full h-full object-cover animate-fade-in"
            onError={(e) => {
              if (process.env.NODE_ENV !== "production") {
                console.log("Image failed to load:", announcement.gallery?.[0]);
              }
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-8 left-8 z-10">
          <Button
            variant="outline"
            onClick={() => navigate("/announcements")}
            className="bg-background/90 backdrop-blur-md border-border/50 hover:bg-background hover-scale">
            {language === "ar" ? (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                {tString("announcementDetails.backToAnnouncements")}
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tString("announcementDetails.backToAnnouncements")}
              </>
            )}
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <div
              className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in"
              style={{ animationDelay: "0.2s" }}>
              <div className="bg-primary px-4 py-2 rounded-full text-sm font-medium capitalize">
                {tString(announcement.typeKey)}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium capitalize">
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

            <h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in"
              style={{ animationDelay: "0.4s" }}>
              {tString(announcement.titleKey)}
            </h1>

            <p
              className="text-xl md:text-2xl text-white/90 max-w-3xl animate-fade-in"
              style={{ animationDelay: "0.6s" }}>
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
                  .split("\n\n")
                  .map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mb-6 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Gallery Section */}
              {announcement.gallery && announcement.gallery.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-8 text-foreground">
                    {tString("announcementDetails.gallery")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {announcement.gallery.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group overflow-hidden rounded-xl bg-muted/20 cursor-pointer relative"
                        onClick={() => openLightbox(index)}>
                        <img
                          src={image}
                          alt={`${tString(
                            "announcementDetails.galleryImage"
                          )} ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 hover-scale"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Search className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Section */}
              {(announcement.projectBrochureUrl ||
                announcement.floorPlansUrl ||
                navigator.share) && (
                <div className="bg-muted/50 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    {tString("announcementDetails.actions")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {announcement.projectBrochureUrl && (
                      <Button
                        variant="outline"
                        asChild
                        className="justify-start h-auto p-6 hover-scale">
                        <a
                          href={announcement.projectBrochureUrl}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Download className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">
                              {tString(
                                "announcementDetails.details.downloads.projectBrochure"
                              )}
                            </div>
                          </div>
                        </a>
                      </Button>
                    )}
                    {announcement.floorPlansUrl && (
                      <Button
                        variant="outline"
                        asChild
                        className="justify-start h-auto p-6 hover-scale">
                        <a
                          href={announcement.floorPlansUrl}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Download className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">
                              {tString(
                                "announcementDetails.details.downloads.floorPlans"
                              )}
                            </div>
                          </div>
                        </a>
                      </Button>
                    )}
                    {navigator.share && (
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="justify-start h-auto p-6 hover-scale">
                        <Share2 className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">
                            {tString("announcementDetails.shareAction")}
                          </div>
                        </div>
                      </Button>
                    )}
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
                {tString("announcementDetails.ctaTitle")}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {tString("announcementDetails.ctaSubtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="bg-white text-primary border-white hover:bg-white/90 px-8 py-3 hover-scale">
                  {tString("announcementDetails.contactUs")}
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-3 hover-scale"
                  onClick={() => navigate("/announcements")}>
                  {tString("announcementDetails.moreAnnouncements")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {lightboxOpen && (
        <Lightbox
          images={announcement.gallery || []}
          startIndex={lightboxStartIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
