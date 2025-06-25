// app/docs/[slug]/page.tsx
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { notFound } from 'next/navigation';
import * as cheerio from 'cheerio';

// Import the new Client Component
import DocContentClient from './components/DocContentClient';

// --- Type Definitions ---
interface Params { slug: string[] }
interface StaticDocPageProps { params: Promise<Params> }
interface FrontMatter { title?: string; [key: string]: unknown; }

/**
 * Helper function to find a file in a directory, case-insensitively.
 * This is crucial for matching 'home.md' to 'Home.md' on case-sensitive systems.
 * @param directory The directory to search in.
 * @param filenameWithoutExt The base filename (e.g., 'home').
 * @param extensions An array of extensions to check (e.g., ['.md', '.html']).
 * @returns The full path with correct casing and extension if found, otherwise null.
 */
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
                        return path.join(directory, entry.name); // Return the path with actual casing
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.error(`Error reading directory ${directory} for case-insensitive file search:`, error);
        return null;
    }
};

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
 * Forces slugs to lowercase.
 * @returns An array of parameters for each static path.
 */
export async function generateStaticParams(): Promise<Params[]> {
    const contentDirectory = path.join(process.cwd(), 'content');
    const filenames: string[] = readContentDir(contentDirectory);

    const params: Params[] = filenames
        .filter((name) => name.endsWith('.md') || name.endsWith('.html'))
        .map((filename) => {
            const relativePath = path.relative(contentDirectory, filename);
            const slugSegments = relativePath.replace(/\.(md|html)$/, '').split(path.sep);

            return {
                // Force all slug segments to lowercase for URL consistency
                slug: slugSegments.map(segment => segment.toLowerCase()),
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
    const { slug } = await params; // slug will be ['home'] (lowercase)

    const contentDir = path.join(process.cwd(), 'content');
    const slugPath = slug.join(path.sep); // 'home' or 'about/about-doc'

    // Extract the last segment of the slug to find the file
    const filenameWithoutExt = slug[slug.length - 1];
    const fileDirectory = path.join(contentDir, ...slug.slice(0, -1)); // e.g., 'content' or 'content/about'

    // Use the case-insensitive file finder
    const foundFilePath = findFileCaseInsensitive(
        fileDirectory,
        filenameWithoutExt,
        ['.md', '.html']
    );

    console.log(`Processing slug in StaticDocPage: ${slug.join('/')}`);
    console.log(`Attempting to find file in: ${fileDirectory} with base name: ${filenameWithoutExt}`);
    console.log(`Found file path (case-corrected): ${foundFilePath}`);


    let rawContent: string = '';
    let frontMatter: FrontMatter = {};
    let isHtmlFile: boolean = false;
    let disableSiteCSS: boolean = false;

    try {
        if (!foundFilePath) {
            console.error(`Neither MD nor HTML file found for slug: ${slug.join('/')}. Triggering notFound().`);
            notFound();
        }

        const ext = path.extname(foundFilePath).toLowerCase(); // Get the actual extension

        if (ext === '.md') {
            const fileContents = fs.readFileSync(foundFilePath, 'utf8');
            const { data: fm, content } = matter(fileContents);
            frontMatter = fm as FrontMatter;
            rawContent = content;
            isHtmlFile = false;
        } else if (ext === '.html') {
            rawContent = fs.readFileSync(foundFilePath, 'utf8');
            isHtmlFile = true;

            const temp$ = cheerio.load(rawContent);
            if (temp$('style').length > 0) {
                disableSiteCSS = true;
            }
        } else {
             // Should theoretically not be hit if findFileCaseInsensitive works correctly
            console.error(`Found file ${foundFilePath} but with unsupported extension. Triggering notFound().`);
            notFound();
        }

    } catch (error) {
        console.error(`Error processing content for slug: ${slug.join('/')}`, error);
        notFound();
    }

    return (
        <div className="max-w-5xl">
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

    const contentDir = path.join(process.cwd(), 'content');
    const filenameWithoutExt = slug[slug.length - 1];
    const fileDirectory = path.join(contentDir, ...slug.slice(0, -1));

    const foundFilePath = findFileCaseInsensitive(
        fileDirectory,
        filenameWithoutExt,
        ['.md', '.html']
    );

    let pageTitle = 'Documentation';

    try {
        if (foundFilePath) {
            const ext = path.extname(foundFilePath).toLowerCase();
            if (ext === '.md') {
                const fileContents = fs.readFileSync(foundFilePath, 'utf8');
                const { data: frontMatter } = matter(fileContents);
                // Use the actual file name without extension for title if frontmatter isn't present
                pageTitle = (frontMatter as FrontMatter).title || path.basename(foundFilePath, ext);
            } else if (ext === '.html') {
                pageTitle = path.basename(foundFilePath, ext);
            }
        } else {
            console.warn(`Could not find content file for metadata generation for slug: ${slug.join('/')}`);
        }
    } catch (error) {
        console.error(`Error generating metadata for slug: ${slug.join('/')}`, error);
        pageTitle = `Error Loading Doc`;
    }

    return {
        title: pageTitle.replaceAll('-', ' '),
    };
}