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
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CarouselItem {
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
}

export const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({
  items,
  className = '',
  autoPlay = true
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
          {items.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden hover:shadow-brand transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    {item.link && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full group-hover:bg-gradient-primary group-hover:text-white group-hover:border-transparent transition-all duration-300"
                      >
                        {t('viewDetails')}
                        {language === 'ar' ? (
                          <ArrowLeft className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
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