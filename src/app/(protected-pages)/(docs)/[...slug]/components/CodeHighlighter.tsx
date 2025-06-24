// components/CodeHighlighter.tsx
'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/dracula.css';

interface CodeHighlighterProps {
    htmlContent: string;
}

export default function CodeHighlighter({ htmlContent }: CodeHighlighterProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            // Query all 'pre code' elements within the ref's current content
            contentRef.current.querySelectorAll('pre code').forEach((block) => {
                // Type assertion here: tell TypeScript that 'block' is an HTMLElement
                // This is safe because 'pre code' elements will always be HTMLElements in a browser DOM.
                const codeBlock = block as HTMLElement;

                // Check if it's already highlighted by markdown-it (if from .md).
                // highlight.js adds 'hljs' class to the parent <pre>
                if (!codeBlock.parentElement?.classList.contains('hljs')) {
                    hljs.highlightElement(codeBlock);
                }
            });
        }
    }, [htmlContent]);

    return (
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
}