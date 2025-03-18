import { makeOptionValue } from './combobox-options'

export function parseBoilerReportInspection(boilerReport: any) {
  if (boilerReport.type) {
    boilerReport.inspectionType = boilerReport.type
  }

  if (boilerReport.client && typeof boilerReport.client === 'object') {
    boilerReport.client = makeOptionValue(boilerReport.client, [
      'id',
      'name',
      'cnpjOrCpf',
    ])
  }

  if (
    boilerReport.responsible &&
    typeof boilerReport.responsible === 'object'
  ) {
    boilerReport.responsible = makeOptionValue(boilerReport.responsible, [
      'id',
      'name',
      'stateRegistry',
    ])
  }

  if (boilerReport.operator) {
    boilerReport.operatorName = boilerReport.operator.name

    boilerReport.isAbleToOperateWithNR13 =
      boilerReport.operator.isAbleToOperateWithNR13

    boilerReport.certificate = boilerReport.operator.certificate
    if (typeof boilerReport.certificate === 'string') {
      boilerReport.certificate = []
    }

    boilerReport.provisionsForOperator =
      boilerReport.operator.provisionsForOperator

    boilerReport.observations = boilerReport.operator.observations
  }

  if (boilerReport.structure) {
    boilerReport.furnaceType = boilerReport.structure.furnace?.type

    boilerReport.heatingSurface = boilerReport.structure.heatingSurface

    boilerReport.tubeDiameterFurnace =
      boilerReport.structure.furnace?.dimensions?.tube?.diameter

    boilerReport.tubeThicknessFurnace =
      boilerReport.structure.furnace?.dimensions?.tube?.thickness

    boilerReport.furnaceHeight =
      boilerReport.structure.furnace?.dimensions?.height

    boilerReport.furnaceWidth =
      boilerReport.structure.furnace?.dimensions?.width

    boilerReport.furnaceLength =
      boilerReport.structure.furnace?.dimensions?.length

    boilerReport.furnaceDiameter =
      boilerReport.structure.furnace?.dimensions?.diameter

    boilerReport.furnaceDimensionsInfos = boilerReport.structure.furnace?.infos

    boilerReport.freeLengthWithoutStaysOrTube =
      boilerReport.structure.freeLengthWithoutStaysOrTube

    boilerReport.mirrorDiameter = boilerReport.structure.mirror?.diameter

    boilerReport.mirrorThickness = boilerReport.structure.mirror?.thickness

    boilerReport.bodyDiameter = boilerReport.structure.body?.diameter

    boilerReport.bodyThickness = boilerReport.structure.body?.thickness

    boilerReport.bodyLength = boilerReport.structure.body?.length

    boilerReport.bodyMaterial = boilerReport.structure.body?.material

    boilerReport.bodyHasCertificateOfManufacturer =
      boilerReport.structure.body?.hasCertificateOfManufacturer

    boilerReport.tubeQuantity = boilerReport.structure.tube?.quantity

    boilerReport.tubeDiameter = boilerReport.structure.tube?.diameter

    boilerReport.tubeLength = boilerReport.structure.tube?.length

    boilerReport.tubeMaterial = boilerReport.structure.tube?.material

    boilerReport.tubeThickness = boilerReport.structure.tube?.thickness

    boilerReport.tubeHasCertificateOfManufacturer =
      boilerReport.structure.tube?.hasCertificateOfManufacturer

    boilerReport.tubeIsNaturalOrForced =
      boilerReport.structure.tube?.isNaturalOrForced

    boilerReport.quantityOfSafetyFuse =
      boilerReport.structure.quantityOfSafetyFuse
  }

  if (boilerReport.examinationsPerformed) {
    boilerReport.tests = boilerReport.examinationsPerformed?.tests?.questions

    boilerReport.nrs = boilerReport.examinationsPerformed?.tests?.nrsToAdd

    boilerReport.observationsExamPerformed =
      boilerReport.examinationsPerformed?.observations

    boilerReport.record = boilerReport.examinationsPerformed?.record

    boilerReport.book = boilerReport.examinationsPerformed?.book
  }

  if (boilerReport.externalExaminationsPerformed) {
    boilerReport.plateIdentification =
      boilerReport.externalExaminationsPerformed?.plateIdentification

    boilerReport.boiler = boilerReport.externalExaminationsPerformed?.boiler

    boilerReport.extraPhotos =
      boilerReport.externalExaminationsPerformed?.extraPhotos

    boilerReport.externExamTests =
      boilerReport.externalExaminationsPerformed?.tests?.questions

    boilerReport.externExamNrs =
      boilerReport.externalExaminationsPerformed?.tests?.nrsToAdd

    boilerReport.observationsExternalExams =
      boilerReport.externalExaminationsPerformed?.observations
  }

  if (boilerReport.internalExaminationsPerformed) {
    boilerReport.tubes = boilerReport.internalExaminationsPerformed?.tubes

    boilerReport.furnaceInternalExaminations =
      boilerReport.internalExaminationsPerformed?.furnace

    boilerReport.internalBoiler =
      boilerReport.internalExaminationsPerformed?.internalBoiler

    boilerReport.extraPhotosInternalExams =
      boilerReport.internalExaminationsPerformed?.extraPhotos

    boilerReport.internalExamTests =
      boilerReport.internalExaminationsPerformed?.tests?.questions

    boilerReport.internalExamNrs =
      boilerReport.internalExaminationsPerformed?.tests?.nrsToAdd

    boilerReport.observationsInternalExams =
      boilerReport.internalExaminationsPerformed?.observations
  }

  if (boilerReport.localInstallationExaminationsPerformed) {
    boilerReport.boilerHouse =
      boilerReport.localInstallationExaminationsPerformed?.boilerHouse

    boilerReport.localInstallationTests =
      boilerReport.localInstallationExaminationsPerformed?.tests?.questions

    boilerReport.localInstallationNrs =
      boilerReport.localInstallationExaminationsPerformed?.tests?.nrsToAdd

    boilerReport.observationsLocalInstallation =
      boilerReport.localInstallationExaminationsPerformed?.observations
  }

  if (boilerReport.pressureGaugeCalibration) {
    boilerReport.calibrationOrderNumber =
      boilerReport.pressureGaugeCalibration.calibrationOrderNumber

    boilerReport.markPressureGauge = boilerReport.pressureGaugeCalibration.mark

    boilerReport.diameterPressureGauge =
      boilerReport.pressureGaugeCalibration.diameter

    boilerReport.capacityPressureGauge =
      boilerReport.pressureGaugeCalibration.capacity

    boilerReport.photos = boilerReport.pressureGaugeCalibration.photos

    boilerReport.pressureGaugeTests =
      boilerReport.pressureGaugeCalibration.tests?.questions

    boilerReport.pressureGaugeNrs =
      boilerReport.pressureGaugeCalibration.tests?.nrsToAdd

    boilerReport.observationsPressureGauge =
      boilerReport.pressureGaugeCalibration.observations
  }

  if (boilerReport.injectorGauge) {
    boilerReport.injectorSerialNumber = boilerReport.injectorGauge.serialNumber

    boilerReport.injectorMark = boilerReport.injectorGauge.mark

    boilerReport.injectorDiameter = boilerReport.injectorGauge.diameter

    boilerReport.injectorFuel = boilerReport.injectorGauge.fuel

    boilerReport.injectorPhotos = boilerReport.injectorGauge.photos

    boilerReport.injectorTests = boilerReport.injectorGauge.tests?.questions

    boilerReport.injectorNrs = boilerReport.injectorGauge.tests?.nrsToAdd

    boilerReport.observationsInjector = boilerReport.injectorGauge.observations
  }

  if (boilerReport.powerSupply) {
    boilerReport.bombs = boilerReport.powerSupply.bombs

    boilerReport.bombsTests = boilerReport.powerSupply.tests?.questions

    boilerReport.bombsNrs = boilerReport.powerSupply.tests?.nrsToAdd

    boilerReport.observationsPowerSupply = boilerReport.powerSupply.observations

    boilerReport.quantityOfBombs = boilerReport.powerSupply.bombs?.length || 0
  }

  if (boilerReport.calibrationOfTheLevelIndicatorAssembly) {
    boilerReport.levelIndicatorTests =
      boilerReport.calibrationOfTheLevelIndicatorAssembly.tests?.questions

    boilerReport.levelIndicatorNrs =
      boilerReport.calibrationOfTheLevelIndicatorAssembly.tests?.nrsToAdd

    boilerReport.observationsLevelIndicator =
      boilerReport.calibrationOfTheLevelIndicatorAssembly.observations

    boilerReport.levelIndicatorMark =
      boilerReport.calibrationOfTheLevelIndicatorAssembly.mark

    boilerReport.levelIndicatorGlassDiameter =
      boilerReport.calibrationOfTheLevelIndicatorAssembly.glass?.diameter

    boilerReport.levelIndicatorGlassLength =
      boilerReport.calibrationOfTheLevelIndicatorAssembly.glass?.length

    boilerReport.levelIndicatorPhotos =
      boilerReport.calibrationOfTheLevelIndicatorAssembly.photos
  }

  if (boilerReport.safetyValveGauge) {
    boilerReport.quantityOfSafetyValves = boilerReport.safetyValveGauge.quantity

    boilerReport.isThereSafetyValveRedundancy =
      boilerReport.safetyValveGauge.isThereSafetyValveRedundancy

    boilerReport.observationsValves = boilerReport.safetyValveGauge.observations

    boilerReport.valvePhotos = boilerReport.safetyValveGauge.photos

    if (Number(boilerReport.safetyValveGauge.quantity) >= 1) {
      boilerReport.valve1 = boilerReport.safetyValveGauge.valves[0]
    }

    if (Number(boilerReport.safetyValveGauge.quantity) >= 2) {
      boilerReport.valve2 = boilerReport.safetyValveGauge.valves[1]
    }

    if (Number(boilerReport.safetyValveGauge.quantity) >= 3) {
      boilerReport.valve3 = boilerReport.safetyValveGauge.valves[2]
    }
  }

  if (boilerReport.gaugeOfElectricOrElectronicControlDevicesAndCommands) {
    boilerReport.gaugeTests =
      boilerReport.gaugeOfElectricOrElectronicControlDevicesAndCommands.tests?.questions

    boilerReport.gaugeNrs =
      boilerReport.gaugeOfElectricOrElectronicControlDevicesAndCommands.tests?.nrsToAdd

    boilerReport.gaugePhotos =
      boilerReport.gaugeOfElectricOrElectronicControlDevicesAndCommands.photos

    boilerReport.observationsGauge =
      boilerReport.gaugeOfElectricOrElectronicControlDevicesAndCommands.observations
  }

  if (boilerReport.bottomDischargeSystemChecks) {
    boilerReport.dischargeTests =
      boilerReport.bottomDischargeSystemChecks.tests?.questions

    boilerReport.dischargesNrs =
      boilerReport.bottomDischargeSystemChecks.tests?.nrsToAdd

    boilerReport.dischargePhotos =
      boilerReport.bottomDischargeSystemChecks.photos

    boilerReport.observationDischarge =
      boilerReport.bottomDischargeSystemChecks.observations
  }

  if (boilerReport.waterQuality) {
    boilerReport.waterTests = boilerReport.waterQuality.tests?.questions

    boilerReport.waterNrs = boilerReport.waterQuality.tests?.nrsToAdd

    boilerReport.ph = boilerReport.waterQuality.ph

    boilerReport.waterPhotos = boilerReport.waterQuality.photos

    boilerReport.observationsWater = boilerReport.waterQuality.observations
  }

  if (boilerReport.hydrostaticTest) {
    boilerReport.pressureHydrostatic = boilerReport.hydrostaticTest.pressure

    boilerReport.durationHydrostatic = boilerReport.hydrostaticTest.duration

    boilerReport.procedureHydrostatic = boilerReport.hydrostaticTest.procedure

    boilerReport.hydrostaticTests =
      boilerReport.hydrostaticTest.tests?.questions

    boilerReport.hydrostaticNrs = boilerReport.hydrostaticTest.tests?.nrsToAdd

    boilerReport.observationsHydrostatic =
      boilerReport.hydrostaticTest.observations
  }

  if (boilerReport.accumulationTest) {
    boilerReport.pressureAccumulation = boilerReport.accumulationTest.pressure

    boilerReport.durationAccumulation = boilerReport.accumulationTest.duration

    boilerReport.accumulationTests =
      boilerReport.accumulationTest.tests?.questions

    boilerReport.accumulationNrs = boilerReport.accumulationTest.tests?.nrsToAdd

    boilerReport.observationsAccumulation =
      boilerReport.accumulationTest.observations
  }

  if (boilerReport.ultrasoundTests) {
    if (boilerReport.ultrasoundTests.bodyExaminationA) {
      boilerReport.bodyExaminationA =
        boilerReport.ultrasoundTests.bodyExaminationA

      boilerReport.isRegularizedAccordingToASME1 =
        boilerReport.ultrasoundTests.bodyExaminationA.isRegularizedAccordingToASME1

      boilerReport.photosBodyExaminationA =
        boilerReport.ultrasoundTests.bodyExaminationA.photos

      boilerReport.totalBodyExaminationA =
        boilerReport.ultrasoundTests.bodyExaminationA.total

      boilerReport.meanBodyExaminationA =
        boilerReport.ultrasoundTests.bodyExaminationA.mean

      boilerReport.thicknessProvidedByManufacturerBodyExaminationA =
        boilerReport.ultrasoundTests.bodyExaminationA.thicknessProvidedByManufacturer

      boilerReport.corrosionRateBodyExaminationA =
        boilerReport.ultrasoundTests.bodyExaminationA.corrosionRate

      boilerReport.allowableThicknessBodyExaminationA =
        boilerReport.ultrasoundTests.bodyExaminationA.allowableThickness
    }

    if (boilerReport.ultrasoundTests.bodyExaminationB) {
      boilerReport.bodyExaminationB =
        boilerReport.ultrasoundTests.bodyExaminationB

      boilerReport.photosBodyExaminationB =
        boilerReport.ultrasoundTests.bodyExaminationB.photos

      boilerReport.totalBodyExaminationB =
        boilerReport.ultrasoundTests.bodyExaminationB.total

      boilerReport.meanBodyExaminationB =
        boilerReport.ultrasoundTests.bodyExaminationB.mean

      boilerReport.thicknessProvidedByManufacturerBodyExaminationB =
        boilerReport.ultrasoundTests.bodyExaminationB.thicknessProvidedByManufacturer

      boilerReport.corrosionRateBodyExaminationB =
        boilerReport.ultrasoundTests.bodyExaminationB.corrosionRate

      boilerReport.allowableThicknessBodyExaminationB =
        boilerReport.ultrasoundTests.bodyExaminationB.allowableThickness
    }

    if (boilerReport.ultrasoundTests.bodyExaminationC) {
      boilerReport.bodyExaminationC =
        boilerReport.ultrasoundTests.bodyExaminationC

      boilerReport.photosBodyExaminationC =
        boilerReport.ultrasoundTests.bodyExaminationC.photos

      boilerReport.totalBodyExaminationC =
        boilerReport.ultrasoundTests.bodyExaminationC.total

      boilerReport.meanBodyExaminationC =
        boilerReport.ultrasoundTests.bodyExaminationC.mean

      boilerReport.thicknessProvidedByManufacturerBodyExaminationC =
        boilerReport.ultrasoundTests.bodyExaminationC.thicknessProvidedByManufacturer

      boilerReport.corrosionRateBodyExaminationC =
        boilerReport.ultrasoundTests.bodyExaminationC.corrosionRate

      boilerReport.allowableThicknessBodyExaminationC =
        boilerReport.ultrasoundTests.bodyExaminationC.allowableThickness
    }

    if (boilerReport.ultrasoundTests.bodyExaminationD) {
      boilerReport.bodyExaminationD =
        boilerReport.ultrasoundTests.bodyExaminationD

      boilerReport.photosBodyExaminationD =
        boilerReport.ultrasoundTests.bodyExaminationD.photos

      boilerReport.totalBodyExaminationD =
        boilerReport.ultrasoundTests.bodyExaminationD.total

      boilerReport.meanBodyExaminationD =
        boilerReport.ultrasoundTests.bodyExaminationD.mean

      boilerReport.thicknessProvidedByManufacturerBodyExaminationD =
        boilerReport.ultrasoundTests.bodyExaminationD.thicknessProvidedByManufacturer

      boilerReport.corrosionRateBodyExaminationD =
        boilerReport.ultrasoundTests.bodyExaminationD.corrosionRate

      boilerReport.allowableThicknessBodyExaminationD =
        boilerReport.ultrasoundTests.bodyExaminationD.allowableThickness
    }
  }

  if (boilerReport.pmta) {
    boilerReport.canBeMaintained = boilerReport.pmta.canBeMaintained

    boilerReport.mustBeIncreasedTo = boilerReport.pmta.mustBeIncreasedTo

    boilerReport.mustBeDecreasedTo = boilerReport.pmta.mustBeDecreasedTo

    boilerReport.observationsPMTA = boilerReport.pmta.observations
  }

  if (boilerReport.conclusions) {
    boilerReport.deadlineForNextInspection =
      boilerReport.conclusions.deadlineForNextInspection

    boilerReport.nrItemsThatNotBeingMet =
      boilerReport.conclusions.nrItemsThatNotBeingMet

    boilerReport.immediateMeasuresNecessary =
      boilerReport.conclusions.immediateMeasuresNecessary

    boilerReport.necessaryRecommendations =
      boilerReport.conclusions.necessaryRecommendations

    boilerReport.canBeOperateNormally =
      boilerReport.conclusions.canBeOperateNormally
  }

  return boilerReport
}
