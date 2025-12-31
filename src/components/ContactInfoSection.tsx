import React, { useEffect, useState } from "react";
import { ContactInfo } from "@/types/contactInfo";
import { ContactInfoService } from "@/services/contactInfo.service";
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
    return <LucideIcons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
};

const ContactInfoSection = () => {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await ContactInfoService.getAll();
        if (data) {
          setContactInfos(data);
        }
      } catch (error) {
        console.error("Error loading contact info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (contactInfos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ar" ? "تواصل معنا" : "Contact Us"}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactInfos.map((info, index) => (
            <Card
              key={info.id || index}
              className="text-center p-6 hover:shadow-brand transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DynamicIcon
                    name={info.icon}
                    className="h-6 w-6 text-white"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "ar" ? info.titleAr : info.titleEn}
                </h3>
                <p className="text-primary font-medium mb-1">{info.value}</p>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? info.descriptionAr : info.descriptionEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoSection;
