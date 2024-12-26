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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { Textarea } from '@inspetor/components/ui/textarea'
import { events } from '@inspetor/constants/events'
import { toast } from '@inspetor/hooks/use-toast'
import { Factory, Mail, Phone, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { sendContactEmail } from './actions'

const schema = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório',
  }),
  email: z
    .string({
      required_error: 'E-mail é obrigatório',
    })
    .email({
      message: 'E-mail inválido',
    }),
  service: z
    .enum([
      'boiler-inspection',
      'integrity-inspection',
      'pipe-inspection',
      'pressure-vessel-inspection',
      'automotive-elevator-inspection',
      'fuel-tanks-inspection',
      'safety-valve-calibration',
      'manometer-calibration',
      'others',
      '',
    ])
    .default('others'),
  description: z.string({
    required_error: 'Descrição é obrigatória',
  }),
  phoneNumber: z.string({
    required_error: 'Telefone é obrigatório',
  }),
})

type Schema = z.infer<typeof schema>

export function ContactForm() {
  const searchParams = useSearchParams()

  const action = useServerAction(sendContactEmail)

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: (searchParams.get('service') as Schema['service']) ?? 'others',
    },
  })

  async function handleSendContactEmail({
    description,
    email,
    name,
    phoneNumber,
    service,
  }: Schema) {
    try {
      window.dispatchEvent(new CustomEvent(events.contact.sending))
      const [result, resultError] = await action.execute({
        description,
        email,
        name,
        phoneNumber,
        service,
      })

      if (resultError) {
        toast({
          title: resultError.message,
          variant: 'destructive',
        })
      }

      if (result?.success) {
        toast({
          title: result.message,
          variant: 'success',
        })
      } else {
        toast({
          title: result?.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro ao enviar e-mail',
        variant: 'destructive',
      })
    } finally {
      window.dispatchEvent(new CustomEvent(events.contact.sent))
      form.reset({
        service: (searchParams.get('service') as Schema['service']) ?? 'others',
        email: '',
        name: '',
        phoneNumber: '',
        description: '',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSendContactEmail)}
        id="contact-form"
        className="grid grid-cols-2 gap-4 w-full h-full"
      >
        <FormField
          control={form.control}
          name="name"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Nome
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="service"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Service
              </FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="-------------------------------------------------" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boiler-inspection">
                      Inspeção de Caldeiras
                    </SelectItem>
                    <SelectItem value="integrity-inspection">
                      Inspeção de Integridade
                    </SelectItem>
                    <SelectItem value="pipe-inspection">
                      Inspeção de Tubulações
                    </SelectItem>
                    <SelectItem value="pressure-vessel-inspection">
                      Inspeção de Vasos de Pressão
                    </SelectItem>
                    <SelectItem value="automotive-elevator-inspection">
                      Inspeção de Elevadores Automotivos
                    </SelectItem>
                    <SelectItem value="fuel-tanks-inspection">
                      Inspeção de Tanques de Combustível
                    </SelectItem>
                    <SelectItem value="safety-valve-calibration">
                      Calibração de Válvulas de Segurança
                    </SelectItem>
                    <SelectItem value="manometer-calibration">
                      Calibração de Manômetros
                    </SelectItem>
                    <SelectItem value="others">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="h-full">
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                E-mail
              </FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="row-span-2 h-full">
              <FormLabel className="flex items-center gap-2">
                Descrição
              </FormLabel>
              <FormControl>
                <Textarea className="resize-none h-36" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className="h-full">
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Telefone
              </FormLabel>
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
