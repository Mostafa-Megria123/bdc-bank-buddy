import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { endpoints } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Constructs the full URL for a file served from the backend.
 * @param filePath The relative path from the backend, e.g., "gallery/announcement/image.jpg"
 * @returns The full, absolute URL to the file.
 */
export function getFileUrl(filePath: string): string {
  if (!filePath) return ""; // Handle cases where filePath might be null or empty
  return `${endpoints.files}/${filePath}`;
}
