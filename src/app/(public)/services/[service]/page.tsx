import type { Metadata } from 'next'
import Link from 'next/link'

import { TEXT_INFOS } from './text'

interface ServiceInfoPageProps {
  params: Promise<{
    service:
      | 'boiler-inspection'
      | 'integrity-inspection'
      | 'pipe-inspection'
      | 'pressure-vessel-inspection'
      | 'automotive-elevator-inspection'
      | 'fuel-tanks-inspection'
      | 'safety-valve-calibration'
      | 'manometer-calibration'
  }>
}

export const revalidate = 604800 // 7 days to revalidate this page

export async function generateMetadata({
  params,
}: ServiceInfoPageProps): Promise<Metadata> {
  const { service } = await params
  const title = TEXT_INFOS[service]?.title ?? ''

  return {
    title,
  }
}

export async function generateStaticParams() {
  const services = [
    'boiler-inspection',
    'integrity-inspection',
    'pipe-inspection',
    'pressure-vessel-inspection',
    'automotive-elevator-inspection',
    'fuel-tanks-inspection',
    'safety-valve-calibration',
    'manometer-calibration',
  ]

  return services.map((service: string) => ({
    service,
  }))
}

export default async function ServiceInfoPage({
  params,
}: ServiceInfoPageProps) {
  const { service: serviceName } = await params
  const service = TEXT_INFOS[serviceName]

  return (
    <main className="flex h-screen w-screen flex-col max-h-content-screen pb-20 scrollbar-thumb-insp-blue scrollbar-track-gray-default scrollbar-thin scrollbar-w-2 items-center justify-start overflow-y-auto px-4 max-xl:pb-40 max-sm:pb-40">
      <h1 className="my-6 w-full max-w-[880px] text-left text-2xl font-bold leading-9 text-white">
        {service.title}
      </h1>
      <p
        className="w-full max-w-[880px] font-semibold text-white text-sm"
        dangerouslySetInnerHTML={{ __html: service.text }}
      />
      <div className="mt-10 flex w-full flex-row-reverse items-center justify-center gap-4 max-sm:flex-col max-sm:justify-start">
        <Link
          className="w-full max-w-[300px] rounded-md bg-inspetor-footer px-8 py-3 text-center text-white"
          href={`/contact?service=${serviceName}`}
        >
          Solicitar Orçamento
        </Link>
        <Link
          className="w-full max-w-[300px] rounded-md bg-inspetor-footer px-8 py-3 text-center text-white"
          href="/services"
        >
          Voltar
        </Link>
      </div>
    </main>
  )
}
