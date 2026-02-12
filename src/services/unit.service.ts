import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { Unit } from "@/types/unit";

const API_URL = endpoints.units;

// Paginated response type for units
export interface PaginatedUnitsResponse {
  content: Unit[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export const UnitService = {
  /**
   * Fetches units by project ID with pagination
   * @param projectId The ID of the project
   * @param page The page number (0-indexed)
   * @param size The number of items per page
   * @returns Paginated units response
   */
  getUnitsByProjectId: async (
    projectId: string | number,
    page: number = 0,
    size: number = 5,
  ): Promise<PaginatedUnitsResponse> => {
    try {
      const url = `${API_URL}/project/${projectId}`;
      const response = await axios.get<PaginatedUnitsResponse>(url, {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching units for project ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches a single unit by ID
   * @param unitId The ID of the unit
   * @returns Unit data
   */
  getUnitById: async (unitId: string | number): Promise<Unit> => {
    try {
      const url = `${API_URL}/${unitId}`;
      const response = await axios.get<Unit>(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unit ${unitId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches all units for a project (without pagination)
   * @param projectId The ID of the project
   * @returns Array of units
   */
  getAllUnitsByProjectId: async (
    projectId: string | number,
  ): Promise<Unit[]> => {
    try {
      const url = `${API_URL}/project/${projectId}`;
      const response = await axios.get<PaginatedUnitsResponse>(url, {
        params: {
          page: 0,
          size: 1000, // Large size to get all units
        },
      });
      return response.data.content;
    } catch (error) {
      console.error(
        `Error fetching all units for project ${projectId}:`,
        error,
      );
      throw error;
    }
  },
};
