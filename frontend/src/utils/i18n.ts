import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import enCommon from '../lang/en_US/common.json';
import esCommon from '../lang/es_ES/common.json';

// Available languages
export const LANGUAGES = {
  EN_US: 'en_US',
  ES_ES: 'es_ES',
};

// Default language
export const DEFAULT_LANGUAGE = LANGUAGES.EN_US;

// Resources
const resources = {
  [LANGUAGES.EN_US]: {
    common: enCommon,
  },
  [LANGUAGES.ES_ES]: {
    common: esCommon,
  },
};

// Language detection function
export const detectLanguage = (): string => {
  // Get from localStorage if available
  const storedLang = localStorage.getItem('language');
  if (storedLang && Object.values(LANGUAGES).includes(storedLang)) {
    return storedLang;
  }

  // Get from browser settings
  const browserLang = navigator.language.replace('-', '_');
  if (Object.values(LANGUAGES).includes(browserLang)) {
    return browserLang;
  }

  // fallback to default
  return DEFAULT_LANGUAGE;
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    ns: ['common'],
    defaultNS: 'common',
  });

// Function to change language
export const changeLanguage = (lang: string) => {
  if (Object.values(LANGUAGES).includes(lang)) {
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
  }
};

export default i18n;