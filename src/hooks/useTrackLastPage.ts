import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { redirectService } from "@/services/redirect.service";

/**
 * Hook to track the last visited page for redirect after login
 * Should be used in a high-level component like App.tsx
 */
export const useTrackLastPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Store the current page if it's not an auth page
    redirectService.storeLastPage(location.pathname);
  }, [location.pathname]);
};
