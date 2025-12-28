import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Announcement } from "@/types/announcement";
import { AnnouncementService } from "@/services/announcement-service";

// Mock hook for language - replace with your actual i18n implementation
const useLanguage = () => ({ lang: "en" as "en" | "ar" });

const AnnouncementsScreen = () => {
  const { lang } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await AnnouncementService.getAll();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {lang === "en"
          ? "Latest News & Announcements"
          : "آخر الأخبار والإعلانات"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((item) => {
          // Fallback to English if Arabic is missing, or vice versa
          const title =
            lang === "en" ? item.titleEn : item.titleAr || item.titleEn;
          const location =
            lang === "en"
              ? item.locationEn
              : item.locationAr || item.locationEn;
          const description =
            lang === "en"
              ? item.descriptionEn
              : item.descriptionAr || item.descriptionEn;
          const thumbnail = item.gallery?.[0]?.imagePath || "/placeholder.jpg";

          return (
            <Link
              href={`/announcements/${item.id}`}
              key={item.id}
              className="group">
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {new Date(item.publishDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {title}
                  </h2>
                  {location && (
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      <span className="mr-1">📍</span> {location}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {description}
                  </p>
                  <span className="text-blue-600 font-medium text-sm mt-auto">
                    {lang === "en" ? "Read More →" : "اقرأ المزيد ←"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementsScreen;
