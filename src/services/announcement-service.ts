import axios from "@/lib/axios";
import { Announcement } from "@/types/announcement";
import { endpoints, config } from "@/config";
import { UnitType } from "@/types/unit-type";
import { AnnouncementCategory } from "@/types/announcement-category";

const API_URL = endpoints.announcements;

// Normalize backend response to Announcement type
const normalizeAnnouncement = (data: unknown): Announcement => {
  const obj = data as Record<string, unknown>;
  return {
    id: obj.id as number,
    titleEn: obj.titleEn as string | undefined,
    titleAr: obj.titleAr as string | undefined,
    contentEn: obj.contentEn as string | undefined,
    contentAr: obj.contentAr as string | undefined,
    type: obj.type as UnitType | string | undefined,
    category: obj.category as AnnouncementCategory | string | undefined,
    publishDate: obj.publishDate as string,
    expiryDate: obj.expiryDate as string,
    authorEn: obj.authorEn as string | undefined,
    authorAr: obj.authorAr as string | undefined,
    locationEn: obj.locationEn as string | undefined,
    locationAr: obj.locationAr as string | undefined,
    descriptionEn: obj.descriptionEn as string | undefined,
    descriptionAr: obj.descriptionAr as string | undefined,
    gallery: obj.gallery as { imagePath: string }[] | null | undefined,
    projectBrochure: obj.projectBrochure as string | undefined,
    floorPlans: obj.floorPlans as string | undefined,
    createdAt: obj.createdAt as string | undefined,
    updatedAt: obj.updatedAt as string | undefined,
    createdBy: obj.createdBy as string | null | undefined,
    updatedBy: obj.updatedBy as string | null | undefined,
  };
};

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const AnnouncementService = {
  /**
   * Fetch all announcements with optional pagination
   */
  // Get all announcements
  getAll: async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Announcement>> => {
    const url = `${API_URL}?page=${page}&size=${size}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      return {
        ...data,
        content: (data.content || []).map((item: unknown) =>
          normalizeAnnouncement(item)
        ),
      };
    } catch (error) {
      console.error("Error fetching announcements:", error, "URL:", url);
      throw error;
    }
  },

  // Get a single announcement by ID
  getById: async (id: number): Promise<Announcement> => {
    const url = `${API_URL}/${id}`;
    try {
      const response = await axios.get(url);
      const result = response.data;
      return normalizeAnnouncement(result);
    } catch (error) {
      console.error("Error fetching announcement:", error, "URL:", url);
      throw error;
    }
  },

  /**
   * Fetch latest announcements (e.g. for a homepage widget)
   */
  getLatest: async (limit = 3): Promise<Announcement[]> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    const response = await axios.get(`${API_URL}/latest?${params}`);
    const data = response.data;
    return Array.isArray(data) ? data.map(normalizeAnnouncement) : [];
  },
};
