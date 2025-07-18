import HorizontalMenuDropdownTrigger from './HorizontalMenuDropdownTrigger'
import HorizontalMenuDropdown from './HorizontalMenuDropdown'
import HorizontalMenuDropdownContent from './HorizontalMenuDropdownContent'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import useTranslation from '@/utils/hooks/useTranslation'
import useMenuActive from '@/utils/hooks/useMenuActive'
import { TbChevronDown } from 'react-icons/tb'
import { Direction } from '@/@types/theme'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'
import { usePathname } from 'next/navigation'

type HorizontalMenuContentProps = {
    routeKey: string
    navigationTree?: NavigationTree[]
    direction?: Direction
    translationSetup?: boolean
    userAuthority: string[]
}

const HorizontalMenuContent = (props: HorizontalMenuContentProps) => {
    const {
        routeKey,
        navigationTree = [],
        translationSetup,
        userAuthority,
    } = props

    const translationPlaceholder = (key: string, fallback?: string) => {
        return fallback || key
    }

    const t = (
        translationSetup ? useTranslation() : translationPlaceholder
    ) as TranslationFn
    const { activedRoute } = useMenuActive(navigationTree, routeKey)
    const pathname = usePathname();

    return (
        <div className="gap-1 hidden lg:flex">
            {navigationTree.map((nav) => (
                <AuthorityCheck
                    key={nav.key}
                    userAuthority={userAuthority}
                    authority={nav.authority}
                >
                    {nav.subMenu.length > 0 ? (
                        <HorizontalMenuDropdown
                            dropdownLean={
                                nav.meta?.horizontalMenu?.layout === 'default'
                            }
                            triggerContent={({ ref, props }) => (
                                <HorizontalMenuDropdownTrigger
                                    ref={ref}
                                    {...props}
                                    active={pathname.includes(nav.key.split('.').join('/'))}
                                    // active={pathname === `/${nav.key.split('.').join('/')}`}
                                    asElement="button"
                                >
                                    <div className="flex items-center gap-1">
                                        <span>
                                            Hello
                                            {t(nav.translateKey, nav.title)}
                                        </span>
                                        <TbChevronDown />
                                    </div>
                                </HorizontalMenuDropdownTrigger>
                            )}
                            menuContent={({ styles, handleDropdownClose }) => (
                                <HorizontalMenuDropdownContent
                                    style={styles}
                                    navigationTree={nav.subMenu}
                                    t={t}
                                    layoutMeta={nav?.meta?.horizontalMenu}
                                    routeKey={routeKey}
                                    routeParentKey={activedRoute?.parentKey}
                                    userAuthority={userAuthority}
                                    onDropdownClose={handleDropdownClose}
                                />
                            )}
                        ></HorizontalMenuDropdown>
                    ) : (
                        <HorizontalMenuDropdownTrigger
                            {...props}
                            path={nav.path}
                            isExternalLink={nav.isExternalLink}
                            // active={activedRoute?.key === nav.key}
                            // active={pathname.includes(nav.key.split('.').join('/'))}
                            active={pathname === `/${nav.key.split('.').join('/')}`}
                            asElement="a"
                        >
                            <div className="flex items-center gap-1">
                                <span>{t(nav.translateKey, nav.title)}</span>
                            </div>
                        </HorizontalMenuDropdownTrigger>
                    )}
                </AuthorityCheck>
            ))}
        </div>
    )
}

export default HorizontalMenuContent
