import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/useLanguage";
import L from "leaflet";

// Fix for default marker icon in Leaflet with React/Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ProjectLocationProps {
  location: string;
  lat?: number;
  lng?: number;
}

export const ProjectLocation: React.FC<ProjectLocationProps> = ({
  location,
  lat,
  lng,
}) => {
  const { language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {language === "ar" ? "الموقع" : "Location"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Address Link */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${
            lat || location
          },${lng || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-primary cursor-pointer transition-colors block">
          <p>{location}</p>
        </a>

        {/* Map Preview Link */}
        {isClient && lat && lng && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-[300px] rounded-lg overflow-hidden cursor-pointer border border-border">
            <div className="h-full w-full pointer-events-none">
              <MapContainer
                center={[lat, lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
                dragging={false}
                zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
          </a>
        )}
      </CardContent>
    </Card>
  );
};
