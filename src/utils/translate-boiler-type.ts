import type { BoilerType } from '@inspetor/@types/models/boiler-inspection'

export function translateBoilerType(type: BoilerType) {
  switch (type) {
    case 'fireTubeHorizontal':
      return 'Fogo tubular horizontal'
    case 'fireTubeVertical':
      return 'Fogo tubular vertical'
    case 'waterTubeHorizontal':
      return 'Aquatubular horizontal'
    case 'waterTubeVertical':
      return 'Aquatubular vertical'
    case 'mixed':
      return 'Mista'
  }
}
