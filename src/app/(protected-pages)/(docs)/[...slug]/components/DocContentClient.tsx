'use client';

import React, { useEffect, useRef, useState } from 'react';
import Loading from '@/components/shared/Loading';
import * as cheerio from 'cheerio';
import hljs from 'highlight.js';

// Import your custom theme hook
import { MODE_DARK } from '@/constants/theme.constant'; // Adjust path if necessary
import useTheme from '@/utils/hooks/useTheme';

interface DocContentClientProps {
  rawContent: string;
  isHtmlFile: boolean;
  frontMatterTitle?: string;
  useShadowDOM: boolean;
}

const DocContentClient: React.FC<DocContentClientProps> = ({ rawContent, isHtmlFile, frontMatterTitle, useShadowDOM }) => {
  const [processedHtml, setProcessedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const shadowHostRef = useRef<HTMLDivElement>(null);

  // NEW: Use your custom theme hook to get the current mode
  const mode = useTheme((state) => state.mode);
  const isDarkMode = mode === MODE_DARK; // Derive isDarkMode from your theme's mode

  const HIGHLIGHT_JS_THEME_URL = '/highlight-js-themes/dracula.css';

  // Removed the previous useEffect for dark mode detection.
  // The 'mode' from useTheme is reactive, so changes will trigger the main effect.

  useEffect(() => {
    const process = async () => {
      setIsLoading(true);
      let currentHtmlContent = rawContent;

      try {
        if (isHtmlFile) {
          const $ = cheerio.load(rawContent);

          // 1. --- Apply Code Highlighting (Existing Logic) ---
          if ($('pre code').length > 0) {
            $('pre code').each((_, el) => {
              const code = $(el);
              const text = code.text();
              let lang = '';
              const cls = code.attr('class');
              if (cls) {
                const match = cls.match(/(?:lang|language)-([a-zA-Z0-9]+)/);
                if (match) lang = match[1];
              }
              const highlighted = lang && hljs.getLanguage(lang)
                ? hljs.highlight(text, { language: lang, ignoreIllegals: true }).value
                : hljs.highlightAuto(text).value;
              code.html(highlighted).addClass(`hljs language-${lang}`);
            });
          }

          // 2. --- CSS Selector Transformation & Dark Mode Filter Injection (Only if useShadowDOM) ---
          if (useShadowDOM) {
            $('style').each((_, el) => {
              const styleContent = $(el).html();
              if (styleContent) {
                let transformedStyleContent = styleContent;

                transformedStyleContent = transformedStyleContent.replace(/:root\s*\{/g, ':host {');
                transformedStyleContent = transformedStyleContent.replace(/html\s*\{/g, ':host {');
                transformedStyleContent = transformedStyleContent.replace(/body\s*\{/g, ':host {');

                $(el).html(transformedStyleContent);
              }
            });

            // Inject dark mode filter CSS
            const darkModeFilterStyle = `
              :host {
                /* Apply invert filter if dark mode is active */
                filter: ${isDarkMode ? 'invert(1) hue-rotate(180deg)' : 'none'};
                transition: filter 0.3s ease; /* Optional: smooth transition */
              }
              /* Re-invert images and videos that should not be inverted */
              :host img, :host video {
                filter: ${isDarkMode ? 'invert(1) hue-rotate(180deg)' : 'none'};
              }
            `;
            const darkModeStyleTag = `<style class="dark-mode-filter-style">${darkModeFilterStyle}</style>`;

            // Check if the style tag already exists (for re-renders)
            // If it exists, update its content; otherwise, append it.
            if ($('.dark-mode-filter-style').length) {
              $('.dark-mode-filter-style').html(darkModeFilterStyle);
            } else if ($('head').length) {
              $('head').append(darkModeStyleTag);
            } else {
              $.root().append(darkModeStyleTag); // Use append, not prepend, for consistency with other appends
            }


            // 3. --- Inject highlight.js theme link into the content ---
            const highlightStyleLink = `<link rel="stylesheet" href="${HIGHLIGHT_JS_THEME_URL}">`;
            if ($('head').length) {
              $('head').prepend(highlightStyleLink);
            } else if ($('body').length) {
              $('body').prepend(highlightStyleLink);
            } else {
              $.root().prepend(highlightStyleLink);
            }

            // Get the final HTML content after all Cheerio modifications
            currentHtmlContent = $.root().html() || $.html();

          } else {
            // This block is for HTML files that DO NOT need Shadow DOM
            const $ = cheerio.load(rawContent);

            if ($('pre code').length > 0) {
              $('pre code').each((_, el) => {
                const code = $(el);
                const text = code.text();
                let lang = '';
                const cls = code.attr('class');
                if (cls) {
                  const match = cls.match(/(?:lang|language)-([a-zA-Z0-9]+)/);
                  if (match) lang = match[1];
                }
                const highlighted = lang && hljs.getLanguage(lang)
                  ? hljs.highlight(text, { language: lang, ignoreIllegals: true }).value
                  : hljs.highlightAuto(text).value;
                code.html(highlighted).addClass(`hljs language-${lang}`);
              });
            }
            currentHtmlContent = $.root().html() || $.html();
          }
        } else {
          // Markdown was already rendered on server
          currentHtmlContent = rawContent;
        }

        setProcessedHtml(currentHtmlContent);

      } catch (err) {
        console.error('Client processing error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // The effect will now re-run when rawContent, isHtmlFile, useShadowDOM, or 'mode' changes
    process();
  }, [rawContent, isHtmlFile, useShadowDOM, mode]); // Changed isDarkMode to mode in dependencies

  useEffect(() => {
    if (!isLoading && isHtmlFile && useShadowDOM && shadowHostRef.current && processedHtml) {
      if (shadowHostRef.current.attachShadow && !shadowHostRef.current.shadowRoot) {
        const shadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = processedHtml;
      } else if (shadowHostRef.current.shadowRoot) {
        shadowHostRef.current.shadowRoot.innerHTML = processedHtml;
      }
    }
    if (!useShadowDOM && shadowHostRef.current?.shadowRoot) {
      shadowHostRef.current.shadowRoot.innerHTML = '';
    }
  }, [isLoading, isHtmlFile, processedHtml, useShadowDOM]);

  return (
    <div className={!useShadowDOM ? 'prose dark:prose-invert max-w-none mx-auto p-8' : ''}>
      {frontMatterTitle && <h1>{frontMatterTitle}</h1>}
      {isLoading
        ? <div className="min-h-screen flex justify-center"><Loading type="cover" loading={isLoading} /></div>
        : useShadowDOM && isHtmlFile
          ? <div ref={shadowHostRef} />
          : <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      }
    </div>
  );
};

export default DocContentClient;