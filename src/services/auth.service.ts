import axios from "@/lib/axios";
import { endpoints } from "@/config";
import {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/lib/validations";
import { User } from "@/types/user";

const AUTH_API_URL = endpoints.auth;
const REGISTER_API_URL = endpoints.register;
const LOGIN_API_URL = endpoints.login;
const LOGOUT_API_URL = endpoints.logout;
const VERIFY_NOW_API_URL = endpoints.verifyNow;
const VERIFY_EMAIL_API_URL = endpoints.verifyEmail;
const REFRESH_TOKEN_API_URL = endpoints.refreshToken;
const FORGOT_PASSWORD_API_URL = endpoints.forgoetPassword;
const RESET_PASSWORD_API_URL = endpoints.resetPassword;
const ME_API_URL = endpoints.me;

export const authService = {
  register: async (data: RegisterFormData) => {
    const formData = new FormData();

    formData.append("nationalId", data.nationalId);
    formData.append("fullName", data.name);
    formData.append("nationalIdFactoryNumber", data.printedNumber);
    formData.append("mobileNumber", data.mobile);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("countryOfBirth", data.nationality);
    formData.append("placeOfResidence", data.residence);
    formData.append("maritalStatus", data.maritalStatus);
    formData.append("preferredLanguage", data.notificationLanguage);
    formData.append("address", data.address);
    formData.append("captcha", data.captcha);
    formData.append("phone", data.phone);

    if (data.nationalIdImage instanceof File) {
      formData.append("nationalIdImage", data.nationalIdImage);
    }

    const response = await axios.post(`${REGISTER_API_URL}`, formData);
    return response.data;
  },

  login: async (data: LoginFormData) => {
    try {
      const response = await axios.post(`${LOGIN_API_URL}`, {
        username: data.nationalId,
        password: data.password,
      });

      if (!response || !response.data) {
        throw new Error("Invalid login response: no data");
      }

      const authData = response.data;

      // Store tokens
      if (authData.token) {
        localStorage.setItem("accessToken", authData.token);
      }
      if (authData.refreshToken) {
        localStorage.setItem("refreshToken", authData.refreshToken);
      }

      // CSRF token is already extracted by axios response interceptor
      // from the X-XSRF-TOKEN header sent by the backend
      // Add small delay to ensure token is fully cached before returning
      await new Promise((resolve) => setTimeout(resolve, 100));

      return authData;
    } catch (error) {
      // Extract backend error message
      if (axios.isAxiosError(error) && error.response?.data) {
        const backendError = error.response.data;
        const errorMessage =
          backendError.error?.message ||
          backendError.message ||
          backendError.error ||
          "Login failed. Please check your credentials.";
        throw new Error(errorMessage);
      }

      throw error;
    }
  },

  refreshToken: async (token: string) => {
    const response = await axios.post(`${REFRESH_TOKEN_API_URL}`, {
      refreshToken: token,
    });
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordFormData) => {
    const response = await axios.post(`${FORGOT_PASSWORD_API_URL}`, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordFormData & { token: string }) => {
    const resetPasswordRequest = {
      token: data.token,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    };

    const response = await axios.post(
      `${RESET_PASSWORD_API_URL}`,
      resetPasswordRequest,
    );
    return response.data;
  },

  verifyEmail: async (token: string): Promise<string> => {
    const response = await axios.get(VERIFY_EMAIL_API_URL, {
      params: { token },
    });
    return response.data;
  },

  verifyNow: async (data: {
    nationalId: string;
    newEmail: string;
  }): Promise<string> => {
    const response = await axios.post(VERIFY_NOW_API_URL, data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${ME_API_URL}`);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axios.post(`${LOGOUT_API_URL}`);
    } catch (error) {
      console.warn("⚠️ Logout API failed, but continuing cleanup:", error);
    } finally {
      // Always clear ALL tokens, regardless of API call success
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("csrfToken");
      localStorage.removeItem("user");

      // Remove token from URL if present (from verify-email flow)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("token")) {
        urlParams.delete("token");
        const newUrl =
          window.location.pathname +
          (urlParams.toString() ? "?" + urlParams.toString() : "");
        window.history.replaceState({}, "", newUrl);
      }
    }
  },
};
