import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import * as cheerio from 'cheerio'
import markdownit from 'markdown-it'
import hljs from 'highlight.js'

// Plugin styles
import '@mdit/plugin-alert/style'

// Markdown-it Plugins
import { abbr } from '@mdit/plugin-abbr'
import { alert } from '@mdit/plugin-alert'
import { align } from '@mdit/plugin-align'
import { attrs } from '@mdit/plugin-attrs'
import { container } from '@mdit/plugin-container'
import { demo } from '@mdit/plugin-demo'
import { dl } from '@mdit/plugin-dl'
import { embed } from '@mdit/plugin-embed'
import { figure } from '@mdit/plugin-figure'
import { footnote } from '@mdit/plugin-footnote'
import { icon } from '@mdit/plugin-icon'
import { imgLazyload } from '@mdit/plugin-img-lazyload'
import { imgMark } from '@mdit/plugin-img-mark'
import { imgSize } from '@mdit/plugin-img-size'
import { include } from '@mdit/plugin-include'
import { ins } from '@mdit/plugin-ins'
import { katex } from '@mdit/plugin-katex'
import { mark } from '@mdit/plugin-mark'
import {
    createMathjaxInstance,
    MarkdownItMathjaxOptions,
    mathjax,
} from '@mdit/plugin-mathjax'
import { plantuml } from '@mdit/plugin-plantuml'
import { ruby } from '@mdit/plugin-ruby'
import { spoiler } from '@mdit/plugin-spoiler'
import '@mdit/plugin-spoiler/style'
import { stylize } from '@mdit/plugin-stylize'
import { sub } from '@mdit/plugin-sub'
import { sup } from '@mdit/plugin-sup'
import { tab } from '@mdit/plugin-tab'
import { tasklist } from '@mdit/plugin-tasklist'
import { uml } from '@mdit/plugin-uml'

import DocContentClient from './components/DocContentClient'
import { getHighlightThemes } from '@/utils/getHighlightThemes'

const contentRootDir = path.join(process.cwd(), 'content')

interface Params {
    slug: string[]
}
interface StaticDocPageProps {
    params: Promise<Params>
}
interface FrontMatter {
    title?: string
    [key: string]: unknown
}

const findFileCaseInsensitive = (
    directory: string,
    filenameWithoutExt: string,
    extensions: string[],
): string | null => {
    try {
        const entries = fs.readdirSync(directory, { withFileTypes: true })
        const lowerFilename = filenameWithoutExt.toLowerCase()

        for (const entry of entries) {
            if (entry.isFile()) {
                const entryNameLower = entry.name.toLowerCase()
                for (const ext of extensions) {
                    if (
                        entryNameLower ===
                        `${lowerFilename}${ext.toLowerCase()}`
                    ) {
                        return path.join(directory, entry.name)
                    }
                }
            }
        }
        return null
    } catch (error) {
        console.error(`Error reading directory ${directory}`, error)
        return null
    }
}

const readContentDir = (contentDir: string): string[] => {
    let filenames: string[] = []
    try {
        const entries = fs.readdirSync(contentDir, { withFileTypes: true })
        for (const entry of entries) {
            if (entry.isDirectory()) {
                filenames = filenames.concat(
                    readContentDir(path.join(contentDir, entry.name)),
                )
            } else {
                filenames.push(path.join(contentDir, entry.name))
            }
        }
        return filenames
    } catch (error) {
        console.error('Error reading content directory:', error)
        return []
    }
}

export async function generateStaticParams(): Promise<Params[]> {
    const filenames = readContentDir(contentRootDir)
    return filenames
        .filter((f) => f.endsWith('.md') || f.endsWith('.html'))
        .map((filename) => {
            const relativePath = path.relative(contentRootDir, filename)
            const slug = relativePath
                .replace(/\.(md|html)$/, '')
                .split(path.sep)
                .map((s) => s.toLowerCase())
            return { slug }
        })
}

