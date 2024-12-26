import LogoHome from '@inspetor/assets/logo-home.png'
import { Button } from '@inspetor/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@inspetor/components/ui/dropdown-menu'
import { CalendarCheck2, FilePlus2, UserPlus2 } from 'lucide-react'
import Image from 'next/image'
import { FaTools } from 'react-icons/fa'
import { GiValve } from 'react-icons/gi'
import { LuTimer } from 'react-icons/lu'
import { Link } from 'react-transition-progress/next'

export default function Home() {
  return (
    <div className="flex justify-center items-center h-96 flex-col pt-60 gap-16">
      <Image src={LogoHome} alt="" />

      <div className="flex flex-col gap-4">
        <Button variant="inspetor-blue" asChild>
          <Link href="/dashboard/schedules/new">
            <CalendarCheck2 className="size-4 mr-1" />
            Agendar nova inspeção
          </Link>
        </Button>
        <Button variant="inspetor-blue" asChild>
          <Link href="/dashboard/clients/register">
            <UserPlus2 className="size-4 mr-1" />
            Cadastrar novo cliente
          </Link>
        </Button>
        {/* <Button variant="inspetor-blue" asChild>
          <Link href="/dashboard/reports">
            <FilePlus2 className="size-4 mr-1" />
            Gerar Relatório
          </Link>
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="inspetor-blue">
              <FilePlus2 className="size-4 mr-1" />
              Gerar Relatório
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" className="w-52">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/boiler-inspection" className="truncate">
                <FaTools />
                Inspeção de caldeiras
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/manometer-calibration"
                className="truncate"
              >
                <LuTimer />
                Calibração de manômetro
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/valve-calibration" className="truncate">
                <GiValve />
                Calibração de válvula
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
