import { useContext } from 'react';
import { LanguageContext } from './LanguageContextCore';
import { LanguageContextType } from './types.ts';

// Re-exported hook to keep LanguageContext file focused on the provider only.
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
