import axios from "@/lib/axios";
import { Project, ProjectFilter } from "@/types/project";
import { endpoints } from "@/config/index";

/**
 * Fetches all projects.
 */
export const ProjectService = {
  getAllProjects: async (
    page = 0,
    size = 10,
  ): Promise<{
    content: Project[];
    totalPages: number;
  }> => {
    const url = `${endpoints.projects}/enhancedUnitsData?page=${page}&size=${size}`;
    const response = await axios.get(url);
    return response.data;
  },

  /**
   * Fetches a single project by its ID.
   * @param projectId The ID of the project to fetch.
   */
  getProjectById: async (id: string): Promise<Project> => {
    const response = await axios.get(
      `${endpoints.projects}/enhancedUnitsData/${id}`,
    );
    return response.data;
  },

  /**
   * Fetches featured projects (e.g., for Home Page)
   */
  getFeaturedProjects: async (): Promise<Project[]> => {
    const url = `${endpoints.projects}/enhancedUnitsData?page=0&size=4`;
    const response = await axios.get(url);

    const dataToReturn = response.data.content || response.data;
    return dataToReturn;
  },
};
