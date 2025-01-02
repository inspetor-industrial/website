/* eslint-disable @next/next/no-img-element */
'use client'

import { Document } from '@inspetor/@types/document'
import { ImageResizer } from '@inspetor/app/reports/components/image-resizer'
import { PageBreak } from '@inspetor/app/reports/components/page-break'
import { ReportLoader } from '@inspetor/app/reports/components/report-loader'
import { SectionTitle } from '@inspetor/app/reports/components/section-title'
import ApplicationBackground from '@inspetor/assets/application-background.png'
import { TableTests, TableTestsRef } from '@inspetor/components/table-tests'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@inspetor/components/ui/table'
import { events } from '@inspetor/constants/events'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { manometerTypes } from '@inspetor/constants/manometer-types'
import { toast } from '@inspetor/hooks/use-toast'
import { getManometer } from '@inspetor/http/firebase/manometer/get-manometer'
import { getUser } from '@inspetor/http/firebase/user/get-user'
import { dayjsApi } from '@inspetor/lib/dayjs'
import { firestore } from '@inspetor/lib/firebase/client'
import { useQuery } from '@tanstack/react-query'
import { collection, doc, setDoc } from 'firebase/firestore'
// import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Fragment, useEffect, useRef, useState } from 'react'

export function ReportPDFPreview() {
  const tableTestsRef = useRef<TableTestsRef | null>(null)
  const [tableTestsResetState, setTableTestsResetState] = useState(false)

  const { manometerId } = useParams<{ manometerId: string }>()

  const { data: manometer, isPending: isLoadingManometer } = useQuery({
    queryKey: ['manometer', manometerId],
    queryFn: async () => {
      const manometer = await getManometer(manometerId)

      if (!manometer) {
        toast({
          title: 'Válvula não encontrado!',
          variant: 'destructive',
        })

        //   startProgressBar()
        //   router.push('/dashboard/manometers')
        //   return null
      }

      setTableTestsResetState((state) => !state)
      return manometer
    },
  })

  const { data: creator, isPending: isLoadingCreator } = useQuery({
    queryKey: ['user', manometer?.createdBy],
    queryFn: async () => {
      const user = await getUser(manometer!.createdBy)
      if (!user) {
        toast({
          title: 'Usuário não encontrado!',
          variant: 'destructive',
        })
        //   startProgressBar()
        //   router.push('/dashboard/manometers')
        // return null
      }

      document.dispatchEvent(new CustomEvent(events.loading.finished))
      return user
    },
    enabled: !!manometer,
  })

  async function updateImageConfiguration(image: Document) {
    const collDocs = collection(firestore, firebaseModels.documents)
    const collManometer = collection(firestore, firebaseModels.manometers)
    const docManometerRef = doc(collManometer, manometerId)
    const docImageRef = doc(collDocs, image.id)

    await Promise.all([
      setDoc(
        docManometerRef,
        {
          documents: manometer?.documents.map((doc) =>
            doc.id === image.id ? image : doc,
          ),
        },
        {
          merge: true,
          mergeFields: ['documents'],
        },
      ),
      setDoc(docImageRef, image, { merge: true }),
    ])
  }

  useEffect(() => {
    if (tableTestsRef.current) {
      tableTestsRef.current.reset()
    }
  }, [manometer, tableTestsRef, tableTestsResetState])

  const isLoading = isLoadingManometer || isLoadingCreator
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
            <strong>Nome</strong>: {manometer?.hirer.name}
          </span>
          <span>
            <strong>CNPJ</strong>: {manometer?.hirer.cnpjOrCpf}
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
                TIPO
              </TableHead>
              <TableHead className="text-white text-center border border-black">
                FABRICANTE (MARCA)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="h-12 py-2">
              <TableCell className="text-center border border-black">
                {manometer?.serialNumber}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometerTypes[manometer?.type as keyof typeof manometerTypes]}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometer?.manufacturer}
              </TableCell>
            </TableRow>
            <TableRow className="bg-inspetor-dark-blue-700 text-white h-12 py-2 hover:bg-inspetor-dark-blue-700">
              <TableCell className="text-white text-center border border-black">
                CLASSE
              </TableCell>
              <TableCell className="text-white text-center border border-black">
                ESCALA
              </TableCell>
              <TableCell className="text-white text-center border border-black">
                DIÂMETRO DO MOSTRADOR
              </TableCell>
            </TableRow>
            <TableRow className="h-12 py-2">
              <TableCell className="text-center border border-black">
                {manometer?.class}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometer?.scale}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometer?.dialDiameter}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <PageBreak />
        <SectionTitle>Procedimento</SectionTitle>
        <div>
          <p>DOQ-CGCRE-017 - Rev.03 - Dez/2013</p>
          <p>
            O Instrumento de Medição foi calibrado na sua posição de trabalho a
            uma temperatura de 20ºC.
          </p>
          <p>
            A calibração foi realizada por método de comparação com o padrão de
            referência da bancada de testes.
          </p>
          <p>
            A Bancada de Testes apresenta instrumento com classe de exatidão
            superior a 04 vezes que a do instrumento calibrado.
          </p>
          <p>
            O instrumento permaneceu sob pressão máxima para estabilidade do
            sistema de calibração, no qual foi realizada com auxílio de bomba
            comparativa do tipo manual, tendo como fluído a água.
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
                {manometerTypes[manometer?.type as keyof typeof manometerTypes]}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometer?.manufacturer}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometer?.serialNumber}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometer?.certificateNumber}
              </TableCell>
              <TableCell className="text-center border border-black uppercase">
                {manometer?.calibrationDate
                  ? dayjsApi(manometer.calibrationDate).format('MMMM [-] YYYY')
                  : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <SectionTitle>Resultado das medições</SectionTitle>
        <TableTests
          onChange={() => {}}
          value={manometer?.tableTests}
          isLoading={isLoading}
          disabled
          ref={tableTestsRef}
        />

        <PageBreak />
        <div className="mt-4 flex gap-2">
          {manometer?.documents.map((document, index) => {
            return (
              <ImageResizer
                imageIndex={index}
                key={document.id}
                image={document}
                reportId={manometerId}
                pagePreview={false}
                onUpdate={updateImageConfiguration}
              />
            )
          })}
        </div>

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
                {manometer?.calibrationDate
                  ? dayjsApi(manometer.calibrationDate).format('MMMM [-] YYYY')
                  : '-'}
              </TableCell>
              <TableCell className="uppercase text-center border border-black">
                {manometer?.nextCalibrationDate
                  ? dayjsApi(manometer.nextCalibrationDate).format(
                      'MMMM [-] YYYY',
                    )
                  : '-'}
              </TableCell>
              <TableCell className="text-center border border-black">
                {manometer?.tag}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Fragment>
  )
}
