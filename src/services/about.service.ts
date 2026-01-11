import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { About } from "@/types/about";

const API_URL = endpoints.about;

export const AboutService = {
  // Get about list
  getAll: async (): Promise<About[]> => {
    const response = await axios.get<About[]>(API_URL);
    return response.data;
  },
};
