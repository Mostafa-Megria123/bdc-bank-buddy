import React, { useState } from 'react';
import { useLanguage } from '@/contexts/useLanguage';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { toast } from 'sonner';
import CaptchaField from '@/components/CaptchaField';

const Login = () => {
  const { language } = useLanguage();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nationalId: '',
      password: '',
      captcha: ''
    }
  });

  const captchaValue = watch('captcha');

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.nationalId, data.password, data.captcha);
      toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
      navigate('/');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى' : 'Login failed. Please try again');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </CardTitle>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'أدخل بياناتك للوصول إلى حسابك'
                : 'Enter your credentials to access your account'
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {language === 'ar' ? 'الرقم القومي' : 'National ID'} *
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  maxLength={14}
                  placeholder={language === 'ar' ? 'أدخل الرقم القومي (14 رقم)' : 'Enter National ID (14 digits)'}
                  className="transition-all duration-300 focus:shadow-sm"
                  {...register('nationalId')}
                  aria-invalid={!!errors.nationalId}
                />
                {errors.nationalId && (
                  <p className="text-sm text-destructive">{errors.nationalId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'} *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="transition-all duration-300 focus:shadow-sm pr-10"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
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
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Button>

              <div className="text-center space-y-2">
                <Link 
                  to="/reset-password" 
                  className="text-sm text-primary hover:underline transition-colors duration-300"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                  <Link 
                    to="/register" 
                    className="text-primary hover:underline transition-colors duration-300"
                  >
                    {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;