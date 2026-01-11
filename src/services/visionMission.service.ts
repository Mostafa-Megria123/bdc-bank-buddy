import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { VisionAndMission } from "@/types/visionAndMission";

const API_URL = endpoints.visionAndMission;

export const VisionMissionService = {
  getAll: async (): Promise<VisionAndMission[]> => {
    const response = await axios.get<VisionAndMission[]>(API_URL);
    return response.data;
  },
};
