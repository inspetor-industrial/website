import { Document } from '../document'

export type BoilerInspectionType = 'initial' | 'periodic' | 'extraordinary'
export type BoilerType =
  | 'fireTubeHorizontal'
  | 'fireTubeVertical'
  | 'waterTubeHorizontal'
  | 'waterTubeVertical'
  | 'mixed'

export type BoilerFuelType =
  | 'firewood'
  | 'woodChips'
  | 'bagasse'
  | 'straw'
  | 'lpg'
  | 'ng'
  | 'dieselOil'
  | 'bpfOil'
  | 'blackLiquor'
  | 'briquette'

export type FurnaceType = 'refractory' | 'cooled' | 'waterTube'

export type FurnaceDimensions = {
  width: string
  height: string
  length: string
  diameter: string

  tube: {
    diameter: string
    thickness: string
  }
}

export type BoilerCategory = 'A' | 'B'

export type BoilerBodyMaterial = 'astmA285Grc' | 'astmA516' | 'notSpecified'
export type BoilerTubeMaterial = 'astmA178' | 'notSpecified'

export type InjectorFuelType = 'liquid' | 'gaseous' | 'solid'

export type BoilerNrToAdd = {
  string: string
  subItem: Omit<BoilerNrToAdd, 'subItem'>[]
  isSelected: boolean
}

export type Question = {
  question: string
  answer: boolean
}

export type BoilerTableTests = {
  nrsToAdd: BoilerNrToAdd[]
  questions: Question[]
}

export type Bomb = {
  mark: string
  stages: string
  model: string
  potency: string

  photos: Document[]
}

export type Valve = {
  calibrationOrderNumber: string
  diameter: string
  flow: string

  tests: BoilerTableTests

  openingPressure: string
  closingPressure: string
}

export type BoilerUltraSoundExam = {
  total: string
  mean: string

  thicknessProvidedByManufacturer: string
  corrosionRate: string

  allowableThickness: string

  photos: Document[]
}

export type BoilerInspection = {
  service: string
  type: BoilerInspectionType

  client: {
    id: string
    name: string
    cnpjOrCpf: string
  }

  motivation: string

  date: number
  startTimeInspection: string
  endTimeInspection: string

  validity: string
  nextDate: number

  responsible: {
    id: string
    name: string
    stateRegistry: string
  }

  operator: {
    name: string
    isAbleToOperateWithNR13: boolean
    certificate?: Document[]
    provisionsForOperator?: string
    observations?: string
  }

  identification: {
    manufacturer: string
    model: string
    type: BoilerType
    yearOfManufacture: string
    mark: string
    capacity: string

    fuel: BoilerFuelType
    maximumWorkingPressure: string
    operatingPressure: string
    series: string
    category: BoilerCategory
  }

  structure: {
    heatingSurface: string
    furnace: {
      type: FurnaceType
      dimensions: Partial<FurnaceDimensions>
    }

    freeLengthWithoutStaysOrTube: string

    mirror: {
      thickness: string
      diameter: string
    }

    body: {
      thickness: string
      diameter: string
      length: string

      material: BoilerBodyMaterial
      hasCertificateOfManufacturer: boolean
    }

    tube: {
      quantity: string
      diameter: string
      length: string
      thickness: string

      material: BoilerTubeMaterial
      hasCertificateOfManufacturer: boolean

      isNaturalOrForced: boolean
    }

    quantityOfSafetyFuse: string
  }

  examinationsPerformed: {
    tests: BoilerTableTests
    observations?: string

    record: Document[]
    book: Document[]
  }

  externalExaminationsPerformed: {
    tests: BoilerTableTests
    observations?: string

    plateIdentification: Document[]
    boiler: Document[]

    extraPhotos?: Document[]
  }

  internalExaminationsPerformed: {
    tests: BoilerTableTests
    observations?: string

    tubes: Document[]
    furnace: Document[]

    internalBoiler?: Document[]
    extraPhotos?: Document[]
  }

  localInstallationExaminationsPerformed: {
    tests: BoilerTableTests
    observations?: string

    boilerHouse: Document[]
  }

  pressureGaugeCalibration: {
    calibrationOrderNumber: string
    mark: string

    diameter: string
    capacity: string

    photos: Document[]

    tests: BoilerTableTests
    observations?: string
  }

  injectorGauge: {
    serialNumber: string
    mark: string
    diameter: string

    fuel: InjectorFuelType

    photos: Document[]
    tests: BoilerTableTests
    observations?: string
  }

  powerSupply: {
    bombs: Bomb[]

    tests: BoilerTableTests
    observations?: string
  }

  calibrationOfTheLevelIndicatorAssembly: {
    tests: BoilerTableTests
    observations?: string

    mark: string
    glass: {
      diameter: string
      length: string
    }

    photos: Document[]
  }

  safetyValveGauge: {
    quantity: string
    valves: Valve[]

    photos: Document[]

    isThereSafetyValveRedundancy: boolean
    observations?: string
  }

  gaugeOfElectricOrElectronicControlDevicesAndCommands: {
    photos: Document[]

    tests: BoilerTableTests
    observations?: string
  }

  waterQuality: {
    photos: Document[]

    tests: BoilerTableTests
    ph: string
    observations?: string
  }

  bottomDischargeSystemChecks: {
    photos: Document[]

    tests: BoilerTableTests
    observations?: string
  }

  hydrostaticTest: {
    pressure: string
    duration: string
    procedure: string

    tests: BoilerTableTests
    observations?: string
  }

  accumulationTest: {
    pressure: string
    duration: string

    tests: BoilerTableTests
    observations?: string
  }

  ultrasoundTests: {
    bodyExaminationA: BoilerUltraSoundExam & {
      isRegularizedAccordingToASME1: boolean
    }

    bodyExaminationB: BoilerUltraSoundExam
    bodyExaminationC: BoilerUltraSoundExam
    bodyExaminationD: BoilerUltraSoundExam
  }

  pmta: {
    canBeMaintained: boolean

    mustBeIncreasedTo: string
    mustBeDecreasedTo: string

    observations?: string
  }

  conclusions: {
    deadlineForNextInspection: string

    nrItemsThatNotBeingMet: BoilerNrToAdd[]
    immediateMeasuresNecessary: string
    necessaryRecommendations: string

    canBeOperateNormally: boolean
  }

  // internal fields
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string

  companyOfUser: string

  id: string
}

export type PartialBoilerInspection = Partial<BoilerInspection>
