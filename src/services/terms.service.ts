import { endpoints } from "@/config";
import { Terms } from "@/types/terms";

const API_URL = endpoints.terms;

export const TermsService = {
  getAll: async (): Promise<Terms[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
