import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { AboutService } from "@/services/about.service";
import { About } from "@/types/about";
import { Loader2 } from "lucide-react";

const AboutSection = () => {
  const { language } = useLanguage();
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setIsLoading(true);
        const data = await AboutService.getAll();
        // The backend returns an array, we only display the first one
        if (data && data.length > 0) {
          const first = data[0];
          setAboutData(first);
        }
      } catch (error) {
        console.error("Error loading About:", error);
        setError("Failed to load about information");
      } finally {
        setIsLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
          {aboutData
            ? language === "ar"
              ? aboutData.titleAr
              : aboutData.titleEn
            : language === "ar"
            ? "عن بنك القاهرة للتنمية والائتمان العقاري"
            : "About BDC"}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in whitespace-pre-wrap">
          {aboutData
            ? language === "ar"
              ? aboutData.descriptionAr
              : aboutData.descriptionEn
            : ""}
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
