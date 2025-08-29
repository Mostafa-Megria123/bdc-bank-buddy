import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, UserPlus, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { toast } from 'sonner';
import CaptchaField from '@/components/CaptchaField';

const Register = () => {
  const { language } = useLanguage();
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nationalId: '',
      name: '',
      printedNumber: '',
      mobile: '',
      confirmMobile: '',
      email: '',
      confirmEmail: '',
      notificationLanguage: 'ar',
      nationality: 'Egypt',
      residence: '',
      governorate: '',
      address: '',
      phone: '',
      maritalStatus: '',
      captcha: ''
    }
  });

  const residenceValue = watch('residence');
  const captchaValue = watch('captcha');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        ...data,
        nationalIdImage: uploadedFile
      });
      toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى' : 'Registration failed. Please try again');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setValue('nationalIdImage', file);
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* National ID */}
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {language === 'ar' ? 'الرقم القومي (14 رقم)' : 'National ID (14 digits)'} *
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  maxLength={14}
                  placeholder={language === 'ar' ? 'أدخل الرقم القومي' : 'Enter National ID'}
                  {...register('nationalId')}
                  aria-invalid={!!errors.nationalId}
                />
                {errors.nationalId && (
                  <p className="text-sm text-destructive">{errors.nationalId.message}</p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === 'ar' ? 'الاسم (كما هو مذكور في الرقم القومي)' : 'Name (as mentioned in National ID)'} *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={language === 'ar' ? 'أدخل الاسم الكامل' : 'Enter full name'}
                  {...register('name')}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
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
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-primary">{uploadedFile.name}</p>
                  )}
                </div>
                {errors.nationalIdImage && (
                  <p className="text-sm text-destructive">{String(errors.nationalIdImage.message)}</p>
                )}
              </div>

              {/* Printed Number */}
              <div className="space-y-2">
                <Label htmlFor="printedNumber">
                  {language === 'ar' ? 'الرقم المطبوع تحت الصورة في الرقم القومي' : 'Printed Number below the picture'} *
                </Label>
                <Input
                  id="printedNumber"
                  type="text"
                  placeholder={language === 'ar' ? 'أدخل الرقم المطبوع' : 'Enter printed number'}
                  {...register('printedNumber')}
                  aria-invalid={!!errors.printedNumber}
                />
                {errors.printedNumber && (
                  <p className="text-sm text-destructive">{errors.printedNumber.message}</p>
                )}
              </div>

              {/* Mobile Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    {language === 'ar' ? 'رقم المحمول' : 'Mobile Number'} *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder={language === 'ar' ? 'أدخل رقم المحمول' : 'Enter mobile number'}
                    {...register('mobile')}
                    aria-invalid={!!errors.mobile}
                  />
                  {errors.mobile && (
                    <p className="text-sm text-destructive">{errors.mobile.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmMobile">
                    {language === 'ar' ? 'تأكيد رقم المحمول' : 'Confirm Mobile Number'} *
                  </Label>
                  <Input
                    id="confirmMobile"
                    type="tel"
                    placeholder={language === 'ar' ? 'أعد إدخال رقم المحمول' : 'Re-enter mobile number'}
                    {...register('confirmMobile')}
                    aria-invalid={!!errors.confirmMobile}
                  />
                  {errors.confirmMobile && (
                    <p className="text-sm text-destructive">{errors.confirmMobile.message}</p>
                  )}
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
                    type="email"
                    placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                    {...register('email')}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">
                    {language === 'ar' ? 'تأكيد البريد الإلكتروني' : 'Confirm Email Address'} *
                  </Label>
                  <Input
                    id="confirmEmail"
                    type="email"
                    placeholder={language === 'ar' ? 'أعد إدخال البريد الإلكتروني' : 'Re-enter email address'}
                    {...register('confirmEmail')}
                    aria-invalid={!!errors.confirmEmail}
                  />
                  {errors.confirmEmail && (
                    <p className="text-sm text-destructive">{errors.confirmEmail.message}</p>
                  )}
                </div>
              </div>

              {/* Notification Language */}
              <div className="space-y-2">
                <Label>
                  {language === 'ar' ? 'لغة الإشعارات المفضلة' : 'Preferred Notification Language'} *
                </Label>
                <Controller
                  name="notificationLanguage"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر اللغة' : 'Select language'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.notificationLanguage && (
                  <p className="text-sm text-destructive">{errors.notificationLanguage.message}</p>
                )}
              </div>

              {/* Country and Residence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'بلد الجنسية' : 'Country of Nationality'}
                  </Label>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'مكان الإقامة' : 'Place of Residence'} *
                  </Label>
                  <Controller
                    name="residence"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر البلد' : 'Select country'} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.residence && (
                    <p className="text-sm text-destructive">{errors.residence.message}</p>
                  )}
                </div>
              </div>

              {/* Governorate (if Egypt) */}
              {residenceValue === 'Egypt' && (
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'المحافظة' : 'Governorate'}
                  </Label>
                  <Controller
                    name="governorate"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر المحافظة' : 'Select governorate'} />
                        </SelectTrigger>
                        <SelectContent>
                          {governorates.map((gov) => (
                            <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  {language === 'ar' ? 'العنوان' : 'Address'}
                </Label>
                <Textarea
                  id="address"
                  placeholder={language === 'ar' ? 'أدخل العنوان التفصيلي' : 'Enter detailed address'}
                  rows={3}
                  {...register('address')}
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
                    type="tel"
                    minLength={8}
                    maxLength={20}
                    placeholder={language === 'ar' ? 'أدخل رقم التليفون' : 'Enter phone number'}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'الحالة الاجتماعية' : 'Marital Status'}
                  </Label>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر الحالة' : 'Select status'} />
                        </SelectTrigger>
                        <SelectContent>
                          {maritalStatuses.map((status, index) => (
                            <SelectItem key={index} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <CaptchaField
                value={captchaValue}
                onChange={(value) => setValue('captcha', value)}
                error={errors.captcha?.message}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
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