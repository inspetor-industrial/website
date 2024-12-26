import { Loader2 } from 'lucide-react'

export function ReportLoader() {
  return (
    <div className="flex justify-center items-center gap-2" id="report-loader">
      <Loader2 className="size-4 animate-spin" />
      <span className="">Carregando, por favor aguarde...</span>
    </div>
  )
}
