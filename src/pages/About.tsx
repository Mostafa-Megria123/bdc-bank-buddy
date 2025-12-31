import React from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import FeaturesSection from "@/components/FeaturesSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import ValuesSection from "@/components/ValuesSection";
import AboutSection from "@/components/AboutSection";
import ContactInfoSection from "@/components/ContactInfoSection";

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* About Content */}
      <VisionMissionSection />

      {/* Values Section */}
      <ValuesSection />

      {/* Contact Section */}
      <ContactInfoSection />

      {/* Terms & Conditions */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="animate-fade-in">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {language === "ar"
                    ? "باستخدام هذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا."
                    : "By using this website, you agree to comply with these terms and conditions. Please read them carefully before using our services."}
                </p>
                <p>
                  {language === "ar"
                    ? "جميع المعلومات المعروضة على هذا الموقع هي لأغراض إعلامية فقط وقد تتغير دون إشعار مسبق."
                    : "All information displayed on this website is for informational purposes only and may change without prior notice."}
                </p>
                <p>
                  {language === "ar"
                    ? "بنك القاهرة للتنمية والائتمان العقاري يحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت."
                    : "BDC reserves the right to modify these terms and conditions at any time."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
