import React, { useEffect, useState } from "react";
import { Feature } from "@/types/feature";
import { FeatureService } from "@/services/feature.service";
import { useLanguage } from "@/contexts/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Helper component to render icon from string name
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    // Fallback icon if name not found
    return <LucideIcons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
};

const FeaturesSection = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await FeatureService.getAll();
        // Sort by ID to ensure consistent display order
        const sortedData = data.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        setFeatures(sortedData);
      } catch (error) {
        console.error("Error loading features:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatures();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ar" ? "لماذا تختارنا؟" : "Why Choose Us?"}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              className="text-center p-8 hover:shadow-brand transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <DynamicIcon
                    name={feature.icon}
                    className="h-8 w-8 text-white"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {language === "ar" ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {language === "ar"
                    ? feature.descriptionAr
                    : feature.descriptionEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
