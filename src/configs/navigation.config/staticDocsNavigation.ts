
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'; 

import type { NavigationTree } from '@/@types/navigation'; 

// Function to dynamically get static doc items
function getStaticDocItems(): NavigationTree[] {
    const contentDirectory = path.join(process.cwd(), 'content');
    const filenames = fs.readdirSync(contentDirectory);

    const docItems: NavigationTree[] = filenames
        .filter(name => name.endsWith('.md') || name.endsWith('.html'))
        .map((filename) => {
            const slug = filename.replace(/\.(md|html)$/, '');
            let title = slug; // Default title
            let translateKey = `nav.staticDocs.${slug}`; // Default translate key

            // Try to read title from Markdown front matter
            if (filename.endsWith('.md')) {
                const filePath = path.join(contentDirectory, filename);
                const fileContents = fs.readFileSync(filePath, 'utf8');
                const { data: frontMatter } = matter(fileContents);
                if (frontMatter.title) {
                    title = frontMatter.title;
                    // You might adjust translateKey if frontMatter has a specific one
                    // translateKey = frontMatter.translateKey || translateKey;
                }
            }
            // For HTML files, you might need a more complex way to get a title
            // or rely on the filename.

            return {
                key: `staticDocs.${slug}`,
                path: `/docs/${slug}`,
                title: title,
                translateKey: translateKey,
                icon: '', // <<<<<< ADDED: Required icon property for individual items
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            };
        });

    return docItems;
}


const staticDocsNavigationConfig: NavigationTree = {
    key: 'staticDocs',
    path: '', // This is a collapse menu, so no direct path
    title: 'Documentation',
    translateKey: 'nav.staticDocs',
    icon: 'documentation', // <<<<<< Keep this icon for the main collapse menu
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [],
    subMenu: getStaticDocItems(), // Dynamically populate subMenu
};

export default staticDocsNavigationConfig;