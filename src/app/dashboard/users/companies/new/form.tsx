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
  name: z
    .string({
      required_error: 'O nome é obrigatório.',
    })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
})

type Schema = z.infer<typeof schema>

export function AddNewCompany() {
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

  async function handleRegisterClient({ name }: Schema) {
    try {
      const substrings = generateSubstrings(name)

      const coll = collection(firestore, firebaseModels.companies)
      const total = await getCountFromServer(query(coll))

      await addDoc(coll, {
        name,
        [appConfigs.firestore.searchProperty]: Array.from(substrings),
        rowNumber: total.data().count + 1,
        createdBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        updatedBy: session.data?.user?.id ?? appConfigs.defaultUsername,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      toast({
        title: 'Empresa adicionada com sucesso!',
        variant: 'success',
      })

      startProgressBar()
      router.push(`/dashboard/users/companies`)
    } catch {
      toast({
        title: 'Falha ao adicionar empresa!',
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
                <Input {...field} placeholder="Digite o nome da empresa.." />
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
