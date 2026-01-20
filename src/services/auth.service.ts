import { fetchClient } from "@/services/fetch-client";
import { endpoints } from "@/config";
import {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/lib/validations";
import axios from "@/lib/axios";
import { User } from "@/types/user";

const API_URL = endpoints.auth;

export const authService = {
  register: async (data: RegisterFormData) => {
    // Convert to FormData to handle file upload
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    return fetchClient(`${API_URL}/register`, {
      method: "POST",
      body: formData,
    });
  },

  login: async (data: LoginFormData) => {
    return fetchClient(`${API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verifyEmail: async (token: string) => {
    return fetchClient(`${API_URL}/verify-email?token=${token}`, {
      method: "POST",
    });
  },

  refreshToken: async (token: string) => {
    return fetchClient(`${API_URL}/refresh-token`, {
      method: "POST",
      body: JSON.stringify({ refreshToken: token }),
    });
  },

  forgotPassword: async (data: ForgotPasswordFormData) => {
    return fetchClient(`${API_URL}/forgot-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: ResetPasswordFormData & { token: string }) => {
    return fetchClient(`${endpoints.auth}/reset-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  },
};
