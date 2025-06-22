import Menu from '@/components/ui/Menu'
import Dropdown from '@/components/ui/Dropdown'
import VerticalMenuIcon from './VerticalMenuIcon'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'
import { usePathname } from 'next/navigation'

interface DefaultItemProps extends CommonProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    t: TranslationFn
    indent?: boolean
    dotIndent?: boolean
    userAuthority: string[]
}

interface CollapsedItemProps extends DefaultItemProps {
    direction: Direction
    renderAsIcon?: boolean
    currentKey?: string
    parentKeys?: string[]
}

interface VerticalCollapsedMenuItemProps extends CollapsedItemProps {
    sideCollapsed?: boolean
}

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({
    nav,
    indent,
    dotIndent,
    children,
    userAuthority,
    t,
}: DefaultItemProps) => {
    const pathname = usePathname()
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <div className='bg-purple-400'>
            <MenuCollapse
                key={nav.key}
                label={
                    <>
                        <VerticalMenuIcon icon={nav.icon} />
                        <span>{t(nav.translateKey, nav.title)}</span>
                    </>
                }
                eventKey={nav.key}
                expanded={false}
                dotIndent={dotIndent}
                indent={indent}
                active={pathname.includes(nav.key.split('.').join('/'))}
            >
                {children}
            </MenuCollapse>
            </div>
        </AuthorityCheck>
    )
}

const CollapsedItem = ({
    nav,
    direction,
    children,
    t,
    renderAsIcon,
    userAuthority,
    parentKeys,
}: CollapsedItemProps) => {
    const pathname = usePathname()
    const menuItem = (
        <MenuItem
            key={nav.key}
            isActive={pathname?.includes(nav.key)}
            eventKey={nav.key}
            className="mb-2"
            icon={nav.icon}
        >
            <VerticalMenuIcon icon={nav.icon} />
        </MenuItem>
    )

    const dropdownItem = (
        <div key={nav.key}>{t(nav.translateKey, nav.title)}</div>
    )

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <Dropdown
                trigger="hover"
                activeKey={nav.key}
                renderTitle={renderAsIcon ? menuItem : dropdownItem}
                placement={direction === 'rtl' ? 'left-start' : 'right-start'}
            >
                {children}
            </Dropdown>
        </AuthorityCheck>
    )
}

const VerticalCollapsedMenuItem = ({
    sideCollapsed,
    ...rest
}: VerticalCollapsedMenuItemProps) => {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}

export default VerticalCollapsedMenuItem
