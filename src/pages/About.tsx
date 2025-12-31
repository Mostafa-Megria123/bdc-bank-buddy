import React from "react";
import { useLanguage } from "@/contexts/useLanguage";
import FeaturesSection from "@/components/FeaturesSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import ValuesSection from "@/components/ValuesSection";
import AboutSection from "@/components/AboutSection";
import ContactInfoSection from "@/components/ContactInfoSection";
import TermsSection from "@/components/TermsSection";

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
      <TermsSection />
    </div>
  );
};

export default About;
