'use client'

import { cn } from '@inspetor/lib/utils'
import { ChevronDown } from 'lucide-react'
import { ReactNode, useState } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from './ui/sidebar'

interface SidebarCollapsibleMenuProps {
  children: ReactNode | Array<ReactNode>
  text: string
  icon: ReactNode
  isCollapsible?: boolean
  disabled?: boolean
}

export function SidebarCollapsibleMenu({
  children,
  icon,
  text,
  isCollapsible,
  disabled = false,
}: SidebarCollapsibleMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(!isCollapsible)
  const { state } = useSidebar()

  const Icon = icon

  function handleOnChangeState(openState: boolean) {
    if (state === 'collapsed') {
      return
    }

    if (!isCollapsible) {
      return
    }

    setIsCollapsed(openState)
  }

  return (
    <Collapsible
      disabled={disabled}
      open={isCollapsed}
      onOpenChange={handleOnChangeState}
      className="group/collapsible group"
      key={text}
    >
      <DropdownMenu>
        <SidebarMenuItem>
          <CollapsibleTrigger
            asChild
            className="group-data-[state='collapsed']:hidden hover:!bg-inspetor-dark-blue-800"
          >
            <SidebarMenuButton
              className={cn(
                '!text-white font-medium leading-5 truncate',
                !isCollapsible && '!cursor-default group-hover:!bg-transparent',
              )}
            >
              {/* <Icon className="text-valeiot-account-menu-text font-medium size-4" /> */}
              {Icon}
              {text}
              {isCollapsible && (
                <ChevronDown className="size-4 ml-auto transition-all group-data-[state='open']:rotate-180 rotate-0 duration-200" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleTrigger
            asChild
            className="group-data-[state='expanded']:hidden"
          >
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="!text-white font-medium leading-5 truncate">
                {/* <Icon className="text-valeiot-account-menu-text font-medium size-4" /> */}
                {Icon}
                {text}
                {isCollapsible && (
                  <ChevronDown className="size-4 ml-auto transition-all group-data-[state='open']:rotate-180 rotate-0 duration-200" />
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="group-data-[state='collapsed']:hidden">
              {children}
            </SidebarMenuSub>
          </CollapsibleContent>
          <DropdownMenuContent
            align="start"
            side="right"
            sideOffset={16}
            className="bg-inspetor-dark-blue-700 border-0 pl-0 min-w-44 w-fit"
          >
            {children}
          </DropdownMenuContent>
        </SidebarMenuItem>
      </DropdownMenu>
    </Collapsible>
  )
}
