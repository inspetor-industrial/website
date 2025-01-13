import locale from 'antd/locale/pt_BR'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale(ptBR)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)

export const defaultLocaleForAntd = locale
export const defaultLocale = ptBR
export const defaultLocalName = 'pt-br'

export const dayjsApi = dayjs
