import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { authService } from "@/services/auth.service";
import { getTranslation } from "@/locales";

const EmailVerification = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage(
          getTranslation(language, "auth.emailVerification.tokenMissing") as string,
        );
        return;
      }

      try {
        const response = await authService.verifyEmail(token);

        setStatus("success");
        setMessage(
          response ||
            (getTranslation(
              language,
              "auth.emailVerification.emailVerifiedSuccessfully",
            ) as string),
        );

        toast.success(
          getTranslation(
            language,
            "auth.emailVerification.emailVerifiedLogin",
          ) as string,
        );

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setStatus("error");
        const err = error as AxiosError<string>;

        // Extract error message from response
        let errorMessage = getTranslation(
          language,
          "auth.emailVerification.emailVerificationFailed",
        ) as string;

        if (err?.response?.data) {
          // Backend returns plain string message
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if ((err.response.data as Record<string, string>).message) {
            // Or as JSON object with message property
            errorMessage = (err.response.data as Record<string, string>)
              .message;
          }
        } else if (err?.message) {
          errorMessage = err.message;
        }

        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmail();
  }, [token, language, navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === "loading" && (
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 animate-spin">
                  <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              {status === "success" && (
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              )}
              {status === "error" && (
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
                  <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {status === "loading" &&
                (getTranslation(
                  language,
                  "auth.emailVerification.verifyingEmail",
                ) as string)}
              {status === "success" &&
                (getTranslation(
                  language,
                  "auth.emailVerification.verificationSuccessful",
                ) as string)}
              {status === "error" &&
                (getTranslation(
                  language,
                  "auth.emailVerification.verificationFailed",
                ) as string)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-center">
              <p
                className={`font-medium ${
                  status === "error"
                    ? "text-red-600 dark:text-red-400"
                    : status === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                }`}>
                {message}
              </p>
            </div>

            {status === "error" && (
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900 dark:text-red-300">
                  {getTranslation(
                    language,
                    "auth.emailVerification.tokenInvalidExpired",
                  ) as string}
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-900">
                <p className="text-sm text-green-900 dark:text-green-300">
                  {getTranslation(
                    language,
                    "auth.emailVerification.redirectingLogin",
                  ) as string}
                </p>
              </div>
            )}

            {status === "error" && (
              <Button
                onClick={() => navigate("/register")}
                className="w-full bg-gradient-primary hover:opacity-90">
                {getTranslation(
                  language,
                  "auth.emailVerification.backToRegistration",
                ) as string}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
