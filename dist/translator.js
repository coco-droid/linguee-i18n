"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = translateText;
exports.generateTranslations = generateTranslations;
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function translateText(text, targetLang, apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a website translation expert  that can translate between source and target languages.
                If you don't know the translation, then return "UNKNOWN TRANSLATION".
                For numbers, please use words to represent them instead of Arabic values.
                The response is translation.:${text} in ${targetLang}`;
    const result = (await model.generateContent(prompt)).response.candidates[0].content.parts[0].text;
    return result;
}

async function generateTranslations(translations, config) {
    const { apiKey, defaultLanguage, supportedLanguages, targetCountries } = config;

    // Génération des fichiers pour la langue par défaut (sans traduction)
    for (const [filePath, texts] of Object.entries(translations)) {
        const defaultLangJSON = {};

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
        const baseName = path_1.basename(filePath, path_1.extname(filePath));
        const outputDir = path_1.join('public/translations', defaultLanguage);
        if (!fs_1.existsSync(outputDir)) {
            fs_1.mkdirSync(outputDir, { recursive: true });
        }

        const outputFilePath = path_1.join(outputDir, `${baseName}.json`);
        fs_1.writeFileSync(outputFilePath, JSON.stringify(defaultLangJSON, null, 2));
    }

    // Génération des fichiers pour les langues supportées (traduction)
    for (const [filePath, texts] of Object.entries(translations)) {
        for (const targetLang of supportedLanguages) {
            // Sauter la langue par défaut puisqu'on l'a déjà traitée
            if (targetLang === defaultLanguage) continue;

            const translatedTexts = {};

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
            const baseName = path_1.basename(filePath, path_1.extname(filePath));
            const outputDir = path_1.join('public/translations', targetLang);
            if (!fs_1.existsSync(outputDir)) {
                fs_1.mkdirSync(outputDir, { recursive: true });
            }

            const outputFilePath = path_1.join(outputDir, `${baseName}.json`);
            fs_1.writeFileSync(outputFilePath, JSON.stringify(translatedTexts, null, 2));
        }
    }

    // Générer client-config.json
    const clientConfig = {
        defaultLanguage,
        supportedLanguages,
        targetCountries
    };

    const configFilePath = path_1.join('public/translations', 'client-config.json');
    fs_1.writeFileSync(configFilePath, JSON.stringify(clientConfig, null, 2));
}