'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Client } from '@inspetor/@types/models/clients'
import { Instrument } from '@inspetor/@types/models/instruments'
import { Combobox } from '@inspetor/components/combobox'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
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
import { MonthPicker } from '@inspetor/components/ui/month-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { Separator } from '@inspetor/components/ui/separator'
import { Switch } from '@inspetor/components/ui/switch'
import { Textarea } from '@inspetor/components/ui/textarea'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { units } from '@inspetor/constants/units'
import { toast } from '@inspetor/hooks/use-toast'
import { getValve } from '@inspetor/http/firebase/valve/get-valve'
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
import { Fragment, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useProgress } from 'react-transition-progress'
import { z } from 'zod'

import { FormGroup } from '../components/form-group'

const schema = z.object({
  certificateNumber: z.string({
    required_error: 'Preencha o número do certificado',
  }),
  seal: z
    .string({
      required_error: 'O campo de lacre é obrigatório o preenchimento',
    })
    .max(16),
  hirer: z.string({
    required_error: 'O campo de contratante é obrigatório o preenchimento',
  }),
  serialNumber: z
    .string({
      required_error:
        'O campo de número serial da válvula é obrigatório o preenchimento',
    })
    .max(50),
  nominalGauge: z.string({
    required_error: 'O campo de bitola nominal é obrigatório o preenchimento',
  }),
  manufacturer: z
    .string({
      required_error: 'O campo de fabricante é obrigatório o preenchimento',
    })
    .max(100),
  operation: z.string({
    required_error: 'O campo de operação é obrigatório o preenchimento',
  }),

  type: z.string().default('CONVENCIONAL'),
  tag: z
    .string({
      required_error: 'O campo de tag é obrigatório o preenchimento',
    })
    .max(24),

  lever: z
    .boolean({
      required_error: 'É obrigatório preencher o campo de alavanca',
    })
    .optional()
    .default(false),
  workingFluid: z.string({
    required_error:
      'O campo de fluído de trabalho é obrigatório o preenchimento',
  }),
  workingRange: z.string({
    required_error:
      'O campo de faixa de trabalho é obrigatório o preenchimento',
  }),

  instrument: z.string({
    required_error: 'É obrigatório escolher o instrumento',
  }),

  temperatureParameter: z.string({
    required_error: 'O campo de temperatura é obrigatório o preenchimento',
  }),
  openingPressureParameter: z.string({
    required_error:
      'O campo de pressão de abertura é obrigatório o preenchimento',
  }),
  closingPressureParameter: z.string({
    required_error:
      'O campo de pressão de fechamento é obrigatório o preenchimento',
  }),

  openingPressureTest: z
    .string({
      required_error:
        'O campo de pressão de abertura de teste é obrigatório o preenchimento',
    })
    .optional(),
  allowablePressure: z
    .string({
      required_error:
        'O campo de pressão admissível é obrigatório o preenchimento',
    })
    .optional(),

  p1: z.string({
    required_error: 'O campo P1 é obrigatório o preenchimento',
  }),
  p2: z.string({
    required_error: 'O campo P2 é obrigatório o preenchimento',
  }),
  p3: z.string({
    required_error: 'O campo P3 é obrigatório o preenchimento',
  }),

  testDescription: z.string({
    required_error:
      'É obrigatório que você descreva o procedimento do teste realizado',
  }),
  test1: z.string({
    required_error: 'É obrigatório dizer se o teste 01 passou',
  }),
  test2: z.string({
    required_error: 'É obrigatório dizer se o teste 02 passou',
  }),
  test3: z.string({
    required_error: 'É obrigatório dizer se o teste 03 passou',
  }),

  calibrationDate: z.number({
    required_error:
      'É obrigatório que o campo da data de calibração seja preenchida',
  }),
  nextCalibrationDate: z.number({
    required_error:
      'É obrigatório que o campo da data da próxima calibração seja preenchida',
  }),

  status: z.string({
    required_error: 'É obrigatório que seja preenchido se foi aprovado ou não',
  }),
})

type Schema = z.infer<typeof schema>

const defaultValveType = 'CONVENCIONAL'

type ValveCalibrationFormProps = {
  isDetail?: boolean
}

