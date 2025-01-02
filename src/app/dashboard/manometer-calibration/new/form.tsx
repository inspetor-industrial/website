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
import { firestore } from '@inspetor/lib/firebase/client'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import { getCertificateNumber } from '@inspetor/utils/get-certificate-number'
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
import { Fragment, useMemo, useRef } from 'react'
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

export function ManometerCalibrationForm() {
  const certificateNumber = useMemo(() => `VS ${getCertificateNumber()}`, [])
  const tableTestRef = useRef<TableTestsRef | null>(null)

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      certificateNumber,
    },
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
      const total = await getCountFromServer(query(coll))

      await addDoc(coll, {
        calibrationDate,
        certificateNumber,
        observations,
        hirer: {
          id: hirerId,
          name: hirerName,
          cnpjOrCpf: hirerCnpjOrCpf,
        },
        instrument: {
          id: instrumentId,
          serialNumber: instrumentSerialNumber,
        },
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
        rowNumber: total.data().count + 1,
        createdBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        companyOfUser: session.data?.user?.companyId ?? '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      toast({
        title: 'Manômetro adicionado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/manometer-calibration`)
    } catch (error) {
      toast({
        title: 'Falha ao adicionar manômetro!',
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
                    <Input {...field} value={certificateNumber} readOnly />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Select {...field} onValueChange={field.onChange}>
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
                    <Input {...field} />
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
                    <Select {...field} onValueChange={field.onChange}>
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
                    <InputWithSuffix suffix={units.kgfPerCm2} {...field} />
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
                    <InputWithSuffix suffix={units.kgfPerCm2} {...field} />
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
                    <Textarea {...field} />
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
                      ref={tableTestRef}
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
                    <Input {...field} />
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
                    <Select {...field} onValueChange={field.onChange}>
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
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Cadastrar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
