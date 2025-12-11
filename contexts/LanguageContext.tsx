import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en.json';
import es from '../locales/es.json';

type Language = 'en' | 'es';
type TranslationKeys = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  translations: TranslationKeys;
}

const translations: Record<Language, TranslationKeys> = {
  en,
  es,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = '@pet_incident_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es'); // Default to Spanish

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
