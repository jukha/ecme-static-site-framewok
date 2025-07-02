// utils/getHighlightThemes.ts

import fs from 'fs';
import path from 'path';

export const getHighlightThemes = (): string[] => {
  // Define the path to your public directory where theme CSS files are stored
  // This path is relative to the project root (process.cwd())
  const publicThemesDir = path.join(process.cwd(), 'public', 'highlight-js-themes');

  console.log(`Server: Reading highlight.js themes from public directory: ${publicThemesDir}`);

  try {
    // Check if the directory exists to provide a clearer error if not
    if (!fs.existsSync(publicThemesDir)) {
      console.warn(`Server: Public themes directory does not exist: ${publicThemesDir}. Returning default themes.`);
      // Optionally create the directory here if you want to ensure it always exists for dev
      // fs.mkdirSync(publicThemesDir, { recursive: true });
      return ['dracula', 'github', 'atom-one-dark', 'vs', 'xcode']; // Fallback
    }

    const files = fs.readdirSync(publicThemesDir);

    const filteredThemes = files
      .filter(file => file.endsWith('.css') && file !== 'default.css') // Keep filtering for CSS files
      .map(file => path.basename(file, '.css')) // Get just the theme name without .css
      .sort();

    console.log(`Server: Themes found in public directory:`, filteredThemes);
    return filteredThemes;
  } catch (error) {
    console.error(`Server: Failed to read highlight.js themes from public directory.`, error);
    // Provide a default list of themes in case of any error during file system access
    return ['dracula', 'github', 'atom-one-dark', 'vs', 'xcode']; // Fallback
  }
};