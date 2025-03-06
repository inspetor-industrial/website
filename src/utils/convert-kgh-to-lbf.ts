export const VALUE_TO_CONVERT_KGF_TO_LBF = 14.22

export function convertKgfToLbf(value: number) {
  return (value * VALUE_TO_CONVERT_KGF_TO_LBF).toFixed(2)
}
