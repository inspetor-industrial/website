import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale(ptBR)
dayjs.extend(relativeTime)

export const dayjsApi = dayjs
