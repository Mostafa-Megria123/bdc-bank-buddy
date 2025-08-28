import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    nationalId: '',
    name: '',
    nationalIdImage: null as File | null,
    printedNumber: '',
    mobile: '',
    confirmMobile: '',
    email: '',
    confirmEmail: '',
    notificationLanguage: '',
    nationality: 'Egypt',
    residence: '',
    governorate: '',
    address: '',
    phone: '',
    maritalStatus: '',
    captcha: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        nationalIdImage: e.target.files[0]
      });
    }
  };

  const governorates = [
    'Cairo', 'Alexandria', 'Giza', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum',
    'Gharbiya', 'Ismailia', 'Menofia', 'Minya', 'Qaliubiya', 'New Valley',
    'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said', 'Damietta',
    'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matrouh', 'Luxor',
    'Qena', 'North Sinai', 'Sohag'
  ];

  const countries = ['Egypt', 'Saudi Arabia', 'UAE', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'];
  const maritalStatuses = language === 'ar' 
    ? ['أعزب', 'متزوج', 'مطلق', 'أرمل', 'متزوج من أجنبي']
    : ['Single', 'Married', 'Divorced', 'Widowed', 'Married to Foreigner'];

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              {language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
            </CardTitle>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'املأ البيانات التالية لإنشاء حسابك'
                : 'Fill in the following information to create your account'
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* National ID */}
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {language === 'ar' ? 'الرقم القومي (14 رقم)' : 'National ID (14 digits)'} *
                </Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  required
                  maxLength={14}
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'أدخل الرقم القومي' : 'Enter National ID'}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === 'ar' ? 'الاسم (كما هو مذكور في الرقم القومي)' : 'Name (as mentioned in National ID)'} *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'أدخل الاسم الكامل' : 'Enter full name'}
                />
              </div>

              {/* National ID Image */}
              <div className="space-y-2">
                <Label htmlFor="nationalIdImage">
                  {language === 'ar' ? 'صورة الرقم القومي (الوجهين)' : 'National ID Image (both sides)'} *
                </Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-300">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <input
                    id="nationalIdImage"
                    name="nationalIdImage"
                    type="file"
                    accept=".jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="nationalIdImage"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {language === 'ar' 
                      ? 'اضغط لرفع الملف (JPG, PDF فقط)'
                      : 'Click to upload file (JPG, PDF only)'
                    }
                  </Label>
                  {formData.nationalIdImage && (
                    <p className="mt-2 text-sm text-primary">{formData.nationalIdImage.name}</p>
                  )}
                </div>
              </div>

              {/* Printed Number */}
              <div className="space-y-2">
                <Label htmlFor="printedNumber">
                  {language === 'ar' ? 'الرقم المطبوع تحت الصورة في الرقم القومي' : 'Printed Number below the picture'} *
                </Label>
                <Input
                  id="printedNumber"
                  name="printedNumber"
                  type="text"
                  required
                  value={formData.printedNumber}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'أدخل الرقم المطبوع' : 'Enter printed number'}
                />
              </div>

              {/* Mobile Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    {language === 'ar' ? 'رقم المحمول' : 'Mobile Number'} *
                  </Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'أدخل رقم المحمول' : 'Enter mobile number'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmMobile">
                    {language === 'ar' ? 'تأكيد رقم المحمول' : 'Confirm Mobile Number'} *
                  </Label>
                  <Input
                    id="confirmMobile"
                    name="confirmMobile"
                    type="tel"
                    required
                    value={formData.confirmMobile}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'أعد إدخال رقم المحمول' : 'Re-enter mobile number'}
                  />
                </div>
              </div>

              {/* Email Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">
                    {language === 'ar' ? 'تأكيد البريد الإلكتروني' : 'Confirm Email Address'} *
                  </Label>
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    required
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'أعد إدخال البريد الإلكتروني' : 'Re-enter email address'}
                  />
                </div>
              </div>

              {/* Notification Language */}
              <div className="space-y-2">
                <Label>
                  {language === 'ar' ? 'لغة الإشعارات المفضلة' : 'Preferred Notification Language'} *
                </Label>
                <Select value={formData.notificationLanguage} onValueChange={(value) => setFormData({...formData, notificationLanguage: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر اللغة' : 'Select language'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country and Residence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'بلد الجنسية' : 'Country of Nationality'}
                  </Label>
                  <Select value={formData.nationality} onValueChange={(value) => setFormData({...formData, nationality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'مكان الإقامة' : 'Place of Residence'}
                  </Label>
                  <Select value={formData.residence} onValueChange={(value) => setFormData({...formData, residence: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر البلد' : 'Select country'} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Governorate (if Egypt) */}
              {formData.residence === 'Egypt' && (
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'المحافظة' : 'Governorate'}
                  </Label>
                  <Select value={formData.governorate} onValueChange={(value) => setFormData({...formData, governorate: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر المحافظة' : 'Select governorate'} />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((gov) => (
                        <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  {language === 'ar' ? 'العنوان' : 'Address'}
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'أدخل العنوان التفصيلي' : 'Enter detailed address'}
                  rows={3}
                />
              </div>

              {/* Phone and Marital Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {language === 'ar' ? 'رقم التليفون (8-20 رقم)' : 'Phone Number (8-20 digits)'}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    minLength={8}
                    maxLength={20}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'أدخل رقم التليفون' : 'Enter phone number'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'الحالة الاجتماعية' : 'Marital Status'}
                  </Label>
                  <Select value={formData.maritalStatus} onValueChange={(value) => setFormData({...formData, maritalStatus: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الحالة' : 'Select status'} />
                    </SelectTrigger>
                    <SelectContent>
                      {maritalStatuses.map((status, index) => (
                        <SelectItem key={index} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <Label htmlFor="captcha">
                  {language === 'ar' ? 'رمز التحقق' : 'Captcha'} *
                </Label>
                <Input
                  id="captcha"
                  name="captcha"
                  type="text"
                  required
                  value={formData.captcha}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'أدخل رمز التحقق' : 'Enter captcha'}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
              </Button>

              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline transition-colors duration-300"
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;