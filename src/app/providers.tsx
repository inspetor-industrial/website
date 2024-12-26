'use client'

import { SidebarProvider } from '@inspetor/components/ui/sidebar'
import { appConfigs } from '@inspetor/constants/configs'
import { queryClient } from '@inspetor/lib/query'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { SessionProvider } from 'next-auth/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactNode, useEffect } from 'react'

export interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    if (!window.Notification) return
    if (window.Notification.permission === 'granted') return

    window.Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        const notification = new window.Notification(
          appConfigs.applicationName,
          {
            body: 'Bem-vindo ao Inspetor Industrial!',
          },
        )

        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      }
    })
  }, [])
  return (
    <SessionProvider>
      <SidebarProvider>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            <JotaiProvider>{children}</JotaiProvider>
          </QueryClientProvider>
        </NuqsAdapter>
      </SidebarProvider>
    </SessionProvider>
  )
}
