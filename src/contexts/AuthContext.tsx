import React, { useState, ReactNode } from 'react';
import { AuthContext } from './AuthContextCore';
import type { AuthContextType, User } from './authTypes';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login: AuthContextType['login'] = async (nationalId, password, captcha) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUser: User = {
        id: '1',
        nationalId,
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

  const register: AuthContextType['register'] = async (userData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const ud = userData as Record<string, unknown>;
      const mockUser: User = {
        id: '1',
        nationalId: String(ud['nationalId'] ?? ''),
        name: String(ud['name'] ?? ''),
        email: String(ud['email'] ?? ''),
        mobile: String(ud['mobile'] ?? '')
      };
      setUser(mockUser);
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout: AuthContextType['logout'] = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};