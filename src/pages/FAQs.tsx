import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQs = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: '1',
      question: language === 'ar' 
        ? 'كيف يمكنني حجز وحدة عقارية؟'
        : 'How can I reserve a real estate unit?',
      answer: language === 'ar'
        ? 'يمكنك حجز وحدة عقارية من خلال تصفح المشاريع المتاحة على الموقع، اختيار الوحدة المناسبة، والضغط على زر "حجز". ستحتاج إلى تسجيل الدخول أولاً وإدخال بيانات الدفع خلال 24 ساعة.'
        : 'You can reserve a real estate unit by browsing available projects on the website, selecting the suitable unit, and clicking the "Reserve" button. You will need to log in first and enter payment data within 24 hours.',
      order: 1
    },
    {
      id: '2',
      question: language === 'ar'
        ? 'ما هي المستندات المطلوبة للتسجيل؟'
        : 'What documents are required for registration?',
      answer: language === 'ar'
        ? 'المستندات المطلوبة تشمل: صورة الرقم القومي (الوجهين)، الرقم المطبوع تحت الصورة، رقم المحمول، والبريد الإلكتروني. جميع هذه البيانات مطلوبة لإنشاء الحساب.'
        : 'Required documents include: National ID image (both sides), printed number below the photo, mobile number, and email address. All this data is required to create an account.',
      order: 2
    },
    {
      id: '3',
      question: language === 'ar'
        ? 'كم من الوقت لديّ لدفع العربون؟'
        : 'How much time do I have to pay the deposit?',
      answer: language === 'ar'
        ? 'لديك 24 ساعة من وقت الحجز لدفع العربون في أحد فروع بنك القاهرة للتنمية والائتمان العقاري. بعد انتهاء هذه المدة، سيتم إلغاء الحجز تلقائياً.'
        : 'You have 24 hours from the reservation time to pay the deposit at one of BDC branches. After this period expires, the reservation will be automatically cancelled.',
      order: 3
    },
    {
      id: '4',
      question: language === 'ar'
        ? 'هل يمكنني تعديل بيانات الدفع؟'
        : 'Can I modify payment data?',
      answer: language === 'ar'
        ? 'يمكنك تعديل بيانات الدفع في حالة طلب الإدارة لذلك فقط. ستجد زر "تعديل بيانات الدفع" في صفحة طلبات الحجز الخاصة بك عند الحاجة.'
        : 'You can modify payment data only when requested by management. You will find the "Edit Payment Data" button on your reservation requests page when needed.',
      order: 4
    },
    {
      id: '5',
      question: language === 'ar'
        ? 'ماذا يحدث إذا تم رفض طلب الحجز؟'
        : 'What happens if the reservation request is rejected?',
      answer: language === 'ar'
        ? 'في حالة رفض طلب الحجز، يمكنك طلب استرداد العربون من خلال الضغط على زر "طلب استرداد الدفعة" في صفحة طلبات الحجز.'
        : 'If the reservation request is rejected, you can request a deposit refund by clicking the "Request Payment Refund" button on your reservation requests page.',
      order: 5
    },
    {
      id: '6',
      question: language === 'ar'
        ? 'كيف يمكنني البحث عن وحدات بمواصفات محددة؟'
        : 'How can I search for units with specific specifications?',
      answer: language === 'ar'
        ? 'يمكنك استخدام معايير البحث في صفحة تفاصيل المشروع للبحث حسب المحافظة، المدينة، المنطقة، مساحة الوحدة، والسعر للعثور على الوحدة المناسبة لك.'
        : 'You can use search criteria on the project details page to search by governorate, city, area, unit area, and price to find the unit that suits you.',
      order: 6
    },
    {
      id: '7',
      question: language === 'ar'
        ? 'هل يمكنني تغيير لغة الإشعارات؟'
        : 'Can I change the notification language?',
      answer: language === 'ar'
        ? 'يتم اختيار لغة الإشعارات عند التسجيل ولا يمكن تغييرها لاحقاً. إذا كنت تريد تغييرها، يرجى التواصل مع خدمة العملاء.'
        : 'Notification language is selected during registration and cannot be changed later. If you want to change it, please contact customer service.',
      order: 7
    },
    {
      id: '8',
      question: language === 'ar'
        ? 'كيف يمكنني استعادة كلمة المرور؟'
        : 'How can I recover my password?',
      answer: language === 'ar'
        ? 'يمكنك استعادة كلمة المرور من خلال صفحة "نسيت كلمة المرور" وإدخال الرقم القومي ورقم المحمول والبريد الإلكتروني المسجلين.'
        : 'You can recover your password through the "Forgot Password" page by entering your registered National ID, mobile number, and email address.',
      order: 8
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            {language === 'ar' 
              ? 'إجابات على أكثر الأسئلة شيوعاً حول خدماتنا العقارية'
              : 'Answers to the most common questions about our real estate services'
            }
          </p>
          
          {/* Search Box */}
          <div className="relative max-w-md mx-auto animate-fade-in">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'ar' ? 'ابحث في الأسئلة...' : 'Search questions...'}
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
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
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
                    {language === 'ar' 
                      ? 'لم يتم العثور على أسئلة تطابق البحث'
                      : 'No questions found matching your search'
                    }
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
                {language === 'ar' ? 'لم تجد إجابة لسؤالك؟' : "Didn't find an answer to your question?"}
              </h2>
              <p className="text-white/90 mb-6">
                {language === 'ar'
                  ? 'فريق خدمة العملاء لدينا متاح لمساعدتك في أي استفسارات إضافية'
                  : 'Our customer service team is available to help you with any additional inquiries'
                }
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">
                    {language === 'ar' ? 'الخط الساخن' : 'Hotline'}
                  </p>
                  <p className="text-xl font-bold">19033</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
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
};

export default FAQs;