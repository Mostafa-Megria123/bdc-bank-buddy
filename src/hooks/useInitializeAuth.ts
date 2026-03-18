import { useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import {
  isTokenExpired,
  isValidTokenFormat,
  getTokenTimeRemaining,
} from "@/lib/jwt-utils";
import { fetchCsrfToken } from "@/lib/axios";
import { authService } from "@/services/auth.service";

/**
 * Hook to validate user session on app load
 * Validates token format and expiration
 * Logout happens only when:
 * 1. User clicks the logout button
 * 2. Session is expired (calls logout API to invalidate backend session)
 * 3. API call returns token-expired event
 */
export const useInitializeAuth = () => {
  const { user } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      // Skip validation on login/register pages
      const isAuthPage =
        window.location.pathname.includes("/login") ||
        window.location.pathname.includes("/register") ||
        window.location.pathname.includes("/forgot-password") ||
        window.location.pathname.includes("/reset-password");

      if (isAuthPage) {
        return;
      }

      const accessToken =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        return;
      }

      // Validate token format and expiration
      const isValidFormat = isValidTokenFormat(accessToken);
      const isExpired = isTokenExpired(accessToken);

      if (!isValidFormat) {
        // Clear tokens for invalid format but don't call logout API (session already invalid)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return;
      }

      if (isExpired) {
        // Token is expired - call logout to invalidate backend session
        await authService.logout();
        return;
      }

      // Token is valid - fetch CSRF token for protected requests
      try {
        const csrfToken = await fetchCsrfToken();
      } catch (error) {
        console.error(
          "Error fetching CSRF token during initialization:",
          error,
        );
      }
    };

    initializeAuth();
  }, []);
};
