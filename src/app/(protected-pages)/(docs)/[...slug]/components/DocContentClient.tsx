// components/DocContentClient.tsx
'use client'; // This directive marks this as a Client Component

import React, { useState, useEffect } from 'react';
// Do NOT import markdown-it, highlight.js, or cheerio here directly.
// They will be dynamically imported inside useEffect.

// Import highlight.js CSS globally (if you haven't already in layout.tsx)
import 'highlight.js/styles/dracula.css';
import Loading from '@/components/shared/Loading'; // Assuming this is your loader component

// Import types for markdown-it and highlight.js to avoid 'any' errors
import type MarkdownIt from 'markdown-it';
// import type { HighlightResult } from 'highlight.js'; // Can be used for more strict typing if needed

// Define props for the client component
interface DocContentClientProps {
    rawContent: string;
    isHtmlFile: boolean;
    frontMatterTitle?: string;
    disableSiteCSS: boolean;
}

const DocContentClient: React.FC<DocContentClientProps> = ({ rawContent, isHtmlFile, frontMatterTitle, disableSiteCSS }) => {
    const [processedHtml, setProcessedHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const processContent = async () => {
            setIsLoading(true); // Start loading state
            try {
                // Dynamically import markdown-it, highlight.js, and cheerio
                // These imports will only be part of the client-side bundle
                const { default: markdownit } = await import('markdown-it');
                const { default: hljs } = await import('highlight.js');
                const cheerioModule = await import('cheerio'); // Import as module object
                const $ = cheerioModule.load; // Access the load function

                // --- START TYPE ANNOTATION & LOGIC CHANGES FOR ESLINT FIXES ---

                // Explicitly declare 'md' with its type (MarkdownIt) before initialization.
                // This resolves 'md' implicitly has type 'any' error.
                let md: MarkdownIt;

                // Initialize markdown-it instance on the client
                md = markdownit({ // Assign to the already declared 'md'
                    html: true,
                    linkify: true,
                    typographer: true,
                    // Explicitly define parameters and return type for 'highlight' function.
                    // This resolves 'highlight' implicitly has return type 'any' error.
                    highlight: function (str: string, lang: string): string {
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return '<pre><code class="hljs language-' + lang + '">' +
                                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                                    '</code></pre>';
                            } catch (__) { /* ignore errors */ }
                        }
                        // 'md.utils.escapeHtml' is now correctly typed because 'md' is typed.
                        return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
                    }
                });

                // --- END TYPE ANNOTATION & LOGIC CHANGES FOR ESLINT FIXES ---


                let currentHtml: string;

                if (!isHtmlFile) {
                    // Process Markdown content to HTML
                    currentHtml = md.render(rawContent);
                } else {
                    // Start with raw HTML content
                    currentHtml = rawContent;

                    // Apply highlight.js to pre-existing code blocks in raw HTML on client-side
                    // Use the '$' function (cheerio.load) obtained from dynamic import
                    const $cheerio = $(currentHtml); // Load HTML into cheerio

                    $cheerio('pre code').each((index, element) => {
                        const codeBlock = $cheerio(element); // Wrap element with cheerio for manipulation
                        const textContent = codeBlock.text();

                        // Skip highlighting for <style> content within .html files
                        if (codeBlock.closest('style').length > 0) {
                            return;
                        }

                        // Try to infer language from class, or fall back to auto-detection
                        let lang = '';
                        const classAttr = codeBlock.attr('class');
                        if (classAttr) {
                            const langMatch = classAttr.match(/(?:lang|language)-([a-zA-Z0-9]+)/);
                            if (langMatch && hljs.getLanguage(langMatch[1])) {
                                lang = langMatch[1];
                            }
                        }

                        let highlightedCode: string; // Explicitly type this variable as well for clarity
                        if (lang) {
                            highlightedCode = hljs.highlight(textContent, { language: lang, ignoreIllegals: true }).value;
                        } else {
                            highlightedCode = hljs.highlightAuto(textContent).value; // Auto-detect language
                        }

                        // Replace the code block's content with the highlighted HTML
                        codeBlock.html(highlightedCode);

                        // Ensure the parent <pre> or the <code> itself has the hljs class for styling
                        if (!codeBlock.parent()?.hasClass('hljs')) {
                            codeBlock.parent()?.addClass('hljs');
                        }
                        // Add language class if not already present
                        if (lang && !codeBlock.hasClass(`language-${lang}`)) {
                            codeBlock.addClass(`language-lang-${lang}`); // Consistency with previous pattern
                        } else if (!lang && !codeBlock.hasClass('hljs')) {
                            // If auto-detected and no specific lang class, ensure base hljs class is there
                            codeBlock.addClass('hljs');
                        }
                    });
                    currentHtml = $cheerio.html(); // Get the modified HTML string from cheerio
                }

                setProcessedHtml(currentHtml); // Update state with the final HTML

            } catch (error) {
                console.error('Error processing content on client:', error);
                // You could set an error state here and display an error message to the user
            } finally {
                setIsLoading(false); // End loading state regardless of success or failure
            }
        };

        // Only process content if rawContent is available
        if (rawContent) {
            processContent();
        } else {
            setIsLoading(false); // No content to process, so stop loading
        }
    }, [rawContent, isHtmlFile]); // Dependency array: re-run effect if rawContent or file type changes

    return (
        <div className={!disableSiteCSS ? 'prose dark:prose-invert max-w-none mx-auto p-8' : ''}>
            {/* Display the title from front matter if available */}
            {frontMatterTitle && <h1>{frontMatterTitle}</h1>}

            {isLoading ? (
                // Loader displayed while content is being processed client-side
                <div className='min-h-screen flex justify-center'>
                    <Loading type='cover' loading={isLoading} />
                </div>
            ) : (
                // Once processed, render the HTML using dangerouslySetInnerHTML
                // suppressHydrationWarning is no longer strictly necessary here as rendering is purely client-side,
                // but it's harmless to leave it if you prefer.
                <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
            )}
        </div>
    );
};

export default DocContentClient;