import React, { useEffect, useState } from "react";
import { PrivacyPolicy } from "@/types/privacyPolicy";
import { PrivacyPolicyService } from "@/services/privacyPolicy.service";
import { Loader2, Ruler } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/useLanguage";
import SectionTitle from "@/components/SectionTitle";

export const PrivacySection = () => {
  const [privacy, setPrivacy] = useState<PrivacyPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadPrivacy = async () => {
      try {
        const data = await PrivacyPolicyService.getAll();
        // The backend returns an array, we display the first one
        if (data && data.length > 0) {
          setPrivacy(data[0]);
        }
      } catch (error) {
        console.error("Error loading privacy policy:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrivacy();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!privacy) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
          </h2> */}

          <SectionTitle
            title={language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
            icon={Ruler}
          />
        </div>

        <Card
          className="border-none shadow-elevated bg-card/80 backdrop-blur-sm animate-fade-in"
          style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {language === "en"
                ? privacy.privacyPolicyEn
                : privacy.privacyPolicyAr}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
