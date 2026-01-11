import axios from "@/lib/axios";
import { PrivacyPolicy } from "@/types/privacyPolicy";
import { endpoints } from "@/config";

// API URLs
const API_URL = endpoints.privacyPolicy;

// Service methods
export const PrivacyPolicyService = {
  // Get all PrivacyPolicy
  getAll: async (): Promise<PrivacyPolicy[]> => {
    const response = await axios.get<PrivacyPolicy[]>(API_URL);
    return response.data;
  },
};
