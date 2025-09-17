import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/useLanguage";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import Announcements from "./pages/Announcements";
import Projects from "./pages/Projects";
import MyReservations from "./pages/MyReservations";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import { AnnouncementDetails } from "@/components/AnnouncementDetails";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

// Wrapper to fetch announcement by ID from params
function AnnouncementDetailsWrapper() {
  const { t, tString } = useLanguage();
  const { id } = useParams();
  const announcementText = t(`announcementDetails.details.${id}`);

  // The `t` function returns the key if not found.
  // We check if the result is an object to confirm it was found.
  if (typeof announcementText !== 'object' || announcementText === null) {
    return <div className="p-8 text-center">{tString('announcementDetails.notFound')}</div>;
  }

  return <AnnouncementDetails />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <ScrollToTop />
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
                  <Route path="/projects" element={<Projects />} />
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
