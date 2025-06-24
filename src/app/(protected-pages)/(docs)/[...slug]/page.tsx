// app/docs/[slug]/page.tsx
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { notFound } from 'next/navigation';
import * as cheerio from 'cheerio'; // Used only on the server for style tag check

// Import the new Client Component
import DocContentClient from './components/DocContentClient'; // Adjust path if your components folder is elsewhere

// --- Type Definitions ---
interface Params { slug: string[] }
interface StaticDocPageProps { params: Promise<Params> }
interface FrontMatter { title?: string; [key: string]: unknown; }

/**
 * Recursively reads filenames from a content directory.
 * @param contentDir The directory to read.
 * @returns An array of full file paths.
 */
const readContentDir = (contentDir: string): string[] => {
    let filenames: string[] = [];
    try {
        const entries = fs.readdirSync(contentDir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const nestedFilenames = readContentDir(path.join(contentDir, entry.name));
                filenames = filenames.concat(nestedFilenames);
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

/**
 * Generates static paths for all Markdown and HTML documents.
 * This is a Next.js built-in function for Static Site Generation (SSG).
 * @returns An array of parameters for each static path.
 */
export async function generateStaticParams(): Promise<Params[]> {
    const contentDirectory = path.join(process.cwd(), 'content');
    const filenames: string[] = readContentDir(contentDirectory);

    const params: Params[] = filenames
        .filter((name) => name.endsWith('.md') || name.endsWith('.html'))
        .map((filename) => {
            const relativePath = path.relative(contentDirectory, filename);
            // Split by path.sep ( OS-specific separator) to handle nested slugs
            return {
                slug: relativePath.replace(/\.(md|html)$/, '').split(path.sep),
            };
        });
    return params;
}

/**
 * Main Page Component (React Server Component)
 * Fetches content on the server and passes it to a client component for rendering.
 * @param params The slug array from the URL.
 */
export default async function StaticDocPage({ params }: StaticDocPageProps) {
    const { slug } = await params;

    const mdFilePath = path.join(process.cwd(), 'content', `${slug.join('/')}.md`);
    const htmlFilePath = path.join(process.cwd(), 'content', `${slug.join('/')}.html`);

    let rawContent: string = ''; // This will hold the raw Markdown or HTML string
    let frontMatter: FrontMatter = {};
    let isHtmlFile: boolean = false;
    let disableSiteCSS: boolean = false; // Flag to control site-wide CSS based on internal styles

    try {
        if (fs.existsSync(mdFilePath)) {
            const fileContents = fs.readFileSync(mdFilePath, 'utf8');
            const { data: fm, content } = matter(fileContents);
            frontMatter = fm as FrontMatter;
            rawContent = content; // Store the raw Markdown content
            isHtmlFile = false;
        } else if (fs.existsSync(htmlFilePath)) {
            rawContent = fs.readFileSync(htmlFilePath, 'utf8'); // Store the raw HTML content
            isHtmlFile = true;

            // Check if the HTML file contains any <style> tags on the server
            // This is done server-side to determine the disableSiteCSS flag early
            const temp$ = cheerio.load(rawContent);
            if (temp$('style').length > 0) {
                disableSiteCSS = true;
            }
        } else {
            // If neither markdown nor HTML file is found, trigger Next.js notFound
            notFound();
        }

    } catch (error) {
        console.error(`Error processing content for slug: ${slug}`, error);
        // If an error occurs during processing, also trigger Next.js notFound
        notFound();
    }

    return (
        <div className="max-w-5xl">
            {/* Pass rawContent and relevant flags to the Client Component */}
            <DocContentClient
                rawContent={rawContent}
                isHtmlFile={isHtmlFile}
                frontMatterTitle={frontMatter?.title}
                disableSiteCSS={disableSiteCSS}
            />
        </div>
    );
}

/**
 * Generates metadata for the page, fetching the title from front matter or slug.
 * This is a Next.js built-in function for Metadata API.
 * @param params The slug array from the URL.
 */
export async function generateMetadata({ params }: StaticDocPageProps) {
    const { slug } = await params;

    const mdFilePath = path.join(process.cwd(), 'content', `${slug.join('/')}.md`);
    const htmlFilePath = path.join(process.cwd(), 'content', `${slug.join('/')}.html`);

    let pageTitle = 'Documentation';

    try {
        if (fs.existsSync(mdFilePath)) {
            const fileContents = fs.readFileSync(mdFilePath, 'utf8');
            const { data: frontMatter } = matter(fileContents);
            pageTitle = (frontMatter as FrontMatter).title || slug[slug.length - 1];
        } else if (fs.existsSync(htmlFilePath)) {
            pageTitle = slug[slug.length - 1];
        }
    } catch (error) {
        console.error(`Error generating metadata for slug: ${slug}`, error);
        pageTitle = `Error Loading Doc`;
    }

    return {
        title: pageTitle.replaceAll('-', ' '),
    };
}