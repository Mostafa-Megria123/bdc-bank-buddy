import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getFileUrl, formatDate } from "@/lib/utils";
import { AnnouncementService } from "@/services/announcement-service";
import { Announcement } from "@/types/announcement";
import SectionTitle from "@/components/SectionTitle";

const Announcements = () => {
  const { language, tString } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await AnnouncementService.getAll(0, 100);
        const data = Array.isArray(response.content) ? response.content : [];
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load announcements"
        );
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getTitle = (announcement: Announcement): string => {
    return language === "ar"
      ? announcement.titleAr || ""
      : announcement.titleEn || "";
  };

  const getDescription = (announcement: Announcement): string => {
    return language === "ar"
      ? announcement.descriptionAr || ""
      : announcement.descriptionEn || "";
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {tString("common.retry")}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-24 px-5 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <SectionTitle
              title={tString("announcementsPage.sectionTitle")}
              icon={Calendar}
            />
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {tString("announcementsPage.sectionSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Announcements Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {announcements.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {tString("announcementsPage.noAnnouncements")}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {announcements.map((announcement, index) => (
                <Card
                  key={announcement.id}
                  className="group overflow-hidden border-0 shadow-elegant hover:shadow-elegant-lg transition-all duration-700 animate-fade-in hover-scale bg-card/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={
                        announcement.gallery?.[0]?.imagePath
                          ? getFileUrl(announcement.gallery[0].imagePath)
                          : "/placeholder.svg"
                      }
                      alt={getTitle(announcement)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-4 right-4">
                      <div className="bg-background/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                        <div className="flex items-center text-sm font-medium text-foreground">
                          <Calendar className="h-3 w-3 mr-2" />
                          {formatDate(announcement.publishDate)}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-background/90 backdrop-blur-md rounded-lg p-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {getDescription(announcement)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                      {getTitle(announcement)}
                    </h3>

                    <Link
                      to={`/announcements/${announcement.id}`}
                      className="block">
                      <Button className="w-full bg-gradient-primary hover:shadow-brand transition-all duration-500 text-lg py-6 story-link group/button">
                        <span className="flex items-center justify-center">
                          {tString("common.readMore")}
                          {language === "ar" ? (
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
          )}
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
                  {tString("announcementsPage.cta.title")}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                  {tString("announcementsPage.cta.subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder={tString("common.enterYourEmail")}
                    className="flex-1 px-6 py-4 rounded-xl text-foreground bg-background/95 backdrop-blur-md border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg"
                  />
                  <Button className="bg-background text-primary hover:bg-background/90 px-8 py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                    {tString("common.subscribe")}
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
