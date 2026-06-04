import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
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
  Lock,
  User,
  Phone,
  Mail,
  Calendar,
  Home,
  MapPin,
  Building,
  Maximize2,
  BedDouble,
  Droplet,
  CheckCircle,
} from "lucide-react";
import { Unit } from "@/types/unit";
import { UnitType } from "@/types/unit-type";
import { useAuth } from "@/contexts/useAuth";
import {
  reservationService,
  ReservationCreateRequest,
} from "@/services/reservation.service";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  projectName: string;
  projectId: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  unit,
  projectName,
  projectId,
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const { language, tString } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [captcha, setCaptcha] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [reservationDetails, setReservationDetails] = useState<{
    notes: string;
  }>({
    notes: "",
  });

  if (!unit) return null;

  const handleReservationDetailsChange = (value: string) => {
    setReservationDetails((prev) => ({ ...prev, notes: value }));
  };

  const validateForm = () => {
    if (!captcha || typeof captcha !== "string") {
      toast({
        title: tString("reservation.errorTitle"),
        description: "Please complete the reCAPTCHA verification",
        variant: "destructive",
      });
      return false;
    }

    const nationalId = user?.username?.trim();
    if (!nationalId) {
      toast({
        title: tString("reservation.authErrorTitle"),
        description: tString("reservation.authErrorDesc"),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateReservation = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const nationalId = user?.username?.trim();

      const reservationRequest: ReservationCreateRequest = {
        unitId: unit.id.toString(),
        projectId: projectId,
        userNationalId: nationalId || "",
        captcha: captcha,
        notes: reservationDetails.notes,
      };

      const result =
        await reservationService.createReservation(reservationRequest);

      // Success - show success message and redirect
      toast({
        title: tString("reservation.successTitle"),
        description: tString("reservation.successPendingApproval"),
        variant: "default",
      });

      onClose();
      navigate("/my-reservations", {
        state: { showReservationPendingAlert: true },
      });
    } catch (error: unknown) {
      console.error("Reservation creation error:", error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Handle specific error cases
      if (errorMessage.includes("Unit is not available")) {
        toast({
          title: "Unit Reserved",
          description:
            "This unit has already been reserved. Please select another unit.",
          variant: "destructive",
        });
        onClose();
        navigate("/projects");
      } else if (errorMessage.includes("duplicate reservation")) {
        toast({
          title: "Duplicate Reservation",
          description: "You already have a reservation for this unit.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("User not found")) {
        toast({
          title: "User Error",
          description: "User account not found. Please check your credentials.",
          variant: "destructive",
        });
        onClose();
        navigate("/login");
      } else if (errorMessage.includes("Unit not found")) {
        toast({
          title: "Unit Error",
          description: "The selected unit is no longer available.",
          variant: "destructive",
        });
      } else {
        toast({
          title: tString("reservation.errorTitle"),
          description: "Failed to create reservation. Please try again.",
          variant: "destructive",
        });
      }

      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset();
      setCaptcha("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setReservationDetails({ notes: "" });
    recaptchaRef.current?.reset();
    setCaptcha("");
  };

  // Detect clicks on the reCAPTCHA challenge iframe
  const isRecaptchaTarget = (target: EventTarget | null): boolean => {
    if (!target) return false;
    const el = target as HTMLElement;
    if (el instanceof HTMLIFrameElement && el.src?.includes("recaptcha"))
      return true;
    return !!(
      el.closest?.("[id*='recaptcha']") || el.closest?.("[class*='grecaptcha']")
    );
  };

  return (
    <>
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80"
            style={{ zIndex: 49 }}
            onClick={handleCancel}
          />,
          document.body,
        )}
      <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          style={{ zIndex: 50 }}
          onPointerDownOutside={(e) => {
            if (isRecaptchaTarget(e.detail.originalEvent.target)) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const target = (e as any).detail?.originalEvent?.target;
            if (isRecaptchaTarget(target)) {
              e.preventDefault();
            }
          }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {tString("reservation.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {tString("reservation.dialogDescriptionNewFlow")}
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
                      {unit.bedrooms > 0 && (
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {tString("reservation.bedrooms")}
                          </span>
                          <span className="text-sm">{unit.bedrooms}</span>
                        </div>
                      )}
                      {unit.bathrooms > 0 && (
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
                        {unit.price ? unit.price.toLocaleString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" className="w-full justify-center">
                    {tString("reservation.available")}
                  </Badge>

                  {/* Reservation Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-200">
                          {tString("reservation.pendingApprovalTitle")}
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                          {tString("reservation.pendingApprovalDesc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-2">
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

                  <Separator />

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
                        handleReservationDetailsChange(e.target.value)
                      }
                    />
                  </div>

                  <Separator />

                  {/* Security Verification Section */}
                  <div className="space-y-2">
                    <Label className="block">
                      {tString("reservation.captchaVerification") ||
                        "Security Verification"}{" "}
                      *
                    </Label>
                    <div className="flex justify-center py-4 border rounded-lg">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
                        onChange={(value) => {
                          setCaptcha(value || "");
                        }}
                        onExpired={() => setCaptcha("")}
                        theme="light"
                        size="normal"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isProcessing}
                      className="flex-1">
                      {tString("reservation.cancel")}
                    </Button>

                    <Button
                      onClick={handleCreateReservation}
                      disabled={isProcessing || !captcha}
                      className="flex-1 bg-gradient-primary hover:opacity-90">
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {tString("reservation.processing")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {tString("reservation.confirmReservation")}
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
