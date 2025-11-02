export type Announcement = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  publishDate: string;
  contentKey: string;
  authorKey: string;
  typeKey: string;
  categoryKey: string;
  locationKey: string;
  gallery?: string[];
  projectBrochureUrl?: string;
  floorPlansUrl?: string;
};

export interface AnnouncementGridItem {
  id: string;
  image: string;
  title: string;
  description: string;
  publishDate: string;
  link: string;
}
