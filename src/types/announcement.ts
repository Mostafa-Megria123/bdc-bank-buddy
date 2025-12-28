import { UnitType } from "@/types/unit-type";
import { AnnouncementCategory } from "@/types/announcement-category";

export type Announcement = {
  id: number;
  titleEn?: string;
  titleAr?: string;
  contentEn?: string;
  contentAr?: string;
  type?: UnitType | string;
  category?: AnnouncementCategory | string;
  publishDate: string;
  expiryDate: string;
  authorEn?: string;
  authorAr?: string;
  locationEn?: string;
  locationAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  gallery?: { imagePath: string }[] | null;
  projectBrochure?: string;
  floorPlans?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
};

export interface AnnouncementGridItem {
  id: string;
  image: string;
  title: string;
  description: string;
  publishDate: string;
  link: string;
}
