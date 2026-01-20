import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import { ProjectService } from "@/services/project-service";
import { Project } from "@/types/project";
import { getFileUrl, formatDate } from "@/lib/utils";
import { ReservationModal } from "@/components/ReservationModal";
import { UnitDetailsModal } from "@/components/UnitDetailsModal";
import { ProjectLocation } from "@/components/ProjectLocation";
import { RequestInfoModal } from "@/components/RequestInfoModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/ui/lightBox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building,
  Tag,
  Download,
  Search,
  Home,
  Phone,
  Mail,
  Calendar,
  Share2,
} from "lucide-react";
import { Unit } from "@/types/unit";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, tString } = useLanguage();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null);
  const [detailUnit, setDetailUnit] = React.useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [isReservationModalOpen, setIsReservationModalOpen] =
    React.useState(false);
  const [isUnitDetailsModalOpen, setIsUnitDetailsModalOpen] =
    React.useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] =
    React.useState(false);
  const [showLoginAlert, setShowLoginAlert] = React.useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await ProjectService.getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleReserveUnit = (unit: Unit) => {
    // Check if user is logged in
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    setSelectedUnit(unit);
    setIsReservationModalOpen(true);
  };

  const handleUnitClick = (unit: Unit) => {
    setDetailUnit(unit);
    setIsUnitDetailsModalOpen(true);
  };

  const closeReservationModal = () => {
    setIsReservationModalOpen(false);
    setSelectedUnit(null);
  };

  const handleShare = () => {
    if (navigator.share && project) {
      navigator
        .share({
          title: project.nameAr,
          text: project.descriptionAr,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing project", error));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Button onClick={() => navigate("/projects")}>
            {tString("projectDetails.backToProjects")}
          </Button>
        </div>
      </div>
    );
  }

  const name = language === "ar" ? project.nameAr : project.nameEn;
  const description =
    language === "ar" ? project.descriptionAr : project.descriptionEn;
  const developer =
    language === "ar" ? project.developerAr : project.developerEn;
  const amenities =
    language === "ar" ? project.amenitiesAr : project.amenitiesEn;
  const additionalDescription =
    language === "ar"
      ? project.additionalDescriptionAr
      : project.additionalDescriptionEn;
  const heroImage = project.projectGallery?.[0]?.imagePath
    ? getFileUrl(project.projectGallery[0].imagePath)
    : "/placeholder.svg";

  const galleryImages =
    project?.projectGallery.map((img) => getFileUrl(img.imagePath)) || [];

  const openLightbox = (index: number) => {
    setLightboxStartIndex(index);
    setLightboxOpen(true);
  };

  const getUnitStatusEn = (unit: Unit) => {
    if (typeof unit.status === "object" && unit.status !== null) {
      return (unit.status as { statusEn: string }).statusEn;
    }
    return String(unit.status);
  };

  const availableUnitsCount = project?.units
    ? project.units.filter((u) => getUnitStatusEn(u) === "Available").length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden group">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-60" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-20">
          <div className="max-w-5xl w-full animate-fade-in space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 text-sm font-medium border-0 shadow-lg">
                {language === "ar"
                  ? project.projectStatus.statusAr
                  : project.projectStatus.statusEn}
              </Badge>
              <Badge
                variant="outline"
                className="bg-black/30 backdrop-blur-md border-white/20 text-white px-4 py-1.5 text-sm font-medium">
                <MapPin className="h-3.5 w-3.5 mr-2" />
                {project.location}
              </Badge>
              <Badge
                variant="outline"
                className="bg-black/30 backdrop-blur-md border-white/20 text-white px-4 py-1.5 text-sm font-medium">
                <Building className="h-3.5 w-3.5 mr-2" />
                {developer}
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                {name}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed line-clamp-3 drop-shadow-md">
                {description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/20 flex flex-wrap gap-8 text-white">
              <div>
                <p className="text-sm text-gray-300 mb-1">
                  {tString("projectDetails.priceRange")}
                </p>
                <p className="text-xl font-semibold">
                  {project.priceMin.toLocaleString()} -{" "}
                  {project.priceMax.toLocaleString()}{" "}
                  <span className="text-sm font-normal">
                    {tString("common.currency")}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">
                  {tString("projectDetails.availableUnits")}
                </p>
                <p className="text-xl font-semibold">
                  {availableUnitsCount}{" "}
                  <span className="text-sm font-normal">
                    {tString("projectDetails.of")} {project.totalUnits}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-6 left-6 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/20 backdrop-blur-md text-white hover:bg-black/40 rounded-full h-12 w-12 border border-white/10"
            onClick={() => navigate("/projects")}
            title={tString("projectDetails.backToProjects")}>
            {language === "ar" ? (
              <ArrowRight className="h-6 w-6" />
            ) : (
              <ArrowLeft className="h-6 w-6" />
            )}
          </Button>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description Section */}
            {additionalDescription && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {tString("projectDetails.projectDescription")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {additionalDescription}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features & Amenities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {tString("projectDetails.amenities")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.split(",").map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        {feature.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Units Section */}
            {project.units && project.units.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {tString("projectDetails.availableUnits")}
                  </h2>

                  {/* Units Grid */}
                  <div className="space-y-4">
                    {project.units.map((unit) => {
                      const statusEn = getUnitStatusEn(unit);
                      return (
                        <Card
                          key={unit.unitNumber}
                          onClick={() => handleUnitClick(unit)}
                          className={`border-2 transition-all duration-300 hover:shadow-brand cursor-pointer ${
                            statusEn === "Reserved"
                              ? "border-destructive/30 bg-destructive/5"
                              : statusEn === "Sold"
                                ? "border-muted bg-muted/20"
                                : "border-primary/30 hover:border-primary/50 cursor-pointer"
                          }`}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              {/* Unit Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {language === "ar"
                                      ? `وحدة رقم ${unit.unitNumber}`
                                      : `Unit #${unit.unitNumber}`}
                                  </h3>
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
                                      ? typeof unit.status === "object" &&
                                        unit.status !== null
                                        ? (unit.status as { statusAr: string })
                                            .statusAr
                                        : statusEn === "Available"
                                          ? "متاح"
                                          : statusEn === "Reserved"
                                            ? "محجوز"
                                            : "مباع"
                                      : statusEn}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      {tString("reservation.type")}
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {typeof unit.type === "object" &&
                                      unit.type !== null
                                        ? language === "ar"
                                          ? (unit.type as { typeAr: string })
                                              .typeAr
                                          : (unit.type as { typeEn: string })
                                              .typeEn
                                        : String(unit.type)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      {tString("reservation.area")}
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {unit.area}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      {tString("reservation.bedrooms")}
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {unit.bedrooms}{" "}
                                      {tString(
                                        "projectDetails.units.bedroomsSuffix",
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      {tString("reservation.bathrooms")}
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {unit.bathrooms}{" "}
                                      {tString(
                                        "projectDetails.units.bathroomsSuffix",
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Price and Action */}
                              <div className="flex flex-col md:items-end gap-3">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-primary">
                                    {unit.price.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {tString("common.currency")}
                                  </p>
                                </div>

                                {statusEn === "Available" && (
                                  <Button
                                    size="sm"
                                    className="bg-gradient-primary hover:opacity-90 whitespace-nowrap"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReserveUnit(unit);
                                    }}>
                                    {tString("projectDetails.units.reserveNow")}
                                  </Button>
                                )}

                                {statusEn === "Reserved" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="whitespace-nowrap">
                                    {tString(
                                      "projectDetails.units.status.reserved",
                                    )}
                                  </Button>
                                )}

                                {statusEn === "Sold" && (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled
                                    className="whitespace-nowrap">
                                    {tString(
                                      "projectDetails.units.status.sold",
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Units Summary */}
                  <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {
                          project.units.filter(
                            (u) => getUnitStatusEn(u) === "Available",
                          ).length
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tString("projectDetails.units.status.available")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">
                        {
                          project.units.filter(
                            (u) => getUnitStatusEn(u) === "Reserved",
                          ).length
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tString("projectDetails.units.status.reserved")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">
                        {
                          project.units.filter(
                            (u) => getUnitStatusEn(u) === "Sold",
                          ).length
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tString("projectDetails.units.status.sold")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery Grid */}
            {project.projectGallery.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {tString("projectDetails.gallery")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-lg group cursor-pointer"
                        onClick={() => openLightbox(index)}>
                        <img
                          src={image}
                          alt={`${name} ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder.svg")
                          }
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Search className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Section */}
            <ProjectLocation
              location={project.location}
              lat={project.locationLat}
              lng={project.locationLng}
            />
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {tString("projectDetails.quickInfo")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {tString("projectDetails.location")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Building className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {tString("projectDetails.developer")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {developer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Home className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {tString("projectDetails.availableUnits")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {availableUnitsCount} {tString("projectDetails.of")}{" "}
                        {project.totalUnits}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {tString("projectDetails.displayPeriod")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(project.startDate)} -{" "}
                        {formatDate(project.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Tag className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {tString("projectDetails.priceRange")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.priceMin.toLocaleString()} -{" "}
                        {project.priceMax.toLocaleString()}{" "}
                        {tString("common.currency")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsRequestInfoModalOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    {tString("projectDetails.requestInfo")}
                  </Button>

                  {navigator.share && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      {tString("projectDetails.shareProject")}
                    </Button>
                  )}

                  {project.projectBrochurePdfUrl && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={getFileUrl(project.projectBrochurePdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        {tString("projectDetails.downloadBrochure")}
                      </a>
                    </Button>
                  )}

                  {project.floorPlansPdfUrl && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={getFileUrl(project.floorPlansPdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        {tString("projectDetails.downloadFloorPlans")}
                      </a>
                    </Button>
                  )}

                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    asChild>
                    <a href="tel:16990">
                      <Phone className="mr-2 h-4 w-4" />
                      {tString("projectDetails.callUs")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
        unit={selectedUnit}
        projectName={language === "ar" ? project.nameAr : project.nameEn}
      />

      <UnitDetailsModal
        isOpen={isUnitDetailsModalOpen}
        onClose={() => setIsUnitDetailsModalOpen(false)}
        unit={detailUnit}
      />

      <RequestInfoModal
        isOpen={isRequestInfoModalOpen}
        onClose={() => setIsRequestInfoModalOpen(false)}
        projectName={language === "ar" ? project.nameAr : project.nameEn}
      />

      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          startIndex={lightboxStartIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Login Required Alert */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tString("reservation.loginRequired") || "Login Required"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tString("reservation.loginRequiredMessage") ||
                "You must be logged in to make a reservation. Please log in or create an account."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>
              {tString("common.cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/login", { state: { from: location.pathname } })}>
              {tString("common.login") || "Go to Login"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetail;
