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
import Projects from "./pages/Projects";
import MyReservations from "./pages/MyReservations";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/TermsPage";
import { AnnouncementDetails } from "@/components/AnnouncementDetails";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            basename="/bdc-real-estate"
            future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
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
                    element={<AnnouncementDetails />}
                  />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/my-reservations" element={<MyReservations />} />
                  <Route path="/terms" element={<TermsPage />} />
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
