'use client';

import React, { useEffect, useState } from 'react';
import 'highlight.js/styles/dracula.css';
import Loading from '@/components/shared/Loading';

interface DocContentClientProps {
  rawContent: string;
  isHtmlFile: boolean;
  frontMatterTitle?: string;
  disableSiteCSS: boolean;
}

const DocContentClient: React.FC<DocContentClientProps> = ({ rawContent, isHtmlFile, frontMatterTitle, disableSiteCSS }) => {
  const [processedHtml, setProcessedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const process = async () => {
      setIsLoading(true);
      try {
        if (isHtmlFile) {
          const cheerioModule = await import('cheerio');
          const hljs = (await import('highlight.js')).default;
          const $ = cheerioModule.load;

          const $cheerio = $(rawContent);
          $cheerio('pre code').each((_, el) => {
            const code = $cheerio(el);
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

          setProcessedHtml($cheerio.html());
        } else {
          // Markdown was already rendered on server
          setProcessedHtml(rawContent);
        }
      } catch (err) {
        console.error('Client processing error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    process();
  }, [rawContent, isHtmlFile]);

  return (
    <div className={!disableSiteCSS ? 'prose dark:prose-invert max-w-none mx-auto p-8' : ''}>
      {frontMatterTitle && <h1>{frontMatterTitle}</h1>}
      {isLoading
        ? <div className="min-h-screen flex justify-center"><Loading type="cover" loading={isLoading} /></div>
        : <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      }
    </div>
  );
};

export default DocContentClient;
