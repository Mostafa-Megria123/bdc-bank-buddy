import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/validations";
import { toast } from "sonner";
import { getTranslation } from "@/locales";

const ResetPassword = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const token = searchParams.get("token");

  useEffect(() => {
    // Redirect if no token is provided
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      navigate("/login");
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  // Update password requirements in real-time
  useEffect(() => {
    if (passwordValue) {
      setPasswordRequirements({
        length: passwordValue.length >= 8,
        lowercase: /[a-z]/.test(passwordValue),
        uppercase: /[A-Z]/.test(passwordValue),
        number: /[0-9]/.test(passwordValue),
        specialChar: /[@#$%^&+=!]/.test(passwordValue),
      });
    } else {
      setPasswordRequirements({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        specialChar: false,
      });
    }
  }, [passwordValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    setIsResetting(true);
    try {
      // Call the resetPassword service
      const { resetPassword } = await import("@/services/auth.service").then(
        (m) => ({ resetPassword: m.authService.resetPassword }),
      );

      await resetPassword({
        ...data,
        token,
      });

      toast.success(
        language === "ar"
          ? "تم إعادة تعيين كلمة المرور بنجاح"
          : "Password reset successfully",
      );
      navigate("/login");
    } catch (error) {
      const errorMessage = (error as Error).message || "";
      toast.error(
        errorMessage ||
          (language === "ar"
            ? "فشل إعادة تعيين كلمة المرور"
            : "Failed to reset password"),
      );
    } finally {
      setIsResetting(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              {language === "ar" ? "إعادة تعيين كلمة المرور" : "Reset Password"}
            </CardTitle>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "أدخل كلمة المرور الجديدة"
                : "Enter your new password"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === "ar" ? "كلمة المرور الجديدة" : "New Password"} *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="transition-all duration-300 focus:shadow-sm pr-10"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
                <div className="text-xs space-y-1 mt-2">
                  <p
                    className={
                      passwordRequirements.length
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }>
                    {language === "ar"
                      ? "8 أحرف على الأقل"
                      : "At least 8 characters"}
                  </p>
                  <p
                    className={
                      passwordRequirements.lowercase &&
                      passwordRequirements.uppercase
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }>
                    {language === "ar"
                      ? "حروف كبيرة وصغيرة"
                      : "Uppercase and lowercase letters"}
                  </p>
                  <p
                    className={
                      passwordRequirements.number &&
                      passwordRequirements.specialChar
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }>
                    {language === "ar"
                      ? "رقم وحرف خاص"
                      : "Number and special character"}
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}{" "}
                  *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="transition-all duration-300 focus:shadow-sm pr-10"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isResetting}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50">
                {isResetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {language === "ar"
                  ? "إعادة تعيين كلمة المرور"
                  : "Reset Password"}
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

export default ResetPassword;
