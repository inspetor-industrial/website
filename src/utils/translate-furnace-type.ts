import type { FurnaceType } from '@inspetor/@types/models/boiler-inspection'

export function translateFurnaceType(type: FurnaceType) {
  switch (type) {
    case 'refractory':
      return 'Refratária'
    case 'cooled':
      return 'Refrigerada'
    case 'waterTube':
      return 'Aquatubular'
  }
}
