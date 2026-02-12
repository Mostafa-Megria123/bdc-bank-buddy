import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { FileResponse } from "@/types/fileResponse";
import { getFileUrl } from "@/lib/utils";

const API_URL = endpoints.batchFiles;

export const FileService = {
  getBatchFiles: async (
    module: string,
    fileType: string,
    fileNames: string[],
  ): Promise<FileResponse[]> => {
    const params = new URLSearchParams();
    params.append("fileType", fileType);
    params.append("module", module);
    fileNames.forEach((name) => params.append("fileNames", name));

    const response = await axios.post<FileResponse[]>(
      `${API_URL}?${params.toString()}`,
    );
    return response.data;
  },

  downloadAttachment: async (attachmentUrl: string): Promise<void> => {
    try {
      // Construct full URL using the same pattern as other file downloads in the app
      const fullUrl = getFileUrl(attachmentUrl);

      const response = await axios.get(fullUrl, {
        responseType: "blob",
      });

      // Create blob from response
      const blob = new Blob([response.data]);

      // Extract filename from URL or use default
      const urlParts = attachmentUrl.split("/");
      const filename = urlParts[urlParts.length - 1] || "attachment";

      // Create temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      throw error;
    }
  },
};
