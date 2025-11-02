import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FaqService, { Faq } from "@/services/faq.Service";
import { DisplayFaq } from "@/types/faq";

export default function FAQs() {
  const { language, tString } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState<DisplayFaq[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFaqs = async () => {
      try {
        const data = await FaqService.getAll();
        if (!mounted) return;

        const mapped: DisplayFaq[] = data
          .slice()
          .sort((a: Faq, b: Faq) => a.order - b.order)
          .map((d: Faq) => ({
            id: d.id !== undefined ? String(d.id) : String(d.order),
            question: language === "ar" ? d.question_ar : d.question_en,
            answer: language === "ar" ? d.answer_ar : d.answer_en,
            order: d.order ?? 0,
          }));

        setFaqs(mapped);
      } catch (error) {
        console.error("Error loading FAQs:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadFaqs();

    return () => {
      mounted = false;
    };
  }, [language]);

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            {tString("faqsPage.title")}
          </h1>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-primary text-white animate-fade-in">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                {tString("faqsPage.cta.title")}
              </h2>
              <p className="text-white/90 mb-6">
                {tString("faqsPage.cta.subtitle")}
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">
                    {tString("common.hotline")}
                  </p>
                  <p className="text-xl font-bold">19033</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">
                    {tString("common.email")}
                  </p>
                  <p className="text-lg">info@bdc.com.eg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
