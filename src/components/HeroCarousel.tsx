import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/useLanguage";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import heroBuilding from "@/assets/hero-building.jpg";
import placeholderSvg from "@/assets/placeholder.svg";
import { ProjectService } from "@/services/project-service";
import { Project } from "@/types/project";

interface HeroCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const { language, t, tString } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ProjectService.getFeaturedProjects();
        setFeaturedProjects(data);
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
      }
    };
    fetchProjects();
  }, []);

  type Slide =
    | {
        type: "hero";
        id: "hero";
        image: string;
        title: string;
        subtitle: string;
        projectStatus: string;
      }
    | {
        type: "announcement";
        id: string;
        image: string;
        title: string;
        subtitle?: string;
        projectStatus: string;
      }
    | {
        type: "project";
        id: string;
        image: string;
        name: string;
        description: string;
        link: string;
        projectStatus: string;
      };

  // Hero slide
  const heroSlide: Slide = {
    type: "hero",
    id: "hero",
    image: heroBuilding,
    title: tString("hero.welcomeTitle"),
    subtitle: tString("hero.welcomeSubtitle"),
    projectStatus: "",
  };

  // Project slides from service data
  const projectSlides: Slide[] = featuredProjects.map((p) => {
    const imageUrl =
      p.projectGallery &&
      p.projectGallery.length > 0 &&
      p.projectGallery[0].imagePath
        ? getFileUrl(p.projectGallery[0].imagePath)
        : placeholderSvg;

    return {
      type: "project",
      id: p.id,
      image: imageUrl,
      name: language === "ar" ? p.nameAr : p.nameEn,
      description: language === "ar" ? p.descriptionAr : p.descriptionEn,
      link: `/projects/${p.id}`,
      projectStatus:
        language === "ar" ? p.projectStatus.statusAr : p.projectStatus.statusEn,
    };
  });

  // Slides: hero slide followed by project slides (announcement removed)
  const slides: Slide[] = [heroSlide, ...projectSlides];
  const backgroundImages = slides.map((s) => s.image);

  const currentSlideObj = slides[currentSlide] ?? null;

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, backgroundImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length,
    );
  };

  // Function to validate and get the correct image URL
  const getBackgroundImage = (imageUrl: string) => {
    if (failedImages.has(imageUrl)) {
      return placeholderSvg;
    }
    return imageUrl;
  };

  // Function to handle image load errors
  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set([...prev, imageUrl]));
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out transform scale-105"
        style={{
          backgroundImage: `url('${getBackgroundImage(backgroundImages[currentSlide])}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Hidden image element to detect load errors */}
      <img
        key={backgroundImages[currentSlide]}
        src={backgroundImages[currentSlide]}
        alt="slide-validator"
        style={{ display: "none" }}
        onError={() => handleImageError(backgroundImages[currentSlide])}
      />
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content: keep hero welcome static while slides rotate (hero is the first slide) */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full pb-16">
        {/* Show welcome content only on the first slide */}
        {currentSlide === 0 && (
          <div className="animate-fade-in space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg leading-tight">
              {heroSlide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto font-light drop-shadow-md leading-relaxed">
              {heroSlide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/projects" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 border-0 text-lg px-10 py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105 group">
                  {tString("hero.exploreProjects")}
                  {language === "ar" ? (
                    <ArrowLeft className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* If the current slide is a project, show its title/description below the welcome text */}
        {currentSlideObj && currentSlideObj.type === "project" && (
          <div className="animate-fade-in space-y-6 max-w-4xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-2">
              {currentSlideObj.projectStatus}
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg leading-tight">
              {currentSlideObj.name}
            </h2>
            <p className="text-xl md:text-2xl text-gray-100 font-light drop-shadow-md leading-relaxed line-clamp-3">
              {currentSlideObj.description}
            </p>
          </div>
        )}
      </div>

      {/* Project overlay when a project slide is active */}
      {currentSlideObj && currentSlideObj.type === "project" && (
        <div className="absolute bottom-8 right-4 lg:right-12 z-20 hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl max-w-sm animate-fade-in">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold mb-1">
              {tString("common.viewDetails")}
            </p>
            <h3 className="text-lg font-bold text-white truncate">
              {currentSlideObj.name}
            </h3>
          </div>
          <Link to={currentSlideObj.link}>
            <Button
              size="icon"
              className="rounded-full bg-white text-primary hover:bg-gray-100 h-12 w-12 shadow-lg">
              {language === "ar" ? (
                <ArrowLeft className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </Link>
        </div>
      )}

      {/* Carousel arrow controls (bottom-left, rectangular) */}
      <div className="absolute bottom-8 left-4 lg:left-12 z-30 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            aria-label={language === "ar" ? "السابق" : "Previous slide"}
            onClick={prevSlide}
            className="group bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">
              {language === "ar" ? "السابق" : "Previous"}
            </span>
          </button>

          <button
            aria-label={language === "ar" ? "التالي" : "Next slide"}
            onClick={nextSlide}
            className="group bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">
              {language === "ar" ? "التالي" : "Next"}
            </span>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-2 ml-4">
          {backgroundImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <div
            className="h-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{
              width: `${((currentSlide + 1) / backgroundImages.length) * 100}%`,
              transition: "width 0.5s ease-out",
            }}>
            <div
              className="h-full w-full bg-white/30"
              style={{
                animation: `progressBar ${autoPlayInterval}ms linear infinite`,
                transformOrigin: "left",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};
