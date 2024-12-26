import { BubbleFooter } from '@inspetor/components/bubble-footer'
import { FiAward } from 'react-icons/fi'
import { GiGearHammer } from 'react-icons/gi'
import { RiExchangeDollarFill } from 'react-icons/ri'

export default async function InstitutionalPage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-start overflow-y-auto max-sm:pb-16">
      <h1 className="my-10 w-full max-w-[1280px] px-4 text-left text-3xl leading-loose text-white">
        Institucional
      </h1>
      <p className="max-w-[1280px] px-4 pb-4 text-center text-xl font-normal text-white">
        Com 23 anos de atuação no mercado de Inspeção de Caldeiras, Tubulações e
        Vasos de Pressão, o Inspetor Industrial é a escolha CERTA para o seu
        negócio. Somos especialistas em soluções industriais e medições de
        segurança e estamos preparados para atender aos clientes em todo Brasil
        conforme as Normas Regulamentadoras NR10, NR12, NR13, NR33 e NR35 do
        Ministério do Trabalho e Emprego. Conheça mais sobre nossos serviços
        clicando neste link: SERVIÇOS. Nosso escritório está localizado na
        cidade de Lambari, no estado de Minas Gerais, e estamos a disposição
        para melhor atender nossos clientes.
      </p>

      <div className="mt-auto flex h-80 w-full items-center justify-center gap-12 bg-inspetor-footer px-6 max-lg:py-8 max-lg:pb-10 max-[700px]:h-auto max-[700px]:flex-col">
        <BubbleFooter
          className="h-fit"
          icon={FiAward}
          text="EQUIPE ALTAMENTE QUALIFICADA"
        />
        <BubbleFooter
          className="h-fit"
          icon={GiGearHammer}
          text="EXPERIÊNCIA COMPROVADA"
        />
        <BubbleFooter
          className="h-fit"
          icon={RiExchangeDollarFill}
          text="PREÇO JUSTO E COMPETITIVO"
        />
      </div>
    </main>
  )
}
