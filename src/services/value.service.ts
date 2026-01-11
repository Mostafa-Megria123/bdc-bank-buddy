import axios from "@/lib/axios";
import { endpoints } from "@/config";
import { Value } from "@/types/value";

const API_URL = endpoints.values;

export const ValueService = {
  getAll: async (): Promise<Value[]> => {
    const response = await axios.get<Value[]>(API_URL);
    return response.data;
  },
};
