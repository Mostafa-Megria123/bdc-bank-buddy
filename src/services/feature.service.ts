import { endpoints } from "@/config";
import { Feature } from "@/types/feature";

const API_URL = endpoints.features;

export const FeatureService = {
  getAll: async (): Promise<Feature[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
