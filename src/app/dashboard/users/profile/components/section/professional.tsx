'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { profileAtom } from '@inspetor/atoms/profile'
import { Button } from '@inspetor/components/ui/button'
import { CardHeader, CardTitle } from '@inspetor/components/ui/card'
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
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { professionOptions, professions } from '@inspetor/constants/professions'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore } from '@inspetor/lib/firebase/client'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
import { cn } from '@inspetor/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore'
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  nationalRegister: z
    .string({ required_error: 'O registro nacional é obrigatório.' })
    .regex(/^\d{11}$/, {
      message: 'O registro nacional deve conter exatamente 11 dígitos.',
    }),
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
})

type Schema = z.infer<typeof schema>

export function ProfessionalSection() {
  const [currentSection] = useQueryState(
    'section',
    parseAsString.withDefault('personal'),
  )

  const [profile, setProfile] = useAtom(profileAtom)

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

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

  async function handleUpdateProfile(data: Schema) {
    try {
      const coll = collection(firestore, firebaseModels.users)
      const docRef = doc(coll, profile!.id)

      await updateDoc(docRef, {
        ...profile!,
        ...data,
        companyId: data.company,
        updatedAt: Date.now(),
        updatedBy: profile!.id,
      })

      setProfile({
        ...profile!,
        ...data,
        companyId: profile!.companyId,
        updatedAt: Date.now(),
        updatedBy: profile!.id,
      })

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso',
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (profile) {
      form.reset({
        nationalRegister: profile.nationalRegister,
        company: profile.companyId,
        profession: profile.profession,
        crea: profile.crea,
        specialty: profile.specialty,
      })
    }
  }, [form, profile])

  return (
    <section
      className={cn(
        'hidden flex-col',
        currentSection === 'professional' && 'flex',
      )}
    >
      <CardHeader className="px-0">
        <CardTitle>Informações Profissionais</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateProfile)}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissão</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-gray-100 border-gray-100">
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
                    variant="profile"
                    {...field}
                    placeholder="Digite registro nacional.."
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
                    variant="profile"
                    {...field}
                    placeholder="Digite crea.."
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
                      className="bg-gray-100 border-gray-100"
                      isLoading={isPending}
                    >
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
                    className="h-32 bg-gray-100 border-gray-100"
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
              disabled={form.formState.isSubmitting}
              onClick={() => {
                form.reset({
                  nationalRegister: profile?.nationalRegister ?? '',
                  company: profile?.companyId ?? '',
                  profession: profile?.profession ?? 'secretário (a)',
                  crea: profile?.crea ?? '',
                  specialty: profile?.specialty ?? '',
                })
              }}
            >
              Resetar
            </Button>
            <Button
              variant="inspetor-blue"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
