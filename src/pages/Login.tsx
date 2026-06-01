import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Loader2, Lock, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { redirectService } from "@/services/redirect.service";
import { getTranslation } from "@/locales";

const Login = () => {
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);
  const { language, setLanguage } = useLanguage();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const [accountLocked, setAccountLocked] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    // Store current page before user might navigate to register/forgot password
    redirectService.storeLastPage(window.location.pathname);

    // Reset failed attempts counter on page load/reload
    setFailedAttempts(0);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nationalId: "",
      password: "",
      captcha: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setVerificationError(false);
    setLoginError("");
    setAccountLocked(false);

    // Validate captcha is present and is a string
    if (!data.captcha || typeof data.captcha !== "string") {
      setLoginError(
        getTranslation(language, "auth.login.captchaRequired") as string,
      );
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    try {
      await login(data.nationalId, data.password, data.captcha);

      // Reset failed attempts on successful login
      setFailedAttempts(0);

      // Set user's preferred language from localStorage after successful login
      const preferredLanguage = localStorage.getItem("preferredLanguage");
      if (preferredLanguage && preferredLanguage !== language) {
        setLanguage(preferredLanguage as "en" | "ar");
      }

      toast.success(
        getTranslation(language, "auth.login.loginSuccessful") as string,
      );
      // Redirect to the page user came from, or default to projects page
      const redirectUrl = redirectService.getPostLoginRedirect("/projects");
      navigate(redirectUrl);
    } catch (error) {
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset();
      setValue("captcha", "");

      const err = error as Error & { status?: number; errorField?: string };
      const errorMessage = err.message || "";
      const statusCode = err.status;
      const errorField = err.errorField;

      // Handle 403 Account Locked
      if (statusCode === 403 && errorField === "Account Locked") {
        setAccountLocked(true);
        setLoginError(errorMessage);
        toast.error(errorMessage);
      }
      // Handle 403 Account Disabled (Unverified)
      else if (
        statusCode === 403 &&
        (errorField === "Account Disabled" ||
          errorMessage.includes("Account Disabled") ||
          errorMessage.includes("not verified") ||
          errorMessage.includes("not active"))
      ) {
        setVerificationError(true);
        setLoginError(
          getTranslation(language, "auth.login.accountNotVerified") as string,
        );
        toast.error(
          getTranslation(language, "auth.login.accountNotVerified") as string,
        );
      }
      // Handle 401 Unauthorized (wrong credentials)
      else if (statusCode === 401) {
        // Increment failed attempts on 401
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        setLoginError(errorMessage);
        toast.error(errorMessage);
      }
      // Other errors
      else if (
        errorMessage.includes("ACCOUNT_NOT_VERIFIED") ||
        errorMessage.includes("account is not active") ||
        errorMessage.includes("Account Disabled") ||
        errorMessage.toLowerCase().includes("not verified") ||
        errorMessage.toLowerCase().includes("not active") ||
        errorMessage.toLowerCase().includes("disabled")
      ) {
        setVerificationError(true);
        setLoginError(
          getTranslation(language, "auth.login.accountNotVerified") as string,
        );
        toast.error(
          getTranslation(language, "auth.login.accountNotVerified") as string,
        );
      } else {
        setLoginError(errorMessage);
        toast.error(errorMessage);
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
                  {getTranslation(language, "auth.login.nationalId") as string}{" "}
                  *
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

              <div className="space-y-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
                  onChange={(value) => {
                    setValue("captcha", value || "");
                  }}
                  onExpired={() => setValue("captcha", "")}
                  theme="light"
                />
                {errors.captcha && (
                  <p className="text-sm text-destructive">
                    {errors.captcha.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || accountLocked}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {getTranslation(language, "auth.login.login") as string}
              </Button>

              {accountLocked && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-red-900">
                        {loginError}
                      </p>
                      <div className="space-y-2 text-sm text-red-800">
                        <p>
                          {
                            getTranslation(
                              language,
                              "auth.login.accountUnlockTime",
                            ) as string
                          }
                        </p>
                        <p>
                          {
                            getTranslation(
                              language,
                              "auth.login.accountRecovery",
                            ) as string
                          }{" "}
                          <Link
                            to="/forgot-password"
                            className="font-semibold text-red-700 hover:text-red-900 underline">
                            {
                              getTranslation(
                                language,
                                "auth.login.resetPassword",
                              ) as string
                            }
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!accountLocked && loginError && !verificationError && (
                <p className="text-sm text-destructive text-center">
                  {loginError}
                </p>
              )}

              {!accountLocked && failedAttempts >= 3 && !verificationError && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      {failedAttempts >= 5
                        ? (getTranslation(
                            language,
                            "auth.login.accountMayBeLocked",
                          ) as string)
                        : (
                            getTranslation(
                              language,
                              "auth.login.failedAttemptsWarning",
                            ) as string
                          ).replace(
                            "{attempts}",
                            (5 - failedAttempts).toString(),
                          )}
                    </p>
                  </div>
                </div>
              )}

              {verificationError && (
                <Button
                  type="button"
                  onClick={() => navigate("/verify-now")}
                  variant="secondary"
                  className="w-full">
                  {
                    getTranslation(
                      language,
                      "auth.login.resendVerificationEmail",
                    ) as string
                  }
                </Button>
              )}

              <div className="text-center space-y-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline transition-colors duration-300">
                  {
                    getTranslation(
                      language,
                      "auth.login.forgotPassword",
                    ) as string
                  }
                </Link>
                <div className="text-sm text-muted-foreground">
                  {getTranslation(language, "auth.login.noAccount") as string}{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:underline transition-colors duration-300">
                    {
                      getTranslation(
                        language,
                        "auth.login.registerNow",
                      ) as string
                    }
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
