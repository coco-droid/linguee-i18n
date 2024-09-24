import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [clientConfig, setClientConfig] = useState(null); // State to hold client configuration
  const [selectedLanguage, setSelectedLanguage] = useState(null); // State for the selected language
  const [selectedCountry, setSelectedCountry] = useState(null); // State for the country code
  const [translation, setTranslation] = useState(null);
  const [activePage, setActivePage] = useState(''); // State to track the current page

  // Fetch client config on initial render
  useEffect(() => {
    const fetchClientConfig = async () => {
      try {
        const response = await fetch('/public/translations/client-config.json');
        if (!response.ok) {
          throw new Error(`Error fetching client config: ${response.statusText}`);
        }
        const config = await response.json();
        setClientConfig(config);
        setSelectedLanguage(config.defaultLanguage); // Set default language from config
      } catch (error) {
        console.error('Error loading client config:', error);
      }
    };

    fetchClientConfig();
  }, []);

  // Load the translation file for the selected language and active page using fetch
  useEffect(() => {
    const loadTranslation = async () => {
      if (selectedLanguage && activePage) {
        try {
          const response = await fetch(`/public/translations/${selectedLanguage}/${activePage}.json`);
          if (!response.ok) {
            throw new Error(`Error fetching translation file: ${response.statusText}`);
          }
          const langFile = await response.json();
          setTranslation(langFile);
        } catch (error) {
          console.log(activePage);
          console.error(`Error loading translation for ${selectedLanguage} and page ${activePage}:`, error);
          setTranslation(null); // Reset translation on error
        }
      }
    };

    loadTranslation();
  }, [selectedLanguage, activePage]);

  // Set country based on the selected language from the config
  useEffect(() => {
    if (clientConfig && selectedLanguage) {
      const langIndex = clientConfig.supportedLanguages.indexOf(selectedLanguage);
      if (langIndex !== -1) {
        setSelectedCountry(clientConfig.targetCountries[langIndex]);
      } else {
        setSelectedCountry(null); // Fallback if no country is found
      }
    }
  }, [selectedLanguage, clientConfig]);

  // Function to handle language changes
  const handleLanguageChange = (newLanguage) => {
    if (clientConfig && clientConfig.supportedLanguages.includes(newLanguage)) {
      setSelectedLanguage(newLanguage);
    } else {
      console.error(`Language ${newLanguage} not supported.`);
    }
  };

  // Function to handle page changes
  const handlePageChange = (newPage) => {
    setActivePage(newPage); // Update the active page
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        selectedCountry,
        supportedLanguages: clientConfig ? clientConfig.supportedLanguages : [], // Provide supportedLanguages
        targetCountries: clientConfig ? clientConfig.targetCountries : [], // Provide targetCountries
        setSelectedLanguage: handleLanguageChange,
        translation,
        activePage,
        setActivePage: handlePageChange, // Provide the page setter
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
