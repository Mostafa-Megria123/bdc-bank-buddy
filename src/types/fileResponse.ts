export interface FileResponse {
  fileName: string;
  fileContent: string;
  mediaType: string | { type: string; subtype: string } | null;
}
