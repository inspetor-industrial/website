'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { InvalidCredentialsError } from '@inspetor/@common/errors/auth'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
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
  password: z.string(),
})

type Schema = z.infer<typeof schema>

export function SignInForm() {
  const startProgressBar = useProgress()
  const router = useRouter()

  const searchParams = useSearchParams()

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  async function handleSignIn(data: Schema) {
    try {
      window.dispatchEvent(new CustomEvent(events.auth.loginInProgress))

      const response = await signIn('credentials', {
        username: data.email,
        password: data.password,
        redirect: false,
      })

      if (!response?.ok) {
        throw new InvalidCredentialsError()
      }

      toast({
        title: 'Login efetuado com sucesso',
        variant: 'success',
      })

      const callbackUrl = searchParams.get('callbackUrl')

      startProgressBar()
      router.replace(callbackUrl || '/dashboard')
    } catch (error) {
      toast({
        title: 'Erro ao efetuar login',
        description: 'E-mail ou senha inválidos',
        variant: 'destructive',
      })
    } finally {
      window.dispatchEvent(new CustomEvent(events.auth.loginFinished))
    }
  }

  return (
    <Form {...form}>
      <form
        id="sign-in"
        className="space-y-4 mb-4"
        onSubmit={form.handleSubmit(handleSignIn)}
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
        <FormField
          control={form.control}
          name="password"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-white">Senha</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
