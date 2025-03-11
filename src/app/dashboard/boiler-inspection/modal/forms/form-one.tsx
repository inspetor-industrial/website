import { zodResolver } from '@hookform/resolvers/zod'
import { Combobox } from '@inspetor/components/combobox'
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
import { getClientsOptions } from '@inspetor/http/firebase/client/combobox/get-clients'
import { makeOptionObject } from '@inspetor/utils/combobox-options'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  service: z.string().optional().default('Inspeção de Caldeiras'),
  type: z.string(),
  client: z.string(),
  motivation: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormOneProps = {
  defaultValues?: Record<string, any>
}

const FormOne = forwardRef(function FormOne(
  { defaultValues }: FormOneProps,
  ref,
) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useImperativeHandle(ref, () => {
    return {
      getValues: form.getValues,
      runAutoCompleteAndFormatterWithDefaultValues: (values: Schema) => {
        if (!values.service) {
          values.service = 'Inspeção de Caldeiras'
        }

        if (!values.motivation) {
          values.motivation = ''
        }

        const client = makeOptionObject(values.client, [
          'id',
          'name',
          'cnpjOrCpf',
        ])

        return {
          ...values,
          client,
        }
      },
      form,
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-2.5">
        <FormField
          name="service"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">Serviço</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    defaultValue="Inspeção de caldeiras"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">Tipo de inspeção</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="initial">Inicial</SelectItem>
                      <SelectItem value="periodic">Periódico</SelectItem>
                      <SelectItem value="extraordinary">
                        Extra ordinário
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Cliente</FormLabel>
              <FormControl>
                <Combobox
                  entityKey="client"
                  onChange={field.onChange}
                  value={field.value}
                  queryFn={getClientsOptions}
                  // label="Selecione um cliente..."
                  triggerClassName="h-10 !bg-inspetor-gray-300 hover:!bg-inspetor-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="motivation"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-zinc-50">Motivação</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </form>
    </Form>
  )
})

export { FormOne }
