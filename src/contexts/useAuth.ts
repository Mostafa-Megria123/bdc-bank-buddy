import { useContext } from 'react';
import { AuthContext } from './AuthContextCore';
import type { AuthContextType } from './authTypes';

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
