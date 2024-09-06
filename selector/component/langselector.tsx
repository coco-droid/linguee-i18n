// langselector.tsx
import React, { useState } from 'react';
interface Language {
  code: string;
  label: string;
  country:string;
}

interface LanguageSelectorProps {
  onLanguageChange?: (lang: Language) => void;
}

const languages: Language[] = [
  { code: 'FR',country:"FR",  label: 'French' },
  { code: 'EN', country:"US", label: 'English' },
  { code: 'ES', country:"ES",  label: 'English' },
  { code: 'HT', country:"HT", label: 'Korean' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
    const {language,i18Language}=useI18n();
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    i18Language(lang);
    setDropdownVisible(false);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  return (
    <div className="h-12 w-20   text-left">
      <div
        className="rounded-full bg-muted rounded-md h-full w-full text-white p-2 flex items-center justify-center cursor-pointer"
        style={{borderRadius:''}}  onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <img src={`https://flagsapi.com/${selectedLanguage.country}/flat/64.png`} alt={selectedLanguage.label} className="w-6 h-6 rounded-full" />
        <span className="ml-2 text-xl">{selectedLanguage.code}</span>
      </div>
      {dropdownVisible && (
        <div className="absolute flex items-center right-0 mt-2 w-20 rounded-md bg-muted  ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className="flex items-center justify-center w-full bg-black px-4 py-2 text-sm text-white"
              >
                <img src={`https://flagsapi.com/${lang.country}/flat/64.png`} alt={selectedLanguage.label} className="w-6 h-6 rounded-full" />
                <span className="ml-2 text-xl">{lang.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;