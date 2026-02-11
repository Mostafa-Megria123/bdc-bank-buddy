import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  paymentService,
  TransactionStatusResponse,
} from "@/services/payment.service";

export const PaymentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, tString } = useLanguage();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] =
    useState<TransactionStatusResponse | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pendingPayment = sessionStorage.getItem("pendingPayment");
        if (!pendingPayment) {
          throw new Error("No pending payment found");
        }

        const paymentData = JSON.parse(pendingPayment);

        const result = await paymentService.checkTransactionStatus({
          orderId: paymentData.orderId,
          userNationalId: paymentData.userNationalId,
        });

        setVerificationResult(result);

        if (result.success) {
          // Clear pending payment from session storage
          sessionStorage.removeItem("pendingPayment");

          toast({
            title: tString("payment.successTitle"),
            description: tString("payment.successDescription").replace(
              "{bookingId}",
              result.bookingId || "",
            ),
          });
        } else {
          toast({
            title: tString("payment.failedTitle"),
            description: result.message || tString("payment.failedDescription"),
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationResult({
          success: false,
          status: "error",
          message: "Verification failed",
        });

        toast({
          title: tString("payment.errorTitle"),
          description: tString("payment.errorDescription"),
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, toast, tString]);

  const handleReturnToProjects = () => {
    navigate("/projects");
  };

  const handleTryAgain = () => {
    navigate("/projects");
    // You might want to reopen the reservation modal here
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {tString("payment.verifyingTitle")}
            </h2>
            <p className="text-muted-foreground text-center">
              {tString("payment.verifyingDescription")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center">
            {verificationResult?.success ? (
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
            )}
            <CardTitle className="text-center">
              {verificationResult?.success
                ? tString("payment.successTitle")
                : tString("payment.failedTitle")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {verificationResult?.message ||
              (verificationResult?.success
                ? tString("payment.successDescription")
                : tString("payment.failedDescription"))}
          </p>

          {verificationResult?.success && verificationResult.bookingId && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm">
                <strong>{tString("payment.bookingId")}:</strong>{" "}
                {verificationResult.bookingId}
              </p>
              {verificationResult.transactionId && (
                <p className="text-sm">
                  <strong>{tString("payment.transactionId")}:</strong>{" "}
                  {verificationResult.transactionId}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleReturnToProjects}
              className="w-full bg-gradient-primary hover:opacity-90">
              {tString("payment.returnToProjects")}
            </Button>

            {!verificationResult?.success && (
              <Button
                onClick={handleTryAgain}
                variant="outline"
                className="w-full">
                {tString("payment.tryAgain")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
