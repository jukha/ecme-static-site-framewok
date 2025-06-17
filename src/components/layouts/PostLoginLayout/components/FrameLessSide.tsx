'use client'

import type { CommonProps } from '@/@types/common'
import LayoutBase from '@/components//template/LayoutBase'
import SidePanel from '@/components//template/SidePanel'
import type { FooterPageContainerType } from '@/components/template/Footer'
import FrameLessGap from '@/components/template/FrameLessGap'
import Header from '@/components/template/Header'
import LanguageSelector from '@/components/template/LanguageSelector'
import MobileNav from '@/components/template/MobileNav'
import Search from '@/components/template/Search'
import SideNav from '@/components/template/SideNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import { LAYOUT_FRAMELESS_SIDE } from '@/constants/theme.constant'
import classNames from '@/utils/classNames'
import useScrollTop from '@/utils/hooks/useScrollTop'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

const FrameLessSide = ({ children }: CommonProps) => {
    const { isSticky } = useScrollTop()

    return (
        <LayoutBase
            adaptiveCardActive
            type={LAYOUT_FRAMELESS_SIDE}
            className="app-layout-frameless-side flex flex-auto flex-col bg-gray-950"
            pageContainerReassemble={({
                pageContainerType,
                pageBackgroundType,
                pageContainerGutterClass,
                children,
                footer,
                header,
                defaultClass,
                pageContainerDefaultClass,
                PageContainerBody,
                PageContainerFooter,
                PageContainerHeader,
            }) => (
                <div
                    className={classNames(
                        defaultClass,
                        'rounded-2xl',
                        pageBackgroundType === 'plain' &&
                            'bg-white dark:bg-gray-900',
                    )}
                >
                    <main className="h-full">
                        <div
                            className={classNames(
                                pageContainerDefaultClass,
                                pageContainerType !== 'gutterless' &&
                                    pageContainerGutterClass,
                                pageContainerType === 'contained' &&
                                    'container mx-auto',
                                !footer && 'pb-0 sm:pb-0 md:pb-0',
                            )}
                        >
                            <PageContainerHeader
                                {...header}
                                gutterLess={pageContainerType === 'gutterless'}
                            />
                            <PageContainerBody
                                pageContainerType={pageContainerType}
                            >
                                {children}
                            </PageContainerBody>
                        </div>
                    </main>
                    <PageContainerFooter
                        footer={footer}
                        pageContainerType={
                            pageContainerType as FooterPageContainerType
                        }
                    />
                </div>
            )}
        >
            <div className="flex flex-auto min-w-0">
                <SideNav
                    background={false}
                    className={classNames('contrast-dark pt-6')}
                    contentClass="h-[calc(100vh-8rem)]"
                    mode="dark"
                />
                <FrameLessGap className="min-h-screen min-w-0 relative w-full">
                    <div className="bg-white dark:bg-gray-900 flex flex-col flex-1 h-full rounded-2xl">
                        <Header
                            className={classNames(
                                'rounded-t-2xl dark:bg-gray-900',
                                isSticky && 'shadow-sm rounded-none!',
                            )}
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
                </FrameLessGap>
            </div>
        </LayoutBase>
    )
}

export default FrameLessSide
