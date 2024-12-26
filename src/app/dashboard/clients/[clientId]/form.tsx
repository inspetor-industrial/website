'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingResource } from '@inspetor/components/loading-resource'
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
import { getClient } from '@inspetor/http/firebase/client/get-client'
import { firestore } from '@inspetor/lib/firebase/client'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import { useQuery } from '@tanstack/react-query'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
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

type ClientFormViewProps = {
  isDetail?: boolean
}

export function ClientFormView({ isDetail }: ClientFormViewProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()

  const { clientId } = useParams<{ clientId: string }>()

  const { isPending } = useQuery({
    queryKey: ['clients', clientId],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const client = await getClient(clientId)

      if (!client) {
        toast({
          title: 'Cliente não encontrado!',
          variant: 'destructive',
        })

        startProgressBar()
        router.push('/dashboard/clients')
        return null
      }

      form.reset({
        cep: client?.cep,
        city: client?.address.city,
        cnpjOrCpf: client?.cnpjOrCpf,
        name: client?.name,
        phoneNumber: client?.phoneNumber,
        state: client?.address.state,
        stateInscription: client?.stateInscription,
        street: client?.address.street,
      })
      return client
    },
  })

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  function handleLoadEditAction() {
    startProgressBar()
    router.push(`/dashboard/clients/${clientId}`)
  }

  async function handleRegisterClient({
    city,
    state,
    street,
    ...rest
  }: Schema) {
    try {
      const substrings = generateSubstrings(rest.name)

      const coll = collection(firestore, firebaseModels.clients)
      const docRef = doc(coll, clientId)

      await updateDoc(docRef, {
        ...rest,
        address: {
          city,
          state,
          street,
        },
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedAt: Date.now(),
      })

      toast({
        title: 'Cliente atualizado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/clients`)
    } catch {
      toast({
        title: 'Falha ao atualizar o cliente!',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    }
  }

  if (isPending) {
    return (
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <LoadingResource />
      </div>
    )
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isDetail}
                >
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
                <Input
                  {...field}
                  disabled={isDetail}
                  placeholder="Digite o nome da cidade..."
                />
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
                  disabled={isDetail}
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
                  disabled={isDetail}
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
                <Input
                  {...field}
                  disabled={isDetail}
                  placeholder="Exemplo: 123456789"
                />
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
                <Input
                  {...field}
                  disabled={isDetail}
                  placeholder="Exemplo: Rua das Flores"
                />
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
                <Input
                  {...field}
                  disabled={isDetail}
                  placeholder="Exemplo: 12345-678"
                />
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
                <Input
                  {...field}
                  disabled={isDetail}
                  placeholder="Exemplo: (11) 99999-9999"
                />
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
