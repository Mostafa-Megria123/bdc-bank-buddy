import React, { useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { getTranslation } from "@/locales";

// Validation schema
const verifyNowSchema = z.object({
  nationalId: z
    .string()
    .min(1, { message: "National ID is required" })
    .length(14, { message: "National ID must be 14 digits" })
    .regex(/^\d+$/, { message: "National ID must contain only numbers" }),
  newEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
});

type VerifyNowFormData = z.infer<typeof verifyNowSchema>;

const VerifyNow = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyNowFormData>({
    resolver: zodResolver(verifyNowSchema),
    defaultValues: {
      nationalId: "",
      newEmail: "",
    },
  });

  const onSubmit = async (data: VerifyNowFormData) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await authService.verifyNow(data);

      // Extract message from response if it's an object
      let successMsg = getTranslation(
        language,
        "auth.verifyNow.verificationSuccessful",
      ) as string;

      if (response && typeof response === "object") {
        if ((response as Record<string, string>).message) {
          successMsg = (response as Record<string, string>).message;
        }
      } else if (typeof response === "string") {
        successMsg = response;
      }

      setSuccessMessage(successMsg);
      setSubmitted(true);

      toast.success(
        getTranslation(
          language,
          "auth.verifyNow.verificationSuccessful",
        ) as string,
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const err = error as AxiosError<string>;

      let errorMsg = getTranslation(
        language,
        "auth.verifyNow.verificationFailed",
      ) as string;

      if (err?.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
        } else if ((err.response.data as Record<string, string>).message) {
          errorMsg = (err.response.data as Record<string, string>).message;
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: VerifyNowFormData) => {
    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error) => error?.message)
        .filter(Boolean)
        .slice(0, 2) // Show first 2 errors
        .join(" • ");

      toast.error(errorMessages);
      return;
    }

    await onSubmit(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-brand animate-fade-in">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {getTranslation(
                  language,
                  "auth.verifyNow.verificationSuccessful",
                ) as string}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-center">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  {successMessage}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-900">
                <p className="text-sm text-green-900 dark:text-green-300">
                  {getTranslation(
                    language,
                    "auth.verifyNow.redirectingLogin",
                  ) as string}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-brand">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {getTranslation(language, "auth.verifyNow.title") as string}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {getTranslation(language, "auth.verifyNow.subtitle") as string}
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6">
              {/* National ID Field */}
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {getTranslation(language, "auth.verifyNow.nationalId") as string}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  maxLength={14}
                  placeholder={getTranslation(
                    language,
                    "auth.verifyNow.enterNationalId",
                  ) as string}
                  {...register("nationalId")}
                  disabled={loading}
                  aria-invalid={!!errors.nationalId}
                  className={errors.nationalId ? "border-red-500" : ""}
                />
                {errors.nationalId && (
                  <p className="text-sm text-red-500">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="newEmail">
                  {getTranslation(language, "auth.verifyNow.newEmail") as string}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder={getTranslation(
                    language,
                    "auth.verifyNow.enterEmail",
                  ) as string}
                  {...register("newEmail")}
                  disabled={loading}
                  aria-invalid={!!errors.newEmail}
                  className={errors.newEmail ? "border-red-500" : ""}
                />
                {errors.newEmail && (
                  <p className="text-sm text-red-500">
                    {errors.newEmail.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900 dark:text-red-300">
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary hover:opacity-90 disabled:opacity-50">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getTranslation(
                      language,
                      "auth.verifyNow.processing",
                    ) as string}
                  </>
                ) : (
                  (getTranslation(language, "auth.verifyNow.verifyNow") as string)
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-primary hover:underline">
                  {getTranslation(
                    language,
                    "auth.verifyNow.backToLogin",
                  ) as string}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyNow;
