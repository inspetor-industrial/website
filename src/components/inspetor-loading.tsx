import LogoHome from '@inspetor/assets/logo-home.png'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export function InspetorLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full w-full">
      <Image src={LogoHome} alt="" quality={100} width={280} />
      <div className="flex items-center flex-col-reverse justify-center gap-2">
        <Loader2 className="size-6 animate-spin" />
        <span className="text-sm font-medium text-center w-96">
          Estamos trabalhando para carregar algumas informações, por favor
          aguarde...
        </span>
      </div>
    </div>
  )
}
