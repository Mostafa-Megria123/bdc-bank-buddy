import { useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import {
  isTokenExpired,
  isValidTokenFormat,
  getTokenTimeRemaining,
} from "@/lib/jwt-utils";

/**
 * Hook to validate user session on app load
 * Validates token expiration and automatically logs out if expired
 */
export const useInitializeAuth = () => {
  const { logout, user } = useAuth();

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
      const timeRemaining = getTokenTimeRemaining(accessToken);

      if (!isValidFormat) {
        await logout();
        return;
      }

      if (isExpired) {
        await logout();
        return;
      }
    };

    initializeAuth();
  }, [logout]);
};
