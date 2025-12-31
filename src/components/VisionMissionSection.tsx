import React, { useEffect, useState } from "react";
import { VisionAndMission } from "@/types/visionAndMission";
import { VisionMissionService } from "@/services/visionMission.service";
import { useLanguage } from "@/contexts/useLanguage";
import { Loader2 } from "lucide-react";

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
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ar" ? "رؤيتنا ورسالتنا" : "Our Vision and Mission"}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {language === "ar" ? "الرؤية" : "Vision"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === "ar" ? data.visionAr : data.visionEn}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {language === "ar" ? "الرسالة" : "Mission"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === "ar" ? data.missionAr : data.missionEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
