import { Unit } from "./unit";
import { ProjectStatus } from "./project-status";

export interface Project {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  location: string;
  projectStatus: ProjectStatus;
  totalUnits: number;
  priceMin: number;
  priceMax: number;
  developerEn: string;
  developerAr: string;
  startDate: string;
  endDate: string;
  additionalDescriptionEn: string;
  additionalDescriptionAr: string;
  locationLat?: number;
  locationLng?: number;
  amenitiesEn: string;
  amenitiesAr: string;
  projectGallery: { imagePath: string }[];
  projectBrochurePdfUrl?: string;
  floorPlansPdfUrl?: string;
  units: Unit[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFilter {
  status?: ProjectStatus[];
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}
