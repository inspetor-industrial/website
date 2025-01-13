export const boilerInspectionType = {
  initial: 'Inicial',
  periodic: 'Periódica',
  extraordinary: 'Extraordinária',
} as const

export const boilerInspectionTypeOptions = Object.entries(
  boilerInspectionType,
).map(([key, value]) => ({
  label: value,
  value: key,
}))
