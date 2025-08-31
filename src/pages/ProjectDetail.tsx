import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Home, Download, Phone, Mail, Users, Building } from 'lucide-react';
import project1 from '@/assets/project-1.jpg';
import heroBuilding from '@/assets/hero-building.jpg';

const ProjectDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();

  // Mock project data based on ID
  const getProjectData = (projectId: string) => {
    const projectsData = {
      '1': {
        id: '1',
        name: language === 'ar' ? 'مشروع النخيل الذهبي' : 'Golden Palm Project',
        type: language === 'ar' ? 'سكني' : 'Residential',
        description: language === 'ar'
          ? 'مجمع سكني فاخر يضم شقق ودوبلكس وفيلات مع مساحات خضراء واسعة ومرافق متكاملة تلبي جميع احتياجات العائلة العصرية.'
          : 'Luxury residential complex featuring apartments, duplexes and villas with vast green spaces and integrated facilities that meet all modern family needs.',
        longDescription: language === 'ar'
          ? 'يقع مشروع النخيل الذهبي في قلب القاهرة الجديدة على مساحة 50 فدان، ويضم 250 وحدة سكنية متنوعة تتراوح بين الشقق والدوبلكس والفيلات. يتميز المشروع بتصميمه المعماري الفريد والمساحات الخضراء الواسعة والمرافق المتكاملة التي تشمل نادي صحي، مسابح، ملاعب رياضية، ومنطقة تجارية.'
          : 'Golden Palm Project is located in the heart of New Cairo on 50 acres, featuring 250 diverse residential units ranging from apartments to duplexes and villas. The project stands out with its unique architectural design, vast green spaces, and integrated facilities including a health club, swimming pools, sports courts, and commercial area.',
        images: [project1, heroBuilding, project1],
        displayStartDate: '2024-01-15',
        displayEndDate: '2024-12-31',
        unitsAvailable: 250,
        totalUnits: 300,
        location: language === 'ar' ? 'القاهرة الجديدة - التجمع الأول' : 'New Cairo - First Settlement',
        area: '50 فدان / 50 Acres',
        priceRange: language === 'ar' ? '1.5 - 4.2 مليون جنيه' : '1.5 - 4.2 Million EGP',
        features: language === 'ar' 
          ? ['مساحات خضراء واسعة', 'نادي صحي متكامل', 'مسابح متعددة', 'ملاعب رياضية', 'منطقة تجارية', 'أمن وحراسة 24/7', 'مواقف سيارات', 'حدائق أطفال']
          : ['Vast Green Spaces', 'Complete Health Club', 'Multiple Swimming Pools', 'Sports Courts', 'Commercial Area', '24/7 Security', 'Parking Spaces', 'Children\'s Playgrounds'],
        unitTypes: language === 'ar'
          ? [
              { type: 'شقق', area: '100-180 م²', price: '1.5-2.8 مليون جنيه' },
              { type: 'دوبلكس', area: '200-280 م²', price: '2.5-3.8 مليون جنيه' },
              { type: 'فيلات', area: '300-450 م²', price: '3.5-4.2 مليون جنيه' }
            ]
          : [
              { type: 'Apartments', area: '100-180 sqm', price: '1.5-2.8M EGP' },
              { type: 'Duplexes', area: '200-280 sqm', price: '2.5-3.8M EGP' },
              { type: 'Villas', area: '300-450 sqm', price: '3.5-4.2M EGP' }
            ]
      },
      '2': {
        id: '2',
        name: language === 'ar' ? 'كمبوند الواحة' : 'Oasis Compound',
        type: language === 'ar' ? 'سكني وتجاري' : 'Residential & Commercial',
        description: language === 'ar'
          ? 'مشروع متكامل يجمع بين السكن والتسوق والترفيه في موقع استراتيجي متميز.'
          : 'Integrated project combining residential, shopping and entertainment in a strategic location.',
        longDescription: language === 'ar'
          ? 'كمبوند الواحة هو مشروع متكامل يقع في منطقة التجمع الخامس على مساحة 35 فدان. يضم المشروع وحدات سكنية متنوعة بالإضافة إلى مول تجاري ومنطقة ترفيهية ومرافق خدمية متكاملة تجعله وجهة مثالية للعيش والاستثمار.'
          : 'Oasis Compound is an integrated project located in the Fifth Settlement on 35 acres. The project includes diverse residential units plus a commercial mall, entertainment area, and integrated service facilities making it an ideal destination for living and investment.',
        images: [project1, heroBuilding, project1],
        displayStartDate: '2024-02-01',
        displayEndDate: '2024-11-30',
        unitsAvailable: 180,
        totalUnits: 220,
        location: language === 'ar' ? 'القاهرة الجديدة - التجمع الخامس' : 'New Cairo - Fifth Settlement',
        area: '35 فدان / 35 Acres',
        priceRange: language === 'ar' ? '1.8 - 5.5 مليون جنيه' : '1.8 - 5.5 Million EGP',
        features: language === 'ar'
          ? ['مول تجاري متكامل', 'منطقة ترفيهية', 'حدائق مناظر طبيعية', 'مركز طبي', 'مدرسة دولية', 'نادي اجتماعي', 'مراكز خدمية', 'بحيرات صناعية']
          : ['Integrated Shopping Mall', 'Entertainment Zone', 'Landscaped Gardens', 'Medical Center', 'International School', 'Social Club', 'Service Centers', 'Artificial Lakes'],
        unitTypes: language === 'ar'
          ? [
              { type: 'شقق', area: '120-200 م²', price: '1.8-3.2 مليون جنيه' },
              { type: 'بنتهاوس', area: '250-350 م²', price: '3.8-5.5 مليون جنيه' },
              { type: 'محلات تجارية', area: '50-150 م²', price: '1.2-2.8 مليون جنيه' }
            ]
          : [
              { type: 'Apartments', area: '120-200 sqm', price: '1.8-3.2M EGP' },
              { type: 'Penthouses', area: '250-350 sqm', price: '3.8-5.5M EGP' },
              { type: 'Commercial Units', area: '50-150 sqm', price: '1.2-2.8M EGP' }
            ]
      }
    };

    return projectsData[projectId as keyof typeof projectsData] || projectsData['1'];
  };

  const project = getProjectData(id || '1');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${project.images[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <Badge className="mb-4 bg-gradient-primary text-white">
              {project.type}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.name}</h1>
            <p className="text-xl max-w-2xl mx-auto">{project.description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'ar' ? 'وصف المشروع' : 'Project Description'}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'ar' ? 'المميزات والمرافق' : 'Features & Amenities'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Unit Types */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'ar' ? 'أنواع الوحدات' : 'Unit Types'}
                </h2>
                <div className="space-y-4">
                  {project.unitTypes.map((unit, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-foreground">{unit.type}</h3>
                          <p className="text-sm text-muted-foreground">{unit.area}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{unit.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'ar' ? 'معرض الصور' : 'Gallery'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg group">
                      <img
                        src={image}
                        alt={`${project.name} ${index + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {language === 'ar' ? 'معلومات سريعة' : 'Quick Info'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{language === 'ar' ? 'الموقع' : 'Location'}</p>
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Building className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{language === 'ar' ? 'المساحة' : 'Area'}</p>
                      <p className="text-sm text-muted-foreground">{project.area}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Home className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{language === 'ar' ? 'الوحدات المتاحة' : 'Available Units'}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.unitsAvailable} {language === 'ar' ? 'من أصل' : 'of'} {project.totalUnits}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{language === 'ar' ? 'فترة العرض' : 'Display Period'}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.displayStartDate} - {project.displayEndDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{language === 'ar' ? 'نطاق الأسعار' : 'Price Range'}</p>
                      <p className="text-sm text-muted-foreground">{project.priceRange}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    <Phone className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'اتصل بنا' : 'Call Us'}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'تحميل الكتيب' : 'Download Brochure'}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'طلب معلومات' : 'Request Info'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;