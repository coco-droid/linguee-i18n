import React, { useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const TranslationUpdater = () => {
  const { translation, activePage } = useLanguage(); // Récupération de la page active

  useEffect(() => {
    if (translation) {
      const elements = document.querySelectorAll('[linguee-tr]');

      elements.forEach((element) => {
        const key = element.getAttribute('linguee-tr');
        const keys = key?.split('-') || [];
        let text = translation;

        // Parcourir les clés pour obtenir la traduction
        keys.forEach((k) => {
          if (text && text[k]) {
            text = text[k];
          }
        });

        if (typeof text === 'string') {
          element.textContent = text;
        }
      });
    }
  }, [translation, activePage]); // Ajout de la page active pour le recalcul des traductions

  return null; // Ce composant ne renvoie rien
};

export default TranslationUpdater;
