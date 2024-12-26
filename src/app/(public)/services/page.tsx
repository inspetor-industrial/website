import { BubbleFooter } from '@inspetor/components/bubble-footer'
import Link from 'next/link'
import { BsFuelPumpFill } from 'react-icons/bs'
import {
  GiAutoRepair,
  GiFuelTank,
  GiPipes,
  GiScubaTanks,
  GiValve,
} from 'react-icons/gi'
import { MdCarRepair } from 'react-icons/md'
import { PiTimer } from 'react-icons/pi'

export default function ServicePage() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-start overflow-y-auto px-4 max-md:pb-40 max-sm:pb-32">
      <h1 className="my-6 w-full max-w-[880px] text-left text-3xl leading-loose text-white">
        Serviços
      </h1>
      <div className="max-sm:grid-rows-8 grid max-w-[880px] grid-cols-4 grid-rows-2 gap-4 rounded-md bg-inspetor-footer px-6 py-4 shadow-box max-lg:grid-cols-3 max-lg:grid-rows-3 max-md:grid-cols-2 max-md:grid-rows-4 max-sm:w-full max-sm:grid-cols-1">
        <Link href="/services/boiler-inspection" className="cursor-pointer">
          <BubbleFooter
            icon={GiPipes}
            text="Inspeção de Caldeiras"
            className="mb-0 h-full hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
        <Link href="/services/integrity-inspection" className="cursor-pointer">
          <BubbleFooter
            icon={GiFuelTank}
            iconSize="sm"
            text="Inspeção de Integridade"
            className="mb-0 hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
        <Link href="/services/pipe-inspection" className="cursor-pointer">
          <BubbleFooter
            icon={GiAutoRepair}
            iconSize="sm"
            text="Inspeção de Tubulações"
            className="mb-0 hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
        <Link
          href="/services/pressure-vessel-inspection"
          className="cursor-pointer"
        >
          <BubbleFooter
            icon={GiScubaTanks}
            iconSize="sm"
            text="Inspeção em Vasos de Pressão"
            className="mb-0 hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
        <Link
          href="/services/automotive-elevator-inspection"
          className="cursor-pointer"
        >
          <BubbleFooter
            icon={MdCarRepair}
            iconSize="sm"
            text="Inspeção de Elevador Automotivo"
            className="mb-0 hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
        <Link href="/services/fuel-tanks-inspection" className="cursor-pointer">
          <BubbleFooter
            icon={BsFuelPumpFill}
            iconSize="sm"
            text="Inspeção em Tanques de Combustível"
            className="mb-0 hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
        <Link
          href="/services/safety-valve-calibration"
          className="cursor-pointer"
        >
          <BubbleFooter
            icon={GiValve}
            iconSize="sm"
            text="Calibração de Válvula de Segurança"
            className="mb-0 hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
        <Link href="/services/manometer-calibration" className="cursor-pointer">
          <BubbleFooter
            icon={PiTimer}
            iconSize="sm"
            text="Calibração de Manômetro"
            className="mb-0 hover:-translate-y-2 max-sm:w-full max-sm:flex-row-reverse min-[700px]:mb-0"
          />
        </Link>
      </div>
    </main>
  )
}
