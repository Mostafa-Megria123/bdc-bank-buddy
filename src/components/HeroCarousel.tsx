import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import heroBuilding from '@/assets/hero-building.jpg';

interface HeroSlide {
  id: string;
  backgroundImage: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

interface HeroCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: '1',
      backgroundImage: heroBuilding,
      title: language === 'ar' ? 'مرحباً بكم في BDC' : 'Welcome to BDC',
      subtitle: language === 'ar' 
        ? 'شريككم الموثوق في التطوير العقاري' 
        : 'Your trusted partner in real estate development',
      primaryButtonText: language === 'ar' ? 'استكشف مشاريعنا' : 'Explore Our Projects',
      secondaryButtonText: language === 'ar' ? 'تعرف علينا أكثر' : 'Learn More About Us'
    },
    {
      id: '2',
      backgroundImage: heroBuilding,
      title: language === 'ar' ? 'مشاريع استثنائية' : 'Exceptional Projects',
      subtitle: language === 'ar' 
        ? 'نبني أحلامكم بجودة وإتقان لا مثيل لهما' 
        : 'Building your dreams with unmatched quality and precision',
      primaryButtonText: language === 'ar' ? 'شاهد مشاريعنا' : 'View Our Projects',
      secondaryButtonText: language === 'ar' ? 'تواصل معنا' : 'Contact Us'
    },
    {
      id: '3',
      backgroundImage: heroBuilding,
      title: language === 'ar' ? 'استثمار آمن' : 'Secure Investment',
      subtitle: language === 'ar' 
        ? 'فرص استثمارية مربحة مع ضمان الجودة والتميز' 
        : 'Profitable investment opportunities with guaranteed quality and excellence',
      primaryButtonText: language === 'ar' ? 'اطلع على العروض' : 'View Offers',
      secondaryButtonText: language === 'ar' ? 'احجز موعد' : 'Book Appointment'
    }
  ];

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentSlideData.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-overlay" />
      
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
          key={`title-${currentSlide}`}
          className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in"
        >
          {currentSlideData.title}
        </h1>
        <p 
          key={`subtitle-${currentSlide}`}
          className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          {currentSlideData.subtitle}
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <Button 
            size="lg" 
            className="bg-white text-bdc-orange hover:bg-white/90 shadow-brand text-lg px-8 py-4 group"
          >
            {currentSlideData.primaryButtonText}
            {language === 'ar' ? (
              <ArrowLeft className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-bdc-orange text-lg px-8 py-4 backdrop-blur-sm"
          >
            {currentSlideData.secondaryButtonText}
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{ 
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              animation: `progressBar ${autoPlayInterval}ms linear infinite`
            }}
          />
        </div>
      )}
    </section>
  );
};