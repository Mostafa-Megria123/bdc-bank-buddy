import { User } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ProfileDTO {
  id: number;
  profileName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdByUsername: string;
  roleCount: number;
  userCount: number;
}

export interface AuthResponse {
  id: number;
  token: string;
  refreshToken: string;
  username: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  nationalId?: string;
  nationalIdFactoryNumber?: string;
  countryOfBirth?: string;
  placeOfResidence?: string;
  maritalStatus?: string;
  address?: string;
  profiles: ProfileDTO[];
  preferredLanguage: string;
  tokenType: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: string;
  user?: User; // Sometimes the user object is nested
}
