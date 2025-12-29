import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/useLanguage";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import heroBuilding from "@/assets/hero-building.jpg";
import project1 from "@/assets/project-1.jpg";
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ProjectService.getFeaturedProjects();
        console.log("Featured projects fetched:", data);
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
      }
    | {
        type: "announcement";
        id: string;
        image: string;
        title: string;
        subtitle?: string;
      }
    | {
        type: "project";
        id: string;
        image: string;
        name: string;
        description: string;
        link: string;
      };

  // Hero slide
  const heroSlide: Slide = {
    type: "hero",
    id: "hero",
    image: heroBuilding,
    title: tString("hero.welcomeTitle"),
    subtitle: tString("hero.welcomeSubtitle"),
  };

  // Project slides from service data
  const projectSlides: Slide[] = featuredProjects.map((p) => {
    const imageUrl =
      p.projectGallery &&
      p.projectGallery.length > 0 &&
      p.projectGallery[0].imagePath
        ? getFileUrl(p.projectGallery[0].imagePath)
        : project1;
    
    console.log(`Project ${p.id} image URL:`, imageUrl);
    
    return {
      type: "project",
      id: p.id,
      image: imageUrl,
      name: language === "ar" ? p.nameAr : p.nameEn,
      description: language === "ar" ? p.descriptionAr : p.descriptionEn,
      link: `/projects/${p.id}`,
    };
  });

  // Slides: hero slide followed by project slides (announcement removed)
  const slides: Slide[] = [heroSlide, ...projectSlides];
  const backgroundImages = slides.map((s) => s.image);

  console.log("All carousel slides background images:", backgroundImages);

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
      (prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length
    );
  };

  return (
    <section className="relative h-[91vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url('${backgroundImages[currentSlide]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onError={(e) => {
          console.log("Background image failed to load:", backgroundImages[currentSlide]);
        }}
      />
      <div className="absolute inset-0 bg-gradient-overlay" />

      {/* Content: keep hero welcome static while slides rotate (hero is the first slide) */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Show welcome content only on the first slide */}
        {currentSlide === 0 && (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              {heroSlide.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
              {heroSlide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/projects" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-bdc-orange hover:bg-white/90 shadow-brand text-lg px-8 py-4 group">
                  {tString("hero.exploreProjects")}
                  {language === "ar" ? (
                    <ArrowLeft className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* If the current slide is a project, show its title/description below the welcome text */}
        {currentSlideObj && currentSlideObj.type === "project" && (
          <div className="mt-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {currentSlideObj.name}
            </h2>
            <p className="text-lg text-white/90 mb-6">
              {currentSlideObj.description}
            </p>
          </div>
        )}
      </div>

      {/* Project overlay when a project slide is active */}
      {currentSlideObj && currentSlideObj.type === "project" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-background/80 backdrop-blur-md rounded-lg px-4 py-3 w-auto max-w-md lg:left-auto lg:right-6 lg:translate-x-0 lg:w-auto lg:max-w-none">
          <div className="text-sm font-semibold text-[#6d6f74] line-clamp-1">
            {currentSlideObj.name}
          </div>
          <Link to={currentSlideObj.link}>
            <Button size="sm" className="whitespace-nowrap">
              {tString("hero.viewProjectButton") ||
                tString("common.viewDetails")}
              {language === "ar" ? (
                <ArrowLeft className="ml-2 h-4 w-4" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </Link>
        </div>
      )}

      {/* Carousel arrow controls (bottom-left, rectangular) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-30 flex items-center gap-3 lg:left-6 lg:translate-x-0 lg:bottom-6">
        <button
          aria-label={language === "ar" ? "السابق" : "Previous slide"}
          onClick={prevSlide}
          className="bg-white/90 hover:bg-white px-3 py-2 rounded-md shadow-md flex items-center"
          style={{ backdropFilter: "blur(6px)" }}>
          <ChevronLeft className="h-5 w-5 text-[#6d6f74]" />
          <span className="sr-only">
            {language === "ar" ? "السابق" : "Previous"}
          </span>
        </button>

        <button
          aria-label={language === "ar" ? "التالي" : "Next slide"}
          onClick={nextSlide}
          className="bg-white/90 hover:bg-white px-3 py-2 rounded-md shadow-md flex items-center"
          style={{ backdropFilter: "blur(6px)" }}>
          <ChevronRight className="h-5 w-5 text-[#6d6f74]" />
          <span className="sr-only">
            {language === "ar" ? "التالي" : "Next"}
          </span>
        </button>
      </div>

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{
              width: `${((currentSlide + 1) / backgroundImages.length) * 100}%`,
              animation: `progressBar ${autoPlayInterval}ms linear infinite`,
            }}
          />
        </div>
      )}
    </section>
  );
};
