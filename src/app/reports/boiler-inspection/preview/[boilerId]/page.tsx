import type { BoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { accumulationTestQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/accumulation-test-examinations'
import { dischargeSystemQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/discharge-system-examinations'
import { electricalControlQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/electrical-control-examinations'
import { tableExamsOptions } from '@inspetor/app/dashboard/boiler-inspection/exams/examinations-performed'
import { tableExternExamsQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/external-examinations-performed'
import { hydrostaticTestQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/hydrostatic-test-examinations'
import { injectorQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/injector-examinations'
import { internExamOfEquipmentQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/internal-exams-performed'
import { levelIndicatorQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/level-indicator-examinations'
import { questionsAboutInstallationLocal } from '@inspetor/app/dashboard/boiler-inspection/exams/local-installation-examinations'
import { powerSupplyQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/power-supply-examinations'
import { pressureGaugeQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/pressure-gauge-examinations'
import { securityMeasurementContinuationValve } from '@inspetor/app/dashboard/boiler-inspection/exams/security-measurement'
import { waterQualityQuestions } from '@inspetor/app/dashboard/boiler-inspection/exams/water-quality-examinations'
import { PageBreak } from '@inspetor/app/reports/components/page-break'
import { BackButton } from '@inspetor/components/back-button'
import { ScrollArea, ScrollBar } from '@inspetor/components/ui/scroll-area'
import { TableCell, TableRow } from '@inspetor/components/ui/table'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { cn } from '@inspetor/lib/utils'
import { calculateHydrostaticTestPressure } from '@inspetor/utils/calculate-hydrostatic-test-pressure'
import { formatDate } from '@inspetor/utils/format-datetime'
import { generateRandomCodeBasedOnTimestamp } from '@inspetor/utils/generate-random-code-based-on-timestamp'
import {
  getBoilerHome,
  getBottomDischargeSystem,
  getCommandsAndDevicesNrs,
  getConclusionNrs,
  getEletricalNrs,
  getExternalExamsNrs,
  getFirstBoilerNrs,
  getFirstNRs,
  getFourthNrs,
  getInjectorNr,
  getInternalExamsNrs,
  getLevelIndicatorNrs,
  getManometerNr,
  getNrsOfBoiler,
  getNrsOfEngineer,
  getOperatorNrs,
  getPMTANr,
  getPMTAPageNr,
  getSecondNRs,
  getTestsAccumulation,
  getTestsHydrostatics,
  getValveNrs,
  getWaterQualityNrs,
} from '@inspetor/utils/get-nrs'
import { nrsStringToHtml } from '@inspetor/utils/nrs-string-to-html'
import { translateFurnaceType } from '@inspetor/utils/translate-furnace-type'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'

import { Aside } from './components/aside'
import { DownloadButton } from './components/download-button'
import { Nrs, NrsContainer } from './components/nrs-container'
import { PageContainer } from './components/page-container'
import { PageInfoContainer } from './components/page-info-container'
import { PageSubTitle } from './components/page-sub-title'
import { PageTitle } from './components/page-title'
import { Spacer } from './components/spacer'
import { TableExams } from './components/table-exams'
import { BackgroundPhoto } from './sections/background-photo'
import { Boiler } from './sections/boiler'
import { BoilerHousePhotos } from './sections/boiler-house'
import { BombsPhotos } from './sections/bombs'
import { ElectricalPhotos } from './sections/electrical'
import { ExamBodyA } from './sections/exam-body-a'
import { ExamBodyB } from './sections/exam-body-b'
import { ExamBodyC } from './sections/exam-body-c'
import { ExamBodyD } from './sections/exam-body-d'
import { ExtraPhotosExternExams } from './sections/extra-photos-extern-exams'
import { FurnacePhotos } from './sections/furnace-photos'
import { InjectorPhotos } from './sections/injector'
import { InternalExaminationBoiler } from './sections/internal-examination-boiler'
import { InternalExaminationExtraPhotos } from './sections/internal-examination-extra-photos'
import { LevelIndicatorPhotos } from './sections/level-indicator'
import { ManometerPhotos } from './sections/manometer'
import { OperatorCertificates } from './sections/operator-certificates'
import { PhotoRecords } from './sections/photo-records'
import { PhotoRegisterBook } from './sections/photo-register-book'
import { PlateIdentification } from './sections/plate-identification'
import { SafetyValvePhotos } from './sections/safety-valves'
import { TubesPhotos } from './sections/tubes-photos'
import { WaterPhoto } from './sections/water-photo'

type PreviewBoilerPageProps = {
  searchParams: Promise<{ download?: string }>
  params: Promise<{ boilerId: string }>
}

export default async function PreviewBoilerPage({
  searchParams,
  params,
}: PreviewBoilerPageProps) {
  const { download } = await searchParams
  const { boilerId } = await params
  const isDownload = String(download) === 'true'

  const firebase = getFirebaseApps()
  if (!firebase) {
    notFound()
  }

  const boiler = await firebase.firestore
    .collection(firebaseModels.boilerInspection)
    .doc(boilerId)
    .get()

  if (!boiler.exists) {
    notFound()
  }

  const boilerData = boiler.data() as BoilerInspection
  if (!boilerData) {
    notFound()
  }

  let client = null
  if (boilerData.client) {
    client = await firebase.firestore
      .collection(firebaseModels.clients)
      .doc(boilerData.client.id)
      .get()
  }

  let clientData = null
  if (client?.exists) {
    clientData = client?.data()
  }

  const creator = await firebase.firestore
    .collection(firebaseModels.users)
    .doc(boilerData.createdBy)
    .get()

  const creatorData = creator.data()

  let responsible = null
  if (boilerData.responsible.id) {
    responsible = await firebase.firestore
      .collection(firebaseModels.users)
      .doc(boilerData.responsible.id)
      .get()
  }

  let responsibleData = null
  if (responsible?.exists) {
    responsibleData = responsible?.data()
  }

  const Container = isDownload ? 'div' : ScrollArea

  const reportCreatedAt = new Date(boilerData.createdAt)
  const currentYear = reportCreatedAt.getFullYear()

  return (
    <Container className="w-screen max-h-screen pb-4" id="preview-boiler-page">
      <section className="w-full flex overflow-x-hidden overflow-y-clip items-start justify-start">
        <div className="w-full relative flex flex-col h-full justify-between col-span-6">
          <div className="w-full relative">
            <div className="w-full relative pr-6">
              <div className="h-0.5 mt-12 w-full bg-gray-700 border-slate-400" />
              <div className="h-0.5 mt-1 w-full bg-gray-700 border-slate-400" />
              <div className="h-0.5 mt-1 w-full bg-gray-700 border-slate-400" />
              <div className="flex justify-end relative">
                <div className="w-0.5 absolute -top-3.5 bottom-0 mr-2 h-[calc(100vh-3rem)] bg-gray-700 border-slate-400" />
                <div className="w-0.5 absolute -top-3.5 bottom-0 mr-4 h-[calc(100vh-3rem)] bg-gray-700 border-slate-400" />
                <div className="w-0.5 absolute -top-3.5 bottom-0 h-[calc(100vh-3rem)] bg-gray-700 border-slate-400" />
              </div>
            </div>
            <div className="mt-16 p-6 h-fit flex flex-col items-center justify-center text-white font-semibold uppercase w-full text-center bg-[#676766]">
              <h1 className="text-3xl">Inspeção de caldeiras</h1>
            </div>
            <Image
              className="object-cover w-full h-[500px]"
              src={
                creatorData?.backgroundPhoto ??
                '/images/application-background.png'
              }
              width={300}
              height={200}
              alt=""
            />
          </div>

          <div className="h-auto flex flex-col justify-end items-center uppercase mt-16">
            <span className="text-gray-500 text-sm">
              {responsibleData?.name || creatorData?.name}
            </span>
            <span className="text-gray-500 text-sm">
              {responsibleData?.stateRegistry || creatorData?.nationalRegister}
            </span>
            <span className="text-gray-500 text-sm">
              {responsibleData?.crea || creatorData?.crea}
            </span>
            <span className="text-gray-500 text-sm">REGISTRO NACIONAL</span>
          </div>
        </div>
        <Aside className={cn(!isDownload && 'hidden')}>
          <span className="text-4xl font-semibold text-white leading-8">
            {currentYear}
          </span>
          <span className="text-white text-sm">
            {generateRandomCodeBasedOnTimestamp(6, reportCreatedAt)}/
            {currentYear}
          </span>
        </Aside>
      </section>
      <div className="h-10" />
      {!isDownload && (
        <div className="fixed top-4 left-4 space-x-4">
          <BackButton />
          <DownloadButton type="boiler" />
        </div>
      )}
      {!isDownload && <ScrollBar orientation="vertical" />}

      <PageContainer>
        <h2 className="text-3xl font-semibold mt-10">Relatório de inspeção</h2>

        <span className="w-full font-bold italic tracking-tight text-sm">
          13.3.9 Os relatórios, projetos, certificados e demais documentos
          previstos nesta NR podem ser elaborados e armazenados em sistemas
          informatizados, com segurança da informação, ou mantidos em mídia
          eletrônica com assinatura validada por uma Autoridade Certificadora -
          AC, assegurados os requisitos de autenticidade, integridade,
          disponibilidade, rastreabilidade e irretratabilidade das informações.
        </span>

        <PageTitle>1 - Dados do cliente</PageTitle>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            Empresa: {clientData?.name || boilerData?.client?.name || '-'}
          </span>
          <span className="text-lg uppercase flex gap-4">
            Endereço:{' '}
            <div className="flex flex-col gap-px items-start justify-start">
              <span>{clientData?.address.street || '-'}</span>
              <span>{clientData?.address.city || '-'}</span>
            </div>
          </span>
          <span className="text-lg uppercase">
            CEP: {clientData?.cep || '-'}
          </span>
          <span className="text-lg uppercase">
            Telefone: {clientData?.phoneNumber || '-'}
          </span>
          <span className="text-lg uppercase">
            CNPJ:{' '}
            {clientData?.cnpjOrCpf || boilerData?.client?.cnpjOrCpf || '-'}
          </span>
        </PageInfoContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>2 - Dados preliminares</PageTitle>

        <PageSubTitle>
          2.1 - TIPO DE INSPEÇÃO DE SEGURANÇA REALIZADA
        </PageSubTitle>

        <div className="flex w-full justify-center items-center gap-6">
          <span className="font-bold text-base uppercase text-end">
            [{boilerData?.type?.toLowerCase() === 'initial' ? ' X ' : '   '}]
            inicial
          </span>
          <span className="font-bold text-base uppercase text-end">
            [
            {boilerData?.type?.toLowerCase() === 'extraordinary'
              ? ' X '
              : '   '}
            ] extraordinária
          </span>
          <span className="font-bold text-base uppercase text-end">
            [{boilerData?.type?.toLowerCase() === 'periodic' ? ' X ' : '   '}]
            periódica
          </span>
        </div>

        <div className="w-full">
          <PageSubTitle>Motivo da inspeção</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.motivation}</span>
          </div>
        </div>

        <NrsContainer>
          {getFirstNRs().map((nr) => {
            if (nr.includes('13.4.4.12')) {
              return (
                <Nrs key={nr} className="font-bold">
                  {nr.trimStart().replaceAll('\n', '<br />')}
                </Nrs>
              )
            }

            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>2.2 - PRAZOS PARA REALIZAÇÃO</PageSubTitle>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            data da inspeção:{' '}
            {boilerData?.date ? formatDate(boilerData?.date) : '-'}
          </span>
          <span className="text-lg uppercase">
            hora de início: {boilerData?.startTimeInspection}
          </span>
          <span className="text-lg uppercase">
            hora de término: {boilerData?.endTimeInspection}
          </span>
          <span className="text-lg uppercase">
            validade da inspeção: {boilerData?.validity}
          </span>
          <span className="text-lg uppercase">
            data da próxima inspeção:{' '}
            {boilerData?.nextDate ? formatDate(boilerData?.nextDate) : '-'}
          </span>
        </PageInfoContainer>

        <NrsContainer>
          {getSecondNRs().map((nr) => {
            if (nr.includes('13.3.8')) {
              return (
                <Nrs key={nr} className="text-base">
                  {nr.trimStart().replaceAll('\n', '<br />')}
                </Nrs>
              )
            }

            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>2.3 - PROFISSIONAIS HABILITADOS</PageSubTitle>
        <PageSubTitle>
          2.3.1 - ENGENHEIRO MECÂNICO E DE SEGURANÇA DO TRABALHO:
        </PageSubTitle>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            engenheiro responsável:{' '}
            {responsibleData?.name || boilerData?.responsible?.name || '-'}
          </span>
          <span className="text-lg uppercase">
            registro nacional do engenheiro:{' '}
            {responsibleData?.nationalRegister ||
              boilerData?.responsible?.stateRegistry ||
              '-'}
          </span>
        </PageInfoContainer>

        <NrsContainer>
          {getNrsOfEngineer().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>2.3.2 - OPERADOR DE CALDEIRA</PageSubTitle>
        <PageInfoContainer>
          <span className="text-lg uppercase">
            nome do operador da caldeira: {boilerData?.operator?.name}
          </span>
          <div className="flex items-center gap-2 w-full">
            <span className="text-lg uppercase w-fit flex">
              operador se enquadra na nr13:
            </span>
            <div className="flex justify-start items-center gap-6">
              <span className="font-bold text-base uppercase text-end">
                [
                {boilerData?.operator?.isAbleToOperateWithNR13 === 'yes'
                  ? ' X '
                  : '  '}
                ] sim
              </span>
              <span className="font-bold text-base uppercase text-end">
                [
                {boilerData?.operator?.isAbleToOperateWithNR13 === 'no'
                  ? ' X '
                  : '  '}
                ] não
              </span>
            </div>
          </div>

          <OperatorCertificates
            operator={boilerData?.operator}
            boilerId={boilerId}
            isDownload={isDownload}
          />

          <div className="w-full">
            <PageSubTitle>Observações</PageSubTitle>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>{boilerData?.operator?.observations}</span>
            </div>
          </div>

          <NrsContainer>
            {getOperatorNrs().map((nr) => {
              return (
                <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
              )
            })}
          </NrsContainer>
        </PageInfoContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>3 - CARACTERÍSTICAS TÉCNICAS DO EQUIPAMENTO</PageTitle>
        <PageSubTitle>3.1 - IDENTIFICAÇÃO DA CALDEIRA</PageSubTitle>
        <PageInfoContainer>
          <span className="text-lg uppercase">
            fabricante: {boilerData?.identification?.manufacturer}
          </span>
          <span className="text-lg uppercase">
            marca: {boilerData?.identification?.mark}
          </span>
          <span className="text-lg uppercase">
            tipo: {boilerData?.identification?.type}
          </span>
          <span className="text-lg uppercase">
            ano de fabricação: {boilerData?.identification?.yearOfManufacture}
          </span>
          <span className="text-lg uppercase">
            modelo: {boilerData?.identification?.model}
          </span>
          <span className="text-lg uppercase">
            pressão máxima de trabalho admissível:{' '}
            {boilerData?.identification?.maximumWorkingPressure} kgf/cm²
          </span>
          <span className="text-lg uppercase">
            combustível: {boilerData?.identification?.fuel}
          </span>
          <span className="text-lg uppercase">
            pressão de operação: {boilerData?.identification?.operatingPressure}{' '}
            kgf/cm²
          </span>
          <span className="text-lg uppercase">
            série: {boilerData?.identification?.series}
          </span>
          <span className="text-lg uppercase">
            capacidade: {boilerData?.identification?.capacity} kgv/h
          </span>
          <span className="text-lg uppercase">
            pressão teste hidrostático:{' '}
            {calculateHydrostaticTestPressure(
              Number(
                boilerData?.identification?.maximumWorkingPressure?.replace(
                  ',',
                  '.',
                ) ?? 0,
              ),
            )}{' '}
            kgv/h
          </span>
        </PageInfoContainer>

        <NrsContainer>
          {getFirstBoilerNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <div className="w-full space-y-1">
          <PageSubTitle>Categoria da caldeira</PageSubTitle>
          <div className="flex w-full justify-start items-center gap-6">
            <span className="font-bold text-base uppercase text-end">
              [{boilerData?.identification?.category === 'A' ? ' x ' : '   '}] A
            </span>
            <span className="font-bold text-base uppercase text-end">
              [{boilerData?.identification?.category === 'B' ? ' x ' : '   '}] B
            </span>
          </div>
        </div>

        <NrsContainer>
          {getFourthNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>

        <PageSubTitle>3.2 dados estruturais</PageSubTitle>
        <PageInfoContainer>
          <span className="text-lg uppercase">
            superfície de aquecimento: {boilerData?.structure?.heatingSurface}{' '}
            (m²)
          </span>
          <span className="text-lg uppercase">
            tipo da fornalha:{' '}
            {translateFurnaceType(boilerData?.structure?.furnace?.type)}
          </span>
          <span className="text-lg uppercase">dimensões:</span>
          {['waterTube', 'refractory'].includes(
            boilerData?.structure?.furnace?.type?.toLowerCase() ?? '',
          ) && (
            <>
              <span className="text-lg uppercase ml-12">
                largura: {boilerData?.structure?.furnace?.dimensions?.width}{' '}
                (mm)
              </span>
              <span className="text-lg uppercase ml-12">
                comprimento:{' '}
                {boilerData?.structure?.furnace?.dimensions?.length} (mm)
              </span>
              <span className="text-lg uppercase ml-12">
                altura: {boilerData?.structure?.furnace?.dimensions?.height}{' '}
                (mm)
              </span>
            </>
          )}
          {boilerData?.structure?.furnace?.type
            ?.toLowerCase()
            .includes('cooled') &&
            boilerData?.structure?.furnace?.infos === 'cal' && (
              <>
                <span className="text-lg uppercase ml-12">
                  largura: {boilerData?.structure?.furnace?.dimensions?.width}{' '}
                  (mm)
                </span>
                <span className="text-lg uppercase ml-12">
                  comprimento:{' '}
                  {boilerData?.structure?.furnace?.dimensions?.length} (mm)
                </span>
                <span className="text-lg uppercase ml-12">
                  altura: {boilerData?.structure?.furnace?.dimensions?.height}{' '}
                  (mm)
                </span>
              </>
            )}
          {boilerData?.structure?.furnace?.type
            ?.toLowerCase()
            .includes('cooled') &&
            boilerData?.structure?.furnace?.infos === 'da' && (
              <>
                <span className="text-lg uppercase ml-12">
                  diâmetro:{' '}
                  {boilerData?.structure?.furnace?.dimensions?.diameter} (mm)
                </span>
                <span className="text-lg uppercase ml-12">
                  altura: {boilerData?.structure?.furnace?.dimensions?.height}{' '}
                  (mm)
                </span>
              </>
            )}
          {boilerData?.structure?.furnace?.type
            ?.toLowerCase()
            .includes('cooled') &&
            boilerData?.structure?.furnace?.infos === 'ds' && (
              <>
                <span className="text-lg uppercase ml-12">
                  diâmetro:{' '}
                  {boilerData?.structure?.furnace?.dimensions?.diameter} (mm)
                </span>
                <span className="text-lg uppercase ml-12">
                  comprimento:{' '}
                  {boilerData?.structure?.furnace?.dimensions?.length} (mm)
                </span>
              </>
            )}

          <span className="text-lg uppercase mt-4">
            diâmetro do espelho: {boilerData?.structure?.mirror?.diameter} (mm)
          </span>
          <span className="text-lg uppercase mb-4">
            espessura do espelho: {boilerData?.structure?.mirror?.thickness}{' '}
            (pol)
          </span>

          <span className="text-lg uppercase">
            comprimento do corpo: {boilerData?.structure?.body?.length} (mm)
          </span>
          <span className="text-lg uppercase">
            diâmetro do corpo: {boilerData?.structure?.body?.diameter}(mm)
          </span>
          <span className="text-lg uppercase">
            espessura do corpo: {boilerData?.structure?.body?.thickness}(pol)
          </span>
          <span className="text-lg uppercase">
            material do corpo: {boilerData?.structure?.body?.material}
          </span>
          <div className="flex items-center gap-2 w-full mb-4">
            <span className="text-lg uppercase w-fit flex">
              certificado do fabricante:
            </span>
            <div className="flex justify-start items-center gap-6 font-bold">
              <span className="text-base uppercase text-end">
                [
                {boilerData?.structure?.body?.hasCertificateOfManufacturer ===
                'yes'
                  ? ' x '
                  : '   '}
                ] sim
              </span>
              <span className="text-base uppercase text-end">
                [
                {boilerData?.structure?.body?.hasCertificateOfManufacturer ===
                'no'
                  ? '   '
                  : ' x '}
                ] não
              </span>
            </div>
          </div>

          <span className="text-lg uppercase">
            quantidade de tubos: {boilerData?.structure?.tube?.quantity} (mm)
          </span>
          <span className="text-lg uppercase">
            diâmetro do tubo: {boilerData?.structure?.tube?.diameter} (mm)
          </span>
          <span className="text-lg uppercase">
            espessura do tubo: {boilerData?.structure?.tube?.thickness} (pol)
          </span>
          <span className="text-lg uppercase">
            material dos tubos: {boilerData?.structure?.tube?.material}
          </span>

          <div className="flex items-center gap-2 w-full mb-4">
            <span className="text-lg uppercase w-fit flex">
              certificado do fabricante:
            </span>
            <div className="flex justify-start items-center gap-6 font-bold">
              <span className="text-base uppercase text-end">
                [
                {boilerData?.structure?.tube?.hasCertificateOfManufacturer ===
                'yes'
                  ? ' x '
                  : '   '}
                ] sim
              </span>
              <span className="text-base uppercase text-end">
                [
                {boilerData?.structure?.tube?.hasCertificateOfManufacturer ===
                'no'
                  ? ' x '
                  : '   '}
                ] não
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full mb-4">
            <span className="text-lg uppercase w-fit flex">
              Tipo de tiragem:
            </span>
            <div className="flex justify-start items-center gap-6 font-bold">
              <span className="text-base uppercase text-end">
                [
                {boilerData?.structure?.tube?.isNaturalOrForced === 'natural'
                  ? ' x '
                  : '   '}
                ] natural
              </span>
              <span className="text-base uppercase text-end">
                [
                {boilerData?.structure?.tube?.isNaturalOrForced === 'forced'
                  ? ' x '
                  : '   '}
                ] forçada
              </span>
            </div>
          </div>

          <span className="text-lg uppercase">
            número de fusíveis de segurança:{' '}
            {boilerData?.structure?.quantityOfSafetyFuse}
          </span>
        </PageInfoContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>4 - exames realizados</PageTitle>
        <PageSubTitle>4.1 - EXAME DO PRONTUÁRIO E DOCUMENTO</PageSubTitle>

        <TableExams
          exams={boilerData?.examinationsPerformed?.tests.questions}
          questions={tableExamsOptions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.examinationsPerformed?.observations}</span>
          </div>
        </div>

        {(boilerData?.examinationsPerformed?.record ||
          boilerData?.examinationsPerformed?.book) && <PageBreak />}

        <PhotoRecords
          examinationsPerformed={boilerData?.examinationsPerformed}
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <PhotoRegisterBook
          examinationsPerformed={boilerData?.examinationsPerformed}
          boilerId={boilerId}
          isDownload={isDownload}
        />

        {(boilerData?.examinationsPerformed?.record ||
          boilerData?.examinationsPerformed?.book) && <PageBreak />}

        <NrsContainer>
          {getNrsOfBoiler().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>4.2 - EXAME Externo do equipamento</PageSubTitle>

        <TableExams
          exams={boilerData?.externalExaminationsPerformed?.tests.questions}
          questions={tableExternExamsQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>
              {boilerData?.externalExaminationsPerformed?.observations}
            </span>
          </div>
        </div>

        {(boilerData?.externalExaminationsPerformed?.plateIdentification ||
          boilerData?.externalExaminationsPerformed?.boiler ||
          boilerData?.externalExaminationsPerformed?.extraPhotos) && (
          <PageBreak />
        )}

        <PlateIdentification
          externalExaminationsPerformed={
            boilerData?.externalExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <Boiler
          externalExaminationsPerformed={
            boilerData?.externalExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <ExtraPhotosExternExams
          externalExaminationsPerformed={
            boilerData?.externalExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        {(boilerData?.externalExaminationsPerformed?.plateIdentification ||
          boilerData?.externalExaminationsPerformed?.boiler ||
          boilerData?.externalExaminationsPerformed?.extraPhotos) && (
          <PageBreak />
        )}

        {boilerData?.externalExaminationsPerformed?.observations && (
          <div className="w-full">
            <PageSubTitle>observações extras sobre a caldeira</PageSubTitle>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>
                {boilerData?.externalExaminationsPerformed?.observations}
              </span>
            </div>
          </div>
        )}

        <NrsContainer>
          {getExternalExamsNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>4.3 - EXAME interno do equipamento</PageSubTitle>

        <TableExams
          exams={boilerData?.internalExaminationsPerformed?.tests.questions}
          questions={internExamOfEquipmentQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>
              {boilerData?.internalExaminationsPerformed?.observations}
            </span>
          </div>
        </div>

        {(boilerData?.internalExaminationsPerformed?.tubes ||
          boilerData?.internalExaminationsPerformed?.furnace ||
          boilerData?.internalExaminationsPerformed?.internalBoiler ||
          boilerData?.internalExaminationsPerformed?.extraPhotos) && (
          <PageBreak />
        )}

        <TubesPhotos
          internalExaminationsPerformed={
            boilerData?.internalExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <FurnacePhotos
          internalExaminationsPerformed={
            boilerData?.internalExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <InternalExaminationBoiler
          internalExaminationsPerformed={
            boilerData?.internalExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <InternalExaminationExtraPhotos
          internalExaminationsPerformed={
            boilerData?.internalExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        {(boilerData?.internalExaminationsPerformed?.tubes ||
          boilerData?.internalExaminationsPerformed?.furnace ||
          boilerData?.internalExaminationsPerformed?.internalBoiler ||
          boilerData?.internalExaminationsPerformed?.extraPhotos) && (
          <PageBreak />
        )}

        {boilerData?.internalExaminationsPerformed?.observations && (
          <div className="w-full">
            <PageSubTitle>observações</PageSubTitle>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>
                {boilerData?.internalExaminationsPerformed?.observations}
              </span>
            </div>
          </div>
        )}

        <NrsContainer>
          {getInternalExamsNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>
          4.4 - EXAME DO LOCAL DE INSTALAÇÃO DA CALDEIRA
        </PageSubTitle>

        <TableExams
          exams={
            boilerData?.localInstallationExaminationsPerformed?.tests.questions
          }
          questions={questionsAboutInstallationLocal.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>
              {boilerData?.localInstallationExaminationsPerformed?.observations}
            </span>
          </div>
        </div>

        {boilerData?.localInstallationExaminationsPerformed?.boilerHouse && (
          <PageBreak />
        )}

        <BoilerHousePhotos
          localInstallationExaminationsPerformed={
            boilerData?.localInstallationExaminationsPerformed
          }
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <NrsContainer>
          {getBoilerHome().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>5 - aferições de segurança</PageTitle>
        <PageSubTitle>5.1 - aferições do manômetro</PageSubTitle>

        <PageInfoContainer>
          <div className="w-full flex items-start justify-between">
            <div className="w-full flex flex-col items-start justify-start">
              <span className="text-lg uppercase">
                número de ordem de calibração:{' '}
                {boilerData?.pressureGaugeCalibration?.calibrationOrderNumber}
              </span>
              <span className="text-lg uppercase">
                marca: {boilerData?.pressureGaugeCalibration?.mark}
              </span>
              <span className="text-lg uppercase">
                diâmetro: {boilerData?.pressureGaugeCalibration?.diameter} (pol)
              </span>
              <span className="text-lg uppercase">
                capacidade: {boilerData?.pressureGaugeCalibration?.capacity}{' '}
                (kgf/cm²)
              </span>
            </div>
            <div className="flex items-center justify-center flex-wrap">
              {boilerData?.pressureGaugeCalibration?.photos && (
                <ManometerPhotos
                  pressureGaugeCalibration={
                    boilerData?.pressureGaugeCalibration
                  }
                  boilerId={boilerId}
                  isDownload={isDownload}
                />
              )}
            </div>
          </div>
        </PageInfoContainer>

        <TableExams
          exams={boilerData?.pressureGaugeCalibration?.tests.questions}
          questions={pressureGaugeQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.pressureGaugeCalibration?.observations}</span>
          </div>
        </div>
        <NrsContainer>
          {getManometerNr().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>5.2 - aferições da alimentação manual</PageSubTitle>

        <PageInfoContainer>
          <div className="w-full flex items-start justify-between">
            <div className="w-full flex flex-col items-start justify-start">
              <span className="text-lg uppercase">
                número de série do injetor:{' '}
                {boilerData?.injectorGauge?.serialNumber}
              </span>
              <span className="text-lg uppercase">
                marca: {boilerData?.injectorGauge?.mark}
              </span>
              <span className="text-lg uppercase">
                diâmetro: {boilerData?.injectorGauge?.diameter} (pol²)
              </span>
            </div>
            <div className="flex items-center justify-center flex-wrap">
              {boilerData?.injectorGauge?.photos && (
                <InjectorPhotos
                  injectorGauge={boilerData?.injectorGauge}
                  boilerId={boilerId}
                  isDownload={isDownload}
                />
              )}
            </div>
          </div>
        </PageInfoContainer>

        <TableExams
          exams={boilerData?.injectorGauge?.tests.questions}
          questions={injectorQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.injectorGauge?.observations}</span>
          </div>
        </div>
        <NrsContainer>
          {getInjectorNr().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>5.3 - aferições da alimentação elétrica</PageSubTitle>

        {boilerData?.powerSupply?.bombs &&
          boilerData.powerSupply.bombs.length > 0 &&
          boilerData.powerSupply.bombs.map((bomb, bombIndex) => (
            <div key={bombIndex} className="mb-6">
              <PageSubTitle>Bomba {bombIndex + 1}</PageSubTitle>
              <PageInfoContainer>
                <div className="w-full flex items-start justify-between">
                  <div className="w-full flex flex-col items-start justify-start">
                    <span className="text-lg uppercase">
                      marca: {bomb.mark || '-'}
                    </span>
                    <span className="text-lg uppercase">
                      estágios: {bomb.stages || '-'}
                    </span>
                    <span className="text-lg uppercase">
                      modelo: {bomb.model || '-'}
                    </span>
                    <span className="text-lg uppercase">
                      potência: {bomb.potency || '-'} (cv)
                    </span>
                  </div>
                </div>
              </PageInfoContainer>
            </div>
          ))}

        <BombsPhotos
          powerSupply={boilerData?.powerSupply}
          boilerId={boilerId}
          isDownload={isDownload}
        />

        <TableExams
          exams={boilerData?.powerSupply?.tests?.questions}
          questions={powerSupplyQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.powerSupply?.observations}</span>
          </div>
        </div>

        <NrsContainer>
          {getEletricalNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>
          5.4 - aferições do conjunto indicador de nível
        </PageSubTitle>

        <PageInfoContainer>
          <div className="w-full flex items-start justify-between">
            <div className="w-full flex flex-col items-start justify-start">
              <span className="text-lg uppercase">
                marca:{' '}
                {boilerData?.calibrationOfTheLevelIndicatorAssembly?.mark}
              </span>
              <span className="text-lg uppercase">
                comprimento do vidro:{' '}
                {
                  boilerData?.calibrationOfTheLevelIndicatorAssembly?.glass
                    ?.length
                }{' '}
                (mm)
              </span>
              <span className="text-lg uppercase">
                diâmetro do vidro:{' '}
                {
                  boilerData?.calibrationOfTheLevelIndicatorAssembly?.glass
                    ?.diameter
                }{' '}
                (pol)
              </span>
            </div>
            <div className="flex items-center justify-center flex-wrap">
              <LevelIndicatorPhotos
                calibrationOfTheLevelIndicatorAssembly={
                  boilerData?.calibrationOfTheLevelIndicatorAssembly
                }
                boilerId={boilerId}
                isDownload={isDownload}
              />
            </div>
          </div>
        </PageInfoContainer>

        <TableExams
          exams={
            boilerData?.calibrationOfTheLevelIndicatorAssembly?.tests.questions
          }
          questions={levelIndicatorQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>
              {boilerData?.calibrationOfTheLevelIndicatorAssembly?.observations}
            </span>
          </div>
        </div>

        <NrsContainer>
          {getLevelIndicatorNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>5.5 - aferições da válvula de segurança</PageSubTitle>

        {(!boilerData?.safetyValveGauge?.valves ||
          boilerData?.safetyValveGauge?.valves?.length === 0) && (
          <PageInfoContainer>
            <PageSubTitle>Válvula 1</PageSubTitle>
            <span className="text-lg uppercase">diâmetro:</span>
            <span className="text-lg uppercase">vazão:</span>
            <span className="text-lg uppercase">
              n° de ordem de calibração:
            </span>
            <span className="text-lg uppercase">
              há redundância de válvula de segurança:
            </span>
            <span className="text-lg uppercase">
              pressão da abertura da válvula de segurança: kgf/cm²
            </span>
            <span className="text-lg uppercase">
              pressão de fechamento: kgf/cm²
            </span>
          </PageInfoContainer>
        )}

        {boilerData?.safetyValveGauge?.valves &&
          boilerData?.safetyValveGauge?.valves?.length > 0 &&
          boilerData?.safetyValveGauge?.valves.map((valve, valveIndex) => (
            <PageInfoContainer key={valveIndex}>
              <PageSubTitle>Válvula {valveIndex + 1}</PageSubTitle>
              <span className="text-lg uppercase">
                diâmetro: {valve.diameter}
              </span>
              <span className="text-lg uppercase">vazão: {valve.flow}</span>
              <span className="text-lg uppercase">
                n° de ordem de calibração: {valve.calibrationOrderNumber}
              </span>
              <span className="text-lg uppercase">
                há redundância de válvula de segurança:{' '}
                {boilerData?.safetyValveGauge?.isThereSafetyValveRedundancy
                  ? 'sim'
                  : 'não'}
              </span>
              <span className="text-lg uppercase">
                pressão da abertura da válvula de segurança:{' '}
                {valve.openingPressure} kgf/cm²
              </span>
              <span className="text-lg uppercase">
                pressão de fechamento: {valve.closingPressure} kgf/cm²
              </span>
            </PageInfoContainer>
          ))}

        {boilerData?.safetyValveGauge?.photos && <PageBreak />}

        {boilerData?.safetyValveGauge?.photos && (
          <SafetyValvePhotos
            safetyValveGauge={boilerData?.safetyValveGauge}
            boilerId={boilerId}
            isDownload={isDownload}
          />
        )}

        {(!boilerData?.safetyValveGauge?.valves ||
          boilerData?.safetyValveGauge?.valves?.length === 0) && (
          <TableExams
            exams={[]}
            questions={securityMeasurementContinuationValve.map(
              (e) => e.question,
            )}
          />
        )}

        {boilerData?.safetyValveGauge?.valves &&
          boilerData?.safetyValveGauge?.valves?.length > 0 &&
          boilerData?.safetyValveGauge?.valves.map((valve, valveIndex) => (
            <TableExams
              key={valveIndex}
              exams={valve.tests.questions}
              questions={securityMeasurementContinuationValve.map(
                (e) => e.question,
              )}
            />
          ))}

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.safetyValveGauge?.observations}</span>
          </div>
        </div>

        <NrsContainer>
          {getValveNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>
          5.6 - AFERIÇÕES DE COMANDOS E DISPOSITIVOS DE CONTROLE
          ELÉTRICO/ELETRÔNICOS
        </PageSubTitle>

        <div className="w-full flex items-center justify-center flex-wrap">
          {boilerData?.gaugeOfElectricOrElectronicControlDevicesAndCommands
            ?.photos && (
            <ElectricalPhotos
              gaugeOfElectricOrElectronicControlDevicesAndCommands={
                boilerData?.gaugeOfElectricOrElectronicControlDevicesAndCommands
              }
              boilerId={boilerId}
              isDownload={isDownload}
            />
          )}
        </div>

        <TableExams
          exams={
            boilerData?.gaugeOfElectricOrElectronicControlDevicesAndCommands
              ?.tests.questions
          }
          questions={electricalControlQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>
              {
                boilerData?.gaugeOfElectricOrElectronicControlDevicesAndCommands
                  ?.observations
              }
            </span>
          </div>
        </div>

        <NrsContainer>
          {getCommandsAndDevicesNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>
          5.7 - AFERIÇÕES DO SISTEMA DE DESCARGA DE FUNDO
        </PageSubTitle>

        <div className="w-full flex items-center justify-center flex-wrap">
          {boilerData?.bottomDischargeSystemChecks?.photos && (
            <BackgroundPhoto
              bottomDischargeSystemChecks={
                boilerData?.bottomDischargeSystemChecks
              }
              boilerId={boilerId}
              isDownload={isDownload}
            />
          )}
        </div>

        <TableExams
          exams={boilerData?.bottomDischargeSystemChecks?.tests.questions}
          questions={dischargeSystemQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.bottomDischargeSystemChecks?.observations}</span>
          </div>
        </div>

        <NrsContainer>
          {getBottomDischargeSystem().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>5.8 - QUALIDADE DA ÁGUA</PageSubTitle>

        <div className="w-full flex items-center justify-center flex-wrap">
          {boilerData?.waterQuality?.photos && (
            <WaterPhoto
              waterQuality={boilerData?.waterQuality}
              boilerId={boilerId}
              isDownload={isDownload}
            />
          )}
        </div>

        <TableExams
          exams={boilerData?.waterQuality?.tests.questions}
          questions={waterQualityQuestions.map((e) => e.question)}
        >
          <TableRow>
            <TableCell className="border-2 text-slate-900 py-1">
              PH da água
            </TableCell>
            <TableCell colSpan={2} className="border-2 text-slate-900 py-1">
              {boilerData?.waterQuality?.ph}
            </TableCell>
          </TableRow>
        </TableExams>

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.waterQuality?.observations}</span>
          </div>
        </div>

        <NrsContainer>
          {getWaterQualityNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>6 - ensaios realizados</PageTitle>
        <PageSubTitle>6.1 - ensaio hidrostático</PageSubTitle>

        <TableExams
          exams={boilerData?.hydrostaticTest?.tests.questions}
          questions={hydrostaticTestQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.hydrostaticTest?.observations}</span>
          </div>
        </div>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            pressão de prova aplicada: {boilerData?.hydrostaticTest?.pressure}{' '}
            (kgf/cm²)
          </span>
          <span className="text-lg uppercase">
            tempo: {boilerData?.hydrostaticTest?.duration} (min)
          </span>
          <span className="text-lg uppercase">
            procedimento: {boilerData?.hydrostaticTest?.procedure}
          </span>
        </PageInfoContainer>

        <NrsContainer>
          {getTestsHydrostatics().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>6.2 - ensaio por acumulação</PageSubTitle>

        <TableExams
          exams={boilerData?.accumulationTest?.tests.questions}
          questions={accumulationTestQuestions.map((e) => e.question)}
        />

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.accumulationTest?.observations}</span>
          </div>
        </div>

        <NrsContainer>
          {getTestsAccumulation().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>6.3 - ensaio de espessura por ultrassom</PageSubTitle>
        <PageSubTitle>6.3.1 - exame do corpo (A)</PageSubTitle>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            caldeira possuí registro de fábrica de acordo com a asme1?{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationA
              ?.isRegularizedAccordingToASME1
              ? 'SIM'
              : 'NÃO'}
          </span>
          <span className="text-lg uppercase">
            total de medidas tomadas:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationA?.total}
          </span>
          <span className="text-lg uppercase">
            média determinada:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationA?.mean} (mm)
          </span>
          <span className="text-lg uppercase">
            espessura fornecida pela fabricante:{' '}
            {
              boilerData?.ultrasoundTests?.bodyExaminationA
                ?.thicknessProvidedByManufacturer
            }{' '}
            (mm)
          </span>
          <span className="text-lg uppercase">
            taxa de corrosão:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationA?.corrosionRate
              ? Number(
                  boilerData?.ultrasoundTests?.bodyExaminationA?.corrosionRate,
                ).toFixed(2)
              : ''}{' '}
            (%)
          </span>
          <span className="text-lg uppercase">
            espessura mínima admitida para a pressão de serviço:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationA?.allowableThickness
              ? Number(
                  boilerData?.ultrasoundTests?.bodyExaminationA
                    ?.allowableThickness,
                ).toFixed(2)
              : ''}{' '}
            (mm)
          </span>
        </PageInfoContainer>

        <div className="w-full flex items-center justify-center flex-wrap">
          {boilerData?.ultrasoundTests?.bodyExaminationA?.photos && (
            <ExamBodyA
              ultrasoundTests={boilerData?.ultrasoundTests}
              boilerId={boilerId}
              isDownload={isDownload}
            />
          )}
        </div>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>
          {boilerData?.structure?.furnace?.type === 'waterTube' ? (
            '6.3.2 EXAME DO ESPELHO SUPERIOR: (B)'
          ) : (
            <>
              6.3.2 - exame do espelho{' '}
              {boilerData?.structure?.furnace?.type
                ?.toUpperCase()
                .includes('VERTICAL')
                ? 'Frontal'
                : 'Inferior'}{' '}
              (B)
            </>
          )}
        </PageSubTitle>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            total de medidas tomadas:
            {boilerData?.ultrasoundTests?.bodyExaminationB?.total}
          </span>
          <span className="text-lg uppercase">
            média determinada:
            {boilerData?.ultrasoundTests?.bodyExaminationB?.mean} (mm)
          </span>
          <span className="text-lg uppercase">
            espessura fornecida pela fabricante:
            {
              boilerData?.ultrasoundTests?.bodyExaminationB
                ?.thicknessProvidedByManufacturer
            }{' '}
            (mm)
          </span>
          <span className="text-lg uppercase">
            taxa de corrosão:
            {boilerData?.ultrasoundTests?.bodyExaminationB?.corrosionRate} (%)
          </span>
          <span className="text-lg uppercase">
            espessura mínima admitida para a pressão de serviço:
            {boilerData?.ultrasoundTests?.bodyExaminationB?.allowableThickness}
            (mm)
          </span>
        </PageInfoContainer>

        <div className="w-full flex items-center justify-center flex-wrap">
          {boilerData?.ultrasoundTests?.bodyExaminationB?.photos && (
            <ExamBodyB
              ultrasoundTests={boilerData?.ultrasoundTests}
              boilerId={boilerId}
              isDownload={isDownload}
            />
          )}
        </div>
      </PageContainer>

      <PageContainer>
        <PageSubTitle>
          {boilerData?.structure?.furnace?.type === 'waterTube' ? (
            '6.3.3 EXAME DO ESPELHO SUPERIOR: (C)'
          ) : (
            <>
              6.3.2 - exame do espelho{' '}
              {boilerData?.structure?.furnace?.type
                ?.toUpperCase()
                .includes('VERTICAL')
                ? 'Traseiro'
                : 'Superior'}{' '}
              (C)
            </>
          )}
        </PageSubTitle>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            total de medidas tomadas:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationC?.total}
          </span>
          <span className="text-lg uppercase">
            média determinada:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationC?.mean} (mm)
          </span>
          <span className="text-lg uppercase">
            espessura fornecida pela fabricante:{' '}
            {
              boilerData?.ultrasoundTests?.bodyExaminationC
                ?.thicknessProvidedByManufacturer
            }{' '}
            (mm)
          </span>
          <span className="text-lg uppercase">
            taxa de corrosão:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationC?.corrosionRate
              ? Number(
                  boilerData?.ultrasoundTests?.bodyExaminationC?.corrosionRate,
                ).toFixed(2)
              : ''}{' '}
            (%)
          </span>
          <span className="text-lg uppercase">
            espessura mínima admitida para a pressão de serviço:{' '}
            {boilerData?.ultrasoundTests?.bodyExaminationC?.allowableThickness
              ? Number(
                  boilerData?.ultrasoundTests?.bodyExaminationC
                    ?.allowableThickness,
                ).toFixed(2)
              : ''}{' '}
            (mm)
          </span>
        </PageInfoContainer>

        <div className="w-full flex items-center justify-center flex-wrap">
          {boilerData?.ultrasoundTests?.bodyExaminationC?.photos && (
            <ExamBodyC
              ultrasoundTests={boilerData?.ultrasoundTests}
              boilerId={boilerId}
              isDownload={isDownload}
            />
          )}
        </div>
      </PageContainer>

      {!boilerData?.structure?.furnace?.type?.includes('refractory') && (
        <PageContainer>
          <PageSubTitle>6.3.4 - exame do fornalha (D)</PageSubTitle>

          <PageInfoContainer>
            <span className="text-lg uppercase">
              total de medidas tomadas:{' '}
              {boilerData?.ultrasoundTests?.bodyExaminationD?.total}
            </span>
            <span className="text-lg uppercase">
              média determinada:{' '}
              {boilerData?.ultrasoundTests?.bodyExaminationD?.mean} (mm)
            </span>
            <span className="text-lg uppercase">
              espessura fornecida pela fabricante:{' '}
              {
                boilerData?.ultrasoundTests?.bodyExaminationD
                  ?.thicknessProvidedByManufacturer
              }{' '}
              (mm)
            </span>
            <span className="text-lg uppercase">
              taxa de corrosão:{' '}
              {boilerData?.ultrasoundTests?.bodyExaminationD?.corrosionRate
                ? Number(
                    boilerData?.ultrasoundTests?.bodyExaminationD
                      ?.corrosionRate,
                  ).toFixed(2)
                : ''}{' '}
              (%)
            </span>
            <span className="text-lg uppercase">
              espessura mínima admitida para a pressão de serviço:{' '}
              {boilerData?.ultrasoundTests?.bodyExaminationD?.allowableThickness
                ? Number(
                    boilerData?.ultrasoundTests?.bodyExaminationD
                      ?.allowableThickness,
                  ).toFixed(2)
                : ''}{' '}
              (mm)
            </span>
          </PageInfoContainer>

          <div className="w-full flex items-center justify-center flex-wrap">
            {boilerData?.ultrasoundTests?.bodyExaminationD?.photos && (
              <ExamBodyD
                ultrasoundTests={boilerData?.ultrasoundTests}
                boilerId={boilerId}
                isDownload={isDownload}
              />
            )}
          </div>
        </PageContainer>
      )}
      <PageContainer>
        <PageTitle>7 - Atualização do PMTA</PageTitle>

        <PageInfoContainer>
          <span className="text-lg uppercase">
            pode ser mantida:{' '}
            {boilerData?.pmta?.canBeMaintained ? 'SIM' : 'NÃO'}
          </span>
          <div className="w-full">
            <span className="text-lg uppercase">deve ser aumentado para</span>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>{boilerData?.pmta?.mustBeIncreasedTo}</span>
            </div>
          </div>
          <div className="w-full">
            <span className="text-lg uppercase">deve ser diminuída para</span>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>{boilerData?.pmta?.mustBeDecreasedTo}</span>
            </div>
          </div>
          <div className="w-full">
            <span className="text-lg uppercase">observações</span>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>{boilerData?.pmta?.observations}</span>
            </div>
          </div>
        </PageInfoContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>
          8 - SOBRE AS RESPONSABILIDADES DO EMPREGADOR NO EQUIPAMENTO{' '}
        </PageTitle>

        <NrsContainer>
          {getPMTANr().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>9 - SOBRE A INSPEÇÃO</PageTitle>
        <NrsContainer>
          {getPMTAPageNr().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>
      </PageContainer>

      <PageContainer>
        <PageTitle>10 - CONCLUSÕES</PageTitle>

        <PageInfoContainer>
          <div className="w-full">
            <span className="text-lg uppercase">
              Itens desta NR que não estão sendo atendidos
            </span>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span
                dangerouslySetInnerHTML={{
                  __html: nrsStringToHtml(
                    boilerData?.conclusions?.nrItemsThatNotBeingMet ?? '',
                  ),
                }}
              ></span>
            </div>
          </div>
          <div className="w-full">
            <span className="text-lg uppercase">
              Providências imediatas necessárias
            </span>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>{boilerData?.conclusions?.immediateMeasuresNecessary}</span>
            </div>
          </div>
          <div className="w-full">
            <span className="text-lg uppercase">PRAZO PARA EXECUÇÃO</span>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>{boilerData?.conclusions?.deadlineForNextInspection}</span>
            </div>
          </div>
          <div className="w-full">
            <span className="text-lg uppercase">Recomendações Necessárias</span>
            <div className="w-full h-fit min-h-24 border border-black p-4">
              <span>{boilerData?.conclusions?.necessaryRecommendations}</span>
            </div>
          </div>
        </PageInfoContainer>

        <PageBreak />
        <PageSubTitle className="text-center">
          A caldeira inspecionada pode ser utilizada normalmente?
        </PageSubTitle>

        <div className="flex w-full justify-center items-center gap-6">
          <span className="font-bold text-base uppercase text-end">
            [{boilerData?.conclusions?.canBeOperateNormally ? ' x ' : '   '}]
            sim
          </span>
          <span className="font-bold text-base uppercase text-end">
            [{boilerData?.conclusions?.canBeOperateNormally ? '   ' : ' x '}]
            não
          </span>
        </div>

        <NrsContainer>
          {getConclusionNrs().map((nr) => {
            return (
              <Nrs key={nr}>{nr.trimStart().replaceAll('\n', '<br />')}</Nrs>
            )
          })}
        </NrsContainer>

        <div className="w-full">
          <PageSubTitle>observações</PageSubTitle>
          <div className="w-full h-fit min-h-24 border border-black p-4">
            <span>{boilerData?.conclusions?.necessaryRecommendations}</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-center flex-col">
          <span className="uppercase text-base">Responsável pela inspeção</span>
          <div className="border-b border-black mt-16 w-96" />
        </div>
      </PageContainer>
    </Container>
  )
}
