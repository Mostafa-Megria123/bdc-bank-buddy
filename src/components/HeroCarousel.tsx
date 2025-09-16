import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/useLanguage';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
const heroBuilding = '/assets/hero-building.jpg';
const announcement1 = '/assets/announcement-1.jpg';
const project1 = '/assets/project-1.jpg';

interface HeroCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  const { language, t, tString } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const backgroundImages = [
    heroBuilding,
    announcement1,
    project1
  ];

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
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${backgroundImages[currentSlide]})` }}
      />
      <div className="absolute inset-0 bg-gradient-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          {tString('hero.welcomeTitle')}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
          {tString('hero.welcomeSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button 
            size="lg" 
            className="bg-white text-bdc-orange hover:bg-white/90 shadow-brand text-lg px-8 py-4 group"
          >
            {tString('hero.exploreProjects')}
            {language === 'ar' ? (
              <ArrowLeft className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-[#6d6f74] hover:bg-white hover:text-bdc-orange text-lg px-8 py-4 backdrop-blur-sm bg-white/80"
          >
            {tString('hero.learnMore')}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{ 
              width: `${((currentSlide + 1) / backgroundImages.length) * 100}%`,
              animation: `progressBar ${autoPlayInterval}ms linear infinite`
            }}
          />
        </div>
      )}
    </section>
  );
};