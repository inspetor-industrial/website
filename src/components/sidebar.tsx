'use client'

import { getSidebarMenus } from '@inspetor/constants/menus'
import { toast } from '@inspetor/hooks/use-toast'
import { Optional } from '@inspetor/lib/types/optional'
import { cn } from '@inspetor/lib/utils'
import { ChevronsLeft, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { ElementType, ReactNode } from 'react'

import { SidebarCollapsibleMenu } from './sidebar-collapsable-menu'
import {
  Sidebar as ShadCnUiSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from './ui/sidebar'

type SidebarMenu = {
  title: string
  icon: ElementType
  pathname?: string
  children?: Array<Optional<SidebarMenu, 'icon'>>
  isCollapsible?: boolean
}

export type NavigationParams = {
  workspace: string
}

export function InspetorSidebar() {
  const { state, toggleSidebar } = useSidebar()

  const { data } = useSession()

  const user = data?.user
  const sidebarMenus = getSidebarMenus(user?.role)

  function renderSidebarMenuItem(
    menu: SidebarMenu | Optional<SidebarMenu, 'icon'>,
    isSubMenu = false,
  ): ReactNode | Array<ReactNode> {
    const Icon = menu.icon!
    if (menu.children) {
      return (
        <SidebarCollapsibleMenu
          icon={<Icon className="!text-white" />}
          text={menu.title}
          key={menu.title}
          isCollapsible={menu.isCollapsible}
        >
          {menu.children.map((_menu) => renderSidebarMenuItem(_menu, true))}
        </SidebarCollapsibleMenu>
      )
    }

    const MenuItem = isSubMenu ? SidebarMenuSubItem : SidebarMenuItem
    const MenuButton = isSubMenu ? SidebarMenuSubButton : SidebarMenuButton

    return (
      <MenuItem
        key={menu.title}
        className="group data-[isselected=true]:bg-valeiot-primary-50 rounded-valeiot-md py-0.5 cursor-pointer list-none"
      >
        <MenuButton
          href={menu.pathname!}
          className="group-data-[isselected=true]:text-valeiot-primary-default !text-white font-medium leading-5 overflow-hidden"
        >
          {Icon && (
            <Icon className="group-data-[isselected=true]:text-valeiot-primary-default !text-white" />
          )}
          <span className="truncate">{menu.title}</span>
        </MenuButton>
      </MenuItem>
    )
  }

  return (
    <ShadCnUiSidebar
      variant="sidebar"
      collapsible="icon"
      className="shadow-md group transition-all collapsible-animation !bg-inspetor-dark-blue-700" // rounded-tr-valeiot-lg"
    >
      <SidebarContent className="bg-valeiot-surface relative !bg-inspetor-dark-blue-700">
        <SidebarHeader
          className={cn('items-end', state === 'collapsed' && 'items-center')}
        >
          <ChevronsLeft
            onClick={toggleSidebar}
            className={cn(
              'text-white transition-all duration-700 cursor-pointer',
              state === 'collapsed' && 'rotate-180',
            )}
          />
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mx-3">
              {sidebarMenus.map((menu) => {
                return renderSidebarMenuItem(menu)
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="absolute bottom-0 w-full">
          <SidebarMenu className="mx-1">
            <SidebarGroup className="">
              <SidebarGroupContent className="">
                <SidebarMenuButton
                  onClick={async () => {
                    try {
                      await signOut()

                      toast({
                        title: 'Saiu com sucesso',
                        variant: 'success',
                      })
                    } catch {
                      toast({
                        title: 'Erro ao sair',
                        description: 'Tente novamente mais tarde',
                        variant: 'destructive',
                      })
                    }
                  }}
                  className="mx-0 group-data-[isselected=true]:text-valeiot-primary-default !text-white font-medium leading-5 overflow-hidden"
                >
                  <LogOut className="!text-white size-4" />
                  <span className="!text-white">Sair</span>
                </SidebarMenuButton>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </ShadCnUiSidebar>
  )
}
