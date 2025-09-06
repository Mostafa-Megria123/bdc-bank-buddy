import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import Announcements from "./pages/Announcements";
import MyReservations from "./pages/MyReservations";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
// import AnnouncementDetails from "./components/AnnouncementDetails";
import { AnnouncementDetails } from "@/components/AnnouncementDetails";
import { useParams } from "react-router-dom";

const queryClient = new QueryClient();

// Dummy data for demonstration
const announcements = [
  {
    id: "1",
    title: "Grand Opening: BDC Downtown Branch",
    date: "2025-09-06",
    content: `We are thrilled to announce the grand opening of our new Downtown Branch! 

This state-of-the-art facility represents our commitment to providing exceptional service to our valued customers.

Key Features:
• Modern banking facilities with cutting-edge technology
• Dedicated customer service areas
• Private consultation rooms
• 24/7 ATM services
• Accessible parking

Join us for the celebration on September 15th, 2025, from 10:00 AM to 4:00 PM. The event will include:
• Official ribbon-cutting ceremony
• Guided tours of the new facility
• Special presentations
• Refreshments and entertainment
• Exclusive opening day offers

Location: 123 Financial District, Downtown
RSVP required for attendance.`,
    images: [
      "/src/assets/hero-building.jpg",
      "/src/assets/announcement-1.jpg"
    ],
    links: [
      { label: "RSVP for the Opening Ceremony", url: "https://example.com/rsvp" },
      { label: "View Branch Location", url: "https://maps.google.com" },
      { label: "Download Event Schedule", url: "https://example.com/schedule" }
    ],
    author: "John Smith",
    category: "Company News",
    location: "Downtown Branch"
  },
  {
    id: "2",
    title: "Exclusive Launch: Green Valley Residences",
    date: "2025-09-07",
    content: `We are excited to introduce our latest premium residential project - Green Valley Residences.

Located in the heart of the city, this sustainable living space combines luxury with eco-friendly design.

Project Highlights:
• 1, 2, and 3-bedroom luxury apartments
• Smart home technology integration
• Sustainable design with LEED certification
• Rooftop garden and community spaces
• Premium amenities including:
  - Indoor swimming pool
  - Fully equipped fitness center
  - Children's play area
  - Co-working spaces

Special Launch Offers:
• Early bird discount of 10% for first 50 bookings
• Flexible payment plans available
• Special rates for BDC account holders
• Complimentary interior design consultation

Visit our show apartment or schedule a virtual tour today.`,
    images: [
      "/src/assets/project-1.jpg",
      "/src/assets/hero-building.jpg"
    ],
    links: [
      { label: "View Project Details", url: "https://example.com/project" },
      { label: "Download Brochure", url: "https://example.com/brochure" },
      { label: "Schedule a Tour", url: "https://example.com/tour" }
    ],
    author: "Sarah Johnson",
    category: "Projects",
    location: "City Center"
  }
];

// Wrapper to fetch announcement by ID from params
function AnnouncementDetailsWrapper() {
  const { id } = useParams();
  const announcement = announcements.find((a) => a.id === id);

  if (!announcement) {
    return <div className="p-8 text-center">Announcement not found.</div>;
  }

  return <AnnouncementDetails announcement={announcement} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route
                    path="/announcements/:id"
                    element={<AnnouncementDetailsWrapper />}
                  />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/my-reservations" element={<MyReservations />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
