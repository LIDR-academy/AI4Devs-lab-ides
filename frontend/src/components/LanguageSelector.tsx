import React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, changeLanguage } from '../utils/i18n';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    changeLanguage(newLanguage);
  };

  return (
    <div className="inline-flex items-center">
      <select
        className="bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label="Select language"
      >
        <option value={LANGUAGES.EN_US}>English</option>
        <option value={LANGUAGES.ES_ES}>Español</option>
      </select>
    </div>
  );
};

export default LanguageSelector;