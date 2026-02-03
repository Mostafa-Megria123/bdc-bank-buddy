import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/useAuth";
import { getTokenTimeRemaining, isTokenExpired } from "@/lib/jwt-utils";
import axios from "@/lib/axios";
import { endpoints } from "@/config";

/**
 * Hook to automatically refresh access token before it expires
 * Runs a check every minute and refreshes when < 5 minutes remaining
 */
export const useTokenRefresh = () => {
  const { logout } = useAuth();
  const intervalRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // Skip if already refreshing
      if (isRefreshingRef.current) {
        return;
      }

      const accessToken =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        // No tokens, user not logged in
        return;
      }

      // Check if token is expired
      if (isTokenExpired(accessToken)) {
        await logout();
        return;
      }

      const timeRemaining = getTokenTimeRemaining(accessToken);

      // Refresh if less than 5 minutes remaining (300 seconds)
      const REFRESH_THRESHOLD = 300;

      if (timeRemaining < REFRESH_THRESHOLD) {
        isRefreshingRef.current = true;

        try {
          const response = await axios.post(
            `${endpoints.auth}/refresh-token`,
            {},
          );
          const responseData = response?.data;

          const newToken = responseData?.token || responseData?.accessToken;
          const newRefreshToken = responseData?.refreshToken;

          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            localStorage.setItem("token", newToken);

            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
          } else {
            await logout();
          }
        } catch (error) {
          await logout();
        } finally {
          isRefreshingRef.current = false;
        }
      }
    };

    // Run check immediately on mount
    checkAndRefreshToken();

    // Set up interval to check every minute (60000ms)
    intervalRef.current = window.setInterval(() => {
      checkAndRefreshToken();
    }, 60000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [logout]);
};
