'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { events } from '@inspetor/constants/events'
import { toast } from '@inspetor/hooks/use-toast'
import { auth } from '@inspetor/lib/firebase/client'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useProgress } from 'react-transition-progress'
import { z } from 'zod'

const schema = z.object({
  email: z
    .string({
      required_error: 'E-mail é obrigatório',
    })
    .email({
      message: 'E-mail inválido',
    }),
})

type Schema = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const startProgressBar = useProgress()
  const router = useRouter()

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  async function handleForgotPassword(data: Schema) {
    try {
      window.dispatchEvent(new CustomEvent(events.resetPassword.sending))
      await sendPasswordResetEmail(auth, data.email)

      toast({
        title: 'E-mail de redefinição de senha enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha',
      })

      startProgressBar()
      router.push('/auth/sign-in')
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          toast({
            title: 'E-mail não encontrado',
            description: 'Verifique seu e-mail e tente novamente',
          })
        }
      }
    } finally {
      window.dispatchEvent(new CustomEvent(events.resetPassword.sent))
    }
  }

  return (
    <Form {...form}>
      <form
        id="sign-in"
        className="space-y-4 mb-2"
        onSubmit={form.handleSubmit(handleForgotPassword)}
      >
        <FormField
          control={form.control}
          name="email"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-white">E-mail</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
