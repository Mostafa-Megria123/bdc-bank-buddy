import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Home,
  Download,
  Loader2,
  MapPin,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getFileUrl } from "@/lib/utils";
import { ProjectService } from "@/services/project-service";
import { Project } from "@/types/project";
import SectionTitle from "@/components/SectionTitle";
import placeholderSvg from "@/assets/placeholder.svg";

const Projects: React.FC = () => {
  const { language, tString } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Minimum loading delay (1.5 seconds) to allow all projects to load
        const [response] = await Promise.all([
          ProjectService.getAllProjects(),
          new Promise((resolve) => setTimeout(resolve, 0)),
        ]);
        setProjects(response.content);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              title={tString("projects.sectionTitle")}
              icon={Home}
            />

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {tString("projects.sectionSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const name = language === "ar" ? project.nameAr : project.nameEn;
              const description =
                language === "ar"
                  ? project.descriptionAr
                  : project.descriptionEn;
              const image = project.projectGallery?.[0]?.imagePath
                ? getFileUrl(project.projectGallery[0].imagePath)
                : placeholderSvg;

              return (
                <Card
                  key={project.id}
                  className="group overflow-hidden border-0 shadow-elegant hover:shadow-elegant-lg transition-all duration-700 animate-fade-in hover-scale bg-card/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.12}s` }}>
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      onError={(e) => (e.currentTarget.src = placeholderSvg)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-4 right-4">
                      <div className="bg-background/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                        <div className="flex items-center text-sm font-medium text-foreground">
                          <Tag className="h-3 w-3 mr-2" />
                          {language === "ar"
                            ? project.projectStatus.statusAr
                            : project.projectStatus.statusEn}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-background/90 backdrop-blur-md rounded-lg p-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                      {name}
                    </h3>

                    <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{project.location}</span>
                      </div>

                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{project.totalUnits} Units</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to={`/projects/${project.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-primary hover:shadow-brand transition-all duration-500 text-lg py-6 story-link group/button">
                          <span className="flex items-center justify-center">
                            {tString("common.viewDetails")}
                            {language === "ar" ? (
                              <ArrowLeft className="mr-3 h-5 w-5 group-hover/button:-translate-x-1 transition-transform duration-300" />
                            ) : (
                              <ArrowRight className="ml-3 h-5 w-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                            )}
                          </span>
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

      {/* CTA Section (reuse patterns from Announcements) */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 shadow-elegant animate-fade-in bg-gradient-primary text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-10" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <CardContent className="p-12 md:p-16 relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {tString("projects.cta.title")}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                {tString("projects.cta.subtitle")}
              </p>
              <div className="flex gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder={tString("common.enterYourEmail")}
                  className="flex-1 px-6 py-4 rounded-xl text-foreground bg-background/95 backdrop-blur-md border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-lg"
                />
                <Button className="bg-background text-primary hover:bg-background/90 px-8 py-4 my-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                  {tString("common.subscribe")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Projects;
