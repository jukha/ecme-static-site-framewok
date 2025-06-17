import type { CommonProps } from '@/@types/common'
import LayoutBase from '@/components//template/LayoutBase'
import SidePanel from '@/components//template/SidePanel'
import Header from '@/components/template/Header'
import LanguageSelector from '@/components/template/LanguageSelector'
import MobileNav from '@/components/template/MobileNav'
import Search from '@/components/template/Search'
import StackedSideNav from '@/components/template/StackedSideNav'
import { LAYOUT_STACKED_SIDE } from '@/constants/theme.constant'
import useResponsive from '@/utils/hooks/useResponsive'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

const StackedSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()

    return (
        <LayoutBase
            type={LAYOUT_STACKED_SIDE}
            className="app-layout-stacked-side flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                {larger.lg && <StackedSideNav />}
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow-sm dark:shadow-2xl"
                        headerStart={
                            <>
                                {smaller.lg && <MobileNav />}
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

export default StackedSide
