import { endpoints } from "@/config";
import { ContactInfo } from "@/types/contactInfo";

const API_URL = endpoints.contactInfo;

export const ContactInfoService = {
  getAll: async (): Promise<ContactInfo[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
