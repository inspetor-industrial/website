'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Client } from '@inspetor/@types/models/clients'
import { Combobox } from '@inspetor/components/combobox'
import { DatePicker } from '@inspetor/components/date-picker'
import { Button } from '@inspetor/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { Textarea } from '@inspetor/components/ui/textarea'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { getSchedule } from '@inspetor/http/firebase/schedule/get-schedule'
import { firestore } from '@inspetor/lib/firebase/client'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import { normalizeText } from '@inspetor/utils/normalize-text'
import { useQuery } from '@tanstack/react-query'
import {
  and,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useProgress } from 'react-transition-progress'
import { z } from 'zod'

const schema = z.object({
  service: z.enum(
    [
      'boiler-inspection',
      'integrity-inspection',
      'pipe-inspection',
      'pressure-vessel-inspection',
      'automotive-elevator-inspection',
      'fuel-tanks-inspection',
      'safety-valve-calibration',
      'manometer-calibration',
    ],
    {
      errorMap: () => ({ message: 'Selecione um serviço válido.' }),
    },
  ),
  responsible: z.string().nonempty('O responsável é obrigatório.'),
  local: z.string().nonempty('O local é obrigatório.'),
  client: z.string().nonempty('O cliente é obrigatório.'),
  date: z
    .number({
      required_error: 'A data é obrigatória.',
    })
    .refine((value) => value > 0, {
      message: 'A data é obrigatória.',
    }),
  hour: z.string().nonempty('O horário é obrigatório.'),
  comments: z.string().nonempty('Os comentários são obrigatórios.'),
})

type Schema = z.infer<typeof schema>

type ScheduleFormViewProps = {
  isDetail?: boolean
}

export function ScheduleForm({ isDetail = false }: ScheduleFormViewProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()
  const { scheduleId } = useParams<{ scheduleId: string }>()

  const { isPending: isLoadingSchedule } = useQuery({
    queryKey: ['schedules', scheduleId],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const schedule = await getSchedule(scheduleId)

      if (!schedule) {
        toast({
          title: 'Agendamento não encontrado!',
          variant: 'destructive',
        })

        startProgressBar()
        router.push('/dashboard/schedules')
        return null
      }

      form.reset({
        client: `${schedule.client.id}|${schedule.client.name}`,
        comments: schedule.comments,
        date: Number(schedule.scheduledAt),
        hour: new Date(schedule.scheduledAt).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        local: schedule.local,
        responsible: schedule.responsible,
        service: schedule.service as any,
      })
      return schedule
    },
  })

  const mustBeDisabled =
    isLoadingSchedule || form.formState.isSubmitting || isDetail

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  function handleLoadEditAction() {
    startProgressBar()
    router.push(`/dashboard/schedules/${scheduleId}`)
  }

  async function getClients(params: any) {
    const { page, filters, companyId } = params
    const coll = collection(firestore, firebaseModels.clients)
    const q = query(
      coll,
      and(
        where('rowNumber', '>=', (page - 1) * appConfigs.limitOfQueries),
        where('search', 'array-contains-any', [
          normalizeText(filters.search) || appConfigs.firestore.emptyString,
        ]),
        where(
          appConfigs.firestore.permissions.byCompanyPropertyName,
          '==',
          companyId,
        ),
      ),
      orderBy('rowNumber'),
      limit(appConfigs.limitOfQueries),
    )

    const clients = await getDocs(q)

    return clients.docs.map((doc) => {
      const data = doc.data() as Client
      return {
        label: data.name,
        value: `${doc.id}|${data.name}`,
      }
    })
  }

  async function handleRegisterClient({
    client,
    comments,
    date,
    hour,
    local,
    responsible,
    service,
  }: Schema) {
    try {
      const [clientId, clientName] = client.split('|')
      const scheduledAt = new Date(date)
      const [hourPart, minutePart] = hour.split(':')
      scheduledAt.setHours(Number(hourPart))
      scheduledAt.setMinutes(Number(minutePart))

      const substrings = generateSubstrings(clientName)
      const coll = collection(firestore, firebaseModels.schedules)
      const docRef = doc(coll, scheduleId)

      await updateDoc(docRef, {
        clientId,
        client: {
          id: clientId,
          name: clientName,
        },
        scheduledAt: scheduledAt.getTime(),
        comments,
        local,
        responsible,
        service,
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        status: appConfigs.firebase.models.status.active,
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedAt: Date.now(),
      })

      toast({
        title: 'Agendamento atualizado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/schedules`)
    } catch {
      toast({
        title: 'Falha ao tentar atualizar!',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegisterClient)}
        className="mt-10 grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="service"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Serviço</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger disabled={mustBeDisabled}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boiler-inspection">
                      Inspeção de Caldeiras
                    </SelectItem>
                    <SelectItem value="integrity-inspection">
                      Inspeção de Integridade
                    </SelectItem>
                    <SelectItem value="pipe-inspection">
                      Inspeção de Tubulações
                    </SelectItem>
                    <SelectItem value="pressure-vessel-inspection">
                      Inspeção de Vasos de Pressão
                    </SelectItem>
                    <SelectItem value="automotive-elevator-inspection">
                      Inspeção de Elevadores Automotivos
                    </SelectItem>
                    <SelectItem value="fuel-tanks-inspection">
                      Inspeção de Tanques de Combustível
                    </SelectItem>
                    <SelectItem value="safety-valve-calibration">
                      Calibração de Válvulas de Segurança
                    </SelectItem>
                    <SelectItem value="manometer-calibration">
                      Calibração de Manômetros
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={mustBeDisabled}
                  placeholder="Digite o nome do responsável.."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Combobox
                  entityKey="client"
                  onChange={field.onChange}
                  value={field.value}
                  queryFn={getClients}
                  disabled={mustBeDisabled}
                  // label="Selecione um cliente..."
                  triggerClassName="h-10 !bg-inspetor-gray-300 hover:!bg-inspetor-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="local"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input {...field} disabled={mustBeDisabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={mustBeDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário</FormLabel>
              <FormControl>
                <Input {...field} type="time" disabled={mustBeDisabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Comentários</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={mustBeDisabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex justify-end space-x-4 mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={handleGoBack}
            disabled={form.formState.isSubmitting}
          >
            Voltar
          </Button>
          <Button
            variant="inspetor-blue"
            type={isDetail ? 'button' : 'submit'}
            onClick={isDetail ? handleLoadEditAction : undefined}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isDetail ? (
              'Editar'
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
