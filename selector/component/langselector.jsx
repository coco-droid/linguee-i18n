import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LangSelector = () => {
    const { selectedLanguage, setSelectedLanguage, supportedLanguages, targetCountries } = useLanguage();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        setDropdownVisible(false);
    };

    return (
        <div className="h-12 w-20 text-left">
            <div
                className="rounded-full bg-muted h-full w-full text-white p-2 flex items-center justify-center cursor-pointer"
                onClick={() => setDropdownVisible(!dropdownVisible)}
            >
                <img
                    src={`https://flagsapi.com/${targetCountries[supportedLanguages.indexOf(selectedLanguage)]}/flat/64.png`} 
                    alt={selectedLanguage}
                    className="w-6 h-6 rounded-full"
                />
                <span className="ml-2 text-xl">{selectedLanguage}</span>
            </div>
            {dropdownVisible && (
                <div className="absolute flex items-center right-0 mt-2 w-20 rounded-md bg-muted ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        {supportedLanguages.map((lang, index) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className="flex items-center justify-center w-full bg-black px-4 py-2 text-sm text-white"
                            >
                                <img
                                    src={`https://flagsapi.com/${targetCountries[index]}/flat/64.png`}
                                    alt={lang}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="ml-2 text-xl">{lang}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LangSelector;
