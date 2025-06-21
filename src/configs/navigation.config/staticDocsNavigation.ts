// import fs from 'fs'
// import path from 'path'
// import matter from 'gray-matter'

// import {
//     // NAV_ITEM_TYPE_TITLE,
//     NAV_ITEM_TYPE_ITEM,
//     NAV_ITEM_TYPE_COLLAPSE,
// } from '@/constants/navigation.constant'

// import type { NavigationTree } from '@/@types/navigation'

// const staticDocsNavigationIcons = {
//     documentation: 'documentation',
//     examples: 'examplesicon',
// }

// export function formatDirectoryTitle(dirName: string): string {
//     return dirName
//         .toLowerCase()
//         .split(/[-&]/) // Split on '-' or '&'
//         .map(word => word.trim().charAt(0).toUpperCase() + word.trim().slice(1))
//         .join(' '); // No separator to remove hyphen/&
// }


// // Function to dynamically get static doc items
// function getStaticDocItems(dir: string, basePath = ''): NavigationTree[] {
//     const items: NavigationTree[] = []

//     try {
//         const entries = fs.readdirSync(dir, { withFileTypes: true })

//         for (const entry of entries) {
//             const fullPath = path.join(dir, entry.name)
//             const relativePath = path.relative(
//                 path.join(process.cwd(), 'content'),
//                 fullPath,
//             )

//             if (entry.isDirectory()) {
//                 // Handle directories - create submenu
//                 const subMenuItems = getStaticDocItems(fullPath, basePath)

//                 if (subMenuItems.length > 0) {
//                     const dirName = entry.name
//                     const dirPath = `${basePath}/${relativePath.replace(/\\/g, '/')}`

//                     items.push({
//                         key: `staticDocs.${relativePath.replace(/[/\\]/g, '.')}`,
//                         path: dirPath,
//                         // title:
//                         //     dirName.charAt(0).toUpperCase() + dirName.slice(1),
//                         title: formatDirectoryTitle(dirName),
//                         translateKey: `nav.staticDocs.${relativePath.replace(/[/\\]/g, '.')}`,
//                         icon: staticDocsNavigationIcons.hasOwnProperty(dirName)
//                             ? staticDocsNavigationIcons[
//                                   dirName as keyof typeof staticDocsNavigationIcons
//                               ]
//                             : 'documentation',
//                         type: NAV_ITEM_TYPE_COLLAPSE,
//                         authority: [],
//                         subMenu: subMenuItems,
//                     })
//                 }
//             } else if (
//                 entry.isFile() &&
//                 (entry.name.endsWith('.md') || entry.name.endsWith('.html'))
//             ) {
//                 // Handle files
//                 const slug = entry.name.replace(/\.(md|html)$/, '')
//                 const filePath = `${basePath}/${relativePath.replace(/\.(md|html)$/, '').replace(/\\/g, '/')}`

//                 let title = slug
//                 let icon = ''
//                 const translateKey = `nav.staticDocs.${relativePath.replace(/[/\\]/g, '.').replace(/\.(md|html)$/, '')}`

//                 // Extract title from front matter for .md files
//                 if (entry.name.endsWith('.md')) {
//                     try {
//                         const fileContents = fs.readFileSync(fullPath, 'utf8')
//                         const { data: frontMatter } = matter(fileContents)
//                         if (frontMatter.title) {
//                             title = frontMatter.title
//                         }
//                         if (frontMatter.icon) {
//                             icon = frontMatter.icon
//                         }
//                     } catch (error) {
//                         console.warn(
//                             `Failed to read front matter from ${fullPath}:`,
//                             error,
//                         )
//                     }
//                 }

//                 // Extract title from HTML files
//                 if (entry.name.endsWith('.html')) {
//                     try {
//                         const fileContents = fs.readFileSync(fullPath, 'utf8')
//                         const titleMatch = fileContents.match(
//                             /<title[^>]*>([^<]+)<\/title>/i,
//                         )
//                         if (titleMatch && titleMatch[1]) {
//                             title = titleMatch[1].trim()
//                         }
//                     } catch (error) {
//                         console.warn(
//                             `Failed to read title from ${fullPath}:`,
//                             error,
//                         )
//                     }
//                 }

//                 items.push({
//                     key: `staticDocs.${relativePath.replace(/[/\\]/g, '.').replace(/\.(md|html)$/, '')}`,
//                     path: filePath,
//                     title: title,
//                     translateKey: translateKey,
//                     icon: icon || '',
//                     type: NAV_ITEM_TYPE_ITEM,
//                     authority: [],
//                     subMenu: [],
//                 })
//             }
//         }
//     } catch (error) {
//         console.error(`Error reading directory ${dir}:`, error)
//     }

//     // Sort items: directories first, then files, both alphabetically
//     return items.sort((a, b) => {
//         if (a.type === NAV_ITEM_TYPE_COLLAPSE && b.type === NAV_ITEM_TYPE_ITEM)
//             return -1
//         if (a.type === NAV_ITEM_TYPE_ITEM && b.type === NAV_ITEM_TYPE_COLLAPSE)
//             return 1
//         return a.title.localeCompare(b.title)
//     })
// }

// const staticDocsNavigationConfig: NavigationTree[] =
//     getStaticDocItems('content')
// // Dynamically populate subMenu

// export default staticDocsNavigationConfig
