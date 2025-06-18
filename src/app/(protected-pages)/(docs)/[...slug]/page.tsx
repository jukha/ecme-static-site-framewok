// app/docs/[slug]/page.tsx
// This file serves as the dynamic page component for rendering both Markdown (.md)
// and raw HTML (.html) files located in the project's root 'content/' directory.
// It uses Next.js App Router features for static site generation (SSG).

import fs from 'fs' // Node.js File System module for reading files (server-side only)
import path from 'path' // Node.js Path module for handling file paths (server-side only)
import matter from 'gray-matter' // Library to parse YAML front matter from Markdown files
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import parse from 'html-react-parser' // Library to safely parse and render raw HTML strings in React

// --- Type Definitions ---
// Defines the structure for the 'params' object passed to page components and data fetching functions.
interface Params {
    slug: string[] // The dynamic part of the URL (e.g., 'about' for /docs/about)
}

// Defines the props structure for the StaticDocPage component.
interface StaticDocPageProps {
    params: Promise<Params>
}

// Defines the expected structure of the front matter in Markdown files.
interface FrontMatter {
    title?: string // Optional title for the page
    date?: string // Optional date
    [key: string]: unknown // Allows for additional, arbitrary properties in front matter
}

const readContentDir = (contentDir: string) => {
    let filenames: string[] = []

    try {
        // Read all filenames from the 'content' directory.
        const entries = fs.readdirSync(contentDir, { withFileTypes: true })

        for (const entry of entries) {
            if (entry.isDirectory()) {
                // Recursively read subdirectories
                const nestedFilenames = readContentDir(
                    path.join(contentDir, entry.name),
                )
                filenames = filenames.concat(nestedFilenames)
            } else {
                // Add filenames to the list
                filenames.push(path.join(contentDir, entry.name))
            }
        }

        return filenames
    } catch (error) {
        console.error('Error reading content directory:', error)
        return []
    }
}

// --- generateStaticParams Function ---
// This Next.js App Router function is crucial for Static Site Generation (SSG).
// It tells Next.js which dynamic paths ([slug]) should be pre-rendered into static HTML
// at build time. This improves performance as pages are served directly from a CDN.
export async function generateStaticParams(): Promise<Params[]> {
    // Construct the absolute path to the 'content' directory at the project root.
    const contentDirectory = path.join(process.cwd(), 'content')

    const filenames: string[] = readContentDir(contentDirectory)

    // Filter for files ending with .md or .html and map them to 'slug' parameters.
    const params: Params[] = filenames
        .filter((name) => name.endsWith('.md') || name.endsWith('.html'))
        .map((filename) => {
            // Minimal Change 2: Calculate relative path before splitting
            const relativePath = path.relative(contentDirectory, filename)
            return {
                // Minimal Change 3: Use path.sep for cross-platform compatibility
                slug: relativePath.replace(/\.(md|html)$/, '').split(path.sep),
            }
        })

    return params
}

// --- Main Page Component (React Server Component) ---
// This is the default export for the page, responsible for rendering the content.
// It's an 'async' component because it fetches data directly during server rendering/build.
export default async function StaticDocPage({ params }: StaticDocPageProps) {
    const { slug } = await params

    // Construct full paths for both potential Markdown and HTML files.
    const mdFilePath = path.join(
        process.cwd(),
        'content',
        `${slug.join('/')}.md`,
    )
    const htmlFilePath = path.join(
        process.cwd(),
        'content',
        `${slug.join('/')}.html`,
    )

   let fileContents: string = '' // Stores raw content read from file
    let frontMatter: FrontMatter = {} // Stores parsed front matter for Markdown
    let contentHtml: string = '' // Stores the final HTML string to be rendered
    let isHtml: boolean = false // Flag to determine if original file was HTML

    try {
        // Attempt to read and process the Markdown file first.
        if (fs.existsSync(mdFilePath)) {
            fileContents = fs.readFileSync(mdFilePath, 'utf8')
            const { data: fm, content } = matter(fileContents)
            frontMatter = fm as FrontMatter // Type assertion for type safety
            contentHtml = content // Store the raw markdown content
            isHtml = false
        } else if (fs.existsSync(htmlFilePath)) {
            fileContents = fs.readFileSync(htmlFilePath, 'utf8')
            contentHtml = fileContents
            isHtml = true
        } 
        // If neither file exists for the given slug, display a 'Not Found' message.
        // For statically generated pages, generateStaticParams should prevent reaching here
        // for non-existent slugs. This acts as a fallback for dynamic scenarios or unexpected issues.
        else {
            return (
                <div className="prose dark:prose-invert max-w-none mx-auto p-8 text-center">
                    <h1>Content Not Found</h1>
                    <p>
                        The page for &quot;{slug}&quot; could not be found.
                        Please check the URL or if the content file exists.
                    </p>
                </div>
            )
        }
    } catch (error) {
        console.error(`Error processing content for slug: ${slug}`, error)
        return (
            <div className="prose dark:prose-invert max-w-none mx-auto p-8 text-center text-red-500">
                <h1>Error Loading Content</h1>
                <p>
                    An error occurred while trying to load the page for &quot;
                    {slug}&quot;.
                </p>
            </div>
        )
    }

    return (
        <div className="prose dark:prose-invert max-w-none mx-auto p-8">
            {frontMatter?.title && <h1>{frontMatter.title}</h1>}

            {isHtml ? (
                <div>{parse(contentHtml)}</div>
            ) : (
                <ReactMarkdown
                    components={{
                        code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                                <SyntaxHighlighter
                                    language={match[1]}
                                    PreTag="div"
                                    style={dracula}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        },
                    }}
                >
                    {contentHtml}
                </ReactMarkdown>
            )}
        </div>
    )
}

// --- generateMetadata Function (Optional but Recommended for SEO) ---
// This Next.js App Router function allows you to dynamically set page metadata (like title)
// based on the content of the page, which is crucial for SEO and browser tabs.
export async function generateMetadata({ params }: StaticDocPageProps) {
    const { slug } = await params
    const mdFilePath = path.join(process.cwd(), 'content', `${slug}.md`)
    const htmlFilePath = path.join(process.cwd(), 'content', `${slug}.html`)

    let pageTitle = 'Document' // Default title if no specific title is found

    try {
        if (fs.existsSync(mdFilePath)) {
            const fileContents = fs.readFileSync(mdFilePath, 'utf8')
            const { data: frontMatter } = matter(fileContents)
            pageTitle = (frontMatter as FrontMatter).title || `Doc: ${slug}`
        } else if (fs.existsSync(htmlFilePath)) {
            // For HTML files, extracting the title programmatically can be more complex.
            // You could potentially parse the HTML string to find the <title> tag,
            // but for simplicity, we'll use a generic title or the slug here.
            pageTitle = `HTML Doc: ${slug}`
        }
    } catch (error) {
        console.error(`Error generating metadata for slug: ${slug}`, error)
        pageTitle = `Error Loading Doc` // Fallback title on error
    }

    return {
        title: pageTitle,
        // You can add other meta tags here, e.g., description, keywords, etc.
        // description: frontMatter.description || `Content for ${slug}`,
    }
}
