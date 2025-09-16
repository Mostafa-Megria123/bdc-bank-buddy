export interface User {
  id: string;
  nationalId: string;
  name: string;
  email: string;
  mobile: string;
}

export interface AuthContextType {
  user: User | null;
  login: (nationalId: string, password: string, captcha: string) => Promise<void>;
  register: (userData: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
