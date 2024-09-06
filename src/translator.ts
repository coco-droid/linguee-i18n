import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface LingueeConfig {
  apiKey: string;
  defaultLanguage: string;
  targetLanguages: string[];
  pages: string[];
}
export async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/translation/automatic_translation",
    headers: {
      authorization: `Bearer ${apiKey}`, // use the provided API key
    },
    data: {
      providers: "amazon,google,ibm,microsoft", // Choose providers for translation
      text, // The text to be translated
      source_language: "auto", // Let API auto-detect source language or set explicitly
      target_language: targetLang, // Target language for translation
    },
  };

  try {
    const response = await axios.request(options);
    return response.data[0].translated_text; // Access the translated text in the response
  } catch (error) {
    console.error(`Error translating text: ${text}`, error);
    return text; // Return original text if translation fails
  }
}

export async function generateTranslations(translations: Record<string, string[]>, config: LingueeConfig) {
  const { apiKey, defaultLanguage, targetLanguages } = config;

  for (const [filePath, texts] of Object.entries(translations)) {
    for (const targetLang of targetLanguages) {
      const translatedTexts: Record<string, string> = {};
      
      for (const text of texts) {
        const translated = await translateText(text, targetLang, apiKey);
        translatedTexts[text] = translated;
      }

      const outputDir = path.join('public/translations', targetLang);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputFilePath = path.join(outputDir, path.basename(filePath, '.tsx') + '.json');
      fs.writeFileSync(outputFilePath, JSON.stringify(translatedTexts, null, 2));
    }
  }
}
