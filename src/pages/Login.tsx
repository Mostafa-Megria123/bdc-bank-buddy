import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { toast } from "sonner";
import CaptchaField from "@/components/CaptchaField";
import { redirectService } from "@/services/redirect.service";
import { getTranslation } from "@/locales";

const Login = () => {
  const { language } = useLanguage();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  useEffect(() => {
    // Store current page before user might navigate to register/forgot password
    redirectService.storeLastPage(window.location.pathname);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nationalId: "",
      password: "",
      captcha: "",
    },
  });

  const captchaValue = watch("captcha");

  const onSubmit = async (data: LoginFormData) => {
    setVerificationError(false);
    try {
      await login(data.nationalId, data.password, data.captcha);
      toast.success(
        getTranslation(language, "auth.login.loginSuccessful") as string,
      );
      // Redirect to the page user came from, or default to projects page
      const redirectUrl = redirectService.getPostLoginRedirect("/projects");
      navigate(redirectUrl);
    } catch (error) {
      const errorMessage = (error as Error).message || "";
      
      // Check if the error is an account verification error
      if (
        errorMessage.includes("ACCOUNT_NOT_VERIFIED") ||
        errorMessage.includes("account is not active") ||
        errorMessage.toLowerCase().includes("not verified") ||
        errorMessage.toLowerCase().includes("not active")
      ) {
        setVerificationError(true);
        toast.error(
          getTranslation(language, "auth.login.accountNotVerified") as string,
        );
      } else {
        toast.error(
          getTranslation(language, "auth.login.loginFailed") as string,
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              {getTranslation(language, "auth.login.title") as string}
            </CardTitle>
            <p className="text-muted-foreground">
              {getTranslation(language, "auth.login.subtitle") as string}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {getTranslation(language, "auth.login.nationalId") as string} *
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  maxLength={14}
                  className="transition-all duration-300 focus:shadow-sm"
                  {...register("nationalId")}
                  aria-invalid={!!errors.nationalId}
                />
                {errors.nationalId && (
                  <p className="text-sm text-destructive">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {getTranslation(language, "auth.login.password") as string} *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="transition-all duration-300 focus:shadow-sm pr-10"
                    {...register("password")}
                    aria-invalid={!!errors.password}
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
              </div>

              <CaptchaField
                value={captchaValue}
                onChange={(value) => setValue("captcha", value)}
                error={errors.captcha?.message}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {getTranslation(language, "auth.login.login") as string}
              </Button>

              {verificationError && (
                <Button
                  type="button"
                  onClick={() => navigate("/verify-now")}
                  variant="secondary"
                  className="w-full">
                  {getTranslation(
                    language,
                    "auth.login.resendVerificationEmail",
                  ) as string}
                </Button>
              )}

              <div className="text-center space-y-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline transition-colors duration-300">
                  {getTranslation(language, "auth.login.forgotPassword") as string}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {getTranslation(language, "auth.login.noAccount") as string}{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:underline transition-colors duration-300">
                    {getTranslation(language, "auth.login.registerNow") as string}
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
