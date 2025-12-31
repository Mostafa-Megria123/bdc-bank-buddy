import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { AboutService } from "@/services/about.service";
import { About as AboutData } from "@/types/about";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Phone, Mail, MapPin } from "lucide-react";
import FeaturesSection from "@/components/FeaturesSection";
import VisionMissionSection from "@/components/VisionMissionSection";

const About = () => {
  const { language } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-destructive">
        {error}
      </div>
    );
  }

  const contactInfo = [
    {
      icon: Phone,
      title: language === "ar" ? "الخط الساخن" : "Hotline",
      value: "19033",
      description: language === "ar" ? "متاح 24/7" : "Available 24/7",
    },
    {
      icon: Phone,
      title:
        language === "ar"
          ? "قسم المنفذ والوصي"
          : "Executor and Trustee Department",
      value: "+20 2 1234 5678",
      description:
        language === "ar" ? "خلال ساعات العمل" : "During business hours",
    },
    {
      icon: Mail,
      title: language === "ar" ? "البريد الإلكتروني" : "Email",
      value: "info@bdc.com.eg",
      description:
        language === "ar" ? "نرد خلال 24 ساعة" : "We respond within 24 hours",
    },
    {
      icon: MapPin,
      title: language === "ar" ? "العنوان الرئيسي" : "Main Address",
      value: language === "ar" ? "القاهرة، مصر" : "Cairo, Egypt",
      description: language === "ar" ? "المقر الرئيسي" : "Headquarters",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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

      {/* Features Section */}
      <FeaturesSection />

      {/* About Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <VisionMissionSection />
            <div className="animate-fade-in">
              <Card className="bg-gradient-primary text-white p-8">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4">
                    {language === "ar" ? "قيمنا" : "Our Values"}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      {language === "ar"
                        ? "الشفافية والصدق"
                        : "Transparency and Honesty"}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      {language === "ar"
                        ? "الجودة والتميز"
                        : "Quality and Excellence"}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      {language === "ar"
                        ? "الابتكار والتطوير"
                        : "Innovation and Development"}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      {language === "ar"
                        ? "خدمة العملاء المتميزة"
                        : "Exceptional Customer Service"}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === "ar" ? "تواصل معنا" : "Contact Us"}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <Card
                  key={contact.title}
                  className="text-center p-6 hover:shadow-brand transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {contact.title}
                    </h3>
                    <p className="text-primary font-medium mb-1">
                      {contact.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

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
