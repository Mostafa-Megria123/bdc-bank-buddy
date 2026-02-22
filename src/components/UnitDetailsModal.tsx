import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/useLanguage";
import { Unit } from "@/types/unit";
import { getFileUrl } from "@/lib/utils";
import {
  Home,
  Maximize,
  BedDouble,
  Bath,
  CheckCircle2,
  XCircle,
  Building2,
  CreditCard,
} from "lucide-react";

interface UnitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
}

export const UnitDetailsModal: React.FC<UnitDetailsModalProps> = ({
  isOpen,
  onClose,
  unit,
}) => {
  const { language, tString } = useLanguage();

  if (!unit) return null;

  const getStatusEn = (u: Unit) => {
    if (typeof u.status === "object" && u.status !== null) {
      return (u.status as { statusEn: string }).statusEn;
    }
    return String(u.status);
  };

  const statusEn = getStatusEn(unit);

  const getGalleryImages = () => {
    const images: string[] = [];
    if (unit.unitGallery && Array.isArray(unit.unitGallery)) {
      unit.unitGallery.forEach((item) => {
        if ("imagePath" in item) {
          images.push(getFileUrl(item.imagePath));
        }
      });
    }
    return images;
  };

  const galleryImages = getGalleryImages();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {language === "ar"
              ? `وحدة رقم ${unit.unitNumber}`
              : `Unit #${unit.unitNumber}`}
          </DialogTitle>
          <DialogDescription>{unit.projectName}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery Section */}
          <div className="space-y-4">
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                <div className="rounded-lg overflow-hidden h-64 w-full">
                  <img
                    src={galleryImages[0]}
                    alt="Main"
                    className="w-full h-full object-cover"
                  />
                </div>
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.slice(1, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="rounded-md overflow-hidden h-20">
                        <img
                          src={img}
                          alt={`Gallery ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                {language === "ar" ? "لا توجد صور" : "No images available"}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  statusEn === "Available"
                    ? "default"
                    : statusEn === "Reserved"
                      ? "destructive"
                      : "secondary"
                }
                className={
                  statusEn === "Available"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                }>
                {language === "ar"
                  ? typeof unit.status === "object" && unit.status !== null
                    ? (unit.status as { statusAr: string }).statusAr
                    : statusEn === "Available"
                      ? "متاح"
                      : statusEn === "Reserved"
                        ? "محجوز"
                        : "مباع"
                  : statusEn}
              </Badge>
              <div className="text-xl font-bold text-primary">
                {unit.price.toLocaleString()}{" "}
                {language === "ar" ? "جنيه مصري" : "EGP"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "النوع" : "Type"}:
                </span>
                <span className="font-medium">
                  {typeof unit.type === "object" && unit.type !== null
                    ? language === "ar"
                      ? (unit.type as { typeAr: string }).typeAr
                      : (unit.type as { typeEn: string }).typeEn
                    : String(unit.type)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "المساحة" : "Area"}:
                </span>
                <span className="font-medium">{unit.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "غرف" : "Bedrooms"}:
                </span>
                <span className="font-medium">{unit.bedrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "حمامات" : "Bathrooms"}:
                </span>
                <span className="font-medium">{unit.bathrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "الدور" : "Floor"}:
                </span>
                <span className="font-medium">{unit.floor}</span>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-2 mt-2">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                {language === "ar" ? "تفاصيل الأسعار" : "Pricing Details"}
              </h4>
              <div className="space-y-2 text-sm">
                {unit.meterPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === "ar" ? "سعر المتر" : "Meter Price"}:
                    </span>
                    <span className="font-medium">
                      {unit.meterPrice.toLocaleString()}{" "}
                      {language === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>
                )}
                {unit.totalAdvancePayment && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === "ar"
                        ? "إجمالي الدفعة المقدمة"
                        : "Total Advance Payment"}
                      :
                    </span>
                    <span className="font-medium">
                      {unit.totalAdvancePayment.toLocaleString()}{" "}
                      {language === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>
                )}
                {unit.downPayment && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">
                      {tString("myReservations.table.downPayment")}:
                    </span>
                    <span className="font-bold text-primary">
                      {unit.downPayment.toLocaleString()}{" "}
                      {language === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">
                {language === "ar" ? "المميزات" : "Features"}
              </h4>
              <div className="flex gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    unit.balcony ? "text-green-600" : "text-muted-foreground"
                  }`}>
                  {unit.balcony ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {language === "ar" ? "شرفة" : "Balcony"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    unit.parking ? "text-green-600" : "text-muted-foreground"
                  }`}>
                  {unit.parking ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {language === "ar" ? "موقف سيارات" : "Parking"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            {language === "ar" ? "إغلاق" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
