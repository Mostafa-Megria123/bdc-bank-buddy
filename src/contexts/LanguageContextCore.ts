import { createContext } from 'react';
import { LanguageContextType } from './types.ts';

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
