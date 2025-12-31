import React, { useEffect, useState } from "react";
import { Terms } from "@/types/terms";
import { TermsService } from "@/services/terms.service";
import { Loader2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/useLanguage";

interface TermsSectionProps {
  withIcon?: boolean;
}

export const TermsSection = ({ withIcon = false }: TermsSectionProps) => {
  const [terms, setTerms] = useState<Terms | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const data = await TermsService.getAll();
        // The backend returns an array, we display the first one
        if (data && data.length > 0) {
          setTerms(data[0]);
        }
      } catch (error) {
        console.error("Error loading terms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTerms();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!terms) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {withIcon ? (
          <SectionTitle
            title={
              language === "en" ? "Terms and Conditions" : "الشروط والأحكام"
            }
            icon={FileText}
          />
        ) : (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === "en" ? "Terms and Conditions" : "الشروط والأحكام"}
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
        )}

        <Card
          className="border-none shadow-elevated bg-card/80 backdrop-blur-sm animate-fade-in"
          style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {language === "en" ? terms.termsEn : terms.termsAr}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
