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
import { Textarea } from '@inspetor/components/ui/textarea'
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { professionOptions, professions } from '@inspetor/constants/professions'
import { toast } from '@inspetor/hooks/use-toast'
import { auth, firestore } from '@inspetor/lib/firebase/client'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
import { generateSubstrings } from '@inspetor/utils/generate-substrings'
import { useQuery } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  query,
  setDoc,
} from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useProgress } from 'react-transition-progress'
import { z } from 'zod'

const schema = z
  .object({
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
    password: z
      .string({ required_error: 'A senha é obrigatória.' })
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
      .refine((value) => value.trim().length > 0, {
        message: 'A senha não pode conter apenas espaços em branco.',
      }),
    confirmPassword: z.string({
      required_error: 'A confirmação de senha é obrigatória.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'A confirmação de senha deve ser igual à senha.',
  })

type Schema = z.infer<typeof schema>

export function AddNewUser() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()

  const { isPending, data: companyOptions } = useQuery<
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

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  async function handleRegisterClient({
    name,
    company,
    crea,
    email,
    profession,
    username,
    specialty = '',
    nationalRegister,
    password,
  }: Schema) {
    try {
      const userAuth = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )

      const substrings = generateSubstrings(name)
      const emailSubstrings = generateSubstrings(email, false)

      const coll = collection(firestore, firebaseModels.users)
      const total = await getCountFromServer(query(coll))

      const userDocRef = doc(firestore, firebaseModels.users, userAuth.user.uid)
      await setDoc(userDocRef, {
        name,
        companyId: company,
        crea,
        email,
        profession,
        username,
        specialty,
        nationalRegister,
        role: 'user',
        authUserId: userAuth.user.uid,
        [appConfigs.firestore.searchProperty]: Array.from(substrings).concat(
          Array.from(emailSubstrings),
        ),
        rowNumber: total.data().count + 1,
        createdBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      toast({
        title: 'Usuário adicionado com sucesso!',
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
        title: 'Falha ao adicionar usuário!',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome do usuário.." />
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
                <Input {...field} placeholder="Digite o username.." />
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
                <Input {...field} placeholder="Digite o email.." />
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
                  <SelectTrigger className="">
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
                <Input {...field} placeholder="Digite registro nacional.." />
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
                <Input {...field} placeholder="Digite crea.." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="" isLoading={isPending}>
                      <SelectValue
                        placeholder={
                          isPending
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
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite a senha.."
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirme a senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="confirme a senha.."
                  type="password"
                />
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
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Adicionar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
