import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Announcement = {
  id: string;
  title: string;
  date: string;
  content: string;
  images?: string[];
  links?: { label: string; url: string }[];
  author?: string;
  category?: string;
  location?: string;
};

interface AnnouncementDetailsProps {
  announcement: Announcement;
  onBack?: () => void;
}

import { useNavigate } from "react-router-dom";

export const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({
  announcement,
  onBack,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          className="flex items-center gap-2 mb-6 text-primary hover:underline"
          onClick={() => navigate('/announcements')}
        >
          ← Back to Announcements
        </button>
      {/* Hero Section with Main Image */}
      {announcement.images && announcement.images.length > 0 && (
        <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
          <img
            src={announcement.images[0]}
            alt={announcement.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="bg-blue-500 px-2 py-1 rounded">{announcement.category}</span>
              <span>•</span>
              <span>{announcement.date}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{announcement.title}</h1>
            <div className="flex items-center gap-4">
              {announcement.author && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">By {announcement.author}</span>
                </div>
              )}
              {announcement.location && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍 {announcement.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Content Section */}
          <div className="prose max-w-none mb-8">
            {announcement.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Additional Images */}
          {announcement.images && announcement.images.length > 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcement.images.slice(1).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Additional view ${idx + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Links Section */}
          {announcement.links && announcement.links.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Related Links</h2>
              <div className="flex flex-wrap gap-4">
                {announcement.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  </div>
  );
};