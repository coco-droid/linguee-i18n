"use strict";

import fs from 'fs';
import path from 'path';

export function loadConfig(): Record<string, any> {
    const configPath = path.join(process.cwd(), 'linguee-config.json');
    if (!fs.existsSync(configPath)) {
        throw new Error('linguee-config.json is missing.');
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config;
}
