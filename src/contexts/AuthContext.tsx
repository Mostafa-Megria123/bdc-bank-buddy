import React, { useState, ReactNode, useEffect } from "react";
import { AuthContext } from "./AuthContextCore";
import type { AuthContextType } from "./authTypes";
import { User } from "@/types/user";
import { authService } from "@/services/auth.service";
import { RegisterFormData } from "@/lib/validations";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle token expiration event from fetchClient
  useEffect(() => {
    const handleTokenExpired = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    };

    window.addEventListener("token-expired", handleTokenExpired);
    return () => {
      window.removeEventListener("token-expired", handleTokenExpired);
    };
  }, []);

  const login: AuthContextType["login"] = async (
    nationalId,
    password,
    captcha,
  ) => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        nationalId,
        password,
        captcha,
      });

      // Store tokens in localStorage
      if (response.token) {
        localStorage.setItem("accessToken", response.token);
      }
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      // Store preferred language
      if (response.preferredLanguage) {
        localStorage.setItem("preferredLanguage", response.preferredLanguage);
      }

      // API returns user object directly, not wrapped in response.user
      const userData = response.user || response;
      setUser(userData);
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register: AuthContextType["register"] = async (userData) => {
    setIsLoading(true);
    try {
      // Call the actual backend API
      await authService.register(userData as RegisterFormData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    try {
      // Call the logout API to invalidate the token
      await authService.logout();
    } catch (error) {
      // Clear user state even if API call fails
    } finally {
      // Always clear local state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("csrfToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
