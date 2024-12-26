export const professions = [
  'engenheiro (a)',
  'técnico (a)',
  'secretário (a)',
  'administrador (a)',
] as const

export const professionOptions = professions.map((profession) => ({
  label: profession,
  value: profession,
}))
