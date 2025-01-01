/* eslint-disable @next/next/no-img-element */
'use client'

import { PageBreak } from '@inspetor/app/reports/components/page-break'
import { ReportLoader } from '@inspetor/app/reports/components/report-loader'
import { SectionTitle } from '@inspetor/app/reports/components/section-title'
import ApplicationBackground from '@inspetor/assets/application-background.png'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@inspetor/components/ui/table'
import { events } from '@inspetor/constants/events'
import { status } from '@inspetor/constants/status'
import { units } from '@inspetor/constants/units'
import { toast } from '@inspetor/hooks/use-toast'
import { getUser } from '@inspetor/http/firebase/user/get-user'
import { getValve } from '@inspetor/http/firebase/valve/get-valve'
import { dayjsApi } from '@inspetor/lib/dayjs'
import { useQuery } from '@tanstack/react-query'
// import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Fragment } from 'react'

export function ReportPDFPreview() {
  const { valveId } = useParams<{ valveId: string }>()

  const { data: valve, isPending: isLoadingValve } = useQuery({
    queryKey: ['valve', valveId],
    queryFn: async () => {
      const valve = await getValve(valveId)

      if (!valve) {
        toast({
          title: 'Válvula não encontrado!',
          variant: 'destructive',
        })

        //   startProgressBar()
        //   router.push('/dashboard/valves')
        //   return null
      }

      return valve
    },
  })

  const { data: creator, isPending: isLoadingCreator } = useQuery({
    queryKey: ['user', valve?.createdBy],
    queryFn: async () => {
      const user = await getUser(valve!.createdBy)
      if (!user) {
        toast({
          title: 'Usuário não encontrado!',
          variant: 'destructive',
        })
        //   startProgressBar()
        //   router.push('/dashboard/valves')
        // return null
      }

      document.dispatchEvent(new CustomEvent(events.loading.finished))
      return user
    },
    enabled: !!valve,
  })

  const isLoading = isLoadingValve || isLoadingCreator
  if (isLoading) {
    return <ReportLoader />
  }

  return (
    <Fragment>
      <img
        src={ApplicationBackground.src}
        alt="Background"
        className="h-96 grayscale-90 w-full"
      />
      <div className="px-16">
        <div className="flex flex-col justify-center items-center my-4 uppercase">
          {creator?.nationalRegister && (
            <span className="text-gray-500 text-sm">
              {creator?.nationalRegister}
            </span>
          )}
          <span className="text-gray-500 text-sm">{creator?.crea}</span>
        </div>

        <PageBreak />

        <SectionTitle>Contratante</SectionTitle>

        <div className="flex flex-col gap-0.5 justify-start items-start">
          <span>
            <strong>Nome</strong>: {valve?.hirer.name}
          </span>
          <span>
            <strong>CNPJ</strong>: {valve?.hirer.cnpjOrCpf}
          </span>
        </div>

        <SectionTitle>Dados do Instrumento</SectionTitle>

        <Table>
          <TableHeader>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableHead className="text-white text-center border border-black">
                NÚMERO DE SÉRIE
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                BITOLA NOMINAL
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                FABRICANTE (MARCA)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="text-center border border-black">
                {valve?.serialNumber}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.nominalGauge}&ldquo;
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.manufacturer}
              </TableCell>
            </TableRow>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableCell className="text-white text-center border border-black">
                OPERAÇÃO (FUNÇÃO)
              </TableCell>
              <TableCell className="text-white text-center border border-black">
                TIPO
              </TableCell>
              <TableCell className="text-white text-center border border-black">
                TAG
              </TableCell>
            </TableRow>
            <TableRow className="h-12 py-2">
              <TableCell className="text-center border border-black">
                {valve?.operation}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.type}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.tag}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <SectionTitle>
          Dados Mecânicos - Válvula de Segurança / Alívio
        </SectionTitle>

        <Table>
          <TableHeader>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableHead className="text-white text-center border border-black">
                ALAVANCA
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                FLUÍDO DE TRABALHO
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                FAIXA DE TRABALHO
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="uppercase text-center border border-black">
                {valve?.lever ? 'SIM' : 'NÃO'}
              </TableCell>
              <TableCell className="uppercase text-center border border-black">
                {valve?.workingFluid}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.workingRange} KGF/CM²
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <PageBreak />
        <SectionTitle>Procedimento</SectionTitle>
        <div>
          <p>PETROBRAS N-2368 – CONTEC-SC-23</p>
          <p>
            A calibração foi realizada por método de comparação com o padrão de
            referência da bancada de testes da Vapour Caldeiras.
          </p>
          <p>
            Realizadas 03 aberturas (“POPs”) consecutivas dentro das tolerâncias
            de calibração.
          </p>
          <p>
            Leitura na bancada de testes do valor da pressão no momento da
            abertura comparado com o valor da pressão de ajuste, levando-se em
            consideração as tolerâncias apresentadas na Norma.
          </p>
        </div>

        <SectionTitle>Instrumento Padrão Utilizado</SectionTitle>
        <Table>
          <TableHeader>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableHead className="text-white text-center border border-black">
                TIPO
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                FABRICANTE
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                N. SÉRIE
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                CERTIFICADO N°
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                VALIDADE DE CALIBRAÇÃO PADRÃO
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="text-center border border-black">
                {valve?.type}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.manufacturer}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.serialNumber}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.certificateNumber}
              </TableCell>
              <TableCell className="text-center border border-black uppercase">
                {valve?.calibrationDate
                  ? dayjsApi(valve.calibrationDate).format('MMMM [-] YYYY')
                  : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <SectionTitle>Parâmetros de Calibração</SectionTitle>
        <Table>
          <TableHeader>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableHead className="text-white text-center border border-black">
                TEMPERATURA
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                PRESSÃO DE ABERTURA
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                PRESSÃO DE FECHAMENTO
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="text-center border border-black">
                {valve?.temperatureParameter} {units.celsius}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.openingPressureParameter} {units.kgfPerCm2}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.closingPressureParameter} {units.kgfPerCm2}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <SectionTitle>Teste de Aferição</SectionTitle>
        <Table>
          <TableHeader>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableHead className="text-white text-center border border-black">
                PRESSÃO DE ABERTURA
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                Pressão Admissível ({units.moreLessThreePercents})
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                P1 ({units.kgfPerCm2})
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                P2 ({units.kgfPerCm2})
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                P3 ({units.kgfPerCm2})
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="text-center border border-black">
                {valve?.openingPressureTest} {units.kgfPerCm2}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.allowablePressure} [{units.kgfPerCm2}]
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.p1} {units.kgfPerCm2}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.p2} {units.kgfPerCm2}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.p3} {units.kgfPerCm2}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <PageBreak />
        <SectionTitle>Teste de Estanqueidade</SectionTitle>
        <Table>
          <TableHeader>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableHead className="text-white text-center border border-black">
                TESTE REALIZADO
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                TESTE 01 (Kgf/cm²)
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                TESTE 02 (Kgf/cm²)
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                TESTE 03 (Kgf/cm²)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="uppercase text-center border border-black">
                {valve?.testDescription}
              </TableCell>
              <TableCell className="text-center border border-black">
                {status[valve?.test1 as keyof typeof status]}
              </TableCell>
              <TableCell className="text-center border border-black">
                {status[valve?.test2 as keyof typeof status]}
              </TableCell>
              <TableCell className="text-center border border-black">
                {status[valve?.test3 as keyof typeof status]}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <SectionTitle>Resultado do Laudo</SectionTitle>
        <p className="mb-4">
          Os resultados são válidos para o estado atual do instrumento em
          condições de ensaio, e referem-se exclusivamente ao instrumento
          submetido à calibração nas condições específicas, não sendo extensivo
          a quaisquer lotes.
        </p>

        <Table>
          <TableHeader>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableHead className="text-white text-center border border-black">
                DATA DE CALIBRAÇÃO
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                DATA DA PRÓXIMA CALIBRAÇÃO
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                TAG NÚMERO
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="uppercase text-center border border-black">
                {valve?.calibrationDate
                  ? dayjsApi(valve.calibrationDate).format('MMMM [-] YYYY')
                  : '-'}
              </TableCell>
              <TableCell className="uppercase text-center border border-black">
                {valve?.nextCalibrationDate
                  ? dayjsApi(valve.nextCalibrationDate).format('MMMM [-] YYYY')
                  : '-'}
              </TableCell>
              <TableCell className="text-center border border-black">
                {valve?.tag}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Fragment>
  )
}
