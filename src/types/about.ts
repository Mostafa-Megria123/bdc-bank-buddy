import { z } from "zod";

export interface About {
  id?: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export const aboutSchema = z.object({
  titleEn: z.string().min(1, "English title is required."),
  titleAr: z.string().min(1, "Arabic title is required."),
  descriptionEn: z.string().min(1, "English description is required."),
  descriptionAr: z.string().min(1, "Arabic description is required."),
});
