import { Button } from '@inspetor/components/ui/button'
import { Link } from 'react-transition-progress/next'

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Não autorizado</h1>
      <p className="text-sm text-gray-500 max-w-md text-center">
        Você não tem permissão para acessar esta página. Caso necessário, entre
        em contato com o suporte.
      </p>
      <Button asChild className="mt-4">
        <Link href="/dashboard">Voltar para o dashboard</Link>
      </Button>
    </div>
  )
}
