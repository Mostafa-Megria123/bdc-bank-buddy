import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReservationModal } from '@/components/ReservationModal';
import { ArrowLeft, Calendar, MapPin, Home, Download, Phone, Mail, Users, Building } from 'lucide-react';
const project1 = '/assets/project-1.jpg';
const heroBuilding = '/assets/hero-building.jpg';

type UnitStatus = 'available' | 'reserved' | 'sold';

interface Unit {
  id: string;
  type: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  status: UnitStatus;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = React.useState(false);

  const handleReserveUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsReservationModalOpen(true);
  };

  const closeReservationModal = () => {
    setIsReservationModalOpen(false);
    setSelectedUnit(null);
  };

  // Mock project data based on ID
  // Mock units data for each project
  const getUnitsData = (projectId: string): Unit[] => {
    const unitsData: Record<string, Unit[]> = {
      '1': [
        { id: 'A101', type: language === 'ar' ? 'شقة' : 'Apartment', area: '120 m²', bedrooms: 2, bathrooms: 2, price: '1,850,000', status: 'available' },
        { id: 'A102', type: language === 'ar' ? 'شقة' : 'Apartment', area: '140 m²', bedrooms: 3, bathrooms: 2, price: '2,100,000', status: 'reserved' },
        { id: 'A103', type: language === 'ar' ? 'شقة' : 'Apartment', area: '160 m²', bedrooms: 3, bathrooms: 3, price: '2,450,000', status: 'available' },
        { id: 'D201', type: language === 'ar' ? 'دوبلكس' : 'Duplex', area: '220 m²', bedrooms: 4, bathrooms: 3, price: '3,200,000', status: 'available' },
        { id: 'D202', type: language === 'ar' ? 'دوبلكس' : 'Duplex', area: '250 m²', bedrooms: 4, bathrooms: 4, price: '3,650,000', status: 'sold' },
        { id: 'V301', type: language === 'ar' ? 'فيلا' : 'Villa', area: '350 m²', bedrooms: 5, bathrooms: 4, price: '4,200,000', status: 'available' },
        { id: 'V302', type: language === 'ar' ? 'فيلا' : 'Villa', area: '380 m²', bedrooms: 5, bathrooms: 5, price: '4,500,000', status: 'reserved' },
        { id: 'A104', type: language === 'ar' ? 'شقة' : 'Apartment', area: '110 m²', bedrooms: 2, bathrooms: 1, price: '1,650,000', status: 'available' },
      ],
      '2': [
        { id: 'B101', type: language === 'ar' ? 'شقة' : 'Apartment', area: '130 m²', bedrooms: 2, bathrooms: 2, price: '2,200,000', status: 'available' },
        { id: 'B102', type: language === 'ar' ? 'شقة' : 'Apartment', area: '150 m²', bedrooms: 3, bathrooms: 2, price: '2,600,000', status: 'reserved' },
        { id: 'P201', type: language === 'ar' ? 'بنتهاوس' : 'Penthouse', area: '280 m²', bedrooms: 4, bathrooms: 3, price: '4,800,000', status: 'available' },
        { id: 'P202', type: language === 'ar' ? 'بنتهاوس' : 'Penthouse', area: '320 m²', bedrooms: 5, bathrooms: 4, price: '5,500,000', status: 'sold' },
        { id: 'C101', type: language === 'ar' ? 'محل تجاري' : 'Commercial', area: '80 m²', bedrooms: 0, bathrooms: 1, price: '1,800,000', status: 'available' },
        { id: 'C102', type: language === 'ar' ? 'محل تجاري' : 'Commercial', area: '120 m²', bedrooms: 0, bathrooms: 2, price: '2,400,000', status: 'reserved' },
      ]
      ,
      '3': [
        { id: 'S101', type: language === 'ar' ? 'شقة' : 'Apartment', area: '100 m²', bedrooms: 2, bathrooms: 2, price: '1,700,000', status: 'available' },
        { id: 'S102', type: language === 'ar' ? 'شقة' : 'Apartment', area: '130 m²', bedrooms: 3, bathrooms: 2, price: '2,000,000', status: 'reserved' },
        { id: 'S201', type: language === 'ar' ? 'دوبلكس' : 'Duplex', area: '210 m²', bedrooms: 4, bathrooms: 3, price: '3,100,000', status: 'available' },
        { id: 'S202', type: language === 'ar' ? 'دوبلكس' : 'Duplex', area: '240 m²', bedrooms: 4, bathrooms: 4, price: '3,500,000', status: 'sold' },
        { id: 'V401', type: language === 'ar' ? 'فيلا' : 'Villa', area: '360 m²', bedrooms: 5, bathrooms: 4, price: '4,300,000', status: 'available' }
      ]
    };
    
    return unitsData[projectId as keyof typeof unitsData] || unitsData['1'];
  };

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
      ,
      '3': {
        id: '3',
        name: language === 'ar' ? 'الإقامة الساحلية' : 'Seaside Residence',
        type: language === 'ar' ? 'سكني' : 'Residential',
        description: language === 'ar'
          ? 'مشروع سكني عصري يقع في منطقة ساحلية بتصميم أنيق ومرافق فاخرة.'
          : 'Modern seaside residential project with elegant design and premium amenities.',
        longDescription: language === 'ar'
          ? 'تقدم الإقامة الساحلية تجربة سكنية مميزة بالقرب من البحر مع شواطئ خاصة ومساحات خضراء ومرافق عائلية.'
          : 'Seaside Residence offers a unique living experience close to the sea with private beaches, green areas, and family-friendly amenities.',
        images: [project1, heroBuilding, project1],
        displayStartDate: '2024-03-01',
        displayEndDate: '2024-10-31',
        unitsAvailable: 120,
        totalUnits: 140,
        location: language === 'ar' ? 'الساحل الشمالي' : 'North Coast',
        area: '20 فدان / 20 Acres',
        priceRange: language === 'ar' ? '1.2 - 3.8 مليون جنيه' : '1.2 - 3.8 Million EGP',
        features: language === 'ar'
          ? ['شواطئ خاصة', 'مسبح بانورامي', 'مساحات خضراء', 'مركز ترفيهي', 'أمن وحراسة']
          : ['Private Beaches', 'Panoramic Pool', 'Green Areas', 'Recreation Center', 'Security'],
        unitTypes: language === 'ar'
          ? [
              { type: 'شقق', area: '80-140 م²', price: '1.2-2.5 مليون جنيه' },
              { type: 'بنتهاوس', area: '180-260 م²', price: '2.8-3.8 مليون جنيه' }
            ]
          : [
              { type: 'Apartments', area: '80-140 sqm', price: '1.2-2.5M EGP' },
              { type: 'Penthouses', area: '180-260 sqm', price: '2.8-3.8M EGP' }
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
          <Link to="/projects" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
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
                  {project.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Units */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'ar' ? 'الوحدات المتاحة' : 'Available Units'}
                </h2>
                
                {/* Units Grid */}
                <div className="space-y-4">
                  {getUnitsData(id || '1').map((unit) => (
                    <Card key={unit.id} className={`border-2 transition-all duration-300 hover:shadow-brand ${
                      unit.status === 'reserved' 
                        ? 'border-destructive/30 bg-destructive/5' 
                        : unit.status === 'sold'
                        ? 'border-muted bg-muted/20'
                        : 'border-primary/30 hover:border-primary/50 cursor-pointer'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Unit Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {language === 'ar' ? `وحدة رقم ${unit.id}` : `Unit #${unit.id}`}
                              </h3>
                              <Badge 
                                variant={unit.status === 'available' ? 'default' : unit.status === 'reserved' ? 'destructive' : 'secondary'}
                                className={unit.status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
                              >
                                {language === 'ar' 
                                  ? unit.status === 'available' ? 'متاح' : unit.status === 'reserved' ? 'محجوز' : 'مباع'
                                  : unit.status === 'available' ? 'Available' : unit.status === 'reserved' ? 'Reserved' : 'Sold'
                                }
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">{language === 'ar' ? 'النوع' : 'Type'}</p>
                                <p className="font-medium text-foreground">{unit.type}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">{language === 'ar' ? 'المساحة' : 'Area'}</p>
                                <p className="font-medium text-foreground">{unit.area}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">{language === 'ar' ? 'الغرف' : 'Bedrooms'}</p>
                                <p className="font-medium text-foreground">
                                  {unit.bedrooms} {language === 'ar' ? 'غرف' : 'BR'}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">{language === 'ar' ? 'الحمامات' : 'Bathrooms'}</p>
                                <p className="font-medium text-foreground">
                                  {unit.bathrooms} {language === 'ar' ? 'حمامات' : 'BA'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price and Action */}
                          <div className="flex flex-col md:items-end gap-3">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">{unit.price}</p>
                              <p className="text-sm text-muted-foreground">
                                {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                              </p>
                            </div>
                            
                            {unit.status === 'available' && (
                              <Button 
                                size="sm" 
                                className="bg-gradient-primary hover:opacity-90 whitespace-nowrap"
                                onClick={() => handleReserveUnit(unit)}
                              >
                                {language === 'ar' ? 'احجز الآن' : 'Reserve Now'}
                              </Button>
                            )}
                            
                            {unit.status === 'reserved' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                disabled
                                className="whitespace-nowrap"
                              >
                                {language === 'ar' ? 'محجوز' : 'Reserved'}
                              </Button>
                            )}
                            
                            {unit.status === 'sold' && (
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                disabled
                                className="whitespace-nowrap"
                              >
                                {language === 'ar' ? 'مباع' : 'Sold'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Units Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {getUnitsData(id || '1').filter(u => u.status === 'available').length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'متاح' : 'Available'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">
                      {getUnitsData(id || '1').filter(u => u.status === 'reserved').length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'محجوز' : 'Reserved'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">
                      {getUnitsData(id || '1').filter(u => u.status === 'sold').length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'مباع' : 'Sold'}
                    </p>
                  </div>
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
                    <div key={`${image}-${index}`} className="relative overflow-hidden rounded-lg group">
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

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
        unit={selectedUnit}
        projectName={project.name}
      />
    </div>
  );
};

export default ProjectDetail;