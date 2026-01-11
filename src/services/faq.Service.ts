import axios from "@/lib/axios";
import { endpoints } from "@/config";

// Types
export interface Faq {
  id?: number;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  displayOrder: number;
}

const API_URL = endpoints.faqs;

export const FaqService = {
  // Get all FAQs
  getAll: async (): Promise<Faq[]> => {
    const response = await axios.get<Faq[]>(API_URL);
    return response.data;
  },
};

export default FaqService;
