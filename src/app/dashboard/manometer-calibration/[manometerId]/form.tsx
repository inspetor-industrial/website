'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Client } from '@inspetor/@types/models/clients'
import { Instrument } from '@inspetor/@types/models/instruments'
import { Combobox } from '@inspetor/components/combobox'
import { DocumentField } from '@inspetor/components/document-field'
import { InputWithSuffix } from '@inspetor/components/input-with-suffix'
import { TableTests, TableTestsRef } from '@inspetor/components/table-tests'
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
import { Textarea } from '@inspetor/components/ui/textarea'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { units } from '@inspetor/constants/units'
import { toast } from '@inspetor/hooks/use-toast'
import { getManometer } from '@inspetor/http/firebase/manometer/get-manometer'
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
import { Fragment, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProgress } from 'react-transition-progress'
import { z } from 'zod'

import { FormGroup } from '../components/form-group'

const schema = z.object({
  observations: z
    .string({
      required_error: 'O campo de observações é obrigatório o preenchimento',
    })
    .optional()
    .default(''),
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
  manufacturer: z
    .string({
      required_error: 'O campo de fabricante é obrigatório o preenchimento',
    })
    .max(100),
  class: z.string({
    required_error: 'O campo de classe é obrigatório o preenchimento',
  }),

  scale: z.string({
    required_error: 'O campo de escala é obrigatório o preenchimento',
  }),

  dialDiameter: z.string({
    required_error:
      'O campo de diâmetro do mostrador é obrigatório o preenchimento',
  }),

  type: z.string().default('CONVENCIONAL'),
  tag: z
    .string({
      required_error: 'O campo de tag é obrigatório o preenchimento',
    })
    .max(24),

  instrument: z.string({
    required_error: 'É obrigatório escolher o instrumento',
  }),

  tableTests: z.array(
    z.object({
      rowId: z.string(),
      standardValue: z.string(),
      cycleOneAscending: z.string(),
      cycleOneDescending: z.string(),
      cycleTwoAscending: z.string(),
      cycleTwoDescending: z.string(),
    }),
  ),

  documents: z.array(
    z.object({
      name: z.string().nonempty("O campo 'name' não pode estar vazio."),
      downloadUrl: z.string().nonempty("O campo 'url' não pode estar vazio."),
      type: z.string().nonempty("O campo 'type' não pode estar vazio."),

      size: z.number(),

      createdAt: z.number().refine((val) => !isNaN(val), {
        message: "O campo 'createdAt' deve ser um número válido.",
      }),
      createdBy: z
        .string()
        .nonempty("O campo 'createdBy' não pode estar vazio."),
      updatedAt: z.number().refine((val) => !isNaN(val), {
        message: "O campo 'updatedAt' deve ser um número válido.",
      }),
      updatedBy: z
        .string()
        .nonempty("O campo 'updatedBy' não pode estar vazio."),

      id: z.string().nonempty("O campo 'id' não pode estar vazio."),
      companyOfUser: z
        .string()
        .nonempty("O campo 'companyOfUser' não pode estar vazio."),
    }),
  ),

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

type ManometerCalibrationFormProps = {
  isDetail?: boolean
}

export function ManometerCalibrationForm({
  isDetail = false,
}: ManometerCalibrationFormProps) {
  const tableTestsRef = useRef<TableTestsRef | null>(null)
  const [tableResetState, setTableResetState] = useState(false)

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    disabled: isDetail,
  })

  const { manometerId } = useParams<{ manometerId: string }>()

  const { isPending: isLoadingManometer } = useQuery({
    queryKey: ['manometers', manometerId],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const manometer = await getManometer(manometerId)

      if (!manometer) {
        toast({
          title: 'Manômetro não encontrado!',
          variant: 'destructive',
        })

        startProgressBar()
        router.push('/dashboard/manometer-calibration')
        return null
      }

      form.reset({
        hirer: `${manometer.hirer.id}|${manometer.hirer.name}|${manometer.hirer.cnpjOrCpf}`,
        instrument: `${manometer.instrument.id}|${manometer.instrument.serialNumber}`,
        certificateNumber: manometer.certificateNumber,
        seal: manometer.seal,
        serialNumber: manometer.serialNumber,
        manufacturer: manometer.manufacturer,
        dialDiameter: manometer.dialDiameter,
        class: manometer.class,
        scale: manometer.scale,
        observations: manometer.observations,
        documents: manometer.documents,
        tableTests: manometer.tableTests,
        type: manometer.type,
        tag: manometer.tag,
        calibrationDate: manometer.calibrationDate,
        nextCalibrationDate: manometer.nextCalibrationDate,
        status: manometer.status,
      })

      tableTestsRef.current?.reset()
      setTableResetState((prev) => !prev)
      return manometer
    },
  })

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()

  const mustBeDisabled =
    form.formState.isSubmitting || isDetail || isLoadingManometer

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  function handleLoadEditAction() {
    startProgressBar()
    router.push(`/dashboard/manometer-calibration/${manometerId}`)
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
    hirer,
    instrument,
    manufacturer,
    nextCalibrationDate,
    seal,
    serialNumber,
    status,
    tag,
    observations,
    class: manometerClass,
    dialDiameter,
    documents,
    scale,
    tableTests,
    type,
  }: Schema) {
    try {
      const [hirerId, hirerName, hirerCnpjOrCpf] = hirer.split('|')
      const [instrumentId, instrumentSerialNumber] = instrument.split('|')

      const certificateNumberAndManufactory = `${certificateNumber}${hirerName}`
      const substrings = generateSubstrings(certificateNumberAndManufactory)

      const coll = collection(firestore, firebaseModels.manometers)
      const docRef = doc(coll, manometerId)

      await updateDoc(docRef, {
        calibrationDate,
        certificateNumber,
        hirer: {
          id: hirerId,
          name: hirerName,
          cnpjOrCpf: hirerCnpjOrCpf,
        },
        instrument: {
          id: instrumentId,
          serialNumber: instrumentSerialNumber,
        },
        observations,
        manufacturer,
        nextCalibrationDate,
        seal,
        serialNumber,
        status,
        tag,
        class: manometerClass,
        dialDiameter,
        documents,
        scale,
        tableTests,
        type,
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedAt: Date.now(),
      })

      toast({
        title: 'Manômetro atualizado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/manometer-calibration`)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Falha ao adicionar manômetro!',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (tableTestsRef.current) {
      tableTestsRef.current.reset()
    }
  }, [isLoadingManometer, tableTestsRef, tableResetState])

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
                    <Input {...field} readOnly disabled={mustBeDisabled} />
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
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
                        <SelectItem value="analog">Analógico</SelectItem>
                        <SelectItem value="digital">Digital</SelectItem>
                      </SelectContent>
                    </Select>
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
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
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
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="b">B</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escala</FormLabel>
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
              name="dialDiameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diâmetro do mostrador</FormLabel>
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

        <FormGroup
          className="flex !flex-col-reverse"
          title="Parâmetros de calibração"
        >
          <Fragment>
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={mustBeDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto dos testes</FormLabel>
                  <FormControl>
                    <DocumentField
                      baseFolderToUpload="manometers"
                      accept="image/*"
                      placeholder="Selecione um documento"
                      onChange={field.onChange}
                      value={field.value}
                      disabled={mustBeDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tableTests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TableTests
                      value={field.value}
                      onChange={field.onChange}
                      disabled={mustBeDisabled}
                      isLoading={isLoadingManometer || !!field.value}
                      ref={tableTestsRef}
                    />
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
