'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentField } from '@inspetor/components/document-field'
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
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore } from '@inspetor/lib/firebase/client'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import {
  addDoc,
  collection,
  getCountFromServer,
  query,
} from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useProgress } from 'react-transition-progress'
import { z } from 'zod'

const schema = z.object({
  type: z.string().nonempty("O campo 'type' não pode estar vazio."),
  manufacturer: z
    .string()
    .nonempty("O campo 'manufacturer' não pode estar vazio."),
  serialNumber: z
    .string()
    .nonempty("O campo 'serialNumber' não pode estar vazio."),
  certificateNumber: z
    .string()
    .nonempty("O campo 'certificateNumber' não pode estar vazio."),
  validationDate: z.number().refine((val) => !isNaN(val), {
    message: "O campo 'validationDate' deve ser um número válido.",
  }),
  documents: z
    .array(
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
    )
    .min(1, 'A lista de documentos deve conter pelo menos um arquivo.'),
})

type Schema = z.infer<typeof schema>

export function InstrumentForm() {
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

  async function handleRegisterClient({
    certificateNumber,
    documents,
    manufacturer,
    serialNumber,
    type,
    validationDate,
  }: Schema) {
    try {
      const serialNumberAndManufactory = `${serialNumber}${manufacturer}`
      const substrings = generateSubstrings(serialNumberAndManufactory)

      const coll = collection(firestore, firebaseModels.instruments)
      const total = await getCountFromServer(query(coll))

      await addDoc(coll, {
        certificateNumber,
        documents,
        manufacturer,
        serialNumber,
        type,
        validationDate,
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        rowNumber: total.data().count + 1,
        status: appConfigs.firebase.models.status.active,
        createdBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        companyOfUser: session.data?.user?.companyId ?? '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      toast({
        title: 'Instrumento adicionado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/instruments`)
    } catch {
      toast({
        title: 'Falha ao adicionar instrumento!',
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
          name="type"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard-manometer">
                      Manômetro Padrão
                    </SelectItem>
                    <SelectItem value="ultrasonic-thickness-gauge">
                      Medidor de Espessura Ultrassônico
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
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fabricante</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome do fabricante.." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="certificateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° do certificado</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Validade Calibração Padrão</FormLabel>
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
          name="documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentos</FormLabel>
              <FormControl>
                <DocumentField
                  baseFolderToUpload="instruments"
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
