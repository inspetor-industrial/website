import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@inspetor/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@inspetor/components/ui/form'
import { Input } from '@inspetor/components/ui/input'
import { Label } from '@inspetor/components/ui/label'
import { Textarea } from '@inspetor/components/ui/textarea'
import { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  canBeMaintained: z.string().optional().default(''),
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
              <FormLabel className="text-zinc-50">
                Manutenção pode ser realizada?
              </FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'yes'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'yes' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-yes"
                    />
                    <Label
                      htmlFor="option-yes"
                      variant="form"
                      className="text-sm"
                    >
                      SIM
                    </Label>
                  </div>
                  <div className="space-x-1 flex items-center">
                    <Checkbox
                      checked={field.value === 'no'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'no' : '')
                      }}
                      className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
                      id="option-no"
                    />
                    <Label
                      htmlFor="option-no"
                      variant="form"
                      className="text-sm"
                    >
                      NÃO
                    </Label>
                  </div>
                </div>
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
              <FormLabel className="text-zinc-50">
                Manutenção pode ser realizada?
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
          name="mustBeDecreasedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">
                Manutenção pode ser realizada?
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
          name="observationsPMTA"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-50">Observações:</FormLabel>
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
