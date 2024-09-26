"use strict";

import path from 'path';
import { loadConfig } from './config';
import { parseFiles } from './parser';
import { generateTranslations } from './translator';

async function run(): Promise<void> {
    try {
        const config = loadConfig();
        console.log(config);
        const filePaths: string[] = config.pagesToTranslate.map((page: string) => path.join(process.cwd(), page));
        console.log(filePaths);
        console.log('Parsing files for translation...');
        const translations = parseFiles(filePaths);
        console.log('Generating translations...');
        await generateTranslations(translations, config);
        console.log('Translation process completed.');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Export the function for use in other modules
export { run };

// Run the function if this file is executed directly
if (require.main === module) {
    run().catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
}