import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ArrowRight, ArrowLeft, Calendar, Home, Download } from "lucide-react";
import { getFileUrl, formatDate } from "@/lib/utils";
import { AnnouncementService } from "@/services/announcement-service";
import { Announcement } from "@/types/announcement";
import { ProjectService } from "@/services/project-service";
import { Project } from "@/types/project";
import { AboutService } from "@/services/about.service";
import { About } from "@/types/about";
import bdcAbout from "@/assets/about-us-corporate.png";

const Index = () => {
  const { language, t, tString } = useLanguage();
  const [latestAnnouncements, setLatestAnnouncements] = useState<
    Announcement[]
  >([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [aboutData, setAboutData] = useState<About | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsData, projectsData, aboutList] = await Promise.all([
          AnnouncementService.getLatest(3),
          ProjectService.getFeaturedProjects(),
          AboutService.getAll(),
        ]);
        setLatestAnnouncements(announcementsData);
        setFeaturedProjects(projectsData);
        if (aboutList && aboutList.length > 0) {
          setAboutData(aboutList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <HeroCarousel autoPlay={true} autoPlayInterval={6000} />

      {/* About Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-elegant bg-card/80 backdrop-blur-sm relative z-10 shadow-xl bg-background/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-8 md:p-12 lg:p-16 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {aboutData
                    ? language === "ar"
                      ? aboutData.titleAr
                      : aboutData.titleEn
                    : tString("home.about.title")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed line-clamp-6">
                  {aboutData
                    ? language === "ar"
                      ? aboutData.descriptionAr
                      : aboutData.descriptionEn
                    : tString("home.about.subtitle")}
                </p>
                <Link to="/about">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:shadow-brand transition-all duration-500 text-lg py-6 group/button">
                    <span className="flex items-center justify-center">
                      {tString("home.about.button")}
                      {language === "ar" ? (
                        <ArrowLeft className="mr-3 h-5 w-5 group-hover/button:-translate-x-1 transition-transform duration-300" />
                      ) : (
                        <ArrowRight className="ml-3 h-5 w-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                      )}
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                <img
                  src={bdcAbout}
                  alt={tString("home.about.title")}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent md:bg-gradient-to-l" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {tString("announcementsPage.sectionTitle")}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {latestAnnouncements.map((a, index) => (
                <Card
                  key={a.id}
                  className="overflow-hidden hover:shadow-brand transition-all duration-500 group animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={
                        a.gallery?.[0]?.imagePath
                          ? getFileUrl(a.gallery[0].imagePath)
                          : "/placeholder.svg"
                      }
                      alt={language === "ar" ? a.titleAr : a.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-[#6d6f74] mb-2 line-clamp-2">
                      {language === "ar" ? a.titleAr : a.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {language === "ar" ? a.descriptionAr : a.descriptionEn}
                    </p>
                    <Link
                      to={`/announcements/${a.id}`}
                      className="w-full block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-gradient-primary group-hover:text-white group-hover:border-transparent transition-all duration-300">
                        {tString("common.viewDetails")}
                        {language === "ar" ? (
                          <ArrowLeft className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </Link>
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
              {tString("projects.sectionTitle")}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => {
              const name = language === "ar" ? project.nameAr : project.nameEn;
              const description =
                language === "ar"
                  ? project.descriptionAr
                  : project.descriptionEn;
              const image = project.projectGallery?.[0]?.imagePath
                ? getFileUrl(project.projectGallery[0].imagePath)
                : "/placeholder.svg";

              return (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-brand transition-all duration-500 group animate-fade-in hover:scale-[1.02] hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative overflow-hidden">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {language === "ar"
                          ? project.projectStatus.statusAr
                          : project.projectStatus.statusEn}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {name}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          {tString("projects.display.dateRange")
                            .replace("{start}", formatDate(project.startDate))
                            .replace("{end}", formatDate(project.endDate))}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          {tString("projects.display.unitsAvailable").replace(
                            "{count}",
                            project.totalUnits.toString()
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to={`/projects/${project.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-primary hover:opacity-90">
                          {tString("common.viewDetails")}
                          {language === "ar" ? (
                            <ArrowLeft className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </Link>

                      <Button variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        {tString("common.termsAndConditions")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
