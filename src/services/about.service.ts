import { endpoints } from "@/config";
import { About } from "@/types/about";

const API_URL = endpoints.about;

export const AboutService = {
  // Get about list
  getAll: async (): Promise<About[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
