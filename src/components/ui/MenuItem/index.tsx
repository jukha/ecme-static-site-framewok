import VerticalMenuIcon from '@/components/template/VerticalMenuContent/VerticalMenuIcon'
import classNames from 'classnames'
import type { ElementType, Ref } from 'react'
import type { CommonProps } from '../@types/common'

export interface MenuItemProps extends CommonProps {
    asElement?: ElementType
    id?: string
    disabled?: boolean
    dotIndent?: boolean
    eventKey?: string
    isActive?: boolean
    menuItemHeight?: string | number
    onSelect?: (eventKey: string, e: MouseEvent) => void
    ref?: Ref<HTMLElement>
    icon?: string
}

const MenuItem = (props: MenuItemProps) => {
    const {
        asElement: Component = 'div',
        children,
        className,
        disabled,
        dotIndent,
        eventKey,
        isActive,
        menuItemHeight = 42,
        onSelect,
        ref,
        icon,
        style,
        ...rest
    } = props

    const menuItemActiveClass = `menu-item-active`
    const menuItemHoverClass = `menu-item-hoverable`
    const disabledClass = 'menu-item-disabled'
    const menuItemClass = classNames(
        'menu-item',
        isActive && menuItemActiveClass,
        disabled && disabledClass,
        !disabled && menuItemHoverClass,
        dotIndent && 'items-center gap-2 ',
        className,
    )

    const hanldeOnClick = (e: MouseEvent) => {
        if (onSelect) {
            onSelect(eventKey as string, e)
        }
    }

    return (
        <Component
            ref={ref}
            className={menuItemClass}
            style={{ height: `${menuItemHeight}px`, ...style }}
            onClick={hanldeOnClick}
            {...rest}
        >
            {dotIndent ? (
                <>
                    <div className="pl-3">
                        <VerticalMenuIcon icon={icon || ""} />
                        {/* <PiDotOutlineFill
                            className={classNames(
                                'text-3xl w-[24px]',
                                !isActive && 'opacity-25',
                            )}
                        /> */}
                    </div>
                    {children}
                </>
            ) : (
                <>{children}</>
            )}
        </Component>
    )
}

export default MenuItem
