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
import { Switch } from '@inspetor/components/ui/switch'
import { Textarea } from '@inspetor/components/ui/textarea'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  canBeMaintained: z.boolean().optional().default(false),
  mustBeIncreasedTo: z.string().optional().default(''),
  mustBeDecreasedTo: z.string().optional().default(''),
  observationsPMTA: z.string().optional().default(''),
})

type Schema = z.infer<typeof schema>

type FormThirtySixProps = {
  defaultValues?: Record<string, any>
}

const FormThirtySix = forwardRef(function FormThirtySix(
  { defaultValues }: FormThirtySixProps,
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
        return {
          ...values,
          pmta: {
            ...(defaultValues?.pmta || {}),
            canBeMaintained: values.canBeMaintained,
            mustBeIncreasedTo: values.mustBeIncreasedTo,
            mustBeDecreasedTo: values.mustBeDecreasedTo,
            observations: values.observationsPMTA,
          },
        }
      },
      form,
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-2.5 max-w-[462px]">
        <FormField
          control={form.control}
          name="canBeMaintained"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Manutenção pode ser realizada?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mustBeIncreasedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manutenção pode ser realizada?</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mustBeDecreasedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manutenção pode ser realizada?</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observationsPMTA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações:</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export { FormThirtySix }
