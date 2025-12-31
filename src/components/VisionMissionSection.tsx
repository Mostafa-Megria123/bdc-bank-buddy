import React, { useEffect, useState } from "react";
import { VisionAndMission } from "@/types/visionAndMission";
import { VisionMissionService } from "@/services/visionMission.service";
import { useLanguage } from "@/contexts/useLanguage";
import { Loader2, Eye, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const VisionMissionSection = () => {
  const [data, setData] = useState<VisionAndMission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await VisionMissionService.getAll();
        // The backend returns an array, we display the first item
        if (result && result.length > 0) {
          setData(result[0]);
        }
      } catch (error) {
        console.error("Error loading Vision & Mission:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ar" ? "رؤيتنا ورسالتنا" : "Our Vision and Mission"}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-brand transition-all duration-300 group animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {language === "ar" ? "الرؤية" : "Vision"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === "ar" ? data.visionAr : data.visionEn}
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-brand transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {language === "ar" ? "الرسالة" : "Mission"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === "ar" ? data.missionAr : data.missionEn}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
