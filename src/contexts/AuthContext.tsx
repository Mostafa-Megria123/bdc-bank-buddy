import React, { useState, ReactNode } from "react";
import { AuthContext } from "./AuthContextCore";
import type { AuthContextType, User } from "./authTypes";
import { authService } from "@/services/auth.service";
import { RegisterFormData } from "@/lib/validations";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login: AuthContextType["login"] = async (
    nationalId,
    password,
    captcha,
  ) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockUser: User = {
        id: "1",
        nationalId,
        name: "John Doe",
        email: "john@example.com",
        mobile: "01234567890",
      };
      setUser(mockUser);
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
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

  const logout: AuthContextType["logout"] = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
