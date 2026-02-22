import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/useLanguage";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Lock,
  User,
  Phone,
  Mail,
  Calendar,
  Home,
  MapPin,
  ExternalLink,
  Building,
  Maximize2,
  BedDouble,
  Droplet,
} from "lucide-react";
import { Unit } from "@/types/unit";
import { UnitType } from "@/types/unit-type";
import { useAuth } from "@/contexts/useAuth";
import {
  paymentService,
  PaymentRequest,
  CheckoutResponse,
} from "@/services/payment.service";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  projectName: string;
  projectId: string; // Add projectId prop
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  unit,
  projectName,
  projectId, // Destructure projectId
}) => {
  const navigate = useNavigate();
  const { language, tString } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth(); // Get user data from auth context
  const [step, setStep] = useState(1); // 1: Reservation Details, 2: Payment Confirmation
  const [isProcessing, setIsProcessing] = useState(false);

  const [reservationDetails, setReservationDetails] = useState<{
    reservationDate: string;
    notes: string;
  }>({
    reservationDate: "",
    notes: "",
  });

  if (!unit) return null;

  const handleReservationDetailsChange = (
    field: keyof typeof reservationDetails,
    value: string,
  ) => {
    setReservationDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      return reservationDetails.reservationDate; // Only reservation date is required since username = nationalId
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 2));
    } else {
      toast({
        title: tString("reservation.errorTitle"),
        description: tString("reservation.errorDesc"),
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const initiatePayment = async () => {
    setIsProcessing(true);

    try {
      // Use username as national ID since they are the same
      const nationalId = user?.username?.trim();

      // Validate national ID (username)
      if (!nationalId) {
        toast({
          title: tString("reservation.authErrorTitle"),
          description: tString("reservation.authErrorDesc"),
          variant: "destructive",
        });
        // Close the modal and redirect to login
        onClose();
        navigate("/login");
        return;
      }

      const paymentData: PaymentRequest = {
        unitId: unit.id,
        projectId: projectId, // Use projectId from props
        amount: unit.downPayment || 50000, // Use unit's downPayment or fallback to 50000
        reservationDate: reservationDetails.reservationDate,
        notes: reservationDetails.notes,
        userNationalId: nationalId,
      };

      const result = await paymentService.checkout(paymentData);

      if (result.errorCode === "0" || result.errorCode === "SUCCESS") {
        // Store orderId and other details for later verification
        sessionStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            orderId: result.orderId,
            unitId: unit.id,
            projectName: projectName,
            amount: paymentData.amount,
            userNationalId: nationalId,
          }),
        );

        // Open payment form in new tab first (before navigation)
        if (result.formUrl) {
          const paymentWindow = window.open(result.formUrl, "_blank");
          if (!paymentWindow) {
            console.warn("Payment window could not be opened");
            toast({
              title: tString("reservation.paymentWarning"),
              description:
                "Payment window blocked. Please check your browser settings.",
              variant: "destructive",
            });
          }
        }

        // Close the modal and navigate to My Reservations with a small delay to ensure window opens
        setTimeout(() => {
          onClose();
          navigate("/my-reservations", {
            state: { showPaymentPendingAlert: true },
          });
        }, 500);
      } else {
        toast({
          title: tString("reservation.paymentError"),
          description: tString("reservation.paymentErrorDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: tString("reservation.paymentError"),
        description: tString("reservation.paymentErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setStep(1);
    setReservationDetails({ reservationDate: "", notes: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {tString("reservation.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {tString("reservation.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unit Summary - Always Visible */}
          <div className="lg:col-span-1">
            <Card className="sticky top-0">
              <CardHeader>
                <CardTitle className="text-lg">
                  {tString("reservation.unitSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {tString("reservation.unitId")}
                    </span>
                    <span>{unit.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {tString("reservation.project")}
                    </span>
                    <span className="text-sm">{projectName}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {tString("reservation.type")}
                      </span>
                      <span className="text-sm">
                        {typeof unit.type === "object" && unit.type !== null
                          ? language === "ar"
                            ? (unit.type as UnitType).typeAr
                            : (unit.type as UnitType).typeEn
                          : String(unit.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize2 className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {tString("reservation.area")}
                      </span>
                      <span className="text-sm">{unit.area}</span>
                    </div>
                    {unit.bedrooms && (
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {tString("reservation.bedrooms")}
                        </span>
                        <span className="text-sm">{unit.bedrooms}</span>
                      </div>
                    )}
                    {unit.bathrooms && (
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {tString("reservation.bathrooms")}
                        </span>
                        <span className="text-sm">{unit.bathrooms}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {tString("reservation.unitPrice")}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {unit.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {tString("reservation.reservationFee")}
                    </span>
                    <span className="text-sm">
                      {unit.totalAdvancePayment.toLocaleString()}{" "}
                      {language === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{tString("reservation.dueNow")}</span>
                    <span className="text-primary">
                      {unit.downPayment.toLocaleString()}{" "}
                      {language === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className="w-full justify-center">
                  {tString("reservation.available")}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Multi-Step Form */}
          <div className="lg:col-span-2">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step >= i
                          ? "bg-primary border-primary text-white"
                          : "border-muted text-muted-foreground"
                      }`}>
                      {i}
                    </div>
                    {i < 2 && (
                      <div
                        className={`w-16 h-0.5 mx-2 ${
                          step > i ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Reservation Details */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {tString("reservation.detailsTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Information Display */}
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      {tString("reservation.customerInfo")}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>{tString("reservation.fullName")}:</strong>{" "}
                        {user?.fullName || ""}
                      </p>
                      <p>
                        <strong>{tString("reservation.email")}:</strong>{" "}
                        {user?.email || ""}
                      </p>
                      <p>
                        <strong>{tString("reservation.mobileNumber")}:</strong>{" "}
                        {user?.mobileNumber || ""}
                      </p>
                      <p>
                        <strong>{tString("reservation.nationalId")}:</strong>{" "}
                        {user?.username || ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reservationDate">
                      {tString("reservation.preferredDate")} *
                    </Label>
                    <Input
                      id="reservationDate"
                      type="date"
                      value={reservationDetails.reservationDate}
                      onChange={(e) =>
                        handleReservationDetailsChange(
                          "reservationDate",
                          e.target.value,
                        )
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      {tString("reservation.additionalNotes")}
                    </Label>
                    <textarea
                      id="notes"
                      className="w-full min-h-[100px] p-3 border border-input bg-background rounded-md"
                      placeholder={tString("reservation.notesPlaceholder")}
                      value={reservationDetails.notes}
                      onChange={(e) =>
                        handleReservationDetailsChange("notes", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Confirmation */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {tString("reservation.paymentConfirmation")}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    {tString("reservation.paymentRedirectInfo")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">
                      {tString("reservation.reservationSummary")}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{tString("reservation.unit")}:</span>
                        <span>{unit.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{tString("reservation.project")}:</span>
                        <span>{projectName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{tString("reservation.reservationDate")}:</span>
                        <span>{reservationDetails.reservationDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{tString("reservation.customer")}:</span>
                        <span>{user?.fullName || ""}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>{tString("reservation.totalAmount")}:</span>
                        <span>50,000 {language === "ar" ? "ج.م" : "EGP"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">
                        {tString("reservation.paymentRedirect")}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600/80 mt-1">
                      {tString("reservation.paymentRedirectDesc")}
                    </p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {tString("reservation.securePayment")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tString("reservation.securePaymentDesc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={step === 1 ? handleCancel : prevStep}
                disabled={isProcessing}>
                {step === 1
                  ? tString("reservation.cancel")
                  : tString("reservation.previous")}
              </Button>

              <Button
                onClick={step === 2 ? initiatePayment : nextStep}
                disabled={isProcessing || !validateStep(step)}
                className="bg-gradient-primary hover:opacity-90">
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {tString("reservation.processing")}
                  </div>
                ) : step === 2 ? (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    {tString("reservation.proceedToPayment")}
                  </div>
                ) : (
                  tString("reservation.next")
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
