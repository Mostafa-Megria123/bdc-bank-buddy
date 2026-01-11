import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { Feature } from "@/types/feature";

const API_URL = endpoints.features;

export const FeatureService = {
  getAll: async (): Promise<Feature[]> => {
    const response = await axios.get<Feature[]>(API_URL);
    return response.data;
  },
};
