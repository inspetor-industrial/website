'use client'

import { PartialBoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { Button } from '@inspetor/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@inspetor/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@inspetor/components/ui/scroll-area'
import { events } from '@inspetor/constants/events'
import { toast } from '@inspetor/hooks/use-toast'
import { blankFunction } from '@inspetor/utils/blank-function'
import { makeOptionValue } from '@inspetor/utils/combobox-options'
import { merge } from 'lodash'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { forms } from './forms'
import { FormRef } from './forms/form'

type BoilerInspectionModalProps = {}

export type BoilerInspectionModalRef = {
  open: () => void
  close: () => void
}

const BoilerInspectionModal = forwardRef(function BoilerInspectionModal(
  props: BoilerInspectionModalProps,
  ref,
) {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [currentFormIndex, setCurrentFormIndex] = useState(0)

  const [boilerReportState, setBoilerReportState] =
    useState<PartialBoilerInspection>({})

  function getBoilerReportToDefaultValuesInForm() {
    let boilerReport = { ...boilerReportState }

    if (boilerReport.client) {
      // @ts-expect-error [ignore]
      boilerReport.client = makeOptionValue(boilerReport.client)
    }

    if (boilerReport.responsible) {
      // @ts-expect-error [ignore]
      boilerReport.responsible = makeOptionValue(boilerReport.responsible)
    }

    if (boilerReport.operator) {
      // @ts-expect-error [ignore]
      boilerReport.operatorName = boilerReport.operator.name

      // @ts-expect-error [ignore]
      boilerReport.isAbleToOperateWithNR13 =
        boilerReport.operator.isAbleToOperateWithNR13

      // @ts-expect-error [ignore]
      boilerReport.certificate = boilerReport.operator.certificate

      // @ts-expect-error [ignore]
      boilerReport.provisionsForOperator =
        boilerReport.operator.provisionsForOperator

      // @ts-expect-error [ignore]
      boilerReport.observations = boilerReport.operator.observations
    }

    if (boilerReport.structure) {
      // @ts-expect-error [ignore]
      boilerReport.furnaceType = boilerReport.structure.furnace?.type
      // @ts-expect-error [ignore]
      boilerReport.heatingSurface = boilerReport.structure.heatingSurface
      // @ts-expect-error [ignore]
      boilerReport.tubeDiameter =
        boilerReport.structure.furnace?.dimensions?.tube?.diameter
      // @ts-expect-error [ignore]
      boilerReport.tubeThickness =
        boilerReport.structure.furnace?.dimensions?.tube?.thickness
      // @ts-expect-error [ignore]
      boilerReport.furnaceHeight =
        boilerReport.structure.furnace?.dimensions?.height
      // @ts-expect-error [ignore]
      boilerReport.furnaceWidth =
        boilerReport.structure.furnace?.dimensions?.width
      // @ts-expect-error [ignore]
      boilerReport.furnaceLength =
        boilerReport.structure.furnace?.dimensions?.length
      // @ts-expect-error [ignore]
      boilerReport.furnaceDiameter =
        boilerReport.structure.furnace?.dimensions?.diameter
      // @ts-expect-error [ignore]
      boilerReport.furnaceDimensionsInfos =
        boilerReport.structure.furnace?.infos

      // @ts-expect-error [ignore]
      boilerReport.freeLengthWithoutStaysOrTube =
        boilerReport.structure.freeLengthWithoutStaysOrTube

      // @ts-expect-error [ignore]
      boilerReport.mirrorDiameter = boilerReport.structure.mirror?.diameter
      // @ts-expect-error [ignore]
      boilerReport.mirrorThickness = boilerReport.structure.mirror?.thickness

      // @ts-expect-error [ignore]
      boilerReport.bodyDiameter = boilerReport.structure.body?.diameter
      // @ts-expect-error [ignore]
      boilerReport.bodyThickness = boilerReport.structure.body?.thickness
      // @ts-expect-error [ignore]
      boilerReport.bodyLength = boilerReport.structure.body?.length

      // @ts-expect-error [ignore]
      boilerReport.bodyMaterial = boilerReport.structure.body?.material
      // @ts-expect-error [ignore]
      boilerReport.bodyHasCertificateOfManufacturer =
        boilerReport.structure.body?.hasCertificateOfManufacturer

      // @ts-expect-error [ignore]
      boilerReport.tubeQuantity = boilerReport.structure.tube?.quantity
      // @ts-expect-error [ignore]
      boilerReport.tubeDiameter = boilerReport.structure.tube?.diameter
      // @ts-expect-error [ignore]
      boilerReport.tubeLength = boilerReport.structure.tube?.length

      // @ts-expect-error [ignore]
      boilerReport.tubeMaterial = boilerReport.structure.tube?.material
      // @ts-expect-error [ignore]
      boilerReport.tubeThickness = boilerReport.structure.tube?.thickness
      // @ts-expect-error [ignore]
      boilerReport.tubeHasCertificateOfManufacturer =
        boilerReport.structure.tube?.hasCertificateOfManufacturer
      // @ts-expect-error [ignore]
      boilerReport.tubeIsNaturalOrForced =
        boilerReport.structure.tube?.isNaturalOrForced

      // @ts-expect-error [ignore]
      boilerReport.quantityOfSafetyFuse =
        boilerReport.structure.quantityOfSafetyFuse
    }

    if (boilerReport.examinationsPerformed) {
      // @ts-expect-error [ignore]
      boilerReport.tests = boilerReport.examinationsPerformed?.tests?.questions
      // @ts-expect-error [ignore]
      boilerReport.nrs = boilerReport.examinationsPerformed?.tests?.nrsToAdd

      // @ts-expect-error [ignore]
      boilerReport.observationsExamPerformed =
        boilerReport.examinationsPerformed?.observations

      // @ts-expect-error [ignore]
      boilerReport.record = boilerReport.examinationsPerformed?.record
      // @ts-expect-error [ignore]
      boilerReport.book = boilerReport.examinationsPerformed?.book
    }

    if (boilerReport.externalExaminationsPerformed) {
      // @ts-expect-error [ignore]
      boilerReport.plateIdentification =
        boilerReport.externalExaminationsPerformed?.plateIdentification
      // @ts-expect-error [ignore]
      boilerReport.boiler = boilerReport.externalExaminationsPerformed?.boiler

      // @ts-expect-error [ignore]
      boilerReport.extraPhotos =
        boilerReport.externalExaminationsPerformed?.extraPhotos

      // @ts-expect-error [ignore]
      boilerReport.externExamTests =
        boilerReport.externalExaminationsPerformed?.tests?.questions

      // @ts-expect-error [ignore]
      boilerReport.externExamNrs =
        boilerReport.externalExaminationsPerformed?.tests?.nrsToAdd

      // @ts-expect-error [ignore]
      boilerReport.observationsExternalExams =
        boilerReport.externalExaminationsPerformed?.observations
    }

    if (boilerReport.internalExaminationsPerformed) {
      // @ts-expect-error [ignore]
      boilerReport.tubes = boilerReport.internalExaminationsPerformed?.tubes
      // @ts-expect-error [ignore]
      boilerReport.furnaceInternalExaminations =
        boilerReport.internalExaminationsPerformed?.furnace

      // @ts-expect-error [ignore]
      boilerReport.internalBoiler =
        boilerReport.internalExaminationsPerformed?.internalBoiler

      // @ts-expect-error [ignore]
      boilerReport.extraPhotosInternalExams =
        boilerReport.internalExaminationsPerformed?.extraPhotos

      // @ts-expect-error [ignore]
      boilerReport.internalExamTests =
        boilerReport.internalExaminationsPerformed?.tests?.questions

      // @ts-expect-error [ignore]
      boilerReport.internalExamNrs =
        boilerReport.internalExaminationsPerformed?.tests?.nrsToAdd

      // @ts-expect-error [ignore]
      boilerReport.observationsInternalExams =
        boilerReport.internalExaminationsPerformed?.observations
    }

    if (boilerReport.localInstallationExaminationsPerformed) {
      // @ts-expect-error [ignore]
      boilerReport.boilerHouse =
        boilerReport.localInstallationExaminationsPerformed?.boilerHouse

      // @ts-expect-error [ignore]
      boilerReport.localInstallationTests =
        boilerReport.localInstallationExaminationsPerformed?.tests?.questions

      // @ts-expect-error [ignore]
      boilerReport.localInstallationNrs =
        boilerReport.localInstallationExaminationsPerformed?.tests?.nrsToAdd

      // @ts-expect-error [ignore]
      boilerReport.observationsLocalInstallation =
        boilerReport.localInstallationExaminationsPerformed?.observations
    }

    if (boilerReport.pressureGaugeCalibration) {
      // @ts-expect-error [ignore]
      boilerReport.calibrationOrderNumber =
        boilerReport.pressureGaugeCalibration.calibrationOrderNumber
      // @ts-expect-error [ignore]
      boilerReport.markPressureGauge =
        boilerReport.pressureGaugeCalibration.mark
      // @ts-expect-error [ignore]
      boilerReport.diameterPressureGauge =
        boilerReport.pressureGaugeCalibration.diameter
      // @ts-expect-error [ignore]
      boilerReport.capacityPressureGauge =
        boilerReport.pressureGaugeCalibration.capacity
      // @ts-expect-error [ignore]
      boilerReport.photos = boilerReport.pressureGaugeCalibration.photos
      // @ts-expect-error [ignore]
      boilerReport.pressureGaugeTests =
        boilerReport.pressureGaugeCalibration.tests?.questions
      // @ts-expect-error [ignore]
      boilerReport.pressureGaugeNrs =
        boilerReport.pressureGaugeCalibration.tests?.nrsToAdd
      // @ts-expect-error [ignore]
      boilerReport.observationsPressureGauge =
        boilerReport.pressureGaugeCalibration.observations
    }

    if (boilerReport.injectorGauge) {
      // @ts-expect-error [ignore]
      boilerReport.injectorSerialNumber =
        boilerReport.injectorGauge.serialNumber
      // @ts-expect-error [ignore]
      boilerReport.injectorMark = boilerReport.injectorGauge.mark
      // @ts-expect-error [ignore]
      boilerReport.injectorDiameter = boilerReport.injectorGauge.diameter
      // @ts-expect-error [ignore]
      boilerReport.injectorFuel = boilerReport.injectorGauge.fuel
      // @ts-expect-error [ignore]
      boilerReport.injectorPhotos = boilerReport.injectorGauge.photos
      // @ts-expect-error [ignore]
      boilerReport.injectorTests = boilerReport.injectorGauge.tests?.questions
      // @ts-expect-error [ignore]
      boilerReport.injectorNrs = boilerReport.injectorGauge.tests?.nrsToAdd
      // @ts-expect-error [ignore]
      boilerReport.observationsInjector =
        boilerReport.injectorGauge.observations
    }

    // @ts-expect-error [ignore]
    boilerReport = {
      ...boilerReport,
      ...(boilerReport.identification || {}),
    }

    return boilerReport
  }

  function updateReportInfo(values: PartialBoilerInspection) {
    setBoilerReportState((prev) => {
      return merge(prev, values)
    })
  }

  function clearBoilerReport() {
    setBoilerReportState({})
  }

  const formRef = useRef<FormRef | null>(null)

  const { Form, formTitle } = useMemo(() => {
    return forms[currentFormIndex]
  }, [currentFormIndex])

  async function handleCancelOrComeback() {
    if (currentFormIndex === 0) {
      setIsModalOpened(false)
      return
    }

    setCurrentFormIndex((prevIndex) => prevIndex - 1)
  }

  async function handleSubmitStep() {
    if (!formRef.current) {
      toast({
        title: 'Erro',
        description: 'Formulário não encontrado',
        variant: 'destructive',
      })

      return
    }

    const submit = formRef.current.form.handleSubmit(blankFunction)
    await submit()

    const isFormValid =
      Object.keys(formRef.current.form.formState.errors).length === 0

    if (!isFormValid) {
      console.log(
        'formRef.current.form.formState',
        formRef.current.form.formState.errors,
      )
      toast({
        title: 'Erro',
        description:
          'Verifique os campos necessários, pois alguns estão inválidos',
        variant: 'destructive',
      })

      return
    }

    const valuesToUpdate = formRef.current
      .runAutoCompleteAndFormatterWithDefaultValues
      ? formRef.current.runAutoCompleteAndFormatterWithDefaultValues(
          formRef.current.getValues(),
        )
      : formRef.current.getValues()
    updateReportInfo(valuesToUpdate)

    setCurrentFormIndex((prevIndex) => prevIndex + 1)
  }

  useEffect(() => {
    function handleOpenModalByEvent() {
      setIsModalOpened(true)
    }

    window.addEventListener(
      events.models.boilerInspection.navigate.to.register,
      handleOpenModalByEvent,
    )

    return () => {
      window.removeEventListener(
        events.models.boilerInspection.navigate.to.register,
        handleOpenModalByEvent,
      )
    }
  }, [])

  useImperativeHandle(ref, () => {
    return {
      open: () => setIsModalOpened(true),
      close: () => setIsModalOpened(false),
    }
  })

  return (
    <Dialog
      open={isModalOpened}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearBoilerReport()
          setCurrentFormIndex(0)
        }

        setIsModalOpened(isOpen)
      }}
      {...props}
    >
      <DialogContent
        className="bg-inspetor-dark-blue-700 border-inspetor-dark-blue-700"
        onPointerDownOutside={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onInteractOutside={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white">{formTitle}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96 min-h-96 w-full">
          <Form
            ref={formRef}
            defaultValues={getBoilerReportToDefaultValuesInForm()}
          />

          <ScrollBar />
        </ScrollArea>

        <DialogFooter>
          <Button variant="modal" size="modal" onClick={handleCancelOrComeback}>
            {currentFormIndex === 0 ? 'Cancelar' : 'Voltar'}
          </Button>

          <Button variant="modal" size="modal" onClick={handleSubmitStep}>
            Próximo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

export { BoilerInspectionModal }
