import LogoReport from '@inspetor/assets/logo-report.png'
import { BackButton } from '@inspetor/components/back-button'
import { ScrollArea, ScrollBar } from '@inspetor/components/ui/scroll-area'
import Image from 'next/image'

import { DownloadButton } from './components/download-button'
import { ReportPDFPreview } from './report'

type PreviewValvePageProps = {
  searchParams: Promise<{ download?: string }>
}

export default async function PreviewValvePage({
  searchParams,
}: PreviewValvePageProps) {
  const { download } = await searchParams
  const isDownload = String(download) === 'true'

  return (
    <ScrollArea className="w-screen h-screen">
      <section className="w-full h-96 flex justify-center items-center flex-col gap-10">
        <Image
          src={LogoReport}
          alt="Logo"
          width={200}
          height={100}
          quality={100}
          className="w-64"
        />

        <div className="text-center">
          <h1 className="uppercase font-bold text-xl">
            Certificado de calibração
          </h1>
          <h2 className="uppercase text-lg">Válvula de Segurança</h2>
        </div>
      </section>
      <ReportPDFPreview />
      <div className="h-10" />
      {!isDownload && (
        <div className="fixed top-4 right-4 space-x-4">
          <BackButton />
          <DownloadButton />
        </div>
      )}
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}
