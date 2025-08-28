import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nationalId: '',
    password: '',
    captcha: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {language === 'ar' ? 'الرقم القومي' : 'National ID'}
                </Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  required
                  maxLength={14}
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'أدخل الرقم القومي (14 رقم)' : 'Enter National ID (14 digits)'}
                  className="transition-all duration-300 focus:shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="transition-all duration-300 focus:shadow-sm pr-10"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="captcha">
                  {language === 'ar' ? 'رمز التحقق' : 'Captcha'}
                </Label>
                <Input
                  id="captcha"
                  name="captcha"
                  type="text"
                  required
                  value={formData.captcha}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'أدخل رمز التحقق' : 'Enter captcha'}
                  className="transition-all duration-300 focus:shadow-sm"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300"
              >
                <LogIn className="mr-2 h-4 w-4" />
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