import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { HorizontalMenuMeta, NavigationTree } from '@/@types/navigation'

interface RawNavigationItem {
    key: string
    path: string
    isExternalLink?: boolean
    title: string
    translateKey: string
    icon: string
    // The 'type' from YAML will be a string like 'ITEM', 'COLLAPSE', 'TITLE'
    type: string
    authority: string[]
    subMenu?: RawNavigationItem[]
    description?: string
    meta?: {
        horizontalMenu?: HorizontalMenuMeta
        description?: {
            translateKey: string
            label: string
        }
    }
}

const yamlFilePath = path.join(
    process.cwd(),
    'public',
    'configs',
    'navigation.config.yaml',
)
// const yamlFilePath = './../../configs/navigation.config.yaml'

function mapType(typeStr: string): NavigationTree['type'] {
    switch (typeStr) {
        case 'COLLAPSE':
            return NAV_ITEM_TYPE_COLLAPSE as 'collapse'
        case 'ITEM':
            return NAV_ITEM_TYPE_ITEM as 'item'
        default:
            console.warn(
                `Unknown navigation item type in config: "${typeStr}". Defaulting to 'item'.`,
            )
            return 'item' as NavigationTree['type']
    }
}

function normalizeNavigation(items: RawNavigationItem[]): NavigationTree[] {
    return items.map((item: RawNavigationItem) => {
        // Construct the NavigationTree object
        const normalizedItem: NavigationTree = {
            key: item.key,
            path: item.path,
            title: item.title,
            translateKey: item.translateKey,
            icon: item.icon,
            authority: item.authority,
            type: mapType(item.type), // Here mapType returns the correct literal type
            subMenu: item.subMenu ? normalizeNavigation(item.subMenu) : [],
            ...(item.isExternalLink !== undefined && {
                isExternalLink: item.isExternalLink,
            }),
            ...(item.description && { description: item.description }),
            ...(item.meta && { meta: item.meta }),
        }
        return normalizedItem
    })
}

export function loadNavigationConfig(): NavigationTree[] {
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8')
    const rawData = YAML.parse(fileContents)

    if (!Array.isArray(rawData)) {
        throw new Error('Navigation YAML config root must be an array')
    }

    console.log('🔴🔴🔴🔴🔴rawData', rawData)

    return normalizeNavigation(rawData as RawNavigationItem[])
}

// const navigationConfig = loadNavigationConfig()

// export default navigationConfig
