import { Project, ProjectFilter } from "@/types/project";
import { endpoints } from "@/config/index";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

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
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Fetches a single project by its ID.
   * @param projectId The ID of the project to fetch.
   */
  getProjectById: async (id: string): Promise<Project> => {
    const response = await fetch(`${endpoints.projects}/${id}`);
    return handleResponse(response);
  },

  /**
   * Fetches featured projects (e.g., for Home Page)
   */
  getFeaturedProjects: async (): Promise<Project[]> => {
    const url = `${endpoints.projects}?page=0&size=3`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data.content;
  },
};
