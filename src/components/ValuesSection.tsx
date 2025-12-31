import React, { useEffect, useState } from "react";
import { Value } from "@/types/value";
import { ValueService } from "@/services/value.service";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";
import { Card, CardContent } from "@/components/ui/card";

export default function ValuesSection() {
  const [values, setValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadValues = async () => {
      try {
        const data = await ValueService.getAll();
        // Sort by ID to ensure consistent display order
        const sortedData = data.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        setValues(sortedData);
      } catch (error) {
        console.error("Error loading values:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadValues();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "en" ? "Our Values" : "قيمنا"}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <Card key={value.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-start p-6">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 shrink-0 ltr:mr-4 rtl:ml-4" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {language === "en" ? value.titleEn : value.titleAr}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
