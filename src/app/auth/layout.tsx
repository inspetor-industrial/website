import { Navbar } from '@inspetor/components/navbar'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <div id="public-layout" />
      {children}
    </div>
  )
}
