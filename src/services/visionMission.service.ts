import { endpoints } from "@/config";
import { VisionAndMission } from "@/types/visionAndMission";

const API_URL = endpoints.visionAndMission;

export const VisionMissionService = {
  getAll: async (): Promise<VisionAndMission[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
