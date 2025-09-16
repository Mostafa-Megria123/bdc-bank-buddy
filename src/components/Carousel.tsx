import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/useLanguage';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link?: string;
}

interface ResponsiveCarouselProps {
  items: CarouselItem[];
  className?: string;
  autoPlay?: boolean;
  /** When true show the bottom-right overlay and the inline outline button (used on home page only) */
  showOverlay?: boolean;
}

export const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({
  items,
  className = '',
  autoPlay = true,
  showOverlay = false,
}) => {
  const { language, t } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="md:basis-1/3 lg:basis-1/3" style={{ animationDelay: `${index * 120}ms` }}>
              <div className="p-1">
                <Card className="overflow-hidden hover:shadow-brand transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${index * 120}ms` }}>
                  <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-[#6d6f74] mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    {showOverlay && item.link && (
                      <Link to={String(item.link)} className="w-full block">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full group-hover:bg-gradient-primary group-hover:text-white group-hover:border-transparent transition-all duration-300"
                        >
                          {String(t('common.viewDetails'))}
                          {language === 'ar' ? (
                            <ArrowLeft className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden md:flex -left-4 bg-background shadow-soft hover:bg-gradient-primary hover:text-white" />
        <CarouselNext className="hidden md:flex -right-4 bg-background shadow-soft hover:bg-gradient-primary hover:text-white" />
      </Carousel>
      
      {/* Mobile Navigation Dots */}
      <div className="flex justify-center mt-4 md:hidden">
        <div className="flex space-x-2">
          {items.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-muted hover:bg-primary transition-colors cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
};