export function ValveCalibrationForm({
  isDetail = false,
}: ValveCalibrationFormProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    disabled: isDetail,
  })

  const { valveId } = useParams<{ valveId: string }>()

  const { isPending: isLoadingValve } = useQuery({
    queryKey: ['valves', valveId],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const valve = await getValve(valveId)

      if (!valve) {
        toast({
          title: 'Válvula não encontrado!',
          variant: 'destructive',
        })

        startProgressBar()
        router.push('/dashboard/valves')
        return null
      }

      form.reset({
        hirer: `${valve.hirer.id}|${valve.hirer.name}|${valve.hirer.cnpjOrCpf}`,
        instrument: `${valve.instrument.id}|${valve.instrument.serialNumber}`,
        certificateNumber: valve.certificateNumber,
        seal: valve.seal,
        serialNumber: valve.serialNumber,
        nominalGauge: valve.nominalGauge,
        manufacturer: valve.manufacturer,
        operation: valve.operation,
        type: valve.type,
        tag: valve.tag,
        lever: valve.lever,
        workingFluid: valve.workingFluid,
        workingRange: valve.workingRange,
        temperatureParameter: valve.temperatureParameter,
        openingPressureParameter: valve.openingPressureParameter,
        closingPressureParameter: valve.closingPressureParameter,
        openingPressureTest: valve.openingPressureParameter,
        allowablePressure: valve.allowablePressure,
        p1: valve.p1,
        p2: valve.p2,
        p3: valve.p3,
        testDescription: valve.testDescription,
        test1: valve.test1,
        test2: valve.test2,
        test3: valve.test3,
        calibrationDate: valve.calibrationDate,
        nextCalibrationDate: valve.nextCalibrationDate,
        status: valve.status,
      })
      return valve
    },
  })

  const openingPressure = form.watch('openingPressureParameter')
  const allowablePressure = useMemo(() => {
    const openingPressureNumber = eval(openingPressure || '0')
    const allowedInterval = openingPressureNumber * 0.03 // 3% of opening pressure

    const min = openingPressureNumber - allowedInterval
    const max = openingPressureNumber + allowedInterval

    return `${min.toFixed(2)} à ${max.toFixed(2)}`
  }, [openingPressure])

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()

  const mustBeDisabled =
    form.formState.isSubmitting || isDetail || isLoadingValve

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  function handleLoadEditAction() {
    startProgressBar()
    router.push(`/dashboard/valve-calibration/${valveId}`)
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
        value: `${doc.id}|${data.name}|${data.cnpjOrCpf}`,
      }
    })
  }

  async function getInstruments(params: any) {
    const { page, filters, companyId } = params
    const coll = collection(firestore, firebaseModels.instruments)
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

    const instruments = await getDocs(q)

    return instruments.docs.map((doc) => {
      const data = doc.data() as Instrument
      return {
        label: data.serialNumber,
        value: `${doc.id}|${data.serialNumber}`,
      }
    })
  }

  async function handleRegisterClient({
    calibrationDate,
    certificateNumber,
    closingPressureParameter,
    hirer,
    instrument,
    lever,
    manufacturer,
    nextCalibrationDate,
    nominalGauge,
    operation,
    openingPressureParameter,
    p1,
    p2,
    p3,
    seal,
    serialNumber,
    status,
    tag,
    test1,
    test2,
    test3,
    testDescription,
    type,
    workingFluid,
    workingRange,
    temperatureParameter,
  }: Schema) {
    try {
      const [hirerId, hirerName, hirerCnpjOrCpf] = hirer.split('|')
      const [instrumentId, instrumentSerialNumber] = instrument.split('|')

      const certificateNumberAndManufactory = `${certificateNumber}${hirerName}`
      const substrings = generateSubstrings(certificateNumberAndManufactory)

      const coll = collection(firestore, firebaseModels.valves)
      const docRef = doc(coll, valveId)

      await updateDoc(docRef, {
        calibrationDate,
        certificateNumber,
        closingPressureParameter,
        hirer: {
          id: hirerId,
          name: hirerName,
          cnpjOrCpf: hirerCnpjOrCpf,
        },
        instrument: {
          id: instrumentId,
          serialNumber: instrumentSerialNumber,
        },
        lever,
        manufacturer,
        nextCalibrationDate,
        nominalGauge,
        operation,
        openingPressureParameter,
        p1,
        p2,
        p3,
        seal,
        serialNumber,
        status,
        tag,
        test1,
        test2,
        test3,
        testDescription,
        type,
        workingFluid,
        workingRange,
        temperatureParameter,
        allowablePressure,
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedAt: Date.now(),
      })

      toast({
        title: 'Válvula adicionado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/valve-calibration`)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Falha ao adicionar válvula!',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegisterClient)}
        className="mt-10 flex flex-col gap-8"
      >
        <FormGroup title="Dados preliminares">
          <Fragment>
            <FormField
              control={form.control}
              name="certificateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° do certificado</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lacre</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hirer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contratante</FormLabel>
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
          </Fragment>
        </FormGroup>

        <FormGroup title="Descrição do instrumento">
          <Fragment>
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° de série</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nominalGauge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bitola nominal</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fabricante</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operação</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={mustBeDisabled}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security">Segurança</SelectItem>
                        <SelectItem value="relief">Alívio</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={mustBeDisabled}
                      value={defaultValveType}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </FormGroup>

        <FormGroup title="Dados Mecânicos - Válvula de Segurança / Alívio">
          <Fragment>
            <FormField
              control={form.control}
              name="lever"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alavanca</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={mustBeDisabled}
                      />

                      <span>{field.value ? 'Sim' : 'Não'}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workingFluid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fluído de trabalho</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={mustBeDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">Água</SelectItem>
                        <SelectItem value="steam">Vapor</SelectItem>
                        <SelectItem value="ammonia">Amônia</SelectItem>
                        <SelectItem value="others">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workingRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faixa de trabalho</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </FormGroup>

        <FormGroup title="Instrumento padrão utilizado">
          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrumento</FormLabel>
                <FormControl>
                  <Combobox
                    entityKey="instrument"
                    onChange={field.onChange}
                    value={field.value}
                    queryFn={getInstruments}
                    disabled={mustBeDisabled}
                    // label="Selecione um cliente..."
                    triggerClassName="h-10 !bg-inspetor-gray-300 hover:!bg-inspetor-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormGroup>

        <FormGroup title="Parâmetros de calibração">
          <Fragment>
            <FormField
              control={form.control}
              name="temperatureParameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.celsius}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openingPressureParameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pressão de abertura</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closingPressureParameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pressão de fechamento</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </FormGroup>

        <FormGroup title="Teste de Aferição">
          <Fragment>
            <FormField
              control={form.control}
              name="openingPressureParameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pressão de abertura</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowablePressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pressão de Admissível</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      value={
                        allowablePressure.includes('0.00 à 0.00')
                          ? field.value
                          : allowablePressure
                      }
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="p1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>P1</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="p2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>P2</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="p3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>P3</FormLabel>
                  <FormControl>
                    <InputWithSuffix
                      suffix={units.kgfPerCm2}
                      {...field}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </FormGroup>

        <FormGroup gridCols={4} title="Teste de estanqueidade">
          <Fragment>
            <FormField
              control={form.control}
              name="testDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teste realizado</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="test1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teste 01</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={mustBeDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="disapproved">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="test2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teste 02</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={mustBeDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="disapproved">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="test3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teste 03</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={mustBeDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="disapproved">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </FormGroup>

        <Separator orientation="horizontal" className="bg-zinc-600" />

        <FormGroup>
          <Fragment>
            <FormField
              control={form.control}
              name="calibrationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de calibração</FormLabel>
                  <FormControl>
                    <MonthPicker
                      selectedMonth={
                        field.value ? new Date(field.value) : undefined
                      }
                      onMonthSelect={(date) => field.onChange(date.getTime())}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextCalibrationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da próxima calibração</FormLabel>
                  <FormControl>
                    <MonthPicker
                      selectedMonth={
                        field.value ? new Date(field.value) : undefined
                      }
                      onMonthSelect={(date) => field.onChange(date.getTime())}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={mustBeDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="disapproved">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </FormGroup>

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
