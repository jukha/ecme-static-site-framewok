'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MdPalette } from 'react-icons/md';

const DEFAULT_CODE_HIGHLIGHT_THEME = "atom-one-dark-reasonable"

interface HighlightThemeSwitcherProps {
  availableThemes: string[];
  // targetDocument: Document | ShadowRoot | null; // This prop becomes less critical for theme loading
}

const HighlightThemeSwitcher: React.FC<HighlightThemeSwitcherProps> = ({
  availableThemes,
  // targetDocument, // No longer directly used for theme injection
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    console.log('themee', availableThemes)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('highlightjs-theme') || DEFAULT_CODE_HIGHLIGHT_THEME;
    }
    return DEFAULT_CODE_HIGHLIGHT_THEME;
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // This function now ALWAYS loads into the main document's head
  const loadHighlightJsTheme = useCallback((themeName: string) => {
    if (typeof document === 'undefined') return; // Ensure client-side only

    // Remove any old theme link from the main document's head
    document.head.querySelectorAll('link[data-highlight-theme]').forEach(link => link.remove());

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/highlight-js-themes/${themeName}.css`; // Ensure this path is correct relative to your public directory
    link.setAttribute('data-highlight-theme', themeName); // Custom attribute to easily find it later

    document.head.appendChild(link);
    console.log(`HighlightThemeSwitcher: Appended theme link to main document.head: ${link.href}`); // Added log
  }, []); // No dependencies related to 'doc' anymore

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('highlightjs-theme', selectedTheme);
    }
  }, [selectedTheme]);

  // Effect to load the theme into the main document's head
  useEffect(() => {
    loadHighlightJsTheme(selectedTheme);

    // Cleanup: remove the theme link when component unmounts or theme changes
    return () => {
      if (typeof document !== 'undefined') {
        document.head.querySelectorAll('link[data-highlight-theme]').forEach(link => link.remove());
      }
    };
  }, [selectedTheme, loadHighlightJsTheme]); // Only depends on selectedTheme and the memoized loader

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Palette Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none"
        aria-label="Change Code Highlight Theme"
      >
        <MdPalette size={20} />
      </button>

      {/* Overlay Theme Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-20 right-6 z-50 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md p-4 w-64"
        >
          <label htmlFor="highlight-theme-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Code Theme:
          </label>
          <select
            id="highlight-theme-select"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {availableThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default HighlightThemeSwitcher;