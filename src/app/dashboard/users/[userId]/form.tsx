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
import { Textarea } from '@inspetor/components/ui/textarea'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { professionOptions, professions } from '@inspetor/constants/professions'
import { toast } from '@inspetor/hooks/use-toast'
import { getUser } from '@inspetor/http/firebase/user/get-user'
import { firestore } from '@inspetor/lib/firebase/client'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import { useQuery } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useProgress } from 'react-transition-progress'
import { z } from 'zod'

const schema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(1, { message: 'O nome não pode ser vazio.' }),
  nationalRegister: z
    .string({ required_error: 'O registro nacional é obrigatório.' })
    .regex(/^\d{11}$/, {
      message: 'O registro nacional deve conter exatamente 11 dígitos.',
    }),
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email({ message: 'O email deve ser válido.' }),
  company: z
    .string({ required_error: 'O nome da empresa é obrigatório.' })
    .min(1, { message: 'O nome da empresa não pode ser vazio.' }),
  profession: z.enum(professions, {
    required_error: 'A profissão é obrigatória.',
    invalid_type_error: 'A profissão selecionada é inválida.',
  }),
  crea: z
    .string({ required_error: 'O CREA é obrigatório.' })
    .min(1, { message: 'O CREA não pode ser vazio.' }),
  specialty: z.string().default('').optional(),
  username: z
    .string({ required_error: 'O nome de usuário é obrigatório.' })
    .min(3, {
      message: 'O nome de usuário deve ter pelo menos 3 caracteres.',
    }),
})

type Schema = z.infer<typeof schema>

type UserFormViewProps = {
  isDetail?: boolean
}

export function UserFormView({ isDetail }: UserFormViewProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()

  const { userId } = useParams<{ userId: string }>()

  const { isPending: isLoadingCompanies, data: companyOptions } = useQuery<
    { value: string; label: string }[]
  >({
    queryKey: ['companies'],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const coll = collection(firestore, firebaseModels.companies)
      const q = query(coll)

      const companies = await getDocs(q)

      return companies.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().name,
      }))
    },
  })

  const { isPending: isLoadingUser } = useQuery({
    queryKey: ['users', userId],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const user = await getUser(userId)

      if (!user) {
        toast({
          title: 'Usuário não encontrado!',
          variant: 'destructive',
        })

        startProgressBar()
        router.push('/dashboard/users')
        return null
      }

      form.reset({
        name: user.name,
        email: user.email,
        company: user.companyId,
        profession: user.profession,
        nationalRegister: user.nationalRegister,
        crea: user.crea,
        specialty: user.specialty,
        username: user.username,
      })
      return user
    },
    enabled: !isLoadingCompanies,
  })

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  function handleLoadEditAction() {
    startProgressBar()
    router.push(`/dashboard/users/${userId}`)
  }

  async function handleRegisterClient({
    name,
    company,
    crea,
    email,
    profession,
    nationalRegister,
    username,
    specialty = '',
  }: Schema) {
    try {
      const substrings = generateSubstrings(name)
      const emailSubstrings = generateSubstrings(email, false)

      const coll = collection(firestore, firebaseModels.users)
      const docRef = doc(coll, userId)

      await updateDoc(docRef, {
        name,
        email,
        companyId: company,
        profession,
        crea,
        specialty,
        nationalRegister,
        username,
        [appConfigs.firestore.searchProperty]: Array.from(substrings).concat(
          Array.from(emailSubstrings),
        ),
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedAt: Date.now(),
      })

      toast({
        title: 'Usuário atualizado com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/users`)
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === appConfigs.firebase.auth.clientErrors.emailAlreadyInUse
        ) {
          form.setError('email', {
            types: {
              validate: 'O email informado já está em uso.',
            },
            message: 'O email informado já está em uso.',
          })
        }
      }

      toast({
        title: 'Falha ao atualizar usuário!',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    }
  }

  if (isLoadingUser) {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o nome do usuário.."
                  disabled={isDetail}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o username.."
                  disabled={isDetail}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o email.." readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="" disabled={isDetail}>
                    <SelectValue
                      placeholder="Selecione a profissão..."
                      className="capitalize"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {professionOptions.map((profession) => (
                      <SelectItem
                        key={profession.value}
                        value={profession.value}
                        className="capitalize"
                      >
                        {profession.label}
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
          name="nationalRegister"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registro nacional</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite registro nacional.."
                  disabled={isDetail}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="crea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CREA</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite crea.."
                  disabled={isDetail}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className=""
                    isLoading={isLoadingCompanies}
                    disabled={isDetail}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingCompanies
                          ? 'Carregando as empresas...'
                          : 'Selecione a empresa...'
                      }
                      className="capitalize"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {companyOptions?.map((company) => (
                      <SelectItem
                        key={company.value}
                        value={company.value}
                        className="capitalize"
                      >
                        {company.label}
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
          name="specialty"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Especialidade (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva a especialidade do usuário.."
                  className="h-32"
                  disabled={isDetail}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex justify-end space-x-4 mt-10">
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
