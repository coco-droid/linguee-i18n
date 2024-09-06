import fs from 'fs';
import path from 'path';

export interface LingueeConfig {
  apiKey: string;
  defaultLanguage: string;
  targetLanguages: string[];
  pages: string[];
}

export function loadConfig(): LingueeConfig {
  const configPath = path.join(process.cwd(), 'linguee-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('linguee-config.json is missing.');
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return config;
}
