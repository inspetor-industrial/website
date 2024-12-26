'use client'

import NavbarLogo from '@inspetor/assets/navbar-logo.png'
import { cn } from '@inspetor/lib/utils'
import { Menu } from 'lucide-react'
import Image from 'next/image'

import { Button } from './ui/button'
import { SidebarHeader, useSidebar } from './ui/sidebar'

export function InspetorSidebarHeader() {
  const { toggleSidebar, state } = useSidebar()

  return (
    <SidebarHeader className={cn(state === 'expanded' && 'pl-3 pt-3')}>
      {state === 'collapsed' ? (
        <Button onClick={toggleSidebar} variant="icon" size="icon">
          <Menu className="text-white" size={20} />
        </Button>
      ) : (
        <Image
          src={NavbarLogo}
          alt="Inspetor"
          quality={100}
          width={150}
          height={120}
        />
      )}
    </SidebarHeader>
  )
}
