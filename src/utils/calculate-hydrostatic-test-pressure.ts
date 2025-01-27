export const VALUE_TO_CALCULATE_HYDROSTATIC_PRESSURE = 1.5

export function calculateHydrostaticTestPressure(value: number) {
  return (value * VALUE_TO_CALCULATE_HYDROSTATIC_PRESSURE).toFixed(2)
}
