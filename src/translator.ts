"use strict";
import axios from 'axios';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Translation {
    attribute: string;
    content: string;
}

interface Config {
    apiKey: string;
    defaultLanguage: string;
    supportedLanguages: string[];
    targetCountries: string[];
}

export async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a website translation expert that can translate between source and target languages.
                If you don't know the translation, then return "UNKNOWN TRANSLATION".
                For numbers, please use words to represent them instead of Arabic values.
                The response is translation.:${text} in ${targetLang}`;
    const result = (await model.generateContent(prompt)).response.candidates[0].content.parts[0].text;
    return result;
}

export async function generateTranslations(translations: Record<string, Translation[]>, config: Config): Promise<void> {
    const { apiKey, defaultLanguage, supportedLanguages, targetCountries } = config;

    // Génération des fichiers pour la langue par défaut (sans traduction)
    for (const [filePath, texts] of Object.entries(translations)) {
        const defaultLangJSON: Record<string, any> = {};

        // Pour chaque élément dans 'texts', structurer le JSON
        texts.forEach(({ attribute, content }) => {
            // Création de l'arborescence à partir de l'attribut
            const attributeParts = attribute.split('-');
            let currentLevel = defaultLangJSON;

            // Parcours des parties de l'attribut pour créer les objets imbriqués
            attributeParts.forEach((part, index) => {
                if (index === attributeParts.length - 1) {
                    // Dernier élément, on assigne le contenu
                    currentLevel[part] = content;
                } else {
                    // Créer un objet vide si ce n'est pas déjà fait
                    currentLevel[part] = currentLevel[part] || {};
                    currentLevel = currentLevel[part];
                }
            });
        });

        // Extraire le nom de la page sans extension
        const baseName = basename(filePath, extname(filePath));
        const outputDir = join('public/translations', defaultLanguage);
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
        }

        const outputFilePath = join(outputDir, `${baseName}.json`);
        writeFileSync(outputFilePath, JSON.stringify(defaultLangJSON, null, 2));
    }

    // Génération des fichiers pour les langues supportées (traduction)
    for (const [filePath, texts] of Object.entries(translations)) {
        for (const targetLang of supportedLanguages) {
            // Sauter la langue par défaut puisqu'on l'a déjà traitée
            if (targetLang === defaultLanguage) continue;

            const translatedTexts: Record<string, any> = {};

            // Processus de traduction pour chaque texte
            for (const { attribute, content } of texts) {
                const translated = await translateText(content, targetLang, apiKey);

                // Création de l'arborescence à partir de l'attribut comme précédemment
                const attributeParts = attribute.split('-');
                let currentLevel = translatedTexts;

                attributeParts.forEach((part, index) => {
                    if (index === attributeParts.length - 1) {
                        currentLevel[part] = translated;
                    } else {
                        currentLevel[part] = currentLevel[part] || {};
                        currentLevel = currentLevel[part];
                    }
                });
            }

            // Extraire le nom de la page sans extension
            const baseName = basename(filePath, extname(filePath));
            const outputDir = join('public/translations', targetLang);
            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true });
            }

            const outputFilePath = join(outputDir, `${baseName}.json`);
            writeFileSync(outputFilePath, JSON.stringify(translatedTexts, null, 2));
        }
    }

    // Générer client-config.json
    const clientConfig = {
        defaultLanguage,
        supportedLanguages,
        targetCountries
    };

    const configFilePath = join('public/translations', 'client-config.json');
    writeFileSync(configFilePath, JSON.stringify(clientConfig, null, 2));
}