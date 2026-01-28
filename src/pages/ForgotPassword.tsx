import React, { useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/validations";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { getTranslation } from "@/locales";

const ForgotPassword = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      // Call the forgot password service
      await authService.forgotPassword(data);

      setEmailSent(true);
      toast.success(
        language === "ar"
          ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
          : "Password reset link has been sent to your email",
      );
    } catch (error) {
      const errorMessage = (error as Error).message || "";
      toast.error(
        errorMessage ||
          (language === "ar"
            ? "فشل في إرسال طلب إعادة تعيين كلمة المرور"
            : "Failed to send password reset request"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-brand animate-fade-in">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {language === "ar"
                  ? "تم إرسال البريد الإلكتروني"
                  : "Email Sent"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground text-center">
                  {language === "ar"
                    ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${getValues("email")}`
                    : `A password reset link has been sent to ${getValues("email")}`}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  {language === "ar"
                    ? "يرجى التحقق من بريدك الإلكتروني والنقر على الرابط لإعادة تعيين كلمة المرور الخاصة بك. قد يستغرق وصول البريد الإلكتروني بضع دقائق."
                    : "Please check your email and click the link to reset your password. The email may take a few minutes to arrive."}
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors duration-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === "ar" ? "العودة إلى تسجيل الدخول" : "Back to Login"}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              {language === "ar"
                ? "نسيت كلمة المرور؟"
                : "Forgot Password?"}
            </CardTitle>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور"
                : "Enter your email and we'll send you a link to reset your password"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === "ar" ? "عنوان البريد الإلكتروني" : "Email Address"}{" "}
                  *
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="transition-all duration-300 focus:shadow-sm"
                  placeholder={
                    language === "ar"
                      ? "example@email.com"
                      : "example@email.com"
                  }
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {language === "ar"
                  ? "إرسال رابط إعادة التعيين"
                  : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline transition-colors duration-300">
                  {language === "ar"
                    ? "العودة إلى تسجيل الدخول"
                    : "Back to Login"}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
