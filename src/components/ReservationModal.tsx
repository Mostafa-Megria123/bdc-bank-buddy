import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock, User, Phone, Mail, Calendar, Home, MapPin } from 'lucide-react';

interface Unit {
  id: string;
  type: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  status: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  projectName: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  unit,
  projectName
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Unit Details, 2: Personal Info, 3: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [reservationDetails, setReservationDetails] = useState({
    reservationDate: '',
    notes: ''
  });

  if (!unit) return null;

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleReservationDetailsChange = (field: string, value: string) => {
    setReservationDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 2) {
      return personalInfo.fullName && personalInfo.email && personalInfo.phone && personalInfo.nationalId;
    }
    if (currentStep === 3) {
      return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.cardholderName;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    } else {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
        variant: 'destructive'
      });
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock payment success
    toast({
      title: language === 'ar' ? 'تم الحجز بنجاح!' : 'Reservation Successful!',
      description: language === 'ar' 
        ? `تم حجز الوحدة ${unit.id} بنجاح. رقم الحجز: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        : `Unit ${unit.id} reserved successfully. Booking ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
    
    setIsProcessing(false);
    onClose();
    
    // Reset form
    setStep(1);
    setPersonalInfo({ fullName: '', email: '', phone: '', nationalId: '' });
    setPaymentInfo({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
    setReservationDetails({ reservationDate: '', notes: '' });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {language === 'ar' ? 'حجز الوحدة' : 'Unit Reservation'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unit Summary - Always Visible */}
          <div className="lg:col-span-1">
            <Card className="sticky top-0">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'ملخص الوحدة' : 'Unit Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="font-medium">{language === 'ar' ? 'رقم الوحدة:' : 'Unit ID:'}</span>
                    <span>{unit.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{language === 'ar' ? 'المشروع:' : 'Project:'}</span>
                    <span className="text-sm">{projectName}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>{language === 'ar' ? 'النوع:' : 'Type:'}</strong> {unit.type}</p>
                    <p><strong>{language === 'ar' ? 'المساحة:' : 'Area:'}</strong> {unit.area}</p>
                    <p><strong>{language === 'ar' ? 'الغرف:' : 'Bedrooms:'}</strong> {unit.bedrooms}</p>
                    <p><strong>{language === 'ar' ? 'الحمامات:' : 'Bathrooms:'}</strong> {unit.bathrooms}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{language === 'ar' ? 'سعر الوحدة:' : 'Unit Price:'}</span>
                    <span className="text-xl font-bold text-primary">{unit.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'رسوم الحجز:' : 'Reservation Fee:'}</span>
                    <span className="text-sm">50,000 {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{language === 'ar' ? 'المطلوب الآن:' : 'Due Now:'}</span>
                    <span className="text-primary">50,000 {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                </div>
                
                <Badge variant="outline" className="w-full justify-center">
                  {language === 'ar' ? 'متاح للحجز' : 'Available for Reservation'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Multi-Step Form */}
          <div className="lg:col-span-2">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step >= i ? 'bg-primary border-primary text-white' : 'border-muted text-muted-foreground'
                    }`}>
                      {i}
                    </div>
                    {i < 3 && (
                      <div className={`w-16 h-0.5 mx-2 ${step > i ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Reservation Details */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {language === 'ar' ? 'تفاصيل الحجز' : 'Reservation Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reservationDate">
                      {language === 'ar' ? 'تاريخ الحجز المفضل' : 'Preferred Reservation Date'}
                    </Label>
                    <Input
                      id="reservationDate"
                      type="date"
                      value={reservationDetails.reservationDate}
                      onChange={(e) => handleReservationDetailsChange('reservationDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      {language === 'ar' ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
                    </Label>
                    <textarea
                      id="notes"
                      className="w-full min-h-[100px] p-3 border border-input bg-background rounded-md"
                      placeholder={language === 'ar' ? 'أي متطلبات خاصة أو ملاحظات...' : 'Any special requirements or notes...'}
                      value={reservationDetails.notes}
                      onChange={(e) => handleReservationDetailsChange('notes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</Label>
                      <Input
                        id="fullName"
                        value={personalInfo.fullName}
                        onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                        placeholder={language === 'ar' ? 'أدخل الاسم الكامل' : 'Enter full name'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">{language === 'ar' ? 'الرقم القومي' : 'National ID'} *</Label>
                      <Input
                        id="nationalId"
                        value={personalInfo.nationalId}
                        onChange={(e) => handlePersonalInfoChange('nationalId', e.target.value)}
                        placeholder={language === 'ar' ? 'أدخل الرقم القومي' : 'Enter national ID'}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          className="pl-10"
                          value={personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Information */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {language === 'ar' ? 'معلومات الدفع' : 'Payment Information'}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    {language === 'ar' ? 'معلوماتك آمنة ومشفرة' : 'Your information is secure and encrypted'}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">{language === 'ar' ? 'اسم حامل البطاقة' : 'Cardholder Name'} *</Label>
                    <Input
                      id="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => handlePaymentInfoChange('cardholderName', e.target.value)}
                      placeholder={language === 'ar' ? 'كما هو مكتوب على البطاقة' : 'As written on card'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">{language === 'ar' ? 'رقم البطاقة' : 'Card Number'} *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        className="pl-10"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentInfoChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'} *</Label>
                      <Input
                        id="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentInfoChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">{language === 'ar' ? 'رمز الأمان' : 'CVV'} *</Label>
                      <Input
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentInfoChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {language === 'ar' ? 'الدفع الآمن' : 'Secure Payment'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' 
                        ? 'جميع المعاملات مشفرة ومؤمنة بنظام SSL 256-bit'
                        : 'All transactions are encrypted and secured with 256-bit SSL'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={step === 1 ? onClose : prevStep}
                disabled={isProcessing}
              >
                {step === 1 
                  ? (language === 'ar' ? 'إلغاء' : 'Cancel')
                  : (language === 'ar' ? 'السابق' : 'Previous')
                }
              </Button>
              
              <Button
                onClick={step === 3 ? handlePayment : nextStep}
                disabled={isProcessing || !validateStep(step)}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                  </div>
                ) : step === 3 ? (
                  language === 'ar' ? 'إتمام الدفع' : 'Complete Payment'
                ) : (
                  language === 'ar' ? 'التالي' : 'Next'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};