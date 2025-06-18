// app/api/search/route.ts
import { NextResponse, NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { searchQueryPoolData as staticPages } from '@/mock/data/commonData'

interface SearchResultItem {
    key: string
    path: string
    title: string
    icon: string
    category: string
    categoryTitle: string
    type: 'dynamic' | 'static'
    content?: string // Optional for dynamic content
}

const DEFAULT_ICONS = {
    // Dynamic content icons
    md: 'document-text',
    html: 'code',
    default: 'document',
    api: 'server',
    guide: 'book-open',
    tutorial: 'academic-cap',
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')?.toLowerCase() || ''

    try {
        const results: SearchResultItem[] = []
        const contentDir = path.join(process.cwd(), 'content')

        // 1. Search dynamic content (markdown/html files)
        const searchDynamicContent = (dir: string, basePath = '') => {
            const entries = fs.readdirSync(dir, { withFileTypes: true })

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name)
                const relativePath = path.join(basePath, entry.name)

                if (entry.isDirectory()) {
                    searchDynamicContent(fullPath, relativePath)
                } else if (entry.name.endsWith('.md') || entry.name.endsWith('.html')) {
                    try {
                        const fileContent = fs.readFileSync(fullPath, 'utf8')
                        const { data: frontmatter, content } = matter(fileContent)
                        const fileExt = entry.name.split('.').pop() || 'md'

                        const icon = frontmatter.icon || 
                                   (frontmatter.category ? DEFAULT_ICONS[frontmatter.category.toLowerCase() as keyof typeof DEFAULT_ICONS] : undefined) ||
                                   DEFAULT_ICONS[fileExt as keyof typeof DEFAULT_ICONS] || 
                                   DEFAULT_ICONS.default

                        const docPath = '/' + relativePath
                            .replace(/\.(md|html)$/, '')
                            .replace(/\\/g, '/')

                        const titleMatch = frontmatter.title?.toLowerCase().includes(query)
                        const contentMatch = content.toLowerCase().includes(query)

                        if (titleMatch || contentMatch) {
                            results.push({
                                key: `doc.${relativePath.replace(/\.(md|html)$/, '').replace(/\//g, '.')}`,
                                path: docPath,
                                title: frontmatter.title || entry.name.replace(/\.(md|html)$/, ''),
                                icon,
                                category: frontmatter.category || 'Documentation',
                                categoryTitle: frontmatter.category || 'Docs',
                                type: 'dynamic',
                                content: content.substring(0, 200) + '...' // Preview for dynamic content
                            })
                        }
                    } catch (error) {
                        console.error(`Error processing file ${entry.name}:`, error)
                    }
                }
            }
        }

        // 2. Search static pages from your existing config
        const searchStaticPages = () => {
            staticPages.forEach(page => {
                const titleMatch = page.title.toLowerCase().includes(query)
                // For static pages, we only search by title since they don't have content
                if (titleMatch) {
                    results.push({
                        ...page, // Spread all existing properties
                        type: 'static'
                    })
                }
            })
        }

        searchDynamicContent(contentDir)
        searchStaticPages()

        // Group results by category
        const categories = [...new Set(results.map(item => item.categoryTitle))]
        const groupedResults = categories.map(category => ({
            title: category,
            data: results
                .filter(item => item.categoryTitle === category)
                .slice(0, 5) // Limit to 5 results per category
        }))

        return NextResponse.json(groupedResults)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}