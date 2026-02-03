import { User } from "@/types/user";

export interface AuthContextType {
  user: User | null;
  login: (
    nationalId: string,
    password: string,
    captcha: string,
  ) => Promise<void>;
  register: (userData: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
