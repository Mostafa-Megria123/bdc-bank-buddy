import React, { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { Lightbox } from "@/components/ui/lightBox";
import { Announcement } from "@/types/announcement";
import { AnnouncementService } from "@/services/announcement-service";
import { getFileUrl, formatDate } from "@/lib/utils";
import { UnitType } from "@/types/unit-type";
import { AnnouncementCategory } from "@/types/announcement-category";
import placeholderSvg from "@/assets/placeholder.svg";
import { useImageWithRetry } from "@/hooks/useImageWithRetry";

export const AnnouncementDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language, tString } = useLanguage();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = React.useState(0);
  const [resolvedImageUrls, setResolvedImageUrls] = useState<string[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState<string>(placeholderSvg);
  const { handleImageError, getImageUrl, failedImages } = useImageWithRetry(
    placeholderSvg,
    {
      maxRetries: 2,
      initialDelay: 500,
      maxDelay: 3000,
      backoffMultiplier: 2,
    },
  );

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);

        if (!id) {
          console.warn("ID is falsy:", id);
          setError("Announcement ID not found");
          return;
        }

        const data = await AnnouncementService.getById(Number(id));
        setAnnouncement(data);

        // Resolve hero image URL
        if (data.gallery && data.gallery.length > 0) {
          const heroUrl = getFileUrl(data.gallery[0].imagePath);
          setHeroImageUrl(heroUrl);

          // Resolve all gallery image URLs
          const galleryUrls = data.gallery.map((img) =>
            getFileUrl(img.imagePath),
          );
          setResolvedImageUrls(galleryUrls);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch announcement:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load announcement",
        );
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const getTitle = (): string => {
    if (!announcement) return "";
    return language === "ar"
      ? announcement.titleAr || ""
      : announcement.titleEn || "";
  };

  const getDescription = (): string => {
    if (!announcement) return "";
    return language === "ar"
      ? announcement.descriptionAr || ""
      : announcement.descriptionEn || "";
  };

  const getContent = (): string => {
    if (!announcement) return "";
    return language === "ar"
      ? announcement.contentAr || ""
      : announcement.contentEn || "";
  };

  const getAuthor = (): string => {
    if (!announcement) return "";
    return language === "ar"
      ? announcement.authorAr || ""
      : announcement.authorEn || "";
  };

  const getLocation = (): string => {
    if (!announcement) return "";
    return language === "ar"
      ? announcement.locationAr || ""
      : announcement.locationEn || "";
  };

  const getType = (): string => {
    if (!announcement) return "";
    if (typeof announcement.type === "object" && announcement.type !== null) {
      const typeObj = announcement.type as UnitType;
      return language === "ar" ? typeObj.typeAr : typeObj.typeEn;
    }
    return announcement.type ? String(announcement.type) : "";
  };

  const getCategory = (): string => {
    if (!announcement) return "";
    if (
      typeof announcement.category === "object" &&
      announcement.category !== null
    ) {
      const categoryObj = announcement.category as AnnouncementCategory;
      return language === "ar"
        ? categoryObj.categoryAr
        : categoryObj.categoryEn;
    }
    return announcement.category ? String(announcement.category) : "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{tString("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {tString("announcementDetails.notFound")}
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
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
        title: getTitle(),
        text: getDescription(),
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
            src={heroImageUrl}
            alt={getTitle()}
            className="w-full h-full object-cover animate-fade-in"
            onError={(e) => {
              if (process.env.NODE_ENV !== "production") {
                console.log("Image failed to load:", heroImageUrl);
              }
              e.currentTarget.src = placeholderSvg;
            }}
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t to-transparent"
          style={
            {
              "--tw-gradient-stops":
                "hsl(0deg 0% 4.72% / 80%), hsl(0deg 0% 0% / 40%) var(--tw-gradient-via-position), var(--tw-gradient-to)",
            } as React.CSSProperties
          }
        />

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
                {getType()}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium capitalize">
                {getCategory()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {formatDate(announcement.publishDate)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {getLocation()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                {getAuthor()}
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in"
              style={{ animationDelay: "0.4s" }}>
              {getTitle()}
            </h1>

            <p
              className="text-xl md:text-2xl text-white/90 max-w-3xl animate-fade-in"
              style={{ animationDelay: "0.6s" }}>
              {getDescription()}
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
                {getContent()
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
              {resolvedImageUrls.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-8 text-foreground">
                    {tString("announcementDetails.gallery")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resolvedImageUrls.map((imageUrl, index) => (
                      <div
                        key={`${imageUrl}-${index}`}
                        className="group overflow-hidden rounded-xl bg-muted/20 cursor-pointer relative"
                        onClick={() => openLightbox(index)}>
                        <img
                          src={getImageUrl(imageUrl)}
                          alt={`${tString(
                            "announcementDetails.galleryImage",
                          )} ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 hover-scale"
                          onError={() => handleImageError(imageUrl)}
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
              {(announcement.projectBrochure ||
                announcement.floorPlans ||
                navigator.share) && (
                <div className="bg-muted/50 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">
                    {tString("announcementDetails.actions")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {announcement.projectBrochure && (
                      <Button
                        variant="outline"
                        asChild
                        className="justify-start h-auto p-6 hover-scale">
                        <a
                          href={getFileUrl(announcement.projectBrochure)}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Download className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">
                              {tString(
                                "announcementDetails.details.downloads.projectBrochure",
                              )}
                            </div>
                          </div>
                        </a>
                      </Button>
                    )}
                    {announcement.floorPlans && (
                      <Button
                        variant="outline"
                        asChild
                        className="justify-start h-auto p-6 hover-scale">
                        <a
                          href={getFileUrl(announcement.floorPlans)}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Download className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">
                              {tString(
                                "announcementDetails.details.downloads.floorPlans",
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

      {lightboxOpen && resolvedImageUrls.length > 0 && (
        <Lightbox
          images={resolvedImageUrls.map((url) => getImageUrl(url))}
          startIndex={lightboxStartIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
