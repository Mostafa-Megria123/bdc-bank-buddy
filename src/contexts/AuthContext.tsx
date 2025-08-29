import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  nationalId: string;
  name: string;
  email: string;
  mobile: string;
}

interface AuthContextType {
  user: User | null;
  login: (nationalId: string, password: string, captcha: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (nationalId: string, password: string, captcha: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        nationalId: nationalId,
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '01234567890'
      };
      
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful registration
      const mockUser: User = {
        id: '1',
        nationalId: userData.nationalId,
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile
      };
      
      setUser(mockUser);
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};