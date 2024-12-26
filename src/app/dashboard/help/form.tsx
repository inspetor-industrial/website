'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { InspetorEditor } from '@inspetor/components/editor'
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
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore } from '@inspetor/lib/firebase/client'
import { addDoc, collection } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().nonempty('O nome é obrigatório.'),
  email: z.string().email('Formato de e-mail inválido.'),
  phoneNumber: z.string().nonempty('O número de telefone é obrigatório.'),
  subject: z.string().nonempty('O assunto é obrigatório.'),
  description: z.string().nonempty('A descrição é obrigatória.'),
})

type Schema = z.infer<typeof schema>

export function RequestSupportForm() {
  const session = useSession()

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session.data?.user.name ?? '',
      email: session.data?.user.email ?? '',
    },
  })

  async function handleSendSupportRequest(data: Schema) {
    try {
      const coll = collection(firestore, firebaseModels.supports)

      await addDoc(coll, {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        updatedBy: session.data!.user.id,
        createdBy: session.data!.user.id,
        status: 'open',
      })

      toast({
        title: 'Solicitação de suporte enviada com sucesso.',
        description: 'Em breve entraremos em contato.',
        variant: 'success',
      })

      //   form.reset({
      //     name: session.data?.user.name ?? '',
      //     email: session.data?.user.email ?? '',
      //     subject: '',
      //     description: '',
      //     phoneNumber: '',
      //   })
    } catch {
      toast({
        title: 'Erro ao enviar solicitação de suporte.',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    form.reset({
      name: session.data?.user.name ?? '',
      email: session.data?.user.email ?? '',
    })
  }, [form, session.data])

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-3 gap-4"
        onSubmit={form.handleSubmit(handleSendSupportRequest)}
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
                  value={session.data?.user.name ?? ''}
                  readOnly
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
                <Input
                  {...field}
                  value={session.data?.user.email ?? ''}
                  readOnly
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Assunto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <InspetorEditor
                  containerClassName="!min-h-[200px] !h-[200px]"
                  onChangeText={field.onChange}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={form.formState.isSubmitting}
          >
            Voltar
          </Button>
          <Button
            type="submit"
            variant="inspetor-blue"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              'Enviar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
