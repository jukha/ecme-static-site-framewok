import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { notFound } from 'next/navigation';
import * as cheerio from 'cheerio'; // Make sure cheerio is imported
import markdownit from 'markdown-it';
import hljs from 'highlight.js';

// Plugins
import { abbr } from "@mdit/plugin-abbr";
import {footnote} from '@mdit/plugin-footnote';
import {sub} from '@mdit/plugin-sub';
import {sup} from '@mdit/plugin-sup';

import 'highlight.js/styles/dracula.css';

import DocContentClient from './components/DocContentClient';

interface Params { slug: string[] }
interface StaticDocPageProps { params: Promise<Params> }
interface FrontMatter { title?: string; [key: string]: unknown; }

const findFileCaseInsensitive = (
  directory: string,
  filenameWithoutExt: string,
  extensions: string[]
): string | null => {
  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    const lowerFilename = filenameWithoutExt.toLowerCase();

    for (const entry of entries) {
      if (entry.isFile()) {
        const entryNameLower = entry.name.toLowerCase();
        for (const ext of extensions) {
          if (entryNameLower === `${lowerFilename}${ext.toLowerCase()}`) {
            return path.join(directory, entry.name);
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error reading directory ${directory}`, error);
    return null;
  }
};

const readContentDir = (contentDir: string): string[] => {
  let filenames: string[] = [];
  try {
    const entries = fs.readdirSync(contentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        filenames = filenames.concat(readContentDir(path.join(contentDir, entry.name)));
      } else {
        filenames.push(path.join(contentDir, entry.name));
      }
    }
    return filenames;
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
};

export async function generateStaticParams(): Promise<Params[]> {
  const contentDirectory = path.join(process.cwd(), 'content');
  const filenames = readContentDir(contentDirectory);

  return filenames
    .filter((f) => f.endsWith('.md') || f.endsWith('.html'))
    .map((filename) => {
      const relativePath = path.relative(contentDirectory, filename);
      const slug = relativePath.replace(/\.(md|html)$/, '').split(path.sep).map(s => s.toLowerCase());
      return { slug };
    });
}

export default async function StaticDocPage({ params }: StaticDocPageProps) {
  const { slug } = await params;
  const contentDir = path.join(process.cwd(), 'content');
  const slugPath = slug.join(path.sep);

  const filenameWithoutExt = slug[slug.length - 1];
  const fileDirectory = path.join(contentDir, ...slug.slice(0, -1));
  const foundFilePath = findFileCaseInsensitive(fileDirectory, filenameWithoutExt, ['.md', '.html']);

  if (!foundFilePath) return notFound();

  let rawContent = '';
  let frontMatter: FrontMatter = {};
  let isHtmlFile = false;
  let useShadowDOM = false; // NEW: Flag to control Shadow DOM usage

  const ext = path.extname(foundFilePath).toLowerCase();
  try {
    if (ext === '.md') {
      const fileContents = fs.readFileSync(foundFilePath, 'utf8');
      const { data, content } = matter(fileContents);
      frontMatter = data;

      const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
        highlight: (str: string, lang: string): string => {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<pre><code class="hljs language-${lang}">` +
                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                '</code></pre>';
            } catch (_) { }
          }
          return `<pre><code class="hljs">` + md.utils.escapeHtml(str) + '</code></pre>';
        }
      })
        .use(abbr)
        .use(footnote)
        .use(sub)
        .use(sup);

      rawContent = md.render(content);
      isHtmlFile = false;
      useShadowDOM = false; // Markdown files never use Shadow DOM
    } else if (ext === '.html') {
      const fileContents = fs.readFileSync(foundFilePath, 'utf8');
      rawContent = fileContents; // Keep original raw content for client-side processing

      isHtmlFile = true;

      // NEW: Check for internal <style> tags or external <link rel="stylesheet">
      const $ = cheerio.load(fileContents);
      if ($('style').length > 0 || $('link[rel="stylesheet"]').length > 0) {
        useShadowDOM = true;
      } else {
        useShadowDOM = false;
      }

    } else {
      return notFound();
    }
  } catch (error) {
    console.error('Error rendering content:', error);
    return notFound();
  }

  return (
    <div className="max-w-5xl">
      <DocContentClient
        rawContent={rawContent}
        isHtmlFile={isHtmlFile}
        frontMatterTitle={frontMatter?.title}
        useShadowDOM={useShadowDOM} // Pass the new flag
      />
    </div>
  );
}

export async function generateMetadata({ params }: StaticDocPageProps) {
  const { slug } = await params;
  const contentDir = path.join(process.cwd(), 'content');
  const filenameWithoutExt = slug[slug.length - 1];
  const fileDirectory = path.join(contentDir, ...slug.slice(0, -1));
  const foundFilePath = findFileCaseInsensitive(fileDirectory, filenameWithoutExt, ['.md', '.html']);

  let pageTitle = 'Documentation';
  try {
    if (foundFilePath) {
      const ext = path.extname(foundFilePath).toLowerCase();
      if (ext === '.md') {
        const fileContents = fs.readFileSync(foundFilePath, 'utf8');
        const { data } = matter(fileContents);
        pageTitle = (data as FrontMatter).title || path.basename(foundFilePath, ext);
      } else {
        pageTitle = path.basename(foundFilePath, ext);
      }
    }
  } catch {
    pageTitle = 'Error Loading Doc';
  }

  return {
    title: pageTitle.replaceAll('-', ' ')
  };
}