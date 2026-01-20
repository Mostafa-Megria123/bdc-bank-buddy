export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  token: string;
  refreshToken: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  preferredLanguage: string;
  tokenType: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: string;
}
