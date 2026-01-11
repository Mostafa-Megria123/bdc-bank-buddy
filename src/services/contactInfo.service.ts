import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { ContactInfo } from "@/types/contactInfo";

const API_URL = endpoints.contactInfo;

export const ContactInfoService = {
  getAll: async (): Promise<ContactInfo[]> => {
    const response = await axios.get<ContactInfo[]>(API_URL);
    return response.data;
  },
};
