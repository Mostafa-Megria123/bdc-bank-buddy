import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";
import { Phone, Mail, AArrowDown, AArrowUp, Type } from "lucide-react";
import * as LucideIcons from "lucide-react";
import bdcLogo from "@/assets/bdc_logo_transparent.png";
import { ContactInfo } from "@/types/contactInfo";
import { ContactInfoService } from "@/services/contactInfo.service";
import { AboutService } from "@/services/about.service";
import { About } from "@/types/about";

// Helper component to render icon from string name
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = (
    LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
  )[name];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
};

export const Footer: React.FC = () => {
  const { tString, language } = useLanguage();
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [aboutData, setAboutData] = useState<About | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ContactInfoService.getAll();
        if (data) {
          setContactInfos(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }

      try {
        const aboutList = await AboutService.getAll();
        if (aboutList && aboutList.length > 0) {
          setAboutData(aboutList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch about info:", error);
      }
    };

    fetchData();
  }, []);

  const quickLinks = [
    { path: "/", label: tString("nav.home") },
    { path: "/announcements", label: tString("nav.announcements") },
    { path: "/projects", label: tString("nav.projects") },
    { path: "/faqs", label: tString("nav.faqs") },
    { path: "/about", label: tString("nav.about") },
  ];

  const adjustFontSize = (action: "increase" | "decrease" | "reset") => {
    const root = document.documentElement;
    const currentSize = parseFloat(window.getComputedStyle(root).fontSize);

    let newSize = currentSize;
    if (action === "increase") newSize = Math.min(currentSize + 1, 24);
    if (action === "decrease") newSize = Math.max(currentSize - 1, 12);
    if (action === "reset") newSize = 16;

    root.style.fontSize = `${newSize}px`;
  };

  return (
    <footer className="bg-bdc-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={bdcLogo} alt="BDC" className="h-8 w-auto" />
            </div>
            <p className="text-white/80 text-sm line-clamp-5">
              {aboutData
                ? language === "ar"
                  ? aboutData.descriptionAr
                  : aboutData.descriptionEn
                : tString("footer.tagline")}
            </p>
          </div>

          {/* Site Map */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {tString("footer.siteMap")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {tString("footer.contactUs")}
            </h3>
            <div className="space-y-3">
              {contactInfos.length > 0 ? (
                contactInfos.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 rtl:space-x-reverse">
                    <DynamicIcon
                      name={info.icon}
                      className="h-4 w-4 text-primary flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {language === "ar" ? info.titleAr : info.titleEn}
                      </p>
                      <p className="text-white/80 text-sm">{info.value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {tString("footer.hotline")}
                      </p>
                      <p className="text-white/80 text-sm">19977</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {tString("footer.executorDept")}
                      </p>
                      <p className="text-white/80 text-sm">+20 2 2770 8888</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-white/80 text-sm">
                        info@bdc-egypt.com
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Font Size */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/80 text-sm mb-3">
                {tString("footer.textSize")}
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => adjustFontSize("decrease")}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  aria-label="Decrease font size">
                  <AArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => adjustFontSize("reset")}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  aria-label="Reset font size">
                  <Type className="h-4 w-4" />
                </button>
                <button
                  onClick={() => adjustFontSize("increase")}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  aria-label="Increase font size">
                  <AArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {tString("footer.additionalInfoTitle")}
            </h3>
            <div className="space-y-2">
              <p className="text-white/80 text-sm">
                {tString("footer.workingHoursDays")}
              </p>
              <p className="text-white/80 text-sm">
                {tString("footer.workingHoursTime")}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-sm">
              {tString("footer.copyright")}
            </p>

            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link
                to="/privacy"
                className="text-white/80 hover:text-white transition-colors text-sm">
                {tString("footer.privacyPolicy")}
              </Link>
              <Link
                to="/terms"
                className="text-white/80 hover:text-white transition-colors text-sm">
                {tString("common.termsAndConditions")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
