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
import { appConfigs } from '@inspetor/constants/configs'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { getCompany } from '@inspetor/http/firebase/company/get-company'
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
  name: z
    .string({
      required_error: 'O nome é obrigatório.',
    })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
})

type Schema = z.infer<typeof schema>

type ClientFormViewProps = {
  isDetail?: boolean
}

export function CompanyFormView({ isDetail }: ClientFormViewProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const session = useSession()
  const startProgressBar = useProgress()
  const router = useRouter()

  const { companyId } = useParams<{ companyId: string }>()

  const { isPending } = useQuery({
    queryKey: ['companies', companyId],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const company = await getCompany(companyId)

      if (!company) {
        toast({
          title: 'Empresa não encontrada!',
          variant: 'destructive',
        })

        startProgressBar()
        router.push('/dashboard/users/companies')
        return null
      }

      form.reset({
        name: company.name,
      })
      return company
    },
  })

  function handleGoBack() {
    startProgressBar()
    router.back()
  }

  function handleLoadEditAction() {
    startProgressBar()
    router.push(`/dashboard/users/companies/${companyId}`)
  }

  async function handleRegisterClient({ name }: Schema) {
    try {
      const substrings = generateSubstrings(name)

      const coll = collection(firestore, firebaseModels.companies)
      const docRef = doc(coll, companyId)

      await updateDoc(docRef, {
        name,
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedAt: Date.now(),
      })

      toast({
        title: 'Empresa atualizada com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/users/companies`)
    } catch {
      toast({
        title: 'Falha ao atualizar a empresa!',
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
