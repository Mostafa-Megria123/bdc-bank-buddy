import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CaptchaFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CaptchaField: React.FC<CaptchaFieldProps> = ({ value, onChange, error }) => {
  const { language } = useLanguage();
  const [captchaText, setCaptchaText] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha">
        {language === 'ar' ? 'رمز التحقق' : 'Captcha'} *
      </Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="captcha"
            name="captcha"
            type="text"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={language === 'ar' ? 'أدخل رمز التحقق' : 'Enter captcha'}
            className="transition-all duration-300 focus:shadow-sm"
            aria-invalid={!!error}
          />
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted px-4 py-2 rounded-md font-mono text-lg font-semibold tracking-widest select-none border-2 border-dashed">
            {captchaText}
          </div>
          <button
            type="button"
            onClick={generateCaptcha}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-300"
            title={language === 'ar' ? 'تحديث رمز التحقق' : 'Refresh captcha'}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptchaField;