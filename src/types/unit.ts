import { UnitStatus } from "./unit-status";
import { UnitType } from "./unit-type";

export interface Unit {
  id: string;
  unitNumber: string;
  projectId: string;
  projectName: string;
  type: UnitType | string;
  floor: number;
  area: number;
  price: number;
  status: UnitStatus | string;
  bedrooms?: number;
  bathrooms?: number;
  balcony: boolean;
  parking: boolean;
  createdAt: Date;
  unitGallery: (File | { imagePath: string })[];
  existingUnitGalleryPaths?: string[];
}
