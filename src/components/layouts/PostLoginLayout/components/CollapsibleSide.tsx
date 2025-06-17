'use client'

import type { CommonProps } from '@/@types/common'
import LayoutBase from '@/components//template/LayoutBase'
import SidePanel from '@/components//template/SidePanel'
import Header from '@/components/template/Header'
import LanguageSelector from '@/components/template/LanguageSelector'
import MobileNav from '@/components/template/MobileNav'
import Search from '@/components/template/Search'
import SideNav from '@/components/template/SideNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

const CollapsibleSide = ({ children }: CommonProps) => {
    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow-sm dark:shadow-2xl"
                        headerStart={
                            <>
                                <MobileNav />
                                <SideNavToggle />
                                <Search />
                            </>
                        }
                        headerEnd={
                            <>
                                <LanguageSelector />
                                <Link
                                    href={'https://github.com/ZuzNet'}
                                    className="text-2xl"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <FaGithub />
                                </Link>
                                <SidePanel />
                            </>
                        }
                    />
                    <div className="h-full flex flex-auto flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default CollapsibleSide
