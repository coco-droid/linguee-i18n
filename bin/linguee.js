#!/usr/bin/env node

const prompts = require('prompts');
const fs = require('fs-extra');
const path = require('path');
const {run}=require('../dist/index');
// Default configuration for Linguee
const defaultConfig = {
  defaultLanguage: "en",
  supportedLanguages: ["en", "fr", "es"],
  apiKey: "<TRANSLATION_API_KEY>",
  pagesToTranslate: [],
  targetCountries:[]
};

// Function to initialize Linguee config
async function initLingueeConfig() {
  console.log("Initializing Linguee...");

  try {
    // Prompt user for the public directory
    const { publicDir } = await prompts({
      type: 'text',
      name: 'publicDir',
      message: 'Enter the public directory where translations will be stored (default: public/translations):',
      initial: 'public/translations'
    });

    // Prompt user for the default language
    const { defaultLanguage } = await prompts({
      type: 'text',
      name: 'defaultLanguage',
      message: 'Enter the default language (default: en):',
      initial: 'en'
    });

    // Prompt user for supported languages
    const { supportedLanguages } = await prompts({
      type: 'list',
      name: 'supportedLanguages',
      message: 'Enter the supported languages separated by commas (default: en, fr, es):',
      initial: ['en', 'fr', 'es'],
      separator: ',',
      format: (values) => values.map(value => value.trim())
    });

    // Prompt user for API key
    const { apiKey } = await prompts({
      type: 'text',
      name: 'apiKey',
      message: 'Enter the API key for translations:',
      validate: value => value.length > 0 ? true : 'API key cannot be empty'
    });

    // Prompt user for pages to translate
    const { pagesToTranslate } = await prompts({
      type: 'list',
      name: 'pagesToTranslate',
      message: 'Enter the pages to translate separated by commas (default: index, about, contact):',
      initial: ['index', 'about', 'contact'],
      separator: ',',
      format: (values) => values.map(value => value.trim())
    });

    // Configuration object with user inputs
    const userConfig = {
      defaultLanguage,
      supportedLanguages,
      apiKey,
      pagesToTranslate
    };

    // Path for the config file
    const configPath = path.resolve(process.cwd(), 'linguee-config.json');

    // Check if config file already exists
    if (fs.existsSync(configPath)) {
      console.log("linguee-config.json already exists. Skipping creation.");
    } else {
      console.log("Creating linguee-config.json...");
      fs.writeFileSync(configPath, JSON.stringify(userConfig, null, 2));
      console.log(`Created linguee-config.json at ${configPath}`);
    }

    // Path for the translations directory
    const translationDir = path.resolve(process.cwd(), publicDir);

    // Check if the translations directory exists
    if (!fs.existsSync(translationDir)) {
      console.log(`Creating translation directory at ${translationDir}...`);
      fs.mkdirpSync(translationDir);
      console.log("Translation directory created successfully.");
    } else {
      console.log("Translation directory already exists.");
    }

    console.log("Linguee initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Linguee:", error);
    process.exit(1);
  }
}

// Function to translate pages
async function translatePages() {
  console.log("Translating pages...");

  try {
    const configPath = path.resolve(process.cwd(), 'linguee-config.json');

    if (!fs.existsSync(configPath)) {
      console.error("linguee-config.json not found. Please run `linguee init` first.");
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    // Logic to perform translation (stub for now)
    console.log(`Default Language: ${config.defaultLanguage}`);
    console.log(`Supported Languages: ${config.supportedLanguages.join(', ')}`);
    console.log(`API Key: ${config.apiKey}`);
    console.log(`Pages to Translate: ${config.pagesToTranslate.join(', ')}`);

    // Implement translation logic here
    console.log("Translation process would go here...");
    run();

  } catch (error) {
    console.error("Failed to translate pages:", error);
    process.exit(1);
  }
}

// Main function to handle CLI commands
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'init') {
    await initLingueeConfig();
  } else if (args[0] === 'translate') {
    await translatePages();
  } else {
    console.error("Unknown command. Use 'init' to initialize or 'translate' to translate pages.");
    process.exit(1);
  }
}

// Ensure the script is run as the main module
if (require.main === module) {
  main();
}
