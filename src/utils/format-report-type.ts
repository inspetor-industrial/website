export function formatReportType(type: string) {
  switch (type) {
    case 'boiler':
      return 'Relatório de Caldeira'
    case 'valve':
      return 'Relatório de Válvula'
    case 'manometer':
      return 'Relatório de Manômetro'
    default:
      return 'Relatório desconhecido'
  }
}
