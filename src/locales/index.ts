import en from './en.json';
import ar from './ar.json';

export const translations = {
  en,
  ar,
};

export type TranslationKey = keyof typeof en;
export type Language = 'en' | 'ar';

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let current: any = translations[lang];
  
  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation missing for key: ${key} in language: ${lang}`);
      return key;
    }
    current = current[k];
  }
  
  if (typeof current !== 'string') {
    console.error(`Translation key "${key}" in language "${lang}" points to an object instead of a string`);
    return key;
  }
  
  return current;
}
