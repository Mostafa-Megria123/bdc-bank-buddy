import { endpoints } from "@/config";
import { FileResponse } from "@/types/fileResponse";

const API_URL = endpoints.batchFiles;

export const FileService = {
  getBatchFiles: async (
    module: string,
    fileType: string,
    fileNames: string[]
  ): Promise<FileResponse[]> => {
    const params = new URLSearchParams();
    params.append("fileType", fileType);
    params.append("module", module);
    fileNames.forEach((name) => params.append("fileNames", name));

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch batch files");
    }

    return response.json();
  },
};
