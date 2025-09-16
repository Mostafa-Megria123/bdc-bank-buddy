import type { Language } from '@/locales';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => unknown;
  tString: (key: string) => string;
}
