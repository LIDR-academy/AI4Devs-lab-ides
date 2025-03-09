import * as fs from 'fs';
import * as path from 'path';

// Available languages
export const LANGUAGES = {
  EN_US: 'en_US',
  ES_ES: 'es_ES',
};

// Default language
export const DEFAULT_LANGUAGE = LANGUAGES.EN_US;

// Language translations
const translations: Record<string, Record<string, string>> = {};

// Load translations
export const loadTranslations = () => {
  // Load translations for each language
  Object.values(LANGUAGES).forEach((lang) => {
    const langPath = path.join(__dirname, `../../lang/${lang}`);

    // Skip if language directory doesn't exist
    if (!fs.existsSync(langPath)) {
      console.warn(`Language directory ${langPath} not found`);
      return;
    }

    // Read all JSON files in the language directory
    fs.readdirSync(langPath)
      .filter((file) => file.endsWith('.json'))
      .forEach((file) => {
        const filePath = path.join(langPath, file);
        const namespace = file.replace('.json', '');

        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const jsonContent = JSON.parse(content);

          // Initialize language if not exists
          if (!translations[lang]) {
            translations[lang] = {};
          }

          // Add translations with namespace prefix
          Object.entries(jsonContent).forEach(([key, value]) => {
            if (typeof value === 'string') {
              translations[lang][`${namespace}.${key}`] = value;
            } else if (typeof value === 'object' && value !== null) {
              // Handle nested objects (e.g., errors, success)
              Object.entries(value as Record<string, any>).forEach(([nestedKey, nestedValue]) => {
                if (typeof nestedValue === 'string') {
                  translations[lang][`${namespace}.${key}.${nestedKey}`] = nestedValue;
                }
              });
            }
          });
        } catch (error) {
          console.error(`Error loading translation file ${filePath}:`, error);
        }
      });
  });
};

/**
 * Translate a key to the specified language
 * @param key Translation key (e.g. 'common.welcome')
 * @param lang Target language
 * @param params Parameters to replace in the translation
 * @returns Translated string or the key if not found
 */
export const translate = (
  key: string,
  lang = DEFAULT_LANGUAGE,
  params: Record<string, string | number> = {}
): string => {
  // Get translation or fallback to key
  let translation = translations[lang]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;

  // Replace parameters in the translation
  Object.entries(params).forEach(([param, value]) => {
    translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
  });

  return translation;
};

// Initialize translations
loadTranslations();