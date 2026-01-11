import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { Terms } from "@/types/terms";

const API_URL = endpoints.terms;

export const TermsService = {
  getAll: async (): Promise<Terms[]> => {
    const response = await axios.get<Terms[]>(API_URL);
    return response.data;
  },
};
