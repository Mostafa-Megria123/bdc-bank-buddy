import { endpoints } from "@/config";
import { Value } from "@/types/value";

const API_URL = endpoints.values;

export const ValueService = {
  getAll: async (): Promise<Value[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
