import LoadingPlaceholder from '@inspetor/assets/loading-placeholder.png'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export function LoadingResource() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 p-4">
      <Image
        src={LoadingPlaceholder}
        alt="Carregando..."
        className="grayscale-90"
        quality={100}
        width={350}
        height={350}
      />
      <div className="text-zinc-950 flex items-center gap-2 justify-start">
        <Loader2 className="size-6 animate-spin" />
        <span className="text-lg font-medium">
          Aguarde enquanto carregamos o recurso...
        </span>
      </div>
    </div>
  )
}
