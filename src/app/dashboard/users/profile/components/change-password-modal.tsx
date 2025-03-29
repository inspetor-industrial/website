'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLoading } from '@inspetor/components/button-loading'
import { Button } from '@inspetor/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@inspetor/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { toast } from '@inspetor/hooks/use-toast'
import { auth } from '@inspetor/lib/firebase/client'
import { cn } from '@inspetor/lib/utils'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

type Schema = z.infer<typeof schema>

export function ChangePasswordModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  async function handleChangePassword(data: Schema) {
    try {
      toast({
        title: 'Enviando e-mail de redefinição de senha',
      })

      await sendPasswordResetEmail(auth, data.email)

      toast({
        title: 'E-mail de redefinição de senha enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha',
      })

      setIsModalOpen(false)
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          toast({
            title: 'E-mail não encontrado',
            description: 'Verifique seu e-mail e tente novamente',
          })
        }
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className={cn('text-left justify-start')} type="button">
          <Lock className="size-4" />
          <span className="text-sm">Trocar senha</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trocar senha</DialogTitle>
          <DialogDescription>
            Insira seu e-mail para receber um link de redefinição de senha.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(handleChangePassword)}
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="text-sm"
                      id="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <ButtonLoading
              isLoading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting
                ? 'Enviando e-mail de redefinição'
                : 'Enviar e-mail de redefinição'}
            </ButtonLoading>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
