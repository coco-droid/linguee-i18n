# Linguee - Auto Translation with Google Gemini AI

![Linguee Logo](https://github.com/coco-droid/linguee/blob/c19772c277acae893bf1821621802817f5529f89/logo.png) <!-- Replace with actual logo URL -->

![npm version](https://img.shields.io/npm/v/linguee) ![License](https://img.shields.io/npm/l/linguee) ![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg) ![Platform](https://img.shields.io/badge/platform-react%20|%20next.js-blue)

Linguee is an intelligent translation package powered by **Google Gemini AI**, designed to automate the translation of entire websites. With support for **React** and **Next.js**, Linguee simplifies integrating multilingual support into your projects. It's easy to set up, highly customizable, and supports multiple target languages.

## Key Features
- **Auto-translate pages** using Google Gemini AI.
- Compatible with **React** and **Next.js**.
- Simple **CLI** interface for setup and translation.
- Supports multiple languages with custom configuration.
- Easy-to-use **Language Provider** to manage language selection.

## Installation

To get started, install Linguee via npm:

```bash
npm install linguee
```

## Quick Start

1. **Initialize Linguee**:
   After installing, run the following command to initialize the configuration:

   ```bash
   linguee init
   ```

2. **Configure Linguee**:
   Update your `linguee-config.json` file to define your API key, default language, target languages, and the pages you want to translate:

   ```json
   {
     "apiKey": "YOUR_API_KEY_HERE",
     "defaultLanguage": "en",
     "targetLanguages": ["fr", "es", "de"],
     "targetCountry": ["", ""],
     "pages": [
       "pages/index.tsx",
       "components/Header.tsx"
     ]
   }
   ```

3. **Translate Pages**:
   Once your configuration is set, run the following command to start translating your website:

   ```bash
   linguee translate
   ```

## Integrating Linguee with React

To use Linguee in a React app, follow these steps:

1. **Wrap your app with the `LanguageProvider`**:

   ```tsx
   import { StrictMode } from 'react';
   import { createRoot } from 'react-dom/client';
   import App from './App';
   import './index.css';
   import { LanguageProvider } from 'linguee/selector/context/LanguageContext';

   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <LanguageProvider>
         <App />
       </LanguageProvider>
     </StrictMode>,
   );
   ```

2. **Add Linguee components to your app**:

   In your app, you can use the `TranslationUpdater` and `LangSelector` components to manage translations and language switching:

   ```tsx
   import './App.css';
   import TranslationUpdater from 'linguee/selector/context/TranslationUpdater';
   import LangSelector from 'linguee/selector/component/langselector';
   import { useLanguage } from 'linguee/selector/context/LanguageContext';

   function App() {
     const { setActivePage } = useLanguage();
     setActivePage('App');

     return (
       <div>
         <LangSelector />
         <TranslationUpdater />
         <h1 linguee-tr="App-title">Welcome to Linguee Test</h1>
         <p linguee-tr="App-description">This is a test of the Linguee translation system in a React project.</p>
       </div>
     );
   }

   export default App;
   ```

3. **Mark Translatable Content**:
   Add the `linguee-tr` attribute to elements that should be translated, like this:

   ```html
   <h1 linguee-tr="App-title">Welcome to Linguee Test</h1>
   <p linguee-tr="App-description">This is a test of the Linguee translation system in a React project.</p>
   ```

## CLI Commands

### `linguee init`

Initializes the Linguee configuration file.

### `linguee translate`

Starts translating the pages listed in the `linguee-config.json`.

## Configuration File (`linguee-config.json`)

| Option             | Description                                          |
|--------------------|------------------------------------------------------|
| `apiKey`           | Your Google Gemini API key.                          |
| `defaultLanguage`  | The default language of your site (e.g., `en`).       |
| `targetLanguages`  | List of target languages for translation (e.g., `fr`, `es`). |
| `targetCountry`    | (Optional) Specify target countries if needed.       |
| `pages`            | Array of page paths to translate.                    |

## Future Improvements

- **Sanity CMS** support for dynamic content.
- **Next.js Routing** improvements to automatically handle translated URLs.
- **Caching and Optimization** for faster translation loads.
- **Advanced AI tuning** for better contextual translations.

## Contributing

We welcome contributions! If you'd like to add features, improve the codebase, or help with documentation, feel free to open an issue or a pull request on [GitHub](https://github.com/your-repo-link).

## License

Linguee is licensed under the [MIT License](LICENSE).

---

Enjoy using Linguee? Feel free to contribute or star the project! More features and improvements are on the way! 🌍