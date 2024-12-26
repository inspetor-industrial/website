import LogoHome from '@inspetor/assets/logo-home.png'
import { Button } from '@inspetor/components/ui/button'
import Image from 'next/image'
import { Link } from 'react-transition-progress/next'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen">
      <Image src={LogoHome} alt="" quality={100} width={280} />
      <div className="flex items-center flex-col justify-center gap-2">
        <span className="text-sm font-medium text-center w-96">
          Página não encontrada. Verifique o endereço e tente novamente ou volte
          para a página inicial.
        </span>

        <Button variant="inspetor-blue" asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  )
}
