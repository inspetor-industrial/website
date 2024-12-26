'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { stateOptions, states } from '@inspetor/constants/states'
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
  state: z
    .string({
      required_error: 'O estado é obrigatório.',
    })
    .refine((val) => states.includes(val), {
      message: 'O estado deve ser um nome válido de estado brasileiro.',
    }),
  city: z
    .string({
      required_error: 'A cidade é obrigatória.',
    })
    .min(3, { message: 'O nome da cidade deve ter pelo menos 3 caracteres.' })
    .regex(/^[a-zA-ZÀ-ú\s]+$/, {
      message: 'O nome da cidade deve conter apenas letras.',
    }),
  name: z
    .string({
      required_error: 'O nome é obrigatório.',
    })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cnpjOrCpf: z
    .string({
      required_error: 'O CNPJ ou CPF é obrigatório.',
    })
    .regex(/^\d{11}$|^\d{14}$/, {
      message: 'O CNPJ deve ter 14 dígitos ou o CPF deve ter 11 dígitos.',
    }),
  phoneNumber: z
    .string({
      required_error: 'O número de telefone é obrigatório.',
    })
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
      message:
        'O número de telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.',
    }),
  street: z
    .string({
      required_error: 'O nome da rua é obrigatório.',
    })
    .min(3, { message: 'O nome da rua deve ter pelo menos 3 caracteres.' }),
  cep: z
    .string({
      required_error: 'O CEP é obrigatório.',
    })
    .regex(/^\d{5}-\d{3}$/, {
      message: 'O CEP deve estar no formato XXXXX-XXX.',
    }),
  stateInscription: z
    .string({
      required_error: 'A inscrição estadual é obrigatória.',
    })
    .regex(/^\d{9,12}$/, {
      message:
        'A inscrição estadual deve conter entre 9 e 12 dígitos numéricos.',
    }),
})

type Schema = z.infer<typeof schema>

export function RegisterClientForm() {
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
    city,
    state,
    street,
    ...rest
  }: Schema) {
    try {
      if (session.data?.user?.companyId === 'unknown') {
        toast({
          title: 'AVISO!',
          description:
            'Usuário sem empresa associada. Contate os adiministradores associar uma empresa e ajustar o usuário criado, caso contrário não será possível realizar qualquer ação no sistema.',
          variant: 'destructive',
        })

        return
      }

      const substrings = generateSubstrings(rest.name)

      const coll = collection(firestore, firebaseModels.clients)
      const total = await getCountFromServer(query(coll))

      await addDoc(coll, {
        ...rest,
        address: {
          city,
          state,
          street,
        },
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        rowNumber: total.data().count + 1,
        createdBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        [appConfigs.firestore.permissions.byCompanyPropertyName]:
          session.data?.user?.companyId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      toast({
        title: 'Cliente registrado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/clients`)
    } catch {
      toast({
        title: 'Falha ao registrar o cliente!',
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
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome da cidade..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o nome da empresa do cliente.."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnpjOrCpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ/CPF</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Exemplo: 12345678901 (CPF) ou 12345678000199 (CNPJ)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stateInscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inscrição Estadual</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exemplo: 123456789" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exemplo: Rua das Flores" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exemplo: 12345-678" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exemplo: (11) 99999-9999" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex justify-end space-x-4">
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
              'Registrar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
