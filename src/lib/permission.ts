import type { ElementType } from 'react'

import type { Optional } from './types/optional'

type SidebarMenu = {
  title: string
  icon: ElementType
  pathname?: string
  children?: Array<Optional<SidebarMenu, 'icon'>>
  isCollapsible?: boolean
}

export const USER_CANNOT_ACCESS_MENUS = [
  {
    pathname: '/dashboard/users',
    exact: false,
  },
  {
    pathname: '/dashboard/users/companies',
    exact: false,
  },
]

export function hasPermissionForMenu(
  menu: SidebarMenu,
  userRole: string = 'user',
) {
  if (userRole === 'user') {
    return !USER_CANNOT_ACCESS_MENUS.some((_menu) => {
      if (_menu.exact) {
        return (
          _menu.pathname === menu.pathname && !menu.pathname.includes('profile')
        )
      }

      return (
        menu.pathname?.startsWith(_menu.pathname ?? '') &&
        !menu.pathname.includes('profile')
      )
    })
  }

  return true
}

export function hasPermissionForPathname(
  pathname: string,
  userRole: string = 'user',
) {
  if (userRole === 'user') {
    return !USER_CANNOT_ACCESS_MENUS.some((_menu) => {
      if (_menu.exact) {
        return _menu.pathname === pathname && !pathname.includes('profile')
      }

      return (
        pathname.startsWith(_menu.pathname ?? '') &&
        !pathname.includes('profile')
      )
    })
  }

  return true
}
