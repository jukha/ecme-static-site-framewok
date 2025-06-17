'use client'

import type { CommonProps } from '@/@types/common'
import LayoutBase from '@/components//template/LayoutBase'
import Header from '@/components/template/Header'
import HeaderLogo from '@/components/template/HeaderLogo'
import HorizontalNav from '@/components/template/HorizontalNav'
import LanguageSelector from '@/components/template/LanguageSelector'
import MobileNav from '@/components/template/MobileNav'
import Search from '@/components/template/Search'
import SidePanel from '@/components/template/SidePanel'
import { LAYOUT_TOP_BAR_CLASSIC } from '@/constants/theme.constant'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

const TopBarClassic = ({ children }: CommonProps) => {
    return (
        <LayoutBase
            type={LAYOUT_TOP_BAR_CLASSIC}
            className="app-layout-top-bar-classic flex flex-auto flex-col min-h-screen"
        >
            <div className="flex flex-auto min-w-0">
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        container
                        className="shadow-sm dark:shadow-2xl"
                        headerStart={
                            <>
                                <MobileNav />
                                <HeaderLogo />
                            </>
                        }
                        headerMiddle={<HorizontalNav />}
                        headerEnd={
                            <>
                                <Search />
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
                    {children}
                </div>
            </div>
        </LayoutBase>
    )
}

export default TopBarClassic
