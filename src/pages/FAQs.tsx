import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, MessageCircleQuestion } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import FaqService, { Faq } from "@/services/faq.Service";
import { DisplayFaq } from "@/types/faq";
import SectionTitle from "@/components/SectionTitle";
import { ContactInfo } from "@/types/contactInfo";
import { ContactInfoService } from "@/services/contactInfo.service";

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

export default function FAQs() {
  const { language, tString } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState<DisplayFaq[]>([]);
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [faqData, contactData] = await Promise.all([
          FaqService.getAll(),
          ContactInfoService.getAll(),
        ]);

        if (!mounted) return;

        const mapped: DisplayFaq[] = faqData
          .slice()
          .sort((a: Faq, b: Faq) => a.displayOrder - b.displayOrder)
          .map((d: Faq) => ({
            id: d.id !== undefined ? String(d.id) : String(d.displayOrder),
            question: language === "ar" ? d.questionAr : d.questionEn,
            answer: language === "ar" ? d.answerAr : d.answerEn,
            order: d.displayOrder ?? 0,
          }));

        setFaqs(mapped);

        if (contactData) {
          setContactInfos(contactData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [language]);

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTitle
            title={tString("faqsPage.title")}
            icon={MessageCircleQuestion}
          />
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            {tString("faqsPage.subtitle")}
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto animate-fade-in">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={tString("faqsPage.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/80 border-primary/20 focus:border-primary transition-colors duration-300"
            />
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="animate-fade-in">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-border/50 rounded-lg px-6 hover:border-primary/30 transition-colors duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}>
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-2">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {tString("faqsPage.noResults")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-primary text-white animate-fade-in overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-10" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <CardContent className="p-12 relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                {tString("faqsPage.cta.title")}
              </h2>
              <p className="text-white/90 mb-10 text-lg max-w-2xl mx-auto">
                {tString("faqsPage.cta.subtitle")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactInfos.map((info, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="p-3 bg-white/20 rounded-full mb-4 shadow-lg">
                      <DynamicIcon
                        name={info.icon}
                        className="h-6 w-6 text-white"
                      />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg">
                      {language === "ar" ? info.titleAr : info.titleEn}
                    </h3>
                    <p className="text-white/90 font-medium dir-ltr">
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
