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

const AUTH_API_URL = endpoints.auth;
const REGISTER_API_URL = endpoints.register;
const LOGIN_API_URL = endpoints.login;
const VERIFY_EMAIL_API_URL = endpoints.verifyEmail;
const REFRESH_TOKEN_API_URL = endpoints.refreshToken;
const FORGOT_PASSWORD_API_URL = endpoints.forgoetPassword;
const RESET_PASSWORD_API_URL = endpoints.resetPassword;
const ME_API_URL = endpoints.me;

export const authService = {
  register: async (data: RegisterFormData) => {
    // Convert to FormData to handle file upload and map fields to backend request
    const formData = new FormData();

    // Map frontend field names to backend field names
    formData.append("nationalId", data.nationalId);
    formData.append("fullName", data.name);
    formData.append("nationalIdFactoryNumber", data.printedNumber);
    formData.append("mobileNumber", data.mobile);
    formData.append("email", data.email);
    formData.append("countryOfBirth", data.nationality);
    formData.append("placeOfResidence", data.residence);
    formData.append("maritalStatus", data.maritalStatus);
    formData.append("preferredLanguage", data.notificationLanguage);
    formData.append("address", data.address);
    formData.append("captcha", data.captcha);
    formData.append("phone", data.phone);

    // Append the file if it exists
    if (data.nationalIdImage instanceof File) {
      formData.append("nationalIdImage", data.nationalIdImage);
    }

    return fetchClient(`${REGISTER_API_URL}`, {
      method: "POST",
      body: formData,
    });
  },

  login: async (data: LoginFormData) => {
    return fetchClient(`${LOGIN_API_URL}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  refreshToken: async (token: string) => {
    return fetchClient(`${REFRESH_TOKEN_API_URL}`, {
      method: "POST",
      body: JSON.stringify({ refreshToken: token }),
    });
  },

  forgotPassword: async (data: ForgotPasswordFormData) => {
    return fetchClient(`${FORGOT_PASSWORD_API_URL}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: ResetPasswordFormData & { token: string }) => {
    return fetchClient(`${RESET_PASSWORD_API_URL}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verifyEmail: async (token: string): Promise<string> => {
    const response = await axios.post(VERIFY_EMAIL_API_URL, null, {
      params: { token },
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${ME_API_URL}`);
    return response.data;
  },
};
