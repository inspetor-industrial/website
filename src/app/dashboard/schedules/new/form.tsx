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
import { firestore } from '@inspetor/lib/firebase/client'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import { normalizeText } from '@inspetor/utils/normalize-text'
import {
  addDoc,
  and,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

export function ScheduleForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()

  function handleGoBack() {
    startProgressBar()
    router.back()
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
      const total = await getCountFromServer(query(coll))

      await addDoc(coll, {
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
        rowNumber: total.data().count + 1,
        status: appConfigs.firebase.models.status.active,
        createdBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      toast({
        title: 'Serviço agendado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/schedules`)
    } catch {
      toast({
        title: 'Falha ao tentar agendar!',
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
                  <SelectTrigger>
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
                <Input {...field} />
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
                <DatePicker value={field.value} onChange={field.onChange} />
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
                <Input {...field} type="time" />
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
                <Textarea {...field} />
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
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Agendar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
