import en from './en.json';
import ar from './ar.json';

export const translations = {
  en,
  ar,
};

export type TranslationKey = keyof typeof en;
export type Language = 'en' | 'ar';

export function getTranslation(lang: Language, key: string): unknown {
  const keys = key.split('.');
  // Return type is unknown because translations can be string, array or object depending on the key.
  let current: unknown = translations[lang];

  for (const k of keys) {
    if (typeof current !== 'object' || current === null || !(k in current)) {
      console.warn(`Translation missing for key: ${key} in language: ${lang}`);
      return key;
    }
  current = (current as Record<string, unknown>)[k];
  }

  return current;
}