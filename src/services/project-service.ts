import axios from "@/lib/axios";
import { Project, ProjectFilter } from "@/types/project";
import { endpoints } from "@/config/index";

/**
 * Fetches all projects.
 */
export const ProjectService = {
  getAllProjects: async (
    page = 0,
    size = 10
  ): Promise<{
    content: Project[];
    totalPages: number;
  }> => {
    const url = `${endpoints.projects}?page=${page}&size=${size}`;
    const response = await axios.get(url);
    return response.data;
  },

  /**
   * Fetches a single project by its ID.
   * @param projectId The ID of the project to fetch.
   */
  getProjectById: async (id: string): Promise<Project> => {
    const response = await axios.get(`${endpoints.projects}/${id}`);
    return response.data;
  },

  /**
   * Fetches featured projects (e.g., for Home Page)
   */
  getFeaturedProjects: async (): Promise<Project[]> => {
    const url = `${endpoints.projects}?page=0&size=3`;
    const response = await axios.get(url);
    return response.data.content;
  },
};
