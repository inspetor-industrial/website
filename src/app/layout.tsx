import './globals.css'

import { Toaster } from '@inspetor/components/ui/toaster'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { ProgressBar, ProgressBarProvider } from 'react-transition-progress'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    template: '%s | Inspetor Industrial',
    default: 'Inspetor Industrial',
  },
  description:
    'Sistema completo de gerenciamento para inspeções industriais, com controle de agendamentos, gestão de usuários, empresas e relatórios detalhados. Plataforma integrada para otimizar o fluxo de trabalho de inspetores e administradores.',
  verification: {
    google: 'C3XBDCl4_QdQAYSF1Kbr5jv17m-LqMpMjWp6akdYWjE',
  },
}

const robotoFont = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: 'normal',
  fallback: ['sans-serif'],
  subsets: ['latin'],
  variable: '--roboto',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoFont.variable} antialiased h-screen overflow-hidden`}
      >
        <ProgressBarProvider>
          <ProgressBar className="fixed h-1 shadow-lg shadow-sky-500/20 bg-blue-700 top-0" />
          <Providers>
            {children}
            <SpeedInsights />
            <Analytics />
          </Providers>

          <Toaster />
        </ProgressBarProvider>
      </body>
    </html>
  )
}
