export interface Role {
  id: number;
  roleName: string;
  description?: string;
  canAccessDashboard: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  mobileNumber?: string; // Added for mobile phone
  nationalId?: string; // Added for national ID
  nationalIdFactoryNumber?: string; // Added for factory number
  countryOfBirth?: string;
  placeOfResidence?: string;
  maritalStatus?: string;
  address?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  preferredLanguage?: string;
  avatar?: string;
  company?: string;
  role: Role;
}

export interface CreateUserRequest {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  isActive?: boolean;
  role: Role;
  preferredLanguage?: string;
}

export interface UpdateUserRequest {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  isActive?: boolean;
  role: Role;
  preferredLanguage?: string;
}

export interface UserPageResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