export default async function StaticDocPage({ params }: StaticDocPageProps) {
    const { slug } = await params
    const slugPath = slug.join(path.sep)
    const filenameWithoutExt = slug[slug.length - 1]
    const fileDirectory = path.join(contentRootDir, ...slug.slice(0, -1))
    const foundFilePath = findFileCaseInsensitive(
        fileDirectory,
        filenameWithoutExt,
        ['.md', '.html'],
    )

    if (!foundFilePath) return notFound()

    let rawContent = ''
    let frontMatter: FrontMatter = {}
    let isHtmlFile = false
    let useShadowDOM = false

    const ext = path.extname(foundFilePath).toLowerCase()

    console.log('--- Debugging Include Plugin ---')
    console.log('Found File Path:', foundFilePath)
    console.log('File Extension:', ext)
    console.log('------------------------------')

    try {
        if (ext === '.md') {
            const fileContents = fs.readFileSync(foundFilePath, 'utf8')
            const { data, content } = matter(fileContents)
            frontMatter = data

            const options: MarkdownItMathjaxOptions = {
                output: 'svg', // Use SVG output (default)
                delimiters: 'all', // Support both `$...$` and `\(...\)`
                allowInlineWithSpace: false, // Do not allow spaces inside inline math delimiters
                mathFence: true, // Enable math fenced code blocks (```math)
                a11y: true, // Enable accessibility features
                tex: {
                    // macros property removed because it's not supported by MathJaxTexInputOptions
                },
                svg: {
                    fontCache: 'global',
                },
            }

            const mathjaxInstance = createMathjaxInstance(options)

            const md = markdownit({
                html: true,
                linkify: true,
                typographer: true,
                highlight: (str: string, lang: string): string => {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return (
                                `<pre><code class="hljs language-${lang}">` +
                                hljs.highlight(str, {
                                    language: lang,
                                    ignoreIllegals: true,
                                }).value +
                                '</code></pre>'
                            )
                        } catch (_) {}
                    }
                    return (
                        `<pre><code class="hljs">` +
                        md.utils.escapeHtml(str) +
                        '</code></pre>'
                    )
                },
            })
                .use(abbr)
                .use(alert)
                .use(align)
                .use(attrs)
                .use(container, { name: 'warning' })
                .use(demo)
                .use(dl)
                .use(embed, {
                    config: [
                        {
                            name: 'youtube',
                            setup: (id: string) =>
                                `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`,
                        },
                    ],
                })
                .use(figure)
                .use(footnote)
                .use(icon)
                .use(imgLazyload)
                .use(imgMark)
                .use(imgSize)
                .use(include, {
                    // FIX
                    currentPath: (env) => {
                        if (!env || !env.filePath) {
                            console.warn(
                                '`filePath` not found in markdown-it env. Cannot resolve relative includes.',
                            )
                            return contentRootDir
                        }
                        console.log('fuck', env.filePath)
                        return path.dirname(env.filePath)
                    },
                    deep: true,
                })
                .use(ins)
                .use(katex)
                .use(mark)
                .use(mathjax, mathjaxInstance)
                .use(plantuml)
                .use(ruby)
                .use(spoiler)
                .use(stylize)
                .use(sub)
                .use(sup)
                .use(tab)
                .use(tasklist)
                .use(uml, {
                    name: 'demo',
                    open: 'demostart',
                    close: 'demoend',
                    render: (tokens, index) => {
                        const token = tokens[index]
                        return `<pre class="uml-block">${token.content}</pre>`
                    },
                })

            // The `filePath` option in md.render is essential for `currentPath` to work correctly.
            rawContent = md.render(content, { filePath: foundFilePath })

            isHtmlFile = false
            useShadowDOM = false
        } else if (ext === '.html') {
            const fileContents = fs.readFileSync(foundFilePath, 'utf8')
            rawContent = fileContents
            isHtmlFile = true

            const $ = cheerio.load(fileContents)
            useShadowDOM =
                $('style').length > 0 || $('link[rel="stylesheet"]').length > 0
        } else {
            return notFound()
        }
    } catch (error) {
        console.error('Error rendering content:', error)
        return notFound()
    }

    const availableThemes = getHighlightThemes()

    return (
        <div className="max-w-5xl">
            <DocContentClient
                rawContent={rawContent}
                isHtmlFile={isHtmlFile}
                frontMatterTitle={frontMatter?.title}
                useShadowDOM={useShadowDOM}
                availableThemes={availableThemes}
            />
        </div>
    )
}

export async function generateMetadata({ params }: StaticDocPageProps) {
    const { slug } = await params
    const filenameWithoutExt = slug[slug.length - 1]
    const fileDirectory = path.join(contentRootDir, ...slug.slice(0, -1))
    const foundFilePath = findFileCaseInsensitive(
        fileDirectory,
        filenameWithoutExt,
        ['.md', '.html'],
    )

    let pageTitle = 'Documentation'
    try {
        if (foundFilePath) {
            const ext = path.extname(foundFilePath).toLowerCase()
            if (ext === '.md') {
                const fileContents = fs.readFileSync(foundFilePath, 'utf8')
                const { data } = matter(fileContents)
                pageTitle =
                    (data as FrontMatter).title ||
                    path.basename(foundFilePath, ext)
            } else {
                pageTitle = path.basename(foundFilePath, ext)
            }
        }
    } catch {
        pageTitle = 'Error Loading Doc'
    }

    return {
        title: pageTitle.replaceAll('-', ' '),
    }
}
