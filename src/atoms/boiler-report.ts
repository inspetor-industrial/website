import { PartialBoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { makeOptionValue } from '@inspetor/utils/combobox-options'
import { atom } from 'jotai'
import { cloneDeep, merge } from 'lodash'

export const boilerReportAtom = atom<PartialBoilerInspection>({})

export const updateBoilerReportAtom = atom(
  null,
  (get, set, updatedInfo: PartialBoilerInspection) => {
    const boilerReport = get(boilerReportAtom)
    set(boilerReportAtom, merge(boilerReport, updatedInfo))
  },
)

export const getBoilerReportToDefaultValuesInFormAtom = atom(null, (get) => {
  let boilerReport = cloneDeep(get(boilerReportAtom))

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
    boilerReport.furnaceDimensionsInfos = boilerReport.structure.furnace?.infos

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
    boilerReport.observations = boilerReport.examinationsPerformed?.observations

    // @ts-expect-error [ignore]
    boilerReport.record = boilerReport.examinationsPerformed?.record
    // @ts-expect-error [ignore]
    boilerReport.book = boilerReport.examinationsPerformed?.book
  }

  // @ts-expect-error [ignore]
  boilerReport = {
    ...boilerReport,
    ...(boilerReport.identification || {}),
  }

  return boilerReport
})

export const clearBoilerReportAtom = atom(null, (_, set) => {
  set(boilerReportAtom, {})
})
