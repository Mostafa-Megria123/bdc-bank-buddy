import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";
import { ProjectService } from "@/services/project-service";
import { Project } from "@/types/project";
import { getFileUrl } from "@/lib/utils";
import { ReservationModal } from "@/components/ReservationModal";
import { UnitDetailsModal } from "@/components/UnitDetailsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/ui/lightBox";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building,
  Tag,
  Download,
  Search,
} from "lucide-react";
import { Unit } from "@/types/unit";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, tString } = useLanguage();
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="absolute inset-0 flex items-end p-8 sm:p-16">
          <div className="max-w-4xl text-white">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-primary px-3 py-1 rounded-full text-sm font-medium">
                {language === "ar"
                  ? project.projectStatus.statusAr
                  : project.projectStatus.statusEn}
              </span>
              <span className="flex items-center text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <MapPin className="h-3 w-3 mr-1" />
                {project.location}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{description}</p>
          </div>
        </div>

        <div className="absolute top-8 left-8">
          <Button
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
            onClick={() => navigate("/projects")}>
            {language === "ar" ? (
              <ArrowRight className="ml-2 h-4 w-4" />
            ) : (
              <ArrowLeft className="mr-2 h-4 w-4" />
            )}
            {tString("projectDetails.backToProjects")}
          </Button>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">{tString("projectDetails.aboutProject")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">{tString("projectDetails.developer")}</p>
                      <p className="font-medium">{developer}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {tString("projectDetails.priceRange")}
                      </p>
                      <p className="font-medium">
                        {project.priceMin.toLocaleString()} -{" "}
                        {project.priceMax.toLocaleString()}{" "}
                        {tString("common.currency")}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.split(",").map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-muted px-3 py-1 rounded-md text-sm">
                      {amenity.trim()}
                    </span>
                  ))}
                </div>

                {additionalDescription && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">
                      {tString("projectDetails.additionalDescription")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {additionalDescription}
                    </p>
                  </div>
                )}
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
                              : "border-primary/30 hover:border-primary/50"
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
                                      {language === "ar" ? "النوع" : "Type"}
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
                                      {language === "ar" ? "المساحة" : "Area"}
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {unit.area}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      {language === "ar" ? "الغرف" : "Bedrooms"}
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {unit.bedrooms}{" "}
                                      {language === "ar" ? "غرف" : "BR"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      {language === "ar"
                                        ? "الحمامات"
                                        : "Bathrooms"}
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {unit.bathrooms}{" "}
                                      {language === "ar" ? "حمامات" : "BA"}
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
                                    {language === "ar" ? "جنيه مصري" : "EGP"}
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
                                    {language === "ar"
                                      ? "احجز الآن"
                                      : "Reserve Now"}
                                  </Button>
                                )}

                                {statusEn === "Reserved" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="whitespace-nowrap">
                                    {language === "ar" ? "محجوز" : "Reserved"}
                                  </Button>
                                )}

                                {statusEn === "Sold" && (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled
                                    className="whitespace-nowrap">
                                    {language === "ar" ? "مباع" : "Sold"}
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
                            (u) => getUnitStatusEn(u) === "Available"
                          ).length
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" ? "متاح" : "Available"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">
                        {
                          project.units.filter(
                            (u) => getUnitStatusEn(u) === "Reserved"
                          ).length
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" ? "محجوز" : "Reserved"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">
                        {
                          project.units.filter(
                            (u) => getUnitStatusEn(u) === "Sold"
                          ).length
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" ? "مباع" : "Sold"}
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
                    {language === "ar" ? "معرض الصور" : "Gallery"}
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
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <Card className="bg-primary text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Interested?</h3>
                <p className="mb-6 text-white/90">
                  Download the brochure or contact us for more details.
                </p>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Brochure
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white text-white hover:bg-white/10">
                    Contact Sales
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

      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          startIndex={lightboxStartIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
