import React from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerificationPending = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4">
                <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {language === "ar"
                ? "تحقق من بريدك الإلكتروني"
                : "Check Your Email"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "تم إرسال رسالة تحقق إلى بريدك الإلكتروني. يرجى النقر على الرابط في الرسالة لتفعيل حسابك."
                  : "A verification email has been sent to your email address. Please click the link in the email to activate your account."}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? "قد يستغرق وصول البريد بضع دقائق. تحقق أيضاً من مجلد البريد المزعج."
                  : "It may take a few minutes for the email to arrive. Also check your spam folder."}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>{language === "ar" ? "ملاحظة: " : "Note: "}</strong>
                {language === "ar"
                  ? "لن تتمكن من تسجيل الدخول حتى تتحقق من بريدك الإلكتروني."
                  : "You will not be able to log in until you verify your email address."}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/verify-now")}
                className="text-sm text-primary hover:underline">
                {language === "ar"
                  ? "لم تستقبل البريد؟"
                  : "Didn't receive the email?"}
              </button>
            </div>

            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "ar" ? "العودة إلى تسجيل الدخول" : "Back to Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPending;
