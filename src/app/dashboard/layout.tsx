import { InspetorLoading } from '@inspetor/components/inspetor-loading'
import { InspetorSidebar } from '@inspetor/components/sidebar'
import { ReactNode, Suspense } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <InspetorLoading />
        </div>
      }
    >
      <InspetorSidebar />
      <main className="h-screen w-full relative bg-inspetor-gray-300/30 space-y-5 flex-1 px-4 py-2.5 flex flex-col overflow-y-auto">
        {children}
      </main>
    </Suspense>
  )
}
