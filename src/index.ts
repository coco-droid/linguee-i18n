const path = require('path');
const { loadConfig } = require('./config');
const { parseFiles } = require('./parser');
const { generateTranslations } = require('./translator');

async function run() {
  try {
    const config = loadConfig();
    const filePaths = config.pages.map(page => path.join(process.cwd(), page));

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
module.exports = { run };

// Run the function if this file is executed directly
if (require.main === module) {
  run().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}
