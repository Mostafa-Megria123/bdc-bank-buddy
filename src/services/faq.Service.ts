import { endpoints } from "@/config";

// Types
export interface Faq {
  id?: number;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  order: number;
}

const API_URL = endpoints.faqs;

export const FaqService =  {
      // Get all FAQs
  getAll: async (): Promise<Faq[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};
 
export default FaqService